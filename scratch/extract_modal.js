const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Extract the modal using regex
const modalStartRegex = /^[ \t]*\{\/\* ── Auth Modal ── \*\/\}\r?\n[ \t]*\{isAuthModalOpen && \(/m;
const match = modalStartRegex.exec(content);
if (!match) throw new Error("Modal start not found");
const modalStartIndex = match.index;

const modalEndStr = '        )}\r\n      </div>\r\n    );\r\n  }';
const fallbackModalEndStr = '        )}\n      </div>\n    );\n  }';
let modalEndIndex = content.indexOf(modalEndStr, modalStartIndex);
if (modalEndIndex === -1) {
    modalEndIndex = content.indexOf(fallbackModalEndStr, modalStartIndex);
}
if (modalEndIndex === -1) throw new Error("Modal end not found");

const exactEnd = content.lastIndexOf('        )}', modalEndIndex);
const modalContent = content.substring(modalStartIndex, exactEnd + 10);

const functionDef = `
  const renderAuthModal = () => (
    <>
${modalContent}
    </>
  );
`;

// 2. Replace the modal in the original place with {renderAuthModal()}
content = content.substring(0, modalStartIndex) + '        {renderAuthModal()}' + content.substring(exactEnd + 10);

// 3. Insert functionDef before \`  // ══════════════════════════════════════════════════════════\n  // A. LANDING / SPLASH SCREEN\`
const insertTarget = '  // ══════════════════════════════════════════════════════════\r\n  // A. LANDING / SPLASH SCREEN';
const fallbackInsertTarget = '  // ══════════════════════════════════════════════════════════\n  // A. LANDING / SPLASH SCREEN';
if (content.includes(insertTarget)) {
    content = content.replace(insertTarget, functionDef + '\r\n' + insertTarget);
} else {
    content = content.replace(fallbackInsertTarget, functionDef + '\n' + fallbackInsertTarget);
}

// 4. Insert {renderAuthModal()} at the end of the Page component
const endTarget = '      {/* ── Header Search Modal ── */}';
content = content.replace(endTarget, '      {renderAuthModal()}\n\n' + endTarget);

// 5. Revert the setView('landing') from the buttons
content = content.replace(/setView\('landing'\); setTimeout\(\(\) => \{ setAuthMode\('signup'\); setIsAuthModalOpen\(true\); \}, 50\);/g, "setAuthMode('signup'); setIsAuthModalOpen(true);");
content = content.replace(/setView\('landing'\); setTimeout\(\(\) => \{ setAuthMode\('login'\); setIsAuthModalOpen\(true\); \}, 50\);/g, "setAuthMode('login'); setIsAuthModalOpen(true);");
content = content.replace(/setView\('landing'\); setIsLandingMenuOpen\(false\); setTimeout\(\(\) => \{ setAuthMode\('signup'\); setIsAuthModalOpen\(true\); \}, 50\);/g, "setAuthMode('signup'); setIsAuthModalOpen(true); setIsLandingMenuOpen(false);");
content = content.replace(/setView\('landing'\); setIsLandingMenuOpen\(false\); setTimeout\(\(\) => \{ setAuthMode\('login'\); setIsAuthModalOpen\(true\); \}, 50\);/g, "setAuthMode('login'); setIsAuthModalOpen(true); setIsLandingMenuOpen(false);");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');

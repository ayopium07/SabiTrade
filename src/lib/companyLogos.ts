// Dictionary of clean, high-resolution company logos for NGX listed companies and major brands

export interface CompanyLogoInfo {
  ticker: string;
  name: string;
  aliases: string[];
  logoUrl: string;
}

export const COMPANY_LOGOS: Record<string, CompanyLogoInfo> = {
  DANGCEM: {
    ticker: 'DANGCEM',
    name: 'Dangote Cement PLC',
    aliases: ['dangote cement', 'dangote group', 'dangote', 'aliko dangote'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Dangote_Group_Logo.svg',
  },
  MTNN: {
    ticker: 'MTNN',
    name: 'MTN Nigeria Communications PLC',
    aliases: ['mtn nigeria', 'mtn', 'momo psb', 'mtn communications'],
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOlf7z4fg2HKMz2wx0EcootM0lPeIhvVPhqfaTZwSUCrwQ7UC_yUkJtWHz&s=10',
  },
  ZENITHBANK: {
    ticker: 'ZENITHBANK',
    name: 'Zenith Bank PLC',
    aliases: ['zenith bank', 'zenith', 'jim ovia'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d6/Zenith_Bank_logo.svg',
  },
  GTCO: {
    ticker: 'GTCO',
    name: 'Guaranty Trust Holding Company PLC',
    aliases: ['gtco', 'gtbank', 'guaranty trust', 'gt bank'],
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPFIrKmTBegB7D5rAqXtzi42Su7Be7q78hyyd6Pkh6CQ&s=10',
  },
  SEPLAT: {
    ticker: 'SEPLAT',
    name: 'Seplat Energy PLC',
    aliases: ['seplat energy', 'seplat', 'seplat petroleum'],
    logoUrl: 'https://yt3.googleusercontent.com/rs2EEuf4IxWvfcckxrG2AnjskptlD-x_xl4aIUYwA11IkZThlNSIvedSYMSPfddnHkEQo3aUZ4c=s900-c-k-c0x00ffffff-no-rj',
  },
  BUAFOODS: {
    ticker: 'BUAFOODS',
    name: 'BUA Foods PLC',
    aliases: ['bua foods', 'bua group', 'bua cement', 'bua', 'abdulsamad rabiu'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Logo_BUA_Foods.svg',
  },
  ACCESSCORP: {
    ticker: 'ACCESSCORP',
    name: 'Access Holdings PLC',
    aliases: ['access holdings', 'access bank', 'accesscorp', 'herbert wigwe', 'roosevelt ogbonna'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Access_Bank_Logo.svg/1200px-Access_Bank_Logo.svg.png',
  },
  NESTLE: {
    ticker: 'NESTLE',
    name: 'Nestlé Nigeria PLC',
    aliases: ['nestle nigeria', 'nestle', 'milo', 'maggi'],
    logoUrl: 'https://d1jcea4y7xhp7l.cloudfront.net/wp-content/uploads/2023/11/NESTLElogo-with-wordmark-oak-1.png',
  },
  OANDO: {
    ticker: 'OANDO',
    name: 'Oando PLC',
    aliases: ['oando plc', 'oando', 'naoc', 'wale tinubu'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Oando_logo.svg/1200px-Oando_logo.svg.png',
  },
  UBA: {
    ticker: 'UBA',
    name: 'United Bank for Africa PLC',
    aliases: ['united bank for africa', 'uba', 'tony elumelu'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/UBA_Logo.png/1200px-UBA_Logo.png',
  },
  FBNH: {
    ticker: 'FBNH',
    name: 'FBN Holdings PLC',
    aliases: ['fbn holdings', 'first bank', 'firstbank', 'fbnh', 'otudeko'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/First_Bank_of_Nigeria_logo.svg/1200px-First_Bank_of_Nigeria_logo.svg.png',
  },
  AIRTEL: {
    ticker: 'AIRTELAFRI',
    name: 'Airtel Africa PLC',
    aliases: ['airtel africa', 'airtel nigeria', 'airtel'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Airtel_Africa_logo.svg',
  },
  PRESCO: {
    ticker: 'PRESCO',
    name: 'Presco PLC',
    aliases: ['presco plc', 'presco'],
    logoUrl: 'https://cdn.guardian.ng/wp-content/uploads/2025/11/ng-presco-logo.png',
  },
  TRANSCORP: {
    ticker: 'TRANSCORP',
    name: 'Transnational Corporation PLC',
    aliases: ['transcorp', 'transcorp hotels', 'transcorp power'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Transcorp_Logo.png/1200px-Transcorp_Logo.png',
  },
  TOTAL: {
    ticker: 'TOTAL',
    name: 'TotalEnergies Marketing Nigeria PLC',
    aliases: ['totalenergies', 'total nigeria', 'total'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/TotalEnergies_logo.svg/1200px-TotalEnergies_logo.svg.png',
  }
};

export interface ResolvedLogoInfo {
  ticker: string;
  name: string;
  logoUrl: string;
}

/**
 * Given a news item (headline, content, affectedStocks), detect ALL matching company logos.
 */
export function resolveCompanyLogos(
  affectedStocks?: string[],
  headline?: string,
  content?: string
): ResolvedLogoInfo[] {
  const matches: ResolvedLogoInfo[] = [];
  const seenTickers = new Set<string>();

  // 1. Check affectedStocks array first
  if (affectedStocks && affectedStocks.length > 0) {
    for (const ticker of affectedStocks) {
      const cleanTicker = ticker.toUpperCase().trim();
      if (COMPANY_LOGOS[cleanTicker] && !seenTickers.has(cleanTicker)) {
        seenTickers.add(cleanTicker);
        matches.push({
          ticker: cleanTicker,
          name: COMPANY_LOGOS[cleanTicker].name,
          logoUrl: COMPANY_LOGOS[cleanTicker].logoUrl,
        });
      }
    }
  }

  // 2. Scan headline and content text for all company names or aliases
  const combinedText = `${headline || ''} ${content || ''}`.toLowerCase();

  for (const [ticker, info] of Object.entries(COMPANY_LOGOS)) {
    if (seenTickers.has(ticker)) continue;

    let found = false;
    if (combinedText.includes(ticker.toLowerCase())) {
      found = true;
    } else {
      for (const alias of info.aliases) {
        if (combinedText.includes(alias)) {
          found = true;
          break;
        }
      }
    }

    if (found) {
      seenTickers.add(ticker);
      matches.push({
        ticker,
        name: info.name,
        logoUrl: info.logoUrl,
      });
    }
  }

  return matches;
}

/**
 * Given a news item (headline, content, affectedStocks), detect matching company logo URL (primary single match).
 */
export function resolveCompanyLogo(
  affectedStocks?: string[],
  headline?: string,
  content?: string
): { logoUrl: string | null; matchedCompany: string | null } {
  const logos = resolveCompanyLogos(affectedStocks, headline, content);
  if (logos.length > 0) {
    return { logoUrl: logos[0].logoUrl, matchedCompany: logos[0].name };
  }
  return { logoUrl: null, matchedCompany: null };
}

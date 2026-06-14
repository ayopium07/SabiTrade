import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "EquityStack | Nigerian Financial Intelligence Platform",
  description: "Your Nigerian market intelligence, simplified. Track NGX stocks, read AI-generated market summaries, and learn investing — in a clear, modern interface built for Nigerian retail investors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen" style={{ background: '#041226', colorScheme: 'dark' }}>
      <body
        className={`${sora.variable} ${dmSans.variable} font-dm-sans text-text-primary bg-bg-base antialiased min-h-screen w-full`}
        style={{ background: '#041226' }}
      >
        {children}
      </body>
    </html>
  );
}

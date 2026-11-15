import { Hanken_Grotesk } from "next/font/google";
import { BackToTop, MotionRoot, ScrollProgress } from "@/components/Motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import "./pages.css";

// Epoch AI's brand face is Messina Sans (licensed, not bundled). It is used first if installed;
// otherwise Hanken Grotesk, a close open-licence grotesque, keeps the same tone.
const sans = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-fallback", display: "swap" });

export const metadata = {
  title: { default: "Epoch AI: investigating the trajectory of AI (redesign concept)", template: "%s | Epoch AI (concept)" },
  description: "Unofficial redesign concept for Epoch AI: accessible, fast and animated.",
  robots: { index: false },
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        {/* Without JavaScript, show everything in its final state. */}
        <noscript>
          <style>{`[style*="opacity"],[style*="transform"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <MotionRoot>
          <span id="top" tabIndex={-1} />
          <a className="skip" href="#main">Skip to main content</a>
          <ScrollProgress />
          <p className="notice">
            <span className="wrap">Unofficial redesign concept, not affiliated with Epoch AI. Content and figures from epoch.ai, for illustration.</span>
          </p>
          <Header />
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer />
          <BackToTop />
        </MotionRoot>
      </body>
    </html>
  );
}

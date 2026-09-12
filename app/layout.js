import { Noto_Sans_Devanagari, Noto_Serif_Devanagari } from "next/font/google";
import MotionPreferenceSync from "@/components/MotionPreferenceSync";
import PwaRegister from "@/components/PwaRegister";
import OfflineIndicator from "@/components/OfflineIndicator";
import UpdateToast from "@/components/UpdateToast";
import "@/styles/main.css";
import "@/styles/components.css";
import "@/styles/responsive.css";

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ui",
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-reading",
});

export const metadata = {
  title: "आरती संग्रहालय — भक्ती, परंपरा, संस्कृती",
  description: "मराठी आरत्यांचा प्रीमियम डिजिटल संग्रह — वाचा, ऐका, आवडती जतन करा.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "आरती संग्रह",
  },
};

export const viewport = {
  themeColor: "#0B0A09",
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mr" className={`${notoSansDevanagari.variable} ${notoSerifDevanagari.variable}`}>
      <body>
        <MotionPreferenceSync />
        <PwaRegister />
        <OfflineIndicator />
        <UpdateToast />
        {children}
      </body>
    </html>
  );
}

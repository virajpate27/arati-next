import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata = {
  title: "ऑफलाइन — आरती संग्रहालय",
};

export default function OfflinePage() {
  return (
    <div className="container" style={{ maxWidth: 520, textAlign: "center", padding: "88px 20px" }}>
      <WifiOff size={40} style={{ opacity: 0.55, marginBottom: 18 }} />
      <h1 style={{ marginBottom: 10 }}>तुम्ही सध्या ऑफलाइन आहात</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>
        याआधी उघडलेली पानं ऑफलाइनही वाचता येतील. इंटरनेट परत आल्यावर बाकीचा मजकूर आपोआप उपलब्ध होईल.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link className="btn btn-primary" href="/">
          मुख्यपृष्ठावर जा
        </Link>
        <Link className="btn" href="/favorites">
          आवडत्या आरत्या
        </Link>
      </div>
    </div>
  );
}

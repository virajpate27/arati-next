"use client";

import { Download, CheckCircle2 } from "lucide-react";
import { usePwaInstall } from "@/lib/hooks/usePwaInstall";

export default function InstallPwaButton() {
  const { canInstall, installed, promptInstall } = usePwaInstall();

  if (installed) {
    return (
      <p className="row-desc" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <CheckCircle2 size={16} /> अ‍ॅप आधीच इन्स्टॉल केलेले आहे
      </p>
    );
  }

  if (!canInstall) {
    return (
      <p className="row-desc" style={{ maxWidth: 220, textAlign: "right" }}>
        या ब्राउझरवर आत्ता थेट पर्याय नाही — ब्राउझर मेनूतून &quot;Add to Home Screen&quot; वापरा
      </p>
    );
  }

  return (
    <button className="btn btn-primary" onClick={promptInstall} style={{ gap: 8 }}>
      <Download size={18} /> इन्स्टॉल करा
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export default function UpdateToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onUpdateAvailable() {
      setVisible(true);
    }
    window.addEventListener("aartisangrah:update-available", onUpdateAvailable);
    return () => window.removeEventListener("aartisangrah:update-available", onUpdateAvailable);
  }, []);

  if (!visible) return null;

  return (
    <div className="pwa-toast" role="status">
      <span>नवीन आवृत्ती उपलब्ध आहे</span>
      <button
        onClick={() => {
          window.__aartiApplyPwaUpdate?.();
          setVisible(false);
        }}
      >
        <RefreshCw size={14} /> रीफ्रेश करा
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Trash2 } from "lucide-react";
import * as storage from "@/lib/storage";
import { useFavoriteIds, FAVORITES_EVENT } from "@/lib/hooks/useFavorite";
import { SETTINGS_EVENT } from "@/components/MotionPreferenceSync";

const FONT_OPTIONS = [
  { id: "small", label: "लहान" },
  { id: "normal", label: "सामान्य" },
  { id: "large", label: "मोठे" },
  { id: "xlarge", label: "अतिमोठे" },
];

const MODE_OPTIONS = [
  { id: "normal", label: "सामान्य" },
  { id: "focus", label: "फोकस" },
];

export default function SettingsClient() {
  const [fontSize, setFontSizeState] = useState("normal");
  const [mode, setModeState] = useState("normal");
  const [reduceMotion, setReduceMotion] = useState(false);
  const favIds = useFavoriteIds();

  useEffect(() => {
    setFontSizeState(storage.getFontSize());
    setModeState(storage.getReadingMode());
    setReduceMotion(!!storage.getSettings().reduceMotion);
  }, []);

  function updateFont(id) {
    storage.setFontSize(id);
    setFontSizeState(id);
  }

  function updateMode(id) {
    storage.setReadingMode(id);
    setModeState(id);
  }

  function toggleMotion() {
    const next = !reduceMotion;
    storage.setSettings({ reduceMotion: next });
    setReduceMotion(next);
    window.dispatchEvent(new Event(SETTINGS_EVENT));
  }

  function clearAll() {
    if (
      typeof window !== "undefined" &&
      window.confirm("तुम्हाला खात्री आहे की सर्व जतन केलेला डेटा (आवडत्या, इतिहास, चिन्हांकने) पुसायचा आहे?")
    ) {
      ["favorites", "recent", "fontSize", "readingMode", "markers", "settings"].forEach((k) => storage.remove(k));
      window.dispatchEvent(new Event(FAVORITES_EVENT));
      window.dispatchEvent(new Event(SETTINGS_EVENT));
      setFontSizeState("normal");
      setModeState("normal");
      setReduceMotion(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <header className="page-header" data-entrance>
        <h1>सेटिंग्ज</h1>
        <p>वाचन अनुभव तुमच्या पसंतीनुसार बदला</p>
      </header>

      <section style={{ marginTop: 26 }} data-entrance>
        <div className="settings-group">
          <div className="settings-row">
            <div>
              <p className="row-label">अक्षर आकार</p>
              <p className="row-desc">आरती वाचनासाठी डिफॉल्ट अक्षर आकार</p>
            </div>
            <div className="segmented">
              {FONT_OPTIONS.map((o) => (
                <button key={o.id} className={fontSize === o.id ? "is-active" : ""} onClick={() => updateFont(o.id)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-row">
            <div>
              <p className="row-label">वाचन मोड</p>
              <p className="row-desc">फोकस मोडमध्ये सध्याचा कडवा उठून दिसतो</p>
            </div>
            <div className="segmented">
              {MODE_OPTIONS.map((o) => (
                <button key={o.id} className={mode === o.id ? "is-active" : ""} onClick={() => updateMode(o.id)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-row">
            <div>
              <p className="row-label">गती कमी करा</p>
              <p className="row-desc">अ‍ॅनिमेशन्स कमीत कमी करा</p>
            </div>
            <button
              className={`switch ${reduceMotion ? "is-on" : ""}`}
              role="switch"
              aria-checked={reduceMotion}
              aria-label="गती कमी करा"
              onClick={toggleMotion}
            />
          </div>
        </div>

        <div className="settings-group">
          <Link className="settings-row" href="/favorites" style={{ textDecoration: "none" }}>
            <div>
              <p className="row-label">माझ्या आवडत्या आरत्या</p>
              <p className="row-desc">{favIds.length} आरत्या जतन केल्या</p>
            </div>
            <ChevronRight color="var(--text-muted)" />
          </Link>
          <button className="settings-row" style={{ width: "100%", textAlign: "left" }} onClick={clearAll}>
            <div>
              <p className="row-label" style={{ color: "#e0836b" }}>
                सर्व डेटा साफ करा
              </p>
              <p className="row-desc">आवडत्या, इतिहास व चिन्हांकने कायमची पुसली जातील</p>
            </div>
            <Trash2 color="#e0836b" />
          </button>
        </div>
      </section>
    </div>
  );
}

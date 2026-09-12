"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MoreVertical, MoreHorizontal, Volume2, Pause, Share2, Bookmark, X } from "lucide-react";
import * as storage from "@/lib/storage";
import { useFavorite } from "@/lib/hooks/useFavorite";
import { useSpeechReader } from "@/lib/hooks/useSpeechReader";

const FONT_LABELS = { small: "लहान", normal: "सामान्य", large: "मोठे", xlarge: "अतिमोठे" };

export default function ReaderPage({ aarti }) {
  const { isFav, toggle: toggleFav } = useFavorite(aarti.id);

  const [activeVerseId, setActiveVerseId] = useState(aarti.verses[0].id);
  const [bump, setBump] = useState(false);
  const [mode, setMode] = useState("normal");
  const [fontSize, setFontSize] = useState("normal");
  const [marker, setMarker] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState("");

  const verseRefs = useRef({});
  const toastTimer = useRef(null);

  // Initial load from storage + record this visit as "recently read".
  useEffect(() => {
    storage.pushRecent(aarti.id);
    setMode(storage.getReadingMode());
    setFontSize(storage.getFontSize());
    setMarker(storage.getMarker(aarti.id));
  }, [aarti.id]);

  // Active-verse tracking: IntersectionObserver watches every verse
  // section and whichever one occupies the center "focus band" of the
  // viewport becomes active. Never computed from scroll position.
  useEffect(() => {
    const visibility = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = Number(entry.target.getAttribute("data-verse"));
          visibility.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let bestId = null;
        let bestRatio = -1;
        visibility.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestRatio > 0 && bestId !== null) {
          setActiveVerseId((prev) => {
            if (prev === bestId) return prev;
            setBump(true);
            return bestId;
          });
        }
      },
      {
        root: null,
        rootMargin: "-38% 0px -42% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    Object.values(verseRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [aarti.id]);

  useEffect(() => {
    if (!bump) return;
    const t = setTimeout(() => setBump(false), 350);
    return () => clearTimeout(t);
  }, [bump]);

  const activeIndex = aarti.verses.findIndex((v) => v.id === activeVerseId);

  const speech = useSpeechReader({
    onVerseChange: (verseId) => {
      setActiveVerseId(verseId);
      scrollToVerse(verseId);
    },
    onEnd: () => showToast("आरती वाचून पूर्ण झाली"),
  });

  // Stop any ongoing speech if the reader switches to a different aarti.
  useEffect(() => {
    return () => speech.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aarti.id]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  function scrollToVerse(id) {
    verseRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleMarkToggle(verseId) {
    if (marker === verseId) {
      storage.clearMarker(aarti.id);
      setMarker(null);
      showToast("कडवा चिन्हांकन काढले");
    } else {
      storage.setMarker(aarti.id, verseId);
      setMarker(verseId);
      showToast("कडवा चिन्हांकित केला");
    }
  }

  function updateMode(next) {
    setMode(next);
    storage.setReadingMode(next);
  }

  function updateFontSize(next) {
    setFontSize(next);
    storage.setFontSize(next);
  }

  function decreaseFont() {
    const idx = storage.FONT_STEPS.indexOf(fontSize);
    updateFontSize(storage.FONT_STEPS[Math.max(0, idx - 1)]);
  }

  function increaseFont() {
    const idx = storage.FONT_STEPS.indexOf(fontSize);
    updateFontSize(storage.FONT_STEPS[Math.min(storage.FONT_STEPS.length - 1, idx + 1)]);
  }

  async function shareAarti() {
    const verse = aarti.verses.find((v) => v.id === activeVerseId);
    const text = `${aarti.title}\n\n${verse ? verse.text.replace(/\n/g, " ") : ""}\n\n— आरती संग्रहालय`;
    if (navigator.share) {
      try {
        await navigator.share({ title: aarti.title, text });
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        showToast("मजकूर क्लिपबोर्डवर कॉपी केला");
      } catch {
        showToast("शेअर करता आले नाही");
      }
    }
  }

  function handleAudio() {
    if (aarti.audio && aarti.audio.src) {
      // Future: real recorded audio, once available — Howler.js
      // playback + verse-follow via aarti.audio.timings.
      showToast("ऑडिओ प्लेबॅक लवकरच येत आहे");
      return;
    }
    if (!speech.supported) {
      showToast("या ब्राउझर/डिव्हाइसवर आवाजात वाचन उपलब्ध नाही");
      return;
    }
    if (speech.speaking && !speech.paused) {
      speech.pause();
    } else if (speech.speaking && speech.paused) {
      speech.resume();
    } else {
      speech.start(aarti.verses, activeIndex >= 0 ? activeIndex : 0);
    }
  }

  return (
    <>
      <header className="reader-header">
        <div className="container">
          <Link href="/list" className="icon-btn" aria-label="मागे जा">
            <ArrowLeft size={20} />
          </Link>
          <span className="aarti-name">{aarti.title}</span>
          <div className="header-actions">
            <button
              className={`icon-btn fav-btn ${isFav ? "is-active" : ""}`}
              onClick={toggleFav}
              aria-label="आवडती चिन्हांकित करा"
              aria-pressed={isFav}
            >
              <HeartIcon active={isFav} />
            </button>
            <button className="icon-btn" onClick={() => setSheetOpen(true)} aria-label="अधिक पर्याय">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className={`verse-indicator ${bump ? "bump" : ""}`} aria-live="polite">
        <span className="dot" aria-hidden="true" />
        <span>
          कडवा {activeIndex + 1} / {aarti.verses.length}
        </span>
      </div>

      <main>
        <div className="reader-intro">
          <p className="invocation">॥ श्री गणेश ॥</p>
          <h1>{aarti.title}</h1>
          <p className="deity-tag">{aarti.deity}</p>
        </div>

        <div className="reader-toolbar">
          <div className="mode-toggle" role="group" aria-label="वाचन मोड">
            <button className={mode === "normal" ? "is-active" : ""} onClick={() => updateMode("normal")}>
              सामान्य
            </button>
            <button className={mode === "focus" ? "is-active" : ""} onClick={() => updateMode("focus")}>
              फोकस
            </button>
          </div>
        </div>

        <div className={`container reader-body ${mode === "focus" ? "focus-mode" : ""}`}>
          <nav className="verse-rail" aria-label="कडवा सूची">
            <div className="rail-line" />
            {aarti.verses.map((v, i) => (
              <button
                key={v.id}
                className={v.id === activeVerseId ? "is-active" : ""}
                onClick={() => scrollToVerse(v.id)}
                aria-label={`कडवा ${i + 1} कडे जा`}
              >
                <span className="dot" />
                कडवा {i + 1}
              </button>
            ))}
          </nav>

          <div className={`verses-wrap font-${fontSize}`}>
            {aarti.verses.map((v, i) => (
              <section
                key={v.id}
                id={`verse-${v.id}`}
                ref={(el) => {
                  verseRefs.current[v.id] = el;
                }}
                data-verse={v.id}
                className={`aarti-verse ${v.id === activeVerseId ? "is-active" : ""} ${
                  marker === v.id ? "is-marked" : ""
                }`}
                tabIndex={-1}
                aria-label={`कडवा ${i + 1}`}
              >
                <span className="verse-label">
                  कडवा {i + 1} / {aarti.verses.length}
                </span>
                <button
                  className="verse-mark-btn"
                  onClick={() => handleMarkToggle(v.id)}
                  aria-label="हा कडवा निवडा"
                  aria-pressed={marker === v.id}
                >
                  <Bookmark size={18} fill={marker === v.id ? "currentColor" : "none"} />
                </button>
                <p style={{ whiteSpace: "pre-line" }}>{v.text}</p>
              </section>
            ))}
          </div>
        </div>

        <div className="reader-end container">
          <p className="om">ॐ</p>
          <p>॥ शुभं भवतु ॥</p>
        </div>
      </main>

      <div className="control-bar">
        <button onClick={decreaseFont} aria-label="अक्षर आकार कमी करा">
          A−
        </button>
        <button onClick={() => updateFontSize("normal")} aria-label="अक्षर आकार सामान्य करा">
          Aa
        </button>
        <button onClick={increaseFont} aria-label="अक्षर आकार वाढवा">
          A+
        </button>
        <span className="divider" aria-hidden="true" />
        <button
          className={speech.speaking && !speech.paused ? "is-active" : ""}
          onClick={handleAudio}
          aria-label={speech.speaking && !speech.paused ? "वाचन थांबवा" : "आवाजात ऐका"}
          aria-pressed={speech.speaking && !speech.paused}
        >
          {speech.speaking && !speech.paused ? <Pause size={20} /> : <Volume2 size={20} />}
        </button>
        <button
          className={isFav ? "is-active" : ""}
          onClick={toggleFav}
          aria-label="आवडती चिन्हांकित करा"
          aria-pressed={isFav}
        >
          <HeartIcon active={isFav} />
        </button>
        <button onClick={() => setSheetOpen(true)} aria-label="अधिक पर्याय">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className={`sheet-backdrop ${sheetOpen ? "is-open" : ""}`} onClick={() => setSheetOpen(false)} />
      <div className={`sheet ${sheetOpen ? "is-open" : ""}`} role="dialog" aria-label="अधिक पर्याय">
        <div className="sheet-handle" />
        <p style={{ padding: "4px 6px 8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>अक्षर आकार</p>
        <div className="font-size-options">
          {storage.FONT_STEPS.map((step) => (
            <button key={step} className={fontSize === step ? "is-active" : ""} onClick={() => updateFontSize(step)}>
              {FONT_LABELS[step]}
            </button>
          ))}
        </div>
        <button className="sheet-item" onClick={shareAarti}>
          <Share2 size={20} /> ही आरती शेअर करा
        </button>
        {speech.speaking && (
          <button
            className="sheet-item"
            onClick={() => {
              speech.stop();
              setSheetOpen(false);
            }}
          >
            <Pause size={20} /> आवाजातील वाचन थांबवा
          </button>
        )}
        <button className="sheet-item" onClick={() => setSheetOpen(false)}>
          <X size={20} /> बंद करा
        </button>
      </div>

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </>
  );
}

function HeartIcon({ active }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

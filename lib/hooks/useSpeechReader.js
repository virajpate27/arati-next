"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * No audio files exist for any aarti yet (see lib/data/aartis.js —
 * every `audio` field is null), so this uses the browser's built-in
 * Web Speech API (speechSynthesis) instead: zero audio assets to
 * host, and it reads verse-by-verse so the reading page can
 * highlight/scroll to the verse currently being spoken, the same
 * way it already tracks scroll position.
 *
 * Offline note: on-device voices (most Android TTS packs once
 * downloaded, and all iOS/Safari voices) keep working offline.
 * Some browsers' default/"cloud" voices need a network connection —
 * that's outside this hook's control.
 */
function pickVoice(voices) {
  return (
    voices.find((v) => v.lang === "mr-IN") ||
    voices.find((v) => v.lang?.startsWith("mr")) ||
    voices.find((v) => v.lang === "hi-IN") ||
    voices.find((v) => v.lang?.startsWith("hi")) ||
    voices.find((v) => v.default) ||
    voices[0] ||
    null
  );
}

export function useSpeechReader({ onVerseChange, onEnd } = {}) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  const versesRef = useRef([]);
  const indexRef = useRef(-1);
  const voiceRef = useRef(null);
  const callbacksRef = useRef({ onVerseChange, onEnd });
  callbacksRef.current = { onVerseChange, onEnd };

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);

    function loadVoices() {
      voiceRef.current = pickVoice(window.speechSynthesis.getVoices());
    }
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const speakFrom = useCallback((idx) => {
    const verses = versesRef.current;
    const verse = verses[idx];
    if (!verse) {
      indexRef.current = -1;
      setSpeaking(false);
      setPaused(false);
      callbacksRef.current.onEnd?.();
      return;
    }

    indexRef.current = idx;
    callbacksRef.current.onVerseChange?.(verse.id);

    const utterance = new window.SpeechSynthesisUtterance(verse.text.replace(/\n/g, ", "));
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.lang = voiceRef.current?.lang || "mr-IN";
    utterance.rate = 0.92;
    utterance.onend = () => {
      if (indexRef.current === idx) speakFrom(idx + 1);
    };
    utterance.onerror = () => {
      indexRef.current = -1;
      setSpeaking(false);
      setPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
    setPaused(false);
  }, []);

  const start = useCallback(
    (verses, fromIndex = 0) => {
      if (!supported) return;
      window.speechSynthesis.cancel();
      versesRef.current = verses;
      speakFrom(fromIndex);
    },
    [supported, speakFrom]
  );

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setPaused(true);
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setPaused(false);
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    indexRef.current = -1;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }, [supported]);

  useEffect(() => stop, [stop]); // stop speaking on unmount / navigation away

  return { supported, speaking, paused, start, pause, resume, stop };
}

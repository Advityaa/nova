"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QUEUE } from "@/lib/data";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [qi, setQi] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [sub, setSub] = useState("Tap anywhere to start");
  const startedRef = useRef(false);

  const track = QUEUE[qi];

  const loadTrack = useCallback((i: number, autoplay: boolean) => {
    const idx = ((i % QUEUE.length) + QUEUE.length) % QUEUE.length;
    setQi(idx);
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = QUEUE[idx].src;
    setSub(`${idx + 1} / ${QUEUE.length} · Nova Radio`);
    if (autoplay) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          setPlaying(false);
          setSub("Add MP3s to /audio to play");
        });
    }
  }, []);

  const playPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.src) loadTrack(0, false);
    if (audio.paused) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setSub("Add MP3s to /audio to play"));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, [loadTrack]);

  // Preload the first track's label without playing.
  useEffect(() => {
    loadTrack(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Advance the queue when a track ends.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => loadTrack(qi + 1, true);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [qi, loadTrack]);

  // Autostart the queue on the visitor's first interaction.
  useEffect(() => {
    const firstInteract = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      loadTrack(0, true);
      window.removeEventListener("pointerdown", firstInteract);
      window.removeEventListener("keydown", firstInteract);
      window.removeEventListener("scroll", firstInteract);
    };
    window.addEventListener("pointerdown", firstInteract);
    window.addEventListener("keydown", firstInteract);
    window.addEventListener("scroll", firstInteract, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", firstInteract);
      window.removeEventListener("keydown", firstInteract);
      window.removeEventListener("scroll", firstInteract);
    };
  }, [loadTrack]);

  return (
    <>
      <audio ref={audioRef} />
      <div className={`nowplaying${playing ? " playing" : ""}`}>
        <button
          className="np-toggle"
          aria-label="Play/pause"
          onClick={(e) => {
            e.stopPropagation();
            playPause();
          }}
        >
          <span className="np-eq">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
          <svg className="np-play" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <div className="np-info">
          <div className="np-track">{track.title}</div>
          <div className="np-sub">{sub}</div>
        </div>
        <button
          className="np-next"
          aria-label="Next track"
          onClick={(e) => {
            e.stopPropagation();
            loadTrack(qi + 1, true);
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 5v14l9-7zM16 5h2v14h-2z" />
          </svg>
        </button>
      </div>
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { QUEUE } from "@/lib/data";

export default function MusicPlayer() {
  const [qi, setQi] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [sub, setSub] = useState("Tap anywhere to start");
  
  const [collapsed, setCollapsed] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const startedRef = useRef(false);

  const track = QUEUE[qi];

  const loadTrack = useCallback((i: number, autoplay: boolean) => {
    const idx = ((i % QUEUE.length) + QUEUE.length) % QUEUE.length;
    setQi(idx);
    setSub(`${idx + 1} / ${QUEUE.length} · Nova Radio`);
    
    // With react-youtube, changing the videoId prop automatically loads the new video.
    // If it was already playing, it will continue playing (autoplay: 1).
    if (autoplay && playerRef.current) {
      setPlaying(true);
    }
  }, []);

  const playPause = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    
    if (playing) {
      player.pauseVideo();
      setPlaying(false);
    } else {
      player.playVideo();
      setPlaying(true);
    }
  }, [playing]);

  useEffect(() => {
    loadTrack(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const firstInteract = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (playerRef.current) {
        playerRef.current.playVideo();
        setPlaying(true);
      }
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
  }, []);

  const onReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
    if (startedRef.current) {
      event.target.playVideo();
    }
  };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    // 1 = playing, 2 = paused, 0 = ended, -1 = unstarted
    if (event.data === 1) {
      setPlaying(true);
      startedRef.current = true;
    } else if (event.data === 2) {
      setPlaying(false);
    } else if (event.data === 0) {
      loadTrack(qi + 1, true);
    }
  };

  const onError: YouTubeProps["onError"] = (event) => {
    console.error("YouTube Player Error", event);
    setSub("Error loading track");
    setPlaying(false);
    setTimeout(() => {
      loadTrack(qi + 1, true);
    }, 2000);
  };
  
  const opts: YouTubeProps["opts"] = {
    height: "10",
    width: "10",
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      playsinline: 1,
    },
  };

  return (
    <>
      <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, overflow: 'hidden' }}>
        <YouTube 
          videoId={track.ytId} 
          opts={opts} 
          onReady={onReady} 
          onStateChange={onStateChange} 
          onError={onError} 
        />
      </div>
      <div className={`nowplaying${playing ? " playing" : ""}${collapsed ? " collapsed" : ""}`}>
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
        <button
          className="np-collapse"
          aria-label="Collapse"
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed(!collapsed);
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            {collapsed ? (
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            ) : (
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            )}
          </svg>
        </button>
      </div>
    </>
  );
}

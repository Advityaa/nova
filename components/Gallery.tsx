"use client";

import { useCallback, useEffect, useState } from "react";

export default function Gallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => {
    setIndex(null);
    document.body.style.overflow = "";
  }, []);

  const openLb = (i: number) => {
    setIndex(i);
    document.body.style.overflow = "hidden";
  };

  const step = useCallback(
    (d: number) =>
      setIndex((i) =>
        i === null ? i : (i + d + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  return (
    <section className="sec" id="gallery">
      <div className="sec-head">
        <div className="l">
          <span className="eyebrow">The floor</span>
          <h2>Gallery</h2>
        </div>
        <div className="r">Mass · Skyline Dome · Bund</div>
      </div>
      <div className="ggrid">
        {images.map((src, i) => (
          <div
            key={src}
            className={`gitem${i === 0 ? " big" : ""}`}
            onClick={() => openLb(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Nova gallery" />
          </div>
        ))}
      </div>

      <div
        className={`lb${open ? " open" : ""}`}
        onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains("lb")) close();
        }}
      >
        <button className="lbx" onClick={close}>
          ×
        </button>
        <button className="lbnav lbprev" onClick={() => step(-1)}>
          ‹
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={index !== null ? images[index] : ""} alt="" />
        <button className="lbnav lbnext" onClick={() => step(1)}>
          ›
        </button>
      </div>
    </section>
  );
}

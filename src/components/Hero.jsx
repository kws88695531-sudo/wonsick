import { useEffect, useMemo, useRef, useState } from "react";

export default function Hero() {
  const images = useMemo(
    () => ["first.png", "sicksick.png", "marin2.png", "marin3.png", "marin4.png"],
    []
  );

  const INTERVAL = 3500;
  const FADE_MS = 900;

  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [isFading, setIsFading] = useState(false);

  const indexRef = useRef(0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (!images.length) return;

    intervalRef.current = setInterval(() => {
      const cur = indexRef.current;

      setPrevIndex(cur);
      setIsFading(true);

      setIndex((i) => {
        const next = (i + 1) % images.length;
        indexRef.current = next;
        return next;
      });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setPrevIndex(null);
        setIsFading(false);
      }, FADE_MS);
    }, INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [images]);

  const currentSrc = `/${images[index]}`;
  const prevSrc = prevIndex !== null ? `/${images[prevIndex]}` : null;

  return (
    <header className="hero">
      <div className="hero-inner">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${currentSrc})` }}
          aria-hidden="true"
        />

        <div className="hero-stage" aria-label="정책 배너">
          {prevSrc && (
            <img
              src={prevSrc}
              alt=""
              className={`hero-img hero-img--prev ${isFading ? "is-fade" : ""}`}
              aria-hidden="true"
              draggable="false"
            />
          )}

          <img
            src={currentSrc}
            alt="정책 사진"
            className="hero-img hero-img--current"
            loading="eager"
            draggable="false"
          />
        </div>
      </div>

      <div className="hero-overlay" />
    </header>
  );
}

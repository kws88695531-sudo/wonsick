import { useEffect, useMemo, useRef, useState } from "react";

export default function Hero() {
  const images = useMemo(
    () => ["mongham.png", "first.png", "sicksick.png", "marin2.png", "marin3.png", "marin4.png"],
    []
  );

  const HOLD_MS = 4000;   // 머무는 시간
  const SLIDE_MS = 1200;  // 넘어가는 시간

  const realCount = images.length;

  // ✅ 양방향 무한: [마지막클론, ...진짜들, 첫클론]
  const slides = useMemo(() => {
    if (!images.length) return [];
    const last = images[images.length - 1];
    const first = images[0];
    return [last, ...images, first];
  }, [images]);

  // pos: 0..realCount+1
  // ✅ 시작은 1(진짜 첫장)
  const [pos, setPos] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);

  // ✅ dots용 논리 인덱스(0..realCount-1)
  const active = realCount ? ((pos - 1 + realCount) % realCount) : 0;
  const currentSrc = realCount ? `/${images[active]}` : "";

  // autoplay
  const timerRef = useRef(null);
  const viewportRef = useRef(null);

  // drag
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const draggingRef = useRef(false);
  const widthRef = useRef(1);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const scheduleNext = () => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      setIsAnimating(true);
      setPos((p) => p + 1);
    }, HOLD_MS);
  };

  const goTo = (nextPos, animate = true) => {
    setIsAnimating(animate);
    setPos(nextPos);
  };

  const goNext = () => {
    setIsAnimating(true);
    setPos((p) => p + 1);
  };

  const goPrev = () => {
    setIsAnimating(true);
    setPos((p) => p - 1);
  };

  // ✅ 최초 진입: 4초 후 다음으로
  useEffect(() => {
    if (!realCount) return;
    scheduleNext();
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realCount]);

  // ✅ transition 끝나면:
  // - 끝(첫클론=realCount+1) 도착 → transition 끄고 1로 점프
  // - 앞(마지막클론=0) 도착 → transition 끄고 realCount로 점프
  // - 그리고 “넘긴 뒤부터” 4초 카운트다운 시작
  useEffect(() => {
    if (!realCount) return;
    const el = viewportRef.current;
    if (!el) return;

    const onTransitionEnd = (e) => {
      if (e.propertyName !== "transform") return;

      // 오른쪽 끝: 첫클론
      if (pos === realCount + 1) {
        setIsAnimating(false);
        setPos(1);
        requestAnimationFrame(() => requestAnimationFrame(() => setIsAnimating(true)));
      }

      // 왼쪽 끝: 마지막클론
      if (pos === 0) {
        setIsAnimating(false);
        setPos(realCount);
        requestAnimationFrame(() => requestAnimationFrame(() => setIsAnimating(true)));
      }

      scheduleNext();
    };

    el.addEventListener("transitionend", onTransitionEnd);
    return () => el.removeEventListener("transitionend", onTransitionEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, realCount]);

  // ✅ 이미지 프리로드
  useEffect(() => {
    images.forEach((name) => {
      const img = new Image();
      img.src = `/${name}`;
    });
  }, [images]);

  // width 측정
  const getWidth = () => {
    const w = viewportRef.current?.getBoundingClientRect().width;
    widthRef.current = w || 1;
  };

  useEffect(() => {
    getWidth();
    window.addEventListener("resize", getWidth);
    return () => window.removeEventListener("resize", getWidth);
  }, []);

  const setTrackTranslatePx = (px) => {
    const track = viewportRef.current?.querySelector(".hero-track");
    if (!track) return;
    track.style.transform = `translate3d(${px}px,0,0)`;
  };

  const handlePointerDown = (e) => {
    clearTimer();
    draggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    getWidth();

    setIsAnimating(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    lastXRef.current = e.clientX;

    const dx = lastXRef.current - startXRef.current;
    const base = -pos * widthRef.current;
    setTrackTranslatePx(base + dx);
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    const dx = lastXRef.current - startXRef.current;
    const threshold = widthRef.current * 0.18;

    setIsAnimating(true);

    if (dx < -threshold) {
      goNext();
    } else if (dx > threshold) {
      goPrev();
    } else {
      goTo(pos, true);
      scheduleNext();
    }
  };

  const onDotClick = (i) => {
    clearTimer();
    goTo(i + 1, true); // ✅ dots(0..real-1) -> pos(1..real)
  };

  const trackStyle = {
    transform: `translate3d(${-pos * 100}%,0,0)`,
    transitionDuration: isAnimating ? `${SLIDE_MS}ms` : "0ms",
  };

  return (
    <header className="hero">
      <div className="hero-inner">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${currentSrc})` }}
          aria-hidden="true"
        />

        <div className="hero-stage" aria-label="정책 배너">
          <div
            className="hero-viewport"
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="hero-track" style={trackStyle}>
              {slides.map((name, idx) => (
                <div className="hero-slide" key={`${name}-${idx}`}>
                  <img
                    src={`/${name}`}
                    alt="정책 사진"
                    className="hero-img"
                    draggable="false"
                    loading="eager"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-dots" aria-label="배너 페이지네이션">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`hero-dot ${active === i ? "is-active" : ""}`}
              onClick={() => onDotClick(i)}
              aria-label={`${i + 1}번 배너로 이동`}
            />
          ))}
        </div>
      </div>

      <div className="hero-overlay" />
    </header>
  );
}

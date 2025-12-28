import { useEffect, useMemo, useRef, useState } from "react";

export default function Hero() {
  const images = useMemo(
    () => ["first.png", "sicksick.png", "marin2.png", "marin3.png", "marin4.png"],
    []
  );

  // ✅ “4초 보여주고 → 부드럽게 슬라이드”
  const HOLD_MS = 4000;     // 머무는 시간
  const SLIDE_MS = 1200;    // 넘어가는 시간(조금 느리게)

  const realCount = images.length;

  // ✅ 무한루프 튐 방지: 마지막에 첫장 clone 붙임
  const slides = useMemo(() => {
    if (!images.length) return [];
    return [...images, images[0]];
  }, [images]);

  // pos: 0..realCount (마지막은 clone)
  const [pos, setPos] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // ✅ dots는 “즉시” 바뀌어야 하니까 논리 인덱스(0..realCount-1)로 따로 계산
  const active = realCount ? (pos === realCount ? 0 : pos) : 0;
  const currentSrc = realCount ? `/${images[active]}` : "";

  // autoplay 타이머
  const timerRef = useRef(null);

  // 드래그 상태
  const viewportRef = useRef(null);
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
      goNext();
    }, HOLD_MS);
  };

  const goTo = (nextPos, animate = true) => {
    setIsAnimating(animate);
    setPos(nextPos);
  };

  const goNext = () => {
    // ✅ 넘어가는 순간 dots가 바로 바뀌게: pos를 즉시 올림
    goTo(pos + 1, true);
  };

  const goPrev = () => {
    // ✅ 0에서 왼쪽으로 가면 “마지막(진짜)”로 순간이동 후 애니메이션
    if (pos === 0) {
      // 1) transition 없이 마지막(진짜 마지막=realCount-1) 위치로 점프
      setIsAnimating(false);
      setPos(realCount - 1);

      // 2) 다음 프레임에서 transition 켜고 한 칸 더 왼쪽(=realCount-2)로 이동
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
          setPos(realCount - 2);
        });
      });
      return;
    }
    goTo(pos - 1, true);
  };

  // ✅ pos가 바뀌면(=슬라이드 시작) autoplay를 멈추고,
  //    애니메이션이 끝난 뒤에 다시 4초 카운트다운 시작(요구사항)
  useEffect(() => {
    if (!realCount) return;
    clearTimer();
    // transition 끝나면 scheduleNext를 transitionend에서 호출할 거라 여기선 안 건드림
  }, [pos, realCount]);

  // ✅ transition 끝나면:
  // - clone(=pos===realCount)에 도착했으면 transition 끄고 0으로 "조용히" 점프
  // - 그리고 4초 후 다음 슬라이드 예약
  useEffect(() => {
    if (!realCount) return;

    const el = viewportRef.current;
    if (!el) return;

    const onTransitionEnd = (e) => {
      // track transform transition 끝만 받기
      if (e.propertyName !== "transform") return;

      // ✅ 마지막(clone) 도착 → 튐 없이 0으로 순간이동
      if (pos === realCount) {
        setIsAnimating(false);
        setPos(0);

        // 다음 프레임에 다시 애니메이션 켜기(이후 이동을 위해)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsAnimating(true);
          });
        });
      }

      // ✅ “다 넘기고 난 뒤부터 카운트다운” 시작
      scheduleNext();
    };

    el.addEventListener("transitionend", onTransitionEnd);
    return () => el.removeEventListener("transitionend", onTransitionEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, realCount]);

  // ✅ 최초 진입 시 4초 후 시작
  useEffect(() => {
    if (!realCount) return;
    scheduleNext();
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realCount]);

  // ✅ 이미지 프리로드(끊김 방지)
  useEffect(() => {
    images.forEach((name) => {
      const img = new Image();
      img.src = `/${name}`;
    });
  }, [images]);

  // ========== Drag/Swipe ==========
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
    // 클릭/드래그 시작 시 autoplay 멈춤
    clearTimer();
    draggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    getWidth();

    // 드래그 중 transition 끄기
    setIsAnimating(false);

    // 캡처
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

    // 다시 transition 켜고 스냅
    setIsAnimating(true);

    if (dx < -threshold) {
      // 왼쪽으로 드래그 => 다음
      goNext();
    } else if (dx > threshold) {
      // 오른쪽으로 드래그 => 이전
      goPrev();
    } else {
      // 원위치
      goTo(pos, true);
      // 이동 안했으니 “다 넘긴 뒤 카운트다운” 규칙상 여기서 다시 예약
      scheduleNext();
    }
  };

  const onDotClick = (i) => {
    clearTimer();
    goTo(i, true);
    // transition 끝난 후 scheduleNext
  };

  // ✅ track 스타일
  const trackStyle = {
    transform: `translate3d(${-pos * 100}%,0,0)`,
    transitionDuration: isAnimating ? `${SLIDE_MS}ms` : "0ms",
  };

  return (
    <header className="hero">
      <div className="hero-inner">
        {/* 뒤에 흐릿한 배경 */}
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${currentSrc})` }}
          aria-hidden="true"
        />

        {/* ✅ 프레임(틀) */}
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

        {/* ✅ 점점점: hero-stage “아래”로 완전히 분리 */}
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

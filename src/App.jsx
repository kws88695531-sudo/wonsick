import { useEffect, useMemo, useState } from "react";

import Hero from "./components/Hero.jsx";
import SnsBar from "./components/SnsBar.jsx";
import Tabs from "./components/Tabs.jsx";
import Policy333 from "./components/Policy333.jsx";
import MarineTour from "./components/MarineTour.jsx";
import Videos from "./components/Videos.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const tabs = useMemo(
    () => [
      { key: "policy333", label: "3·3·3 정책" },
      { key: "marine", label: "해양관광" },
    ],
    []
  );

  // ✅ PC: 기본 선택(3·3·3)
  // ✅ Mobile: 처음엔 아무것도 선택 X(null)
  const [active, setActive] = useState("policy333");

  // 페이드 트리거용 (내용 전환될 때만)
  const [fadeKey, setFadeKey] = useState(0);

  const isMobile = () => window.innerWidth <= 820;

  // ✅ 첫 진입 시: 모바일이면 "아무 탭도 선택 안됨"
  useEffect(() => {
    if (isMobile()) setActive(null);
  }, []);

  const handleChange = (key) => {
    // ✅ 스크롤 이동 절대 없음 (여기서 scrollTo 같은 거 안 함)

    // ✅ 모바일: 같은 버튼 다시 누르면 해제(null) -> 내용 숨김
    if (isMobile()) {
      setActive((prev) => (prev === key ? null : key));
      setFadeKey((k) => k + 1);
      return;
    }

    // ✅ PC: 탭 전환(항상 하나 선택)
    setActive(key);
    setFadeKey((k) => k + 1);
  };

  return (
    <div className="page">
      <Hero />

      {/* ✅ SNS 바로가기는 “하나만” */}
      <SnsBar />

      <div className="container">
        <Tabs tabs={tabs} active={active} onChange={handleChange} />

        {/* ✅ 모바일: 처음엔 내용 안보임(버튼만) */}
        {/* ✅ 버튼 누르면 내용 “전환” + 페이드 */}
        {active ? (
          <div key={`${active}-${fadeKey}`} className="tab-panel fade-in">
            {active === "policy333" ? <Policy333 /> : <MarineTour />}
          </div>
        ) : null}

        {/* ✅ 내용이 없을 때도 영상이 “바로 밑에” 붙어있게 */}
        <div className={`stack ${active ? "" : "stack--tight"}`}>
          <Videos />
        </div>
      </div>

      <Footer />

      {/* Floating buttons */}
      <button
        className="fab fab-top"
        type="button"
        aria-label="맨 위로"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
      <button
        className="fab fab-bottom"
        type="button"
        aria-label="맨 아래로"
        onClick={() =>
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
        }
      >
        ↓
      </button>
    </div>
  );
}

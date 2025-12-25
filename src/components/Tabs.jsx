export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist" aria-label="정책 페이지 선택">
      {tabs.map((t) => {
        const isOn = active === t.key;

        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={isOn}
            className={`tab ${isOn ? "is-active" : ""}`}
            onClick={() => onChange(t.key)}
          >
            <span className="tab-label">{t.label}</span>

            {/* ✅ 아이콘: 선택됨(▾), 미선택(≡) */}
            <span className={`tab-icon ${isOn ? "is-open" : "is-closed"}`} aria-hidden="true">
              {isOn ? "▾" : "≡"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

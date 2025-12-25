const SNS = [
  {
    name: "공원식TV",
    href: "https://www.youtube.com/@%EA%B3%B5%EC%9B%90%EC%8B%9DTV",
    icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
    type: "img",
  },
  {
    name: "인스타그램",
    href: "https://www.instagram.com/pohang_016/",
    icon: "https://cdn-icons-png.flaticon.com/512/1384/1384063.png",
    type: "img",
  },
  {
    name: "페이스북",
    href: "https://www.facebook.com/kws5307",
    icon: "https://cdn-icons-png.flaticon.com/512/1384/1384053.png",
    type: "img",
  },
  {
    name: "네이버 블로그",
    href: "https://blog.naver.com/kws5307",
    iconText: "N",
    type: "text",
  },
  {
    name: "네이버 밴드",
    href: "https://band.us/@wonsick",
    iconText: "B",
    type: "text",
  },
  {
    name: "카카오톡 채널",
    href: "https://pf.kakao.com/_xlPHGn",
    icon: "https://cdn.freebiesupply.com/logos/large/2x/kakaotalk-logo-png-transparent.png",
    type: "img",
  },
];

export default function SnsBar() {
  return (
    <section className="snsbar" aria-label="공식 SNS 바로가기">
      <div className="container">
        <div className="snsbar-head">
          <div className="snsbar-title">공식 SNS 바로가기</div>
        </div>

        <ul className="snsbar-grid">
          {SNS.map((s) => (
            <li key={s.name}>
              <a
                className="snsbar-item"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="snsbar-ico">
                  {s.type === "img" ? (
                    <img src={s.icon} alt="" />
                  ) : (
                    <span className="snsbar-icoText">{s.iconText}</span>
                  )}
                </span>
                <span className="snsbar-label">{s.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

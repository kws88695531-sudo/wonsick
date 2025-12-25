export default function Videos() {
  return (
    <section className="card">

      <div className="videoGrid">
        <div className="videoBox">
          <div className="videoTitle">출판기념회</div>
          <div className="videoFrame">
            <iframe
              src="https://www.youtube.com/embed/eXUEBNr2yKM"
              title="출판기념회 영상"
              allowFullScreen
            />
          </div>
        </div>

        <div className="videoBox">
          <div className="videoTitle">공원식의 발자취</div>
          <div className="videoFrame">
            <iframe
              src="https://www.youtube.com/embed/Qf8Fokw11YQ"
              title="공원식의 발자취"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeBackgroundLine() {
  return (
    <div className="home-market-line-track" aria-hidden="true">
      {[0, 1].map((index) => (
        <img
          key={index}
          src="/images/home-market-line.svg"
          alt=""
          aria-hidden="true"
          width={1200}
          height={720}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="home-market-line"
        />
      ))}
    </div>
  );
}

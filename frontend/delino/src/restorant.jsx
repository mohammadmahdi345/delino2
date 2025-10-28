
import axios from "axios";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";


const SCROLL_STEP = 260;

const Restorant = () => {
  const [restorants, setRestorants] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchRestorants = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get("http://localhost:8004/restorant/");
        setRestorants(response.data);
    
        requestAnimationFrame(checkScroll);
      } catch (err) {
        console.error(err);
        setError("رستوران‌ها بارگذاری نشدند.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestorants();

    const onResize = () => requestAnimationFrame(checkScroll);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => requestAnimationFrame(checkScroll);
    el.addEventListener("scroll", onScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [restorants]);

  const checkScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth + 8 < el.scrollWidth);
  };

  const scrollBy = (delta) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
    setTimeout(checkScroll, 420);
  };

  const scrollLeft = () => scrollBy(-SCROLL_STEP);
  const scrollRight = () => scrollBy(SCROLL_STEP);

  const handleClick = (rName) => {
    setMessage(`در حال باز کردن جزئیات: ${rName}`);
  };

  if (loading) return <p className="res-loading">در حال بارگذاری رستوران‌ها...</p>;

  return (
    <section className="restorant-section" aria-label="فهرست رستوران‌ها">
      <div className="res-header-row">
        {error ? <p className="res-error">{error}</p> : <p className="res-message">{message}</p>}
        <a className="res-view-all" href="/restorans">مشاهده همه</a>
      </div>

      <div className="restorant-carousel-wrap">
        <div className={`res-fade-left ${canScrollLeft ? "visible" : ""}`} />
        <div className={`res-fade-right ${canScrollRight ? "visible" : ""}`} />

        <button
          className={`carousel-nav left ${canScrollLeft ? "" : "disabled"}`}
          onClick={scrollLeft}
          aria-label="اسکرول به چپ"
          disabled={!canScrollLeft}
        >
          ‹
        </button>

        <div className="restorant-grid" role="list" ref={carouselRef}>
          {restorants.length > 0 ? (
            restorants.map((r) => (
              <article key={r.id} className="restorant-card" role="listitem" tabIndex={0}>
                <div className="res-inner">
                  <div className="res-body">
                    <h2 className="res-title">{r.name}</h2>
                    <p className="res-desc">{r.description}</p>
                    <p className="res-phone">📞 {r.phone_number}</p>
                    <p className="res-likes">❤️ {r.like_count}</p>
                    <Link to={`/res/${r.id}`}>
                      <button className="res-btn" onClick={() => handleClick(r.name)}>دیدن جزئیات</button>
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="res-empty">هیچ رستورانی موجود نیست.</p>
          )}
        </div>

        <button
          className={`carousel-nav right ${canScrollRight ? "" : "disabled"}`}
          onClick={scrollRight}
          aria-label="اسکرول به راست"
          disabled={!canScrollRight}
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default Restorant;

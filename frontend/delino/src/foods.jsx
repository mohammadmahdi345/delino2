import { useEffect, useState,useRef } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';


const SCROLL_STEP = 260;

const Food = () => {
  const [food, setFood] = useState([]);
  const [message, setMessage] = useState("در حال بارگذاری...");
  const carouselRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get("http://localhost:8004/foods/");
        setFood(response.data);
        setMessage(""); // ✅ متن حذف میشه بعد از لود موفق
        requestAnimationFrame(checkScroll);
      } catch (error) {
        console.error(error);
        setMessage(error?.message || "خطا در دریافت اطلاعات");
      }
    };
    fetchFoods();

    const onResize = () => requestAnimationFrame(checkScroll);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => requestAnimationFrame(checkScroll);
    el.addEventListener("scroll", onScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [food]);

  const handleToggleOpen = (e, id) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="food-section" aria-label="فهرست غذاها">
      <div className="food-header-row">
        <p className="food-message">{message}</p>
        <a className="view-all" href="/foods">مشاهده همه</a>
      </div>

      <div className="food-carousel-wrap">
        <div className={`fade-left ${canScrollLeft ? "visible" : ""}`} />
        <div className={`fade-right ${canScrollRight ? "visible" : ""}`} />

        <button
          className={`carousel-nav left ${canScrollLeft ? "" : "disabled"}`}
          onClick={scrollLeft}
          aria-label="اسکرول به چپ"
          disabled={!canScrollLeft}
        >
          ‹
        </button>

        <div className="food-carousel" role="list" ref={carouselRef}>
          {food.length > 0 ? (
            food.map((f) => {
              const isOpen = openId === f.id;
              return (
                <article
                  className="food-card"
                  key={f.id}
                  role="listitem"
                  tabIndex={0}
                >
                  <div className="card-inner" style={{ padding: 10 }}>
                    {/* نامه */}
                    <div
                      className={`letter-image ${isOpen ? "open" : ""}`}
                      role="button"
                      aria-pressed={isOpen}
                      aria-label={isOpen ? `بستن نامه ${f.name}` : `باز کردن نامه ${f.name}`}
                      onClick={(e) => handleToggleOpen(e, f.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleToggleOpen(e, f.id);
                        }
                      }}
                    >
                      <div className="animated-mail" aria-hidden={false}>
                        <div className="back-fold" />
                        <div className="letter">
                          <div className="letter-border" />
                          <div className="letter-context" />
                          <div className="letter-stamp" />
                        </div>
                        <div className="top-fold" />
                        <div className="body" />
                        <div className="left-fold" />
                        <img
                          className="card-avatar revealed-img"
                          src={f.avatar}
                          alt={f.name}
                          loading="lazy"
                        />
                      </div>
                      <div className="shadow" />
                    </div>

                    {/* اسم غذا بیرون نامه */}
                    <div className="letter-title-outside">{f.name || "بدون نام"}</div>

                    {/* meta وقتی نامه بازه */}
                    <div
                      className={`letter-meta ${isOpen ? "visible" : ""}`}
                      style={{
                        marginTop: 10,
                        textAlign: "center",
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen ? "translateY(0)" : "translateY(-6px)",
                        transition: "opacity .22s, transform .22s",
                        pointerEvents: isOpen ? "auto" : "none",
                      }}
                    >
                      <h3
                        className="card-title"
                        style={{ margin: "6px 0 4px", fontSize: "1rem" }}
                      >
                        {f.name}
                      </h3>
                      <p
                        className="card-desc"
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          color: "var(--muted, #6b7280)",
                          maxHeight: 48,
                          overflow: "hidden",
                        }}
                      >
                        {f.description}
                      </p>

                      <div style={{ marginTop: 8 }}>
                        <Link
                          to={`/food/res/${f.id}`}
                          className="card-cta"
                          onClick={(e) => {
                            if (!isOpen) {
                              e.preventDefault();
                              setOpenId(f.id);
                            }
                          }}
                          style={{ textDecoration: "none" }}
                        >
                          جزئیات
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty-placeholder">هیچ غذایی یافت نشد</div>
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

export default Food;
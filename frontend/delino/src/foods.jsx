import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Food = () => {
  const [food, setFood] = useState([]);
  const [message, setMessage] = useState("در حال بارگذاری...");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchFoods = async () => {
      try {
        const response = await axios.get("http://localhost:8004/foods/");
        if (!mounted) return;
        setFood(response.data || []);
        setMessage("");
      } catch (error) {
        console.error(error);
        setMessage(error?.message || "خطا در دریافت اطلاعات");
      }
    };
    fetchFoods();
    return () => { mounted = false; };
  }, []);

  const handleToggleOpen = (e, id) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="food-section" aria-label="فهرست غذاها">
      <div className="food-header-row">
        <p className="food-message">{message}</p>
      </div>

      <div className="food-carousel-wrap">
        {/* fades can remain — CSS بالا مدیریتشون می‌کنه */}
        <div className="fade-left" />
        <div className="fade-right" />

        {/* scroll container: CSS-only scrollbar */}
        <div className="food-carousel" role="list">
          <div className="food-row">
            {food.length > 0 ? (
              food.map(f => {
                const isOpen = openId === f.id;
                return (
                  <div key={f.id} className="food-item-shell">
                    <article className="food-card" role="listitem" tabIndex={0}>
                      <div className="card-inner" style={{ padding: 10 }}>
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
                            <img className="card-avatar revealed-img" src={f.avatar} alt={f.name} loading="lazy" />
                          </div>
                          <div className="shadow" />
                        </div>

                        <div className="letter-title-outside">{f.name || "بدون نام"}</div>

                        <div className={`letter-meta ${isOpen ? "visible" : ""}`}
                          style={{
                            marginTop: 10,
                            textAlign: "center",
                            opacity: isOpen ? 1 : 0,
                            transform: isOpen ? "translateY(0)" : "translateY(-6px)",
                            transition: "opacity .22s, transform .22s",
                            pointerEvents: isOpen ? "auto" : "none",
                          }}
                        >
                          <h3 className="card-title" style={{ margin: "6px 0 4px", fontSize: "1rem" }}>{f.name}</h3>
                          <p className="card-desc" style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted, #6b7280)", maxHeight: 48, overflow: "hidden" }}>
                            {f.description}
                          </p>

                          <div style={{ marginTop: 8 }}>
                            <Link to={`/food/res/${f.id}`} className="card-cta" style={{ textDecoration: "none" }}>
                              جزئیات
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })
            ) : (
              <div className="empty-placeholder">هیچ غذایی یافت نشد</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Food;

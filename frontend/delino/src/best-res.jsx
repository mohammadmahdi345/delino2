import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ThumbsUp, ShoppingBag, Phone } from "lucide-react";

const BestRestorant = () => {
  const [restorants, setRestorants] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestorants = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get("http://localhost:8004/best-restorant/");
        setRestorants(response.data);
        setMessage("رستوران‌ها با موفقیت بارگذاری شدند.");
      } catch (err) {
        console.error(err);
        setError("رستوران‌ها بارگذاری نشدند.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestorants();
  }, []);

  const handleClick = (rName) => {
    setMessage(`در حال باز کردن جزئیات: ${rName}`);
  };

  // ---------- helper: single avatar character ----------
  const getAvatarChar = (name = "") => {
    if (!name || !name.trim()) return "ر";
    const words = name.trim().split(/\s+/);
    // اگر بیش از یک کلمه هست، حرف اول کلمه دوم را برگردان
    if (words.length > 1 && words[1].length > 0) {
      return words[1].charAt(0);
    }
    // در غیر این صورت حرف اول از کلمه اول
    return words[0].charAt(0);
  };

  // ---------- helper: deterministic color from string ----------
  const stringToColor = (str = "") => {
    if (!str) return "#6b7280";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue} 70% 45%)`;
  };

  if (loading) return <p className="br-loading">در حال بارگذاری رستوران‌ها...</p>;

  return (
    <section className="best-rest-panel" aria-labelledby="best-rest-title">
      <div className="br-header">
        <h2 id="best-rest-title">🍽️ رستوران‌های پیشنهادی</h2>
        <p className="br-note">بهترین‌ها نزدیک شما — با رأی کاربران</p>
      </div>

      {error && <div className="br-error" role="alert">{error}</div>}
      {message && <div className="br-message" role="status">{message}</div>}

      <div className="br-grid">
        {restorants.length > 0 ? (
          restorants.map((r) => (
            <article className="br-card" key={r.id} tabIndex={0} aria-labelledby={`br-title-${r.id}`}>
              <div className="br-card-top">
                <div className="br-badge">#{r.rank ?? "-"}</div>

                <div className="br-media" aria-hidden="true">
                  <div
                    className="br-avatar"
                    style={{
                      background: stringToColor(r.name || ""),
                      color: "#fff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      fontWeight: 800,
                      fontSize: 20,
                      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                    }}
                    title={r.name}
                  >
                    {getAvatarChar(r.name)}
                  </div>
                </div>

                <div className="br-title-wrap">
                  <h3 id={`br-title-${r.id}`} className="br-title">{r.name}</h3>
                  <p className="br-desc">{r.description}</p>
                </div>
              </div>

              <div className="br-stats">
                <div className="br-stat br-like">
                  <ThumbsUp size={18} className="br-icon" />
                  <div>
                    <div className="br-stat-num">{r.like_count ?? 0}</div>
                    <div className="br-stat-label">لایک</div>
                  </div>
                </div>

                <div className="br-stat br-order">
                  <ShoppingBag size={18} className="br-icon" />
                  <div>
                    <div className="br-stat-num">{r.order_count ?? 0}</div>
                    <div className="br-stat-label">سفارش</div>
                  </div>
                </div>

                <div className="br-stat br-phone">
                  <Phone size={18} className="br-icon" />
                  <div>
                    <div className="br-stat-num">{r.phone_number || "-"}</div>
                    <div className="br-stat-label">تلفن</div>
                  </div>
                </div>
              </div>

              <div className="br-actions">
                <Link to={`/res/${r.id}`} className="br-link" onClick={() => handleClick(r.name)}>
                  <button className="br-btn primary" aria-label={`دیدن جزئیات ${r.name}`}>دیدن جزئیات</button>
                </Link>
              </div>
            </article>
          ))
        ) : (
          <p className="br-empty">هیچ رستورانی موجود نیست.</p>
        )}
      </div>
    </section>
  );
};

export default BestRestorant;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";


const Res = () => {
  const { id } = useParams();
  const [res, setRes] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  // base for media URLs: if axios.defaults.baseURL is set use it, otherwise use this
  const API_BASE = (axios.defaults.baseURL && axios.defaults.baseURL.replace(/\/$/, "")) || "http://localhost:8004";

  // Convert avatar path to absolute usable URL
  const fullImageUrl = (path) => {
    if (!path) return null;
    // already absolute
    if (/^https?:\/\//i.test(path) || /^data:/i.test(path)) return path;
    // ensure starts with slash
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE}${p}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axios.defaults.headers.common["Authorization"];

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resResp, commentsResp] = await Promise.all([
          axios.get(`${API_BASE}/restorant/${id}/`),
          axios.get(`${API_BASE}/comments/${id}/`),
        ]);

        console.debug("RESTORANT RESPONSE (raw):", resResp.data);
        setRes(resResp.data);
        setComments(commentsResp.data || []);
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت اطلاعات از سرور");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAll();
  }, [id, API_BASE]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`${API_BASE}/likes/${id}/`, {});
      setRes((prev) => ({
        ...prev,
        like_count: (prev?.like_count || 0) + 1,
      }));
      setMessage(response.data.detail || "لایک شد");
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.detail || "خطا در لایک");
    }
  };

  const handleDislike = async () => {
    try {
      const response = await axios.delete(`${API_BASE}/likes/${id}/`);
      setRes((prev) => ({
        ...prev,
        like_count: Math.max((prev?.like_count || 1) - 1, 0),
      }));
      setMessage(response.data.detail || "دیسلایک شد");
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.detail || "خطا در دیسلایک");
    }
  };

  if (loading)
    return (
      <div className="res-wrapper-center">
        <div className="res-card res-card--loading">
          <div className="skeleton title" />
          <div className="skeleton subtitle" />
          <div className="skeleton row" />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="res-wrapper-center">
        <div className="res-card">
          <div className="res-error">{error}</div>
        </div>
      </div>
    );

  // foods may be array of Food objects (as your response shows)
  const foods = Array.isArray(res?.foods) ? res.foods : [];

  // helper to format min/max times (fall back to '-' if missing)
  const formatTimeRange = (min, max) => {
    const hasMin = typeof min === "number" && !Number.isNaN(min);
    const hasMax = typeof max === "number" && !Number.isNaN(max);
    if (hasMin && hasMax) {
      return `${min} - ${max} دقیقه`;
    }
    if (hasMin) return `حداقل ${min} دقیقه`;
    if (hasMax) return `حداکثر ${max} دقیقه`;
    return "-";
  };

  return (
    <div className="res-wrapper-center">
      <div className="res-card" role="region" aria-label={`جزییات رستوران ${res?.name || ""}`}>
        <header className="res-hero res-hero--centered">
          <div className="res-hero-left">
            <h1 className="res-title2">{res?.name || "—"}</h1>
            <p className="res-sub">{res?.description || ""}</p>

            {/* meta: phone / address / time-range / likes
                we reuse res-meta-box so existing styles حفظ بشه */
            }
            <div className="res-meta-row res-meta-center" style={{ marginTop: 14 }}>
              <span className="res-phone res-meta-box" aria-label="شماره تماس">
                📞 {res?.phone_number || "-"}
              </span>

              {/* address: use <address> for semantics, but keep visual classes */}
              <address
                className="res-address res-meta-box"
                aria-label="آدرس"
                title={res?.address || ""}
                style={{ fontStyle: "normal" }}
              >
                📍 {res?.address ? res.address : "-"}
              </address>

              {/* time range: min_post_time / max_post_time from model */}
              <span className="res-time res-meta-box" aria-label="زمان ارسال">
                ⏱️ {formatTimeRange(res?.min_post_time, res?.max_post_time)}
              </span>

              <span className="res-likes res-meta-box" aria-label="تعداد لایک">
                ❤️ {res?.like_count ?? 0}
              </span>
            </div>
          </div>
        </header>

        <section className="res-section">
          <h2 className="section-title">منوی رستوران</h2>

          <ul className="food-list">
            {foods && foods.length > 0 ? (
              foods.map((foodItem) => {
                // foodItem.avatar like "/media/foods/xxx.webp"
                const img = fullImageUrl(foodItem.avatar);
                return (
                  <li className="food-item" key={foodItem.id}>
                    <div className="food-left">
                      {img ? (
                        <img src={img} alt={foodItem.name} className="food-thumb" loading="lazy" />
                      ) : (
                        <div className="food-thumb placeholder" aria-hidden="true" />
                      )}
                    </div>

                    <div className="food-right">
                      <div className="food-head">
                        <h3 className="food-name" title={foodItem.name}>
                          {foodItem.name}
                        </h3>
                        {/* قیمت ممکنه موجود نباشد؛ فقط اگر داری نمایش بده */}
                        {foodItem.price && <span className="food-price">{foodItem.price} تومان</span>}
                      </div>
                      <p className="food-desc">{foodItem.description}</p>
                      <div className="food-actions">
                        <Link to={`/orderpost/${res.id}/${foodItem.id}`}>
                          <button className="btn btn-order">🛒 سفارش</button>
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="no-food">هنوز غذایی ثبت نشده.</p>
            )}
          </ul>
        </section>

        <section className="res-section">
          <div className="actions-and-comments">
            <div className="actions-row">
              <button className="btn btn-like" onClick={handleLike}>
                ❤️ لایک
              </button>
              <button className="btn btn-dislike" onClick={handleDislike}>
                💔 دیسلایک
              </button>
              <Link to={`/comment/${id}`}>
                <button className="btn btn-comment">✍️ ثبت نظر</button>
              </Link>
            </div>

            <div className="comments-block">
              <h3 className="section-title">نظرات ({comments.length})</h3>
              {comments.length > 0 ? (
                <ul className="comments-list">
                  {comments.map((c) => (
                    <li className="comment-item" key={c.id}>
                      <div className="avatar">{c.user?.full_name ? c.user.full_name[0] : "ک"}</div>
                      <div className="comment-body">
                        <div className="comment-head">
                          <strong className="comment-user">{c.user?.full_name || "کاربر"}</strong>
                          <time className="comment-time">{c.created_time}</time>
                        </div>
                        <p className="comment-text">{c.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-comments">هنوز نظری ثبت نشده.</p>
              )}
            </div>
          </div>
        </section>

        {message && <div className="res-flash">{message}</div>}
      </div>
    </div>
  );
};

export default Res;
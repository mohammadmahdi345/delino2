// FoodRes.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';


const FoodRes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restos, setRestos] = useState([]);
  const [message, setMessage] = useState("در حال بارگذاری رستوران‌ها...");
  const [loading, setLoading] = useState(true);
  const [foodName, setFoodName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8004/food/res/${id}/`);
        setRestos(res.data || []);

        // اگر از دیتای دریافتی بشه نام غذا رو فهمید
        if (res.data && res.data.length > 0) {
          const maybe = res.data[0].foods?.find(
            (f) => String(f.id) === String(id)
          );
          if (maybe) setFoodName(maybe.name || "");
        }

        setMessage("بارگذاری شد");
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.detail || "خطا در بارگذاری رستوران‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="fr-shell">
        <div className="fr-loader">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="fr-shell">
      <div className="fr-toolbar">
        <button className="fr-back" onClick={() => navigate(-1)} aria-label="بازگشت">
          ⟵ بازگشت
        </button>
        <div className="fr-title">
          <h2>رستوران‌هایی که این غذا را دارند</h2>
          {foodName && <div className="fr-sub">غذا: {foodName}</div>}
        </div>
      </div>

      <div className="fr-grid">
        {restos.length === 0 ? (
          <div className="fr-empty">{message || "رستورانی پیدا نشد."}</div>
        ) : (
          restos.map((r) => {
            let priceForThisFood = null;
            if (Array.isArray(r.foods)) {
              const match = r.foods.find(
                (f) => String(f.id) === String(id) || f.name === foodName
              );
              if (match) {
                priceForThisFood =
                  match.price ?? match.sale_price ?? match.menu_price ?? null;
              }
            }

            return (
              <article className="fr-card" key={r.id} tabIndex={0}>
                <div className="fr-card-body">
                  <h3 className="fr-name">{r.name}</h3>
                  <p className="fr-desc">{r.description}</p>

                  <div className="fr-meta">
                    <div className="fr-meta-left">
                      <div className="fr-phone">📞 {r.phone_number || "-"}</div>
                      <div className="fr-stars">⭐ {r.star ?? 0}</div>
                    </div>
                    <div className="fr-meta-right">
                      <div className="fr-likes">❤️ {r.like_count ?? (r.likes_count ?? 0)}</div>
                    </div>
                  </div>

                  {priceForThisFood !== null && (
                    <div className="fr-price">
                      قیمت تقریبی: <span>{priceForThisFood}</span> تومان
                    </div>
                  )}

                  <div className="fr-actions">
                    <Link to={`/res/${r.id}`} className="fr-btn">
                      جزئیات رستوران
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FoodRes;
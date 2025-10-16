import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Restorant = () => {
  const [restorants, setRestorants] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestorants = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get("http://localhost:8004/restorant/");
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

  if (loading)
    return <p className="res-loading">در حال بارگذاری رستوران‌ها...</p>;

  return (
    <section className="restorant-section" aria-label="فهرست رستوران‌ها">
      {error && <p className="res-error">{error}</p>}

      <div className="restorant-grid" role="list">
        {restorants.length > 0 ? (
          restorants.map((r) => (
            <article
              key={r.id}
              className="restorant-card"
              role="listitem"
            >
              <div className="res-inner">
                <div className="res-body">
                  <h2 className="res-title">{r.name}</h2>
                  <p className="res-desc">{r.description}</p>
                  <p className="res-phone">📞 {r.phone_number}</p>
                  <p className="res-likes">❤️ {r.like_count}</p>
                </div>
                <Link to={`/res/${r.id}`}>
                  <button
                    className="res-btn"
                    onClick={() => handleClick(r.name)}
                  >
                    دیدن جزئیات
                  </button>
                </Link>
              </div>
            </article>
          ))
        ) : (
          <p className="res-empty">هیچ رستورانی موجود نیست.</p>
        )}
      </div>

      {message && <p className="res-message">{message}</p>}
    </section>
  );
};

export default Restorant;
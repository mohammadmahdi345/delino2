import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
  }, []); // فقط بار اول اجرا می‌شود

  // وقتی کاربر روی دکمه کلیک می‌کند، پیغام را به‌روز می‌کنیم
  const handleClick = (rName) => {
    setMessage(`در حال باز کردن جزئیات: ${rName}`);
  };

  if (loading) return <p>در حال بارگذاری رستوران‌ها...</p>;

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {restorants.length > 0 ? (
        restorants.map((r) => (
          <div key={r.id} style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}>
            <h1>{r.name}</h1>
            <p>{r.description}</p>
            <h3>{r.phone_number}</h3>
            <h3>likes:{r.like_count}</h3>
            <h2>تعداد سفارشات {r.order_count}</h2>

            {/* Link مسیر را تغییر می‌دهد؛ دکمه هم یک پیام محلی می‌سازد */}
            <Link to={`/res/${r.id}`}>
              <button onClick={() => handleClick(r.name)}>دیدن جزئیات</button>
            </Link>
          </div>
        ))
      ) : (
        <p>هیچ رستورانی موجود نیست.</p>
      )}

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </>
  );
};

export default BestRestorant;

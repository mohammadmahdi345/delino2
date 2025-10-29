import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Search = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setMessage("لطفاً عبارتی وارد کنید");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const response = await axios.post(
        `http://localhost:8004/search/${encodeURIComponent(search)}/`
      );
      const data = response.data || [];
      // console.log("SEARCH RESULTS:", data);
      setResult(data);
      setMessage(data.length ? `✅ ${data.length} نتیجه یافت شد` : "❌ نتیجه‌ای پیدا نشد");
    } catch (error) {
      console.error("Search error:", error);
      setMessage("❌ خطا در برقراری ارتباط با سرور");
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form" role="search" aria-label="جستجو">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="اسم غذا یا رستوران را جست‌وجو کنید..."
          aria-label="عبارت جست‌وجو"
        />
        <button type="submit">🔍 جست‌وجو</button>
      </form>

      {loading && <p className="search-message">در حال جست‌وجو...</p>}
      {message && <p className="search-message">{message}</p>}

      <div className="search-results" aria-live="polite">
        {result.length > 0 &&
          result.map((r, idx) => {
            // نتیجه از serializer رستوران می‌آید، پس از id استفاده می‌کنیم
            const rid = r?.id ?? idx;
            return (
              <Link key={rid} to={`/res/${rid}`} className="search-result-card">
                <h2>{r.name}</h2>
                {r.description && <p>{r.description}</p>}
                {r.phone_number && <span className="res-phone">📞 {r.phone_number}</span>}
                <span className="res-likes">❤️ {r.like_count ?? 0}</span>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default Search;
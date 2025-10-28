// SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const SearchBar = ({ placeholder = "اسم غذا یا رستوران..." }) => {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const timerRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!q || q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      setErr("");
      return;
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await axios.post(`http://localhost:8004/search/${encodeURIComponent(q)}/`);
        const data = res.data || [];
        setResults(data);
        setErr("");
        setOpen(true);
      } catch (error) {
        console.error("SearchBar error:", error);
        setErr("خطا در دریافت نتایج");
        setResults([]);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timerRef.current);
  }, [q]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (results.length > 0) setOpen(true);
  };

  return (
    <div className="searchbar-root" ref={rootRef}>
      <form className="searchbar-form" onSubmit={handleSubmit} role="search" aria-label="جستجو">
        <input
          className="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label="جستجو"
          onFocus={() => q && results.length > 0 && setOpen(true)}
        />
        <button className="search-btn" type="submit" aria-label="جست‌وجو">
          {loading ? "…" : "🔍"}
        </button>
      </form>

      <div className={`search-dropdown ${open ? "open" : ""}`} role="listbox" aria-hidden={!open}>
        {err && <div className="search-empty">{err}</div>}

        {!err && results.length === 0 && q.trim().length >= 2 && !loading && (
          <div className="search-empty">نتیجه‌ای یافت نشد</div>
        )}

        {!err &&
          results.slice(0, 6).map((r, i) => {
            const link =
              r.type === "food"
                ? `/food/res/${r.id}` // 👈 مسیر غذاها (مطابق روت فعلیت)
                : `/res/${r.id}`; // 👈 مسیر رستوران‌ها

            return (
              <Link
                to={link}
                key={r.id ?? i}
                className="search-item"
                onClick={() => setOpen(false)}
              >
                <div className="search-item-left">
                  <img
                    src={r.avatar || r.image || r.avatar_url}
                    alt={r.name || "result"}
                    loading="lazy"
                    onError={(e) => (e.target.style.display = "none")}
                    style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
                  />
                </div>
                <div className="search-item-body">
                  <div className="search-item-title">{r.name}</div>
                  <div className="search-item-desc">{r.description ?? ""}</div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default SearchBar;

import { useState } from "react";
import axios from "axios";

const Search = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // اگر سرور GET می‌خواهد
      const response = await axios.post(`http://localhost:8004/search/${search}/`);
      setResult(response.data);
      setMessage(`✅ ${response.data.length} نتیجه یافت شد`);
    } catch (error) {
      console.error(error);
      setMessage("❌ نتوانستم نتایج را دریافت کنم");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="اسم غذا یا رستوران را سرچ کنید"
        />
        <button type="submit">جست‌وجو</button>
      </form>

      <p>{message}</p>

      {result.length > 0 &&
        result.map((r, i) => (
          <div key={i}>
            <h1>{r.name}</h1>
            <h2>{r.description}</h2>
          </div>
        ))}
    </div>
  );
};

export default Search;

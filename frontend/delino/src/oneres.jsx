import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";


const Res = () => {
  const { id } = useParams();
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [comments,setComment] = useState([])

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8004/restorant/${id}/`);
        setRes(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRes();
  }, [id]);


  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8004/comments/${id}/`);
        setComment(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchComments();
  }, [id]);

  // ✅ تابع لایک
  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8004/likes/${id}/`,
        {}
      );
      setMessage(response.data.detail || "Liked!");
    } catch (err) {
      setMessage(err.response?.data?.detail || "خطا در لایک");
    }
  };

  // ✅ تابع دیسلایک
  const handleDislike = async () => {
    try {
      const response = await axios.delete(`http://localhost:8004/likes/${id}/`);
      setMessage(response.data.detail || "Disliked!");
    } catch (err) {
      setMessage(err.response?.data?.detail || "خطا در دیسلایک");
    }
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>خطا در بارگذاری اطلاعات.</p>;

  return (
    <>
      {res ? (
        <div style={{ padding: "20px" }}>
          <h1>{res.name}</h1>
          <p>{res.description}</p>
          <h3>{res.phone_number}</h3>
          <h2>غذاها:</h2>
          <ul>
            {res.foods && res.foods.length > 0 ? (
              res.foods.map((food) => (
                <li key={food.id}>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  {food.avatar && (
                    <img
                      src={food.avatar}
                      alt={food.name}
                      width="100"
                      style={{ borderRadius: "8px" }}
                    />
                  )}
                  <Link to={`/orderpost/${res.id}/${food.id}`}>
                    <button>🛒 سفارش</button>
                  </Link>
                </li>
              ))
            ) : (
              <p>غذایی برای این رستوران ثبت نشده.</p>
            )}
          </ul>


          {/* دکمه‌های لایک و دیسلایک */}
          <div style={{ marginTop: "15px" }}>
            <button onClick={handleLike} style={{ marginRight: "10px" }}>
              ❤️ لایک
            </button>
            <button onClick={handleDislike}>💔 دیسلایک</button>
          </div>


          <ul>
            {comments.length > 0 ? (
              comments.map(c => (
                <li key={c.id}>
                  <h1>{c.user.fullname}</h1>
                  <h2>{c.created_time}</h2>
                  <h3>{c.description}</h3>
                </li>
              ))
            
          ): (
            <p>کامنتی یافت نشد</p>
          )}
          </ul>

          <Link to={`/comment/${id}`}>
          <button>ثبت کامنت</button>
          </Link>
          
          {/* پیام وضعیت */}
          {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
        </div>
      ) : (
        <p>اطلاعاتی یافت نشد.</p>
      )}
    </>
  );
};

export default Res;

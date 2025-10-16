import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const OrderPost = () => {
  const { resId, foodId } = useParams(); // از Route: /orderpost/:resId/:foodId
  const navigate = useNavigate();

  const [foodName, setFoodName] = useState(""); // اختیاری: اسم غذا برای نمایش
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  // اگر می‌خوای اسم غذا/رستوران رو نشون بدی، می‌تونی اینجا fetch کنی.
{/*useEffect(() => {
    const loadFood = async () => {
      try {
        // فرض: endpoint رستوران شامل لیست foods هست، یا endpoint جدا برای food وجود دارد
        const res = await axios.get(`http://localhost:8004/restorant/${resId}/`);
        const foods = res.data.foods || [];
        const matched = foods.find(f => String(f.id) === String(foodId));
        if (matched) {
          setFoodName(matched.name);
        } else {
          // اگر پیدا نشد، می‌خواهی اسم رو از یک endpoint food بگیری:
          try {
            const f = await axios.get(`http://localhost:8004/food/${foodId}/`);
            setFoodName(f.data.name || "");
          } catch {
            setFoodName("");
          }
        }
      } catch (err) {
        console.error("خطا در دریافت نام غذا:", err);
      }
    };
    loadFood();
  }, [resId, foodId]);*/}

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation ساده
    if (!foodId || !resId) {
      setMessage("خطا: شناسه غذا یا رستوران موجود نیست.");
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setMessage("لطفاً تعداد معتبر وارد کنید.");
      return;
    }

    try {
      // --- راه پیشنهادی: POST به /order/ و ارسال res و food در body ---
      const response = await axios.post(
        `http://localhost:8004/order/${resId}/`,
        {
          food: Number(foodId),
          quantity: Number(quantity),
        }
      );

      setMessage("سفارش با موفقیت ثبت شد ✅");
      // بعد از موفقیت می‌تونی کاربر رو به صفحه لیست سفارش‌ها بفرستی:
      navigate("/foods");
    } catch (error) {
      console.error(error.response?.data || error);
      const errMsg =
        error.response?.data?.detail ||
        (error.response?.data && JSON.stringify(error.response.data)) ||
        "خطا در ثبت سفارش";
      setMessage(errMsg);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>ثبت سفارش</h2>
      <p>رستوران: {resId}</p>
      <p>غذا: {foodName || `#${foodId}`}</p>

      <form onSubmit={handleSubmit}>
        <label>تعداد:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ marginLeft: 8, marginBottom: 12 }}
        />

        <div>
          <button type="submit">ثبت سفارش</button>
        </div>
      </form>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
};

export default OrderPost;

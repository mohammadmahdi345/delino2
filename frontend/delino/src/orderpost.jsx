import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const OrderPost = () => {
  const { resId, foodId } = useParams(); 
  const navigate = useNavigate();

  const [foodName, setFoodName] = useState(""); 
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foodId || !resId) {
      setMessage("خطا: شناسه غذا یا رستوران موجود نیست.");
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setMessage("لطفاً تعداد معتبر وارد کنید.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8004/order/${resId}/`,
        {
          food: Number(foodId),
          quantity: Number(quantity),
        }
      );

      setMessage("سفارش با موفقیت ثبت شد ✅");
      navigate("/orders");
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
    <div className="orderpost-container">
      <h2 className="orderpost-title">ثبت سفارش</h2>
      <p className="orderpost-info">رستوران: {resId}</p>
      <p className="orderpost-info">غذا: {foodName || `#${foodId}`}</p>

      <form onSubmit={handleSubmit} className="orderpost-form">
        <label className="orderpost-label">تعداد:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="orderpost-input"
        />

        <div>
          <button type="submit" className="orderpost-button">
            ثبت سفارش
          </button>
        </div>
      </form>

      {message && <p className="orderpost-message">{message}</p>}
    </div>
  );
};

export default OrderPost;
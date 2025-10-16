import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Order = () => {
  const [order, setOrder] = useState({ orders: [], other_orders: [] }); // مقدار اولیه مناسب
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get("http://localhost:8004/orders/");
        setOrder(response.data);
        setMessage("با موفقیت بارگذاری شد");
      } catch (error) {
        // نمایش پیغام خطا به شکل خواناتر
        const msg =
          error.response?.data?.detail ||
          error.message ||
          "خطا در دریافت اطلاعات";
        setMessage(msg);
      }
    };
    fetchOrder();
  }, []);

  return (
    <>
      <h2>وضعیت رزرو‌ها:</h2>
      <p>{message}</p>

      <h3>رزروهای در انتظار (PENDING):</h3>
      {order.orders && order.orders.length > 0 ? (
        order.orders.map((o) => (
          <div key={o.id}>
            <p>وضعیت: {o.status}</p>
            <p>غذا: {o.food?.name || o.food}</p>
            <p>تعداد: {o.quantity}</p>
            <p>رستوران: {o.res.name}</p>
            <p>آخرین بروزرسانی: {o.last_update}</p>
            <p>قیمت کل: {o.total_price}</p>
            <Link to={`/payment/${o.id}`}>
            <button>پرداخت</button>
            </Link>
          </div>
        ))
      ) : (
        <p>رزروی در انتظار وجود ندارد.</p>
      )}

      <h3>سایر رزروها:</h3>
      {order.other_orders && order.other_orders.length > 0 ? (
        order.other_orders.map((o) => (
          <div key={o.id}>
            <p>وضعیت: {o.status}</p>
            <p>غذا: {o.food?.name || o.food}</p>
            <p>تعداد: {o.quantity}</p>
            <p>رستوران: {o.res.name}</p>
            <p>آخرین بروزرسانی: {o.last_update}</p>
            <p>قیمت کل: {o.total_price}</p>
          </div>
        ))
      ) : (
        <p>سایر رزروی وجود ندارد.</p>
      )}
    </>
  );
};

export default Order;

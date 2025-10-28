import React, { useEffect, useState } from "react";
import axios from "axios";


const Order = () => {
  const [order, setOrder] = useState({ orders: [], other_orders: [] });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get("http://localhost:8004/orders/");
        setOrder({
          orders: response.data.orders,
          other_orders: response.data.other_orders,
        });
        setMessage("با موفقیت بارگذاری شد");
      } catch (error) {
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
    <div className="order-panel">
      <header className="order-header">
        <h2>رزروهای من</h2>
        <p className="status-message">{message}</p>
      </header>

      {/* ================= PENDING ORDERS ================= */}
      <section className="orders-section">
        <h3>رزروهای در انتظار تایید</h3>
        <div className="orders-grid">
          {order.orders.length > 0 ? (
            order.orders.map((o) => (
              <article
                className="order-card pending-card"
                key={`pending-${o.id}`}
                tabIndex={0}
              >
                <div
                  className="order-card-visual visual-pending"
                  aria-hidden="true"
                ></div>
                <div className="order-card-body pending-body">
                  <h4 className="order-title">{o.food?.name || o.food}</h4>

                  <p className="order-line">
                    <span className="order-key">رستوران:</span>
                    <span className="order-value">{o.res?.name}</span>
                  </p>
                  <p className="order-line">
                    <span className="order-key">تعداد:</span>
                    <span className="order-value">{o.quantity}</span>
                  </p>
                  <p className="order-line">
                    <span className="order-key">آخرین بروزرسانی:</span>
                    <span className="order-value">{o.last_update}</span>
                  </p>
                  <p className="order-line">
                    <span className="order-key">قیمت کل:</span>
                    <span className="order-value amount-pill">
                      {o.total_price} تومان
                    </span>
                  </p>

                  <div className="order-meta">
                    <span
                      className={`status-badge status-${o.status?.toLowerCase()}`}
                    >
                      {o.status}
                    </span>
                    <a
                      href={`/payment/${o.id}`}
                      className="pay-link"
                      aria-label={`پرداخت برای ${o.food?.name || o.food}`}
                    >
                      <button className="pay-btn">پرداخت</button>
                    </a>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="empty">رزروی در انتظار وجود ندارد.</p>
          )}
        </div>
      </section>

      {/* ================= OTHER ORDERS ================= */}
      <section className="orders-section">
        <h3>سایر رزروها</h3>
        <div className="other-orders-grid">
          {order.other_orders.length > 0 ? (
            order.other_orders.map((o) => (
              <article
                className="order-card other-card"
                key={`other-${o.id}`}
                tabIndex={0}
              >
                <div
                  className="order-card-visual visual-other"
                  aria-hidden="true"
                ></div>
                <div className="order-card-body other-body">
                  <h4 className="other-title">{o.food?.name || o.food}</h4>

                  <div className="info-line">
                    <span className="info-label">رستوران:</span>
                    <span className="info-value">{o.res?.name}</span>
                  </div>

                  <div className="info-line">
                    <span className="info-label">تعداد:</span>
                    <span className="info-value">{o.quantity}</span>
                  </div>

                  <div className="info-line">
                    <span className="info-label">آخرین بروزرسانی:</span>
                    <span className="info-value">{o.last_update}</span>
                  </div>

                  <div className="info-line">
                    <span className="info-label">قیمت کل:</span>
                    <span className="info-value highlight">
                      {o.total_price} تومان
                    </span>
                  </div>

                  <div className="order-meta">
                    <span
                      className={`status-badge status-${o.status?.toLowerCase()}`}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="empty">سایر رزروی وجود ندارد.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Order;
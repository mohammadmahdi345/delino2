import React, { useEffect, useState } from "react";
import axios from "axios";
import { Component } from "react";
import { Route, Routes } from "react-router-dom";
import { Link, useParams,useNavigate } from "react-router-dom";

const User = () => {
  const [user, setUser] = useState({ full_name: "", email: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handelChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handelClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("http://localhost:8004/user/", user);
      setUser(response.data);
      setMessage("موفقیت‌آمیز ✅");
      navigate('/')
      // اگر می‌خوای بلافاصله هدایت کن:
      // navigate('/profile'); // uncomment if you want to auto-navigate
    } catch (error) {
      setMessage(error.response?.data?.detail || "خطایی رخ داد ❌");
    }
  };

  const handleReset = () => {
    setUser({ full_name: "", email: "" });
    setMessage("");
  };

  return (
    <div className="user-panel">
      <div className="user-card" tabIndex={0} aria-labelledby="user-title">
        <div className="user-card-decor" aria-hidden="true" />
        <header className="user-head">
          <div className="user-avatar" aria-hidden="true">
            {user.full_name ? user.full_name.split(" ").map(n => n[0]).slice(0,2).join("") : "U"}
          </div>
          <div>
            <h1 id="user-title" className="user-title">بروزرسانی اطلاعات</h1>
            <p className="user-sub">اطلاعات تماس خود را به‌روز کنید</p>
          </div>
        </header>

        <form className="user-form" onSubmit={handelClick} noValidate>
          <label className="field" htmlFor="full_name">
            <span className="field-label">نام و نام خانوادگی</span>
            <input
              id="full_name"
              name="full_name"
              className="input-field"
              value={user.full_name}
              placeholder="مثال: علی رضایی"
              onChange={handelChange}
              aria-label="نام و نام خانوادگی"
              autoComplete="name"
            />
          </label>

          <label className="field" htmlFor="email">
            <span className="field-label">ایمیل</span>
            <input
              id="email"
              name="email"
              className="input-field"
              value={user.email}
              placeholder="مثال: you@mail.com"
              onChange={handelChange}
              aria-label="ایمیل"
              autoComplete="email"
              type="email"
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="submit-btn">ثبت تغییرات</button>
            <button type="button" className="reset-btn" onClick={handleReset}>بازنشانی</button>
            {/* نمونهٔ استفاده از navigate */}
          </div>

          {message && <div className="form-message" role="status">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default User;
import React, { useState } from "react";
import axios from "axios";
import * as yup from "yup";
import { Link } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({ phone_number: "", password: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const schema = yup.object({
    phone_number: yup
      .string()
      .matches(/^(?:09\d{9}|989\d{9})$/, "شماره معتبر نیست")
      .required("شماره تلفن الزامی است"),
    password: yup.string().required("رمز عبور الزامی است"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await schema.validate(user);

      setSending(true);
      const response = await axios.post("http://localhost:8004/login/", user);
      const token = response.data?.access_token || response.data?.access;

      if (token) {
        localStorage.setItem("token", token);
        window.location.href = "/";
      } else {
        setError("ورود با موفقیت انجام نشد");
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        setError(err.message);
      } else {
        setError("خطایی در ارتباط با سرور رخ داد");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="register-form"
      aria-label="فرم ورود"
    >
      <div className="register-card">
        <h2 className="register-title">ورود</h2>

        <div className="register-fields">
          <input
            className="register-input"
            type="text"
            name="phone_number"
            value={user.phone_number}
            onChange={handleChange}
            placeholder="شماره تلفن"
            aria-label="شماره تلفن"
          />

          <input
            className="register-input"
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="رمز عبور"
            aria-label="رمز عبور"
          />
        </div>

        {error && <p className="register-error" role="alert">{error}</p>}

        <div className="register-actions">
          <button
            className="register-btn"
            type="submit"
            disabled={sending}
            aria-busy={sending}
          >
            {sending ? "در حال ارسال..." : "ورود"}
          </button>
        </div>

        <p className="login-register">اکانت نداری؟ <Link to="/register">ثبت‌نام کن</Link></p>

      </div>
    </form>
  );
};

export default Login;

import React, { useState } from "react";
import axios from "axios";
import * as yup from "yup";

const Login = () => {
  const [user, setUser] = useState({ phone_number: "", password: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ ولیدیشن ساده
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
      // فقط اعتبارسنجی ساده
      await schema.validate(user);

      setSending(true);
      const response = await axios.post("http://localhost:8004/login/", user);

      const token = response.data?.access_token || response.data?.access;
      if (token) {
        localStorage.setItem("token", token);
        window.location.href = "/restorans";
      } else {
        setError("ورود با موفقیت انجام نشد");
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        setError(err.message); // خطای yup
      } else if (err.response?.status === 401) {
        setError("شماره یا رمز عبور اشتباه است");
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
      style={{
        maxWidth: "400px",
        margin: "2rem auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <input
        type="text"
        name="phone_number"
        value={user.phone_number}
        onChange={handleChange}
        placeholder="شماره تلفن"
      />

      <input
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder="رمز عبور"
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={sending}>
        {sending ? "در حال ورود..." : "ورود"}
      </button>
    </form>
  );
};

export default Login;

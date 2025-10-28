import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate  } from "react-router-dom";
import SearchBar from "./searchbar";


const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e?.preventDefault?.();

    try {
      // پاک کردن توکن (اگر نام دیگری داره تغییر بده)
      localStorage.removeItem("token");
    } catch (err) {
      console.warn("localStorage remove failed", err);
    }

    // حذف هدر Authorization از axios
    delete axios.defaults.headers.common["Authorization"];

    // هدایت به صفحه لاگین (replace تا تاریخچه برنگرده)
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main nav">
      <div className="nav-inner">
        <div className="nav-left">
          <Link to="/" className="navbar-brand">Delino</Link>
        </div>

        <div className="nav-center">
          <SearchBar />
        </div>

        <div className="nav-right">
          {!user ? (
            <>
              <button className="btn nav-btn login-btn" onClick={() => navigate("/login")}>ورود</button>
              <button className="btn nav-btn register-btn" onClick={() => navigate("/register")}>ثبت‌نام</button>
            </>
          ) : (
            <>
              <button className="btn nav-btn orders-btn" onClick={() => navigate("/orders")}>رزرو ها</button>
              <button className="btn nav-btn logout-btn" onClick={handleLogout}>بیرون رفتن</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

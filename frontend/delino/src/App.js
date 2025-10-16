import { Component } from "react";
import { Route, Routes } from "react-router-dom";
import Restorant from "./restorant";
import Food from "./foods";
import Search from "./search";
import Res from "./oneres";
import Register from "./register";
import axios from 'axios';
import Login from "./login";
import BestRestorant from "./best-res";
import Order from "./order";
import OrderPost from "./orderpost";
import User from "./user";
import Comment from "./comment";
import Payment from "./payment";
import Home from "./home";
import "./delino.css"



class App extends Component {
  state = {
    user: null,
    loading: true, // تا زمانی که اطلاعات کاربر در حال دریافت است
  };

  componentDidMount() {
    const token = localStorage.getItem("token");

    if (token) {
      // تنظیم هدر پیش‌فرض axios برای همهٔ درخواست‌ها
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // فراخوانی اطلاعات کاربر
      this.fetchUser();
    } else {
      // اگر توکن وجود نداشته باشد
      delete axios.defaults.headers.common["Authorization"];
      this.setState({ user: null, loading: false });
    }
  }

  // متد fetchUser به صورت arrow تا this درست بدرستی ارجاع دهی شود
  fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8004/users/me");
      // ذخیرهٔ اطلاعات کاربر در state
      this.setState({ user: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching user:", error);
      // در صورت خطا توکن را پاک کن و هدر را حذف کن
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      this.setState({ user: null, loading: false });
    }
  };

  render() {
    const { loading, user } = this.state;

    // می‌توانید نشانگر لودینگ نشان دهید در صورت نیاز
    if (loading) {
      return <div>در حال بارگذاری...</div>;
    }

    return (
      <>
        {/* اگر خواستی می‌توانی user را به Routeها یا context پاس دهی */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restorans" element={<Restorant />} />
          <Route path="/res/:id" element={<Res />} />
          <Route path="/foods" element={<Food />} />
          <Route path="/search" element={<Search />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/best-res" element={<BestRestorant />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/comment/:id" element={<Comment />} />
          <Route path="/user" element={<User />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/orderpost/:resId/:foodId" element={<OrderPost />} />
        </Routes>
      </>
    );
  }v
}

export default App;

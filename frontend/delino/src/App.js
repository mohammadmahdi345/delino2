import { Component,useState,useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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
import Navbar from "./navbar";
import SearchBar from "./searchbar";
import FoodRes from "./foodres";



const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8004/users/me");
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setLoading(false);
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;

  const hideNavbarRoutes = ["/login", "/register"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restorans" element={<Restorant />} />
        <Route path="/res/:id" element={<Res />} />
        <Route path="/foods" element={<Food />} />
        <Route path="/search" element={<Search />} />
        <Route path="/searchbar" element={<SearchBar />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/best-res" element={<BestRestorant />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/comment/:id" element={<Comment />} />
        <Route path="/user" element={<User />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/orderpost/:resId/:foodId" element={<OrderPost />} />
        <Route path="/food/res/:id" element={<FoodRes />} />
      </Routes>
    </>
  );
};

export default App;
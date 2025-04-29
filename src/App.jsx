import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Jewelry from "./Jewelry";
import Contact from "./Contact";
import About from "./About";
import Location from "./Location";
import Login from "./Login";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import NoPage from "./NoPage";
import JewelryDetail from "./JewelryDetail";
import ResetPassword from "./ResetPassword";
import Wishlist from "./Wishlist";
import Cart from "./Cart";
import MyAccount from "./MyAccount";
import AccountSettings from "./AccountSettings";
import Checkout from "./Checkout";
import Order from "./Order";
import "@fontsource/montserrat";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="jewelry" element={<Jewelry />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="location" element={<Location />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="jewelry/:id" element={<JewelryDetail />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="account" element={<MyAccount />} />
          <Route path="account/settings" element={<AccountSettings />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Order />} />
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
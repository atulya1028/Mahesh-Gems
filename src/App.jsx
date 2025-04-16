import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Jewelry from './Jewelry';
import Contact from './Contact';
import About from './About';
import Location from './Location';
import Login from './Login';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import NoPage from './NoPage';

import JewelryDetail from './JewelryDetail'; 
import '@fontsource/montserrat'; 


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
          <Route path="signup" element={<SignUp/>} />
          <Route path="jewelry/:id" element={<JewelryDetail />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

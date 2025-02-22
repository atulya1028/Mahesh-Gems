import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Jewelry from './Jewelry';
import Contact from './Contact';
import About from './About';
import Location from './Location';
import Login from './Login';
import NoPage from './NoPage';

import ProductDetail from './ProductDetail'; 
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
          <Route path="signin" element={<Login />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="jewelry/:id" element={<JewelryDetail />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

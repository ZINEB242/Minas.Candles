import { useState } from 'react'
import Navbar from "./components/layout/Navbar";
import Hero from "./components/common/Hero";
import Categories from "./components/products/Categories";
import ProductSection from "./components/products/ProductSection";
import CustomOrderBanner from "./components/forms/CustomOrderBanner";
import Order from "./pages/Order/Order";
function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <ProductSection />
       <CustomOrderBanner />
        <Order />
    </>
  );
}

export default App;
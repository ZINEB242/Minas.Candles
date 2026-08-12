// import { useState } from 'react'
// import Navbar from "./components/layout/Navbar";
// import LeftSidebar from "./components/layout/LeftSidebar";
// import RightSidebar from "./components/layout/RightSidebar";
// import Home from "./pages/Home/Home";
// import Categories from "./components/products/Categories";
// import ProductSection from "./components/products/ProductSection";
// import CustomOrderBanner from "./components/forms/CustomOrderBanner";
// import Order from "./pages/Order/Order";
// function App() {
//   return (
//     <>
//       <Navbar />
      
//       {/* <Hero /> */}
//         <Home />
//       <Categories />
//       <ProductSection />
//        <CustomOrderBanner />
//         <Order />
//     </>
//   );
// }

// export default App;


import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Order from "./pages/Order/Order";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />
     <Route path="/order" element={<Order />} />
      </Routes>

    </>
  );
}

export default App;
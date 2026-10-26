
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Order from "./pages/Order/Order";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Notifications from "./pages/Notifications/Notifications";
import MyPosts from "./pages/MyPosts/MyPosts";
import AdminPosts from "./pages/AdminPosts/AdminPosts";
import Messages from "./pages/Messages/Messages";
import Category from "./pages/Category/Category";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import DiscoverMinas from "./pages/DiscoverMinas/DiscoverMinas";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:categoryId" element={<Category />} />
<Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/discover-minas" element={<DiscoverMinas />} />

        {/* Pages réservées aux utilisateurs connectés */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/order" element={<Order />} />
          <Route path="/admin/orders" element={<AdminDashboard />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
<Route path="/my-posts" element={<MyPosts />} />


        </Route>
      </Routes>
    </>
  );
}

export default App;

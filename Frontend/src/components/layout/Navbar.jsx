// import { Link } from "react-router-dom";
// import { FaShoppingBag, FaSearch, FaUserCircle } from "react-icons/fa";
// import minasLogo from "../../assets/logo/minas.png";
// import "./Navbar.css";
// const Navbar = () => {
//   return (
//     <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
//       <div className="container">

//         <Link to="/" className="minas-logo">
//   <img
//     src={minasLogo}
//     alt="Minas Candles"
//   />
// </Link>

//         {/* Bouton mobile */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Menu */}
//         <div className="collapse navbar-collapse" id="navbarNav">

//           <ul className="navbar-nav mx-auto">

//             <li className="nav-item">
//               <Link className="nav-link" to="/">
//                 Accueil
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/shop">
//                 Boutique
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/order">
//                 Commander
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/community">
//                 Communauté
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/exhibitions">
//                 Expositions
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/contact">
//                 Contact
//               </Link>
//             </li>

//           </ul>

//           {/* Icônes */}
//           <div className="d-flex align-items-center gap-3">

//             <FaSearch size={18} style={{ cursor: "pointer" }} />

//             <FaShoppingBag size={18} style={{ cursor: "pointer" }} />

//             <FaUserCircle size={22} style={{ cursor: "pointer" }} />

//           </div>

//         </div>

//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import { Link } from "react-router-dom";

import {
  FaSearch,
  FaCommentDots,
  FaBell,
  FaChevronDown,
} from "react-icons/fa";

import minasLogo from "../../assets/logo/minas.png";

import "./Navbar.css";


const Navbar = () => {
  return (
    <nav className="minas-navbar">

      {/* ================= LOGO ================= */}

      <Link to="/" className="minas-logo">
        <img
          src={minasLogo}
          alt="Minas Candles"
        />
      </Link>


      {/* ================= RECHERCHE ================= */}

      <div className="navbar-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Rechercher une bougie, une collection..."
        />

      </div>


      {/* ================= MENU ================= */}

      <div className="navbar-menu">

        <Link
          to="/"
          className="navbar-link active"
        >
          Accueil
        </Link>


        <Link
          to="/exhibitions"
          className="navbar-link"
        >
          Expositions
        </Link>


        <Link
          to="/shop"
          className="navbar-link"
        >
          Boutique
        </Link>


        <Link
          to="/order"
          className="navbar-link"
        >
          Commandes
        </Link>


        <Link
          to="/messages"
          className="navbar-link icon-link"
        >
          Messages
          <FaCommentDots />
        </Link>


        <Link
          to="/notifications"
          className="navbar-link icon-link notification"
        >

          Notifications

          <FaBell />

          <span className="notification-badge">
            3
          </span>

        </Link>

      </div>


      {/* ================= PROFIL ================= */}

      <div className="navbar-profile">

        <div className="profile-avatar">
          Z
        </div>


        <div className="profile-info">

          <span>
            Minas Candles
          </span>

          <small>
            Admin
          </small>

        </div>


        <FaChevronDown className="profile-arrow" />

      </div>

    </nav>
  );
};


export default Navbar;
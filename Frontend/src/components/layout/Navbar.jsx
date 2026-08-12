import { Link } from "react-router-dom";
import { FaShoppingBag, FaSearch, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          Mina's Candles
        </Link>

        {/* Bouton mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav mx-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Accueil
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/shop">
                Boutique
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/order">
                Commander
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/community">
                Communauté
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/exhibitions">
                Expositions
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>

          </ul>

          {/* Icônes */}
          <div className="d-flex align-items-center gap-3">

            <FaSearch size={18} style={{ cursor: "pointer" }} />

            <FaShoppingBag size={18} style={{ cursor: "pointer" }} />

            <FaUserCircle size={22} style={{ cursor: "pointer" }} />

          </div>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;

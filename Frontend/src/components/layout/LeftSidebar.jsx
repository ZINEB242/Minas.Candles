import {
  FaEllipsisV,
  FaUser,
  FaBoxOpen,
  FaHeart,
  FaThLarge,
  FaFire,
  FaGift,
  FaCalendarAlt,
} from "react-icons/fa";

import "./LeftSidebar.css";

const LeftSidebar = () => {
  return (
    <aside className="left-sidebar">

      {/* ================= PROFIL ================= */}

      <div className="sidebar-card profile-card">

        <div className="card-title">
          <span>Mon Profil</span>
          <FaEllipsisV />
        </div>

        <div className="profile-picture">
          <FaUser />
        </div>

        <h3>Minas Candles</h3>

        <p>Artisanat de bougies</p>

        <button className="profile-button">
          Voir mon profil
        </button>

      </div>


      {/* ================= COMMANDES ================= */}

      <div className="sidebar-card orders-card">

        <div className="sidebar-section-title">
          <FaBoxOpen />
          <span>Mes commandes</span>
        </div>

        <div className="order-row">
          <span>En cours</span>
          <span className="order-number">2</span>
        </div>

        <div className="order-row">
          <span>Livrées</span>
          <span className="order-number">12</span>
        </div>

        <div className="order-row">
          <span>Annulées</span>
          <span className="order-number cancelled">0</span>
        </div>

        <div className="favorites-link">
          <FaHeart />
          <span>Mes favoris</span>
        </div>

      </div>


      {/* ================= CATEGORIES ================= */}

      <div className="sidebar-card categories-card">

        <h4>Catégories</h4>

        <div className="category-item">
          <FaThLarge />
          <span>Toutes les bougies</span>
        </div>

        <div className="category-item">
          <FaFire />
          <span>Parfumées</span>
        </div>

        <div className="category-item">
          <FaGift />
          <span>Décoratives</span>
        </div>

        <div className="category-item">
          <FaHeart />
          <span>Personnalisées</span>
        </div>

        <div className="category-item">
          <FaGift />
          <span>Coffrets cadeaux</span>
        </div>

      </div>


      {/* ================= CALENDRIER ================= */}

      <div className="sidebar-card calendar-card">

        <h4>Calendrier</h4>

        <div className="event-card">

          <div className="event-date">
            <strong>15</strong>
            <span>AOÛT</span>
          </div>

          <div className="event-info">
            <h5>Salon de l'Artisanat</h5>

            <p>
              Palais des Expositions
            </p>
          </div>

          <button>
            Je participe
          </button>

        </div>

      </div>

    </aside>
  );
};

export default LeftSidebar;
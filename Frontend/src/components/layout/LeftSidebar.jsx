import { useEffect, useState } from "react";
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

import { Link } from "react-router-dom";
import "./LeftSidebar.css";

const LeftSidebar = () => {
    const storedUser = localStorage.getItem("minasUser");

  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const isAdmin = currentUser?.role === "admin";
  const [orderStats, setOrderStats] = useState({
    enCours: 0,
    livrees: 0,
    annulees: 0,
  });

  useEffect(() => {
    const fetchOrderStats = async () => {
      const token = localStorage.getItem("minasToken");

      if (!token) return;

      try {
        const response = await fetch("http://localhost:3000/api/orders/admin-stats", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setOrderStats(data.stats);
        }
      } catch (error) {
        console.error(
          "Erreur de récupération des statistiques :",
          error
        );
      }
    };

   fetchOrderStats();

const intervalId = setInterval(fetchOrderStats, 5000);

return () => clearInterval(intervalId);
}, []);

  return (
    <aside className="left-sidebar">

      {/* ================= PROFIL ================= */}

           {/* ================= PRESENTATION / PROFIL ================= */}

      {isAdmin ? (
        <div className="sidebar-card profile-card">
          <div className="card-title">
            <span>Mon Profil</span>
            <FaEllipsisV />
          </div>

          <div className="profile-picture">
            <FaUser />
          </div>

          <h3>Minas Candles</h3>
          <p>Administration de la boutique</p>

          <Link to="/profile" className="profile-button">
            Voir mon profil
          </Link>
        </div>
      ) : (
        <div className="sidebar-card discover-card">
          <div className="profile-picture">
            <FaGift />
          </div>

          <h3>Découvrir Minas Candles</h3>

          <p>
            Des créations artisanales pensées pour offrir,
            décorer et créer de beaux souvenirs.
          </p>

          <Link to="/discover-minas" className="profile-button">
  Découvrir Minas Candles
</Link>
        </div>
      )}


      {/* ================= COMMANDES ================= */}

      <div className="sidebar-card orders-card">

        <div className="sidebar-section-title">
          <FaBoxOpen />
          <span>Mes commandes</span>
        </div>

        <div className="order-row">
  <span>En cours</span>
  <span className="order-number">{orderStats.enCours}</span>
</div>

<div className="order-row">
  <span>Livrées</span>
  <span className="order-number">{orderStats.livrees}</span>
</div>

<div className="order-row">
  <span>Annulées</span>
  <span className="order-number cancelled">{orderStats.annulees}</span>
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
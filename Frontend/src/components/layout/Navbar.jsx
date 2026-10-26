
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaCommentDots,
  FaBell,
  FaChevronDown,
} from "react-icons/fa";
import { useEffect, useState } from "react";

import minasLogo from "../../assets/logo/minas.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
const [messageCount, setMessageCount] = useState(0);
  const savedUser = localStorage.getItem("minasUser");
  let user = null;

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    user = null;
  }

  const isAdmin = user?.role === "admin";


useEffect(() => {
  if (!user) {
    setNotificationCount(0);
    return;
  }

  let isMounted = true;

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("minasToken");

      if (!token) {
        if (isMounted) setNotificationCount(0);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (isAdmin) {
        const [pendingResponse, notificationsResponse] =
          await Promise.all([
            fetch("http://localhost:3000/api/admin/posts/pending-count", {
              headers,
            }),
            fetch("http://localhost:3000/api/notifications/unread-count", {
              headers,
            }),
          ]);

        if (!pendingResponse.ok || !notificationsResponse.ok) {
          throw new Error("Impossible de récupérer les compteurs.");
        }

        const pendingData = await pendingResponse.json();
        const notificationsData = await notificationsResponse.json();

        if (isMounted) {
          setNotificationCount(
            (pendingData.count || 0) +
            (notificationsData.count || 0)
          );
        }
      } else {
        const response = await fetch(
          "http://localhost:3000/api/notifications/unread-count",
          { headers }
        );

        if (!response.ok) {
          throw new Error("Impossible de récupérer les notifications.");
        }

        const data = await response.json();

        if (isMounted) {
          setNotificationCount(data.count || 0);
        }
      }
    } catch (error) {
      console.error("Erreur du compteur de notifications :", error);
    }
  };

  fetchNotificationCount();

  const interval = setInterval(fetchNotificationCount, 5000);

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, [isAdmin, user?._id, user?.id]);


useEffect(() => {
  const fetchMessageCount = async () => {
    const token = localStorage.getItem("minasToken");

    if (!token) {
      setMessageCount(0);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/messages/unread-count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessageCount(data.count || 0);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement du compteur des messages :",
        error
      );
    }
  };

  fetchMessageCount();

  const interval = setInterval(fetchMessageCount, 5000);

  return () => clearInterval(interval);
}, []);

  const getLinkClass = ({ isActive }) =>
    `navbar-link${isActive ? " active" : ""}`;

  const handleLogout = () => {
    localStorage.removeItem("minasToken");
    localStorage.removeItem("minasUser");
    setNotificationCount(0);
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <nav className="minas-navbar">
      <Link to="/" className="minas-logo">
        <img src={minasLogo} alt="Minas Candles" />
      </Link>

      <div className="navbar-search">
        <FaSearch />
        <input
          type="text"
          placeholder="Rechercher une bougie, une collection..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchTerm.trim()) {
              navigate(
                `/shop?search=${encodeURIComponent(searchTerm.trim())}`
              );
            }
          }}
        />
      </div>

      <div className="navbar-menu">
        <NavLink to="/" end className={getLinkClass}>
          Accueil
        </NavLink>

        <NavLink to="/exhibitions" className={getLinkClass}>
          Expositions
        </NavLink>

        <NavLink to="/shop" className={getLinkClass}>
          Boutique
        </NavLink>

        <NavLink to="/order" className={getLinkClass}>
          Commandes
        </NavLink>

        <NavLink to="/messages" className={getLinkClass}>
  Messages <FaCommentDots />
  {messageCount > 0 && (
    <span className="notification-badge">
      {messageCount > 99 ? "99+" : messageCount}
    </span>
  )}
</NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `navbar-link icon-link notification${
              isActive ? " active" : ""
            }`
          }
        >
          Notifications
          <FaBell />

          {notificationCount > 0 && (
            <span className="notification-badge">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </NavLink>
      </div>

      <div className="navbar-profile-wrapper">
        <button
          type="button"
          className="navbar-profile"
          onClick={() => setProfileOpen(!profileOpen)}
          aria-expanded={profileOpen}
          aria-label="Ouvrir le menu du profil"
        >
          <div className="profile-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>

          <div className="profile-info">
            <span>{user?.name || "Mon compte"}</span>
            <small>
              {user
                ? isAdmin
                  ? "Administrateur"
                  : "Client"
                : "Visiteur"}
            </small>
          </div>

          <FaChevronDown
            className={`profile-arrow ${
              profileOpen ? "rotated" : ""
            }`}
          />
        </button>

        {profileOpen && (
          <div className="profile-dropdown">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile");
                  }}
                >
                  Mon profil
                </button>

                {isAdmin ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/admin/settings");
                      }}
                    >
                      Paramètres
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/admin/orders");
                      }}
                    >
                      Gestion des commandes
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/admin/posts");
                      }}
                    >
                      Gestion des publications
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/my-posts");
                      }}
                    >
                      Mes publications
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/liked-posts");
                      }}
                    >
                      Publications aimées
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/order");
                      }}
                    >
                      Mes commandes
                    </button>
                  </>
                )}

                <button type="button" onClick={handleLogout}>
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/login");
                  }}
                >
                  Se connecter
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/register");
                  }}
                >
                  Créer un compte
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

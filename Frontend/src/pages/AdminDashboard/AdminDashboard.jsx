
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  FaBox,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaSyncAlt,
} from "react-icons/fa";

import "./AdminDashboard.css";

const API_URL = "http://localhost:3000";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);
  const token = localStorage.getItem("minasToken");
  const savedUser = localStorage.getItem("minasUser");

  let user = null;

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    if (!token || !user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Impossible de charger les commandes.");
        }

        setOrders(data.orders || []);
        setError("");
      } catch (err) {
        setError(err.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, user?.id]);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

const refreshOrders = async () => {
  setRefreshing(true);
  setError("");

  try {
    const response = await fetch(`${API_URL}/api/admin/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible d'actualiser les commandes."
      );
    }

    setOrders(data.orders || []);
  } catch (err) {
    setError(err.message || "Une erreur est survenue.");
  } finally {
    setRefreshing(false);
  }
};

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de modifier le statut.");
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setUpdatingId("");
    }
  };

  const pendingCount = orders.filter(
    (order) => order.status === "En attente"
  ).length;

  const preparingCount = orders.filter(
    (order) => order.status === "En préparation"
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "Livrée"
  ).length;

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">MINAS CANDLES · ADMINISTRATION</p>
          <h1>Tableau de bord</h1>
          <p>Bienvenue, {user.name}. Gérez votre boutique en un seul endroit.</p>
        </div>

        <div className="admin-header-icon">
          <FaClipboardList />
        </div>
      </header>

      <section className="admin-stats">
        <article className="admin-stat-card">
          <FaBox />
          <div>
            <span>Total des commandes</span>
            <strong>{orders.length}</strong>
          </div>
        </article>

        <article className="admin-stat-card">
          <FaClock />
          <div>
            <span>En attente</span>
            <strong>{pendingCount}</strong>
          </div>
        </article>

        <article className="admin-stat-card">
          <FaSyncAlt />
          <div>
            <span>En préparation</span>
            <strong>{preparingCount}</strong>
          </div>
        </article>

        <article className="admin-stat-card">
          <FaCheckCircle />
          <div>
            <span>Livrées</span>
            <strong>{deliveredCount}</strong>
          </div>
        </article>
      </section>

      <section className="admin-orders-section">
        
<div className="admin-section-heading">
  <div>
    <p className="admin-eyebrow">SUIVI DE LA BOUTIQUE</p>
    <h2>Gestion des commandes</h2>
  </div>

  <div className="admin-heading-actions">
    <span>{orders.length} commande(s)</span>

    <button
      type="button"
      className="admin-refresh-button"
      onClick={refreshOrders}
      disabled={refreshing}
    >
      <FaSyncAlt className={refreshing ? "admin-spinning" : ""} />
      {refreshing ? "Actualisation..." : "Actualiser"}
    </button>
  </div>
</div>


        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="admin-message">Chargement des commandes...</p>
        ) : orders.length === 0 ? (
          <div className="admin-empty">
            <FaBox />
            <h3>Aucune commande pour le moment</h3>
            <p>Les nouvelles commandes apparaîtront ici.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              

<thead>
  <tr>
    <th>Client</th>
    <th>Parfum</th>
    <th>Couleur</th>
    <th>Type</th>
    <th>Personnalisation</th>
    <th>Date</th>
    <th>Statut</th>
    <th>Actions</th>
  </tr>
</thead>



              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    
<td className="admin-client-cell">
  <strong>{order.name}</strong>
  <small>
    <span>Téléphone</span>
    {order.phone}
  </small>
  <small>
    <span>Adresse</span>
    {order.address}
  </small>
</td>


   
<td>{order.fragrance}</td>
<td>{order.color}</td>
<td>{order.orderType}</td>
<td className="admin-personalization">
  {order.message ? (
    <p>
      <strong>Message :</strong> {order.message}
    </p>
  ) : (
    <p>Aucun message</p>
  )}

  {order.photo ? (
    <a href={order.photo} target="_blank" rel="noreferrer">
      Voir la photo
    </a>
  ) : (
    <p>Aucune photo</p>
  )}
</td>
<td>
  {order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("fr-FR")
    : "—"}
</td>


                    <td>
                      
<select
  className={`admin-status-select status-${(order.status || "En attente")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")}`}
  value={order.status || "En attente"}
  disabled={updatingId === order._id}
  onChange={(event) => updateStatus(order._id, event.target.value)}
  aria-label={`Statut de la commande de ${order.name}`}
>

                        <option>En attente</option>
                        <option>Confirmée</option>
                        <option>En préparation</option>
                        <option>Expédiée</option>
                        <option>Livrée</option>
                        <option>Annulée</option>
                      </select>

                      {updatingId === order._id && (
                        <small>Enregistrement...</small>
                      )}
                    </td>
                    
<td>
  <button
    type="button"
    className="admin-details-button"
    onClick={() => setSelectedOrder(order)}
  >
    Voir les détails
  </button>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    
      </section>

      {selectedOrder && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setSelectedOrder(null)}
              aria-label="Fermer les détails"
            >
              ×
            </button>

            <p className="admin-eyebrow">MINAS CANDLES · COMMANDE</p>
            <h2 id="admin-modal-title">Détails de la commande</h2>

            <div className="admin-modal-details">
              <p><strong>Client :</strong> {selectedOrder.name}</p>
              <p><strong>Téléphone :</strong> {selectedOrder.phone}</p>
              <p><strong>Adresse :</strong> {selectedOrder.address}</p>
              <p><strong>Parfum :</strong> {selectedOrder.fragrance}</p>
              <p><strong>Couleur :</strong> {selectedOrder.color}</p>
              <p><strong>Type :</strong> {selectedOrder.orderType}</p>
              <p><strong>Message :</strong> {selectedOrder.message || "Aucun message"}</p>
              <p><strong>Date :</strong> {selectedOrder.createdAt
                ? new Date(selectedOrder.createdAt).toLocaleDateString("fr-FR")
                : "—"}
              </p>
              <p><strong>Statut :</strong> {selectedOrder.status || "En attente"}</p>

              {selectedOrder.photo && (
                <p>
                  <strong>Photo :</strong>{" "}
                  <a href={selectedOrder.photo} target="_blank" rel="noreferrer">
                    Voir la photo
                  </a>
                </p>
              )}
            </div>

            <button
              type="button"
              className="admin-modal-footer-button"
              onClick={() => setSelectedOrder(null)}
            >
              Fermer
            </button>
          </section>
        </div>
      )}
    </main>
  );
}


export default AdminDashboard;

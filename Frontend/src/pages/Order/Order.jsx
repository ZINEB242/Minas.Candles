import { useState, useEffect } from "react";

import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Summary from "./Summary";
import "./Order.css";

const Order = () => {
  const [step, setStep] = useState(0);
const [orders, setOrders] = useState([]);
const [loadingOrders, setLoadingOrders] = useState(true);
const [showNewOrder, setShowNewOrder] = useState(false);
const [ordersError, setOrdersError] = useState("");

useEffect(() => {
  const fetchMyOrders = async () => {
    const token = localStorage.getItem("minasToken");

    if (!token) {
      setOrdersError("Veuillez vous connecter pour consulter vos commandes.");
      setLoadingOrders(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Impossible de charger vos commandes.");
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Erreur historique des commandes :", error);
      setOrdersError(error.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  fetchMyOrders();
}, []);

  const [occasion, setOccasion] = useState("");
  const [fragrance, setFragrance] = useState("");
  const [colors, setColors] = useState([]);
  const [customColor, setCustomColor] = useState("");
  const [customImage, setCustomImage] = useState(null);
  const [message, setMessage] = useState("");
  const [messageImage, setMessageImage] = useState(null);

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    wilaya: "",
    commune: "",
    address: "",
    note: "",
  });

  const occasions = [
    { id: "naissance", title: "Naissance", emoji: "👶" },
    { id: "mariage", title: "Mariage", emoji: "💍" },
    { id: "cadeau", title: "Cadeau à offrir", emoji: "🎁" },
    { id: "plaisir", title: "Pour me faire plaisir", emoji: "🕯️" },
  ];

  const handleConfirmOrder = async () => {
    try {
      const orderData = {
        name: `${customer.firstName} ${customer.lastName}`,
        fragrance,
        color: [
          ...colors,
          ...(customColor.trim() ? [customColor.trim()] : []),
        ].join(", "),
        message,
        phone: customer.phone,
        address: `${customer.address}, ${customer.commune}, ${customer.wilaya}`,
        orderType: occasion,
        note: customer.note,
      };

     
const token = localStorage.getItem("minasToken");

if (!token) {
  alert("Veuillez vous connecter à votre compte avant de commander.");
  return;
}

const response = await fetch("http://localhost:3000/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(orderData),
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la commande");
      }

      alert("Votre commande a été enregistrée avec succès ! 🕯️❤️");
      console.log("Commande enregistrée :", data);
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de l'enregistrement de la commande ❌");
    }
  };

  // Affichage de l'historique des commandes
  if (!showNewOrder) {
    return (
      <main className="order-page">
        <section className="order-container">
          <span className="order-subtitle">MINAS CANDLES</span>
          <h1>Mes commandes</h1>
          <p>Retrouvez ici l'historique de vos commandes.</p>

          {loadingOrders && <p>Chargement de vos commandes...</p>}

          {ordersError && <p>{ordersError}</p>}

          {!loadingOrders && !ordersError && orders.length === 0 && (
            <p>Vous n'avez pas encore passé de commande.</p>
          )}

          {!loadingOrders &&
            !ordersError &&
            orders.map((order) => (
              <article
                key={order._id}
                style={{
                  border: "1px solid #e5d5d5",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <h3>Commande du {new Date(order.createdAt).toLocaleDateString("fr-FR")}</h3>
                <p><strong>Nom :</strong> {order.name}</p>
                <p><strong>Parfum :</strong> {order.fragrance}</p>
                <p><strong>Couleur :</strong> {order.color}</p>
                <p><strong>Occasion :</strong> {order.orderType}</p>
                <p><strong>Statut :</strong> {order.status}</p>
              </article>
            ))}

          <button
            type="button"
            className="start-order-btn"
            onClick={() => {
              setStep(0);
              setShowNewOrder(true);
            }}
          >
            Nouvelle commande
          </button>
        </section>
      </main>
    );
  }

  // Écran de départ
  
  if (step === 0) {
    return (
      <main className="order-page">
        <section className="order-container">
          <span className="order-subtitle">MINAS CANDLES</span>
          <h1>Créez votre bougie</h1>
          <p>
            Personnalisez votre bougie en choisissant chaque détail.
          </p>
          <button
            type="button"
            className="start-order-btn"
            onClick={() => setStep(1)}
          >
            Commencer ma commande
          </button>
        </section>
      </main>
    );
  }

  // Personnalisation sur une seule page
  return (
    <main className="order-page">
      <div className="order-layout">
        <div className="order-form-sections">
          <section className="order-container">
            <div className="step-number">Étape 1</div>
            <span className="order-subtitle">VOTRE CRÉATION</span>
            <h1>Pour quelle occasion ?</h1>
            <p>
              Choisissez l'occasion pour laquelle vous créez votre bougie.
            </p>

            <div className="occasion-grid">
              {occasions.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`occasion-card ${
                    occasion === item.id ? "selected" : ""
                  }`}
                  onClick={() => setOccasion(item.id)}
                >
                  <span className="occasion-emoji">{item.emoji}</span>
                  <span className="occasion-title">{item.title}</span>
                </button>
              ))}
            </div>
          </section>

          <Step2
            fragrance={fragrance}
            setFragrance={setFragrance}
          />

          <Step3
            colors={colors}
            setColors={setColors}
            customColor={customColor}
            setCustomColor={setCustomColor}
            customImage={customImage}
            setCustomImage={setCustomImage}
          />

          <Step4
            message={message}
            setMessage={setMessage}
            messageImage={messageImage}
            setMessageImage={setMessageImage}
          />

          <Step5
            customer={customer}
            setCustomer={setCustomer}
          />
        </div>

        <aside className="order-summary">
          <Summary
            occasion={occasions.find((item) => item.id === occasion)?.title || ""}
            fragrance={fragrance}
            colors={colors}
            customColor={customColor}
            customImage={customImage}
            message={message}
            messageImage={messageImage}
            customer={customer}
            onConfirm={handleConfirmOrder}
          />
        </aside>
      </div>
    </main>
  );
};

export default Order;

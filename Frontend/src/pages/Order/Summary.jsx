import { useEffect, useState } from "react";
import "./Summary.css";
const Summary = ({
  occasion,
  fragrance,
  colors,
  customColor,
  customImage,
  message,
  messageImage,
  customer,
  onConfirm,
}) => {

  const [messageImagePreview, setMessageImagePreview] = useState("");

useEffect(() => {
  if (!messageImage) {
    setMessageImagePreview("");
    return;
  }

  if (typeof messageImage === "string") {
    setMessageImagePreview(messageImage);
    return;
  }

  const imageUrl = URL.createObjectURL(messageImage);
  setMessageImagePreview(imageUrl);

  return () => URL.revokeObjectURL(imageUrl);
}, [messageImage]);
  return (
    <section className="summary-container">

      <div className="step-number">
        Résumé de votre commande
      </div>

      <span className="order-subtitle">
        MINAS CANDLES
      </span>

      <h1>
        Vérifiez votre commande
      </h1>

      <p>
        Tout est prêt ! Vérifiez les informations avant de confirmer.
      </p>

      {/* =========================
          PERSONNALISATION
      ========================= */}

      <div className="summary-card">

        <h2>
          🕯️ Votre bougie
        </h2>

        <div className="summary-row">
          <span>Occasion</span>
          <strong>{occasion || "Non précisée"}</strong>
        </div>

        <div className="summary-row">
          <span>Senteur</span>
          <strong>{fragrance || "Non précisée"}</strong>
        </div>

       <div className="summary-row">
  <span>Couleurs</span>
  <div className="summary-colors">
    {colors.length > 0 ? (
      colors.map((color, index) => (
        <span className="summary-color" key={index}>{color}</span>
      ))
    ) : (
      <strong>{customColor || "Non précisées"}</strong>
    )}
  </div>
</div>

{customColor && colors.length > 0 && (
  <div className="summary-row">
    <span>Couleur personnalisée</span>
    <strong>{customColor}</strong>
  </div>
)}

{customImage && (
  <div className="summary-image">
    <span>Photo de référence des couleurs</span>
    <img
      src={customImage}
      alt="Référence des couleurs personnalisées"
    />
  </div>
)}

        <div className="summary-message">

          <span>Message</span>

          <p>
            {message || "Aucun message"}
          </p>

        </div>

        {/* IMAGE */}

       {messageImagePreview && (
  <div className="summary-image">
    <span>Image de référence</span>

    <img
      src={messageImagePreview}
      alt="Référence"
    />
  </div>
)}

      </div>


      {/* =========================
          LIVRAISON
      ========================= */}

      <div className="summary-card">

        <h2>
          📍 Livraison
        </h2>

        <div className="customer-name">

          <strong>
            {customer.firstName} {customer.lastName}
          </strong>

        </div>

        <div className="summary-row">

          <span>Téléphone</span>

          <strong>
            {customer.phone}
          </strong>

        </div>

        <div className="summary-row">

          <span>Wilaya</span>

          <strong>
            {customer.wilaya}
          </strong>

        </div>

        <div className="summary-row">

          <span>Commune</span>

          <strong>
            {customer.commune}
          </strong>

        </div>

        <div className="summary-message">

          <span>Adresse</span>

          <p>
            {customer.address}
          </p>

        </div>

        {customer.note && (
          <div className="summary-message">

            <span>Indication</span>

            <p>
              {customer.note}
            </p>

          </div>
        )}

      </div>


      {/* =========================
          NAVIGATION
      ========================= */}

    <div className="summary-navigation">
  <button
    type="button"
    className="confirm-btn"
    onClick={onConfirm}
  >
    ✓ Confirmer ma commande
  </button>
</div>

    </section>
  );
};

export default Summary;
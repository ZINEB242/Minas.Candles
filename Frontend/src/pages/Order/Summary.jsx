import "./Summary.css";

const Summary = ({
  occasion,
  fragrance,
  colors,
  message,
  messageImage,
  customer,
  onBack,
  onConfirm,
}) => {
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
                <span
                  className="summary-color"
                  key={index}
                >
                  {color}
                </span>
              ))
            ) : (
              <strong>Personnalisée</strong>
            )}

          </div>

        </div>

        <div className="summary-message">

          <span>Message</span>

          <p>
            {message || "Aucun message"}
          </p>

        </div>

        {/* IMAGE */}

        {messageImage && (
          <div className="summary-image">

            <span>
              Image de référence
            </span>

            <img
              src={
                typeof messageImage === "string"
                  ? messageImage
                  : URL.createObjectURL(messageImage)
              }
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
          className="back-btn"
          onClick={onBack}
        >
          ← Modifier
        </button>

        <button
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
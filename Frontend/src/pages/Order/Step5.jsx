import "./Step5.css";

const Step5 = ({
  customer,
  setCustomer,
  onNext,
  onBack,
}) => {

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer({
      ...customer,
      [name]: value,
    });
  };

  const isComplete =
    customer.firstName.trim() !== "" &&
    customer.lastName.trim() !== "" &&
    customer.phone.trim() !== "" &&
    customer.wilaya.trim() !== "" &&
    customer.commune.trim() !== "" &&
    customer.address.trim() !== "";

  return (
    <section className="order-container">

      {/* PROGRESSION */}

      <div className="step-number">
        Étape 5 sur 5
      </div>

      <span className="order-subtitle">
        LIVRAISON
      </span>

      <h1>
        Où devons-nous livrer votre commande ?
      </h1>

      <p>
        Renseignez vos coordonnées pour que nous puissions vous contacter.
      </p>

      {/* FORMULAIRE */}

      <div className="address-form">

        {/* PRÉNOM */}

        <div className="form-group">

          <label>
            Prénom *
          </label>

          <input
            type="text"
            name="firstName"
            placeholder="Votre prénom"
            value={customer.firstName}
            onChange={handleChange}
          />

        </div>

        {/* NOM */}

        <div className="form-group">

          <label>
            Nom *
          </label>

          <input
            type="text"
            name="lastName"
            placeholder="Votre nom"
            value={customer.lastName}
            onChange={handleChange}
          />

        </div>

        {/* TÉLÉPHONE */}

        <div className="form-group full-width">

          <label>
            Numéro de téléphone *
          </label>

          <input
            type="tel"
            name="phone"
            placeholder="Ex : 0550 00 00 00"
            value={customer.phone}
            onChange={handleChange}
          />

        </div>

        {/* WILAYA */}

        <div className="form-group">

          <label>
            Wilaya *
          </label>

          <input
            type="text"
            name="wilaya"
            placeholder="Ex : Alger"
            value={customer.wilaya}
            onChange={handleChange}
          />

        </div>

        {/* COMMUNE */}

        <div className="form-group">

          <label>
            Commune *
          </label>

          <input
            type="text"
            name="commune"
            placeholder="Ex : Bab Ezzouar"
            value={customer.commune}
            onChange={handleChange}
          />

        </div>

        {/* ADRESSE */}

        <div className="form-group full-width">

          <label>
            Adresse exacte *
          </label>

          <textarea
            name="address"
            placeholder="Numéro, rue, résidence..."
            value={customer.address}
            onChange={handleChange}
          />

        </div>

        {/* INDICATION */}

        <div className="form-group full-width">

          <label>
            Indication supplémentaire
            <span className="optional">
              (facultatif)
            </span>
          </label>

          <input
            type="text"
            name="note"
            placeholder="Ex : près de la pharmacie..."
            value={customer.note}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* NAVIGATION */}

      <div className="order-navigation">

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Retour
        </button>

        <button
          className="next-btn"
          disabled={!isComplete}
          onClick={onNext}
        >
          Voir mon résumé →
        </button>

      </div>

    </section>
  );
};

export default Step5;
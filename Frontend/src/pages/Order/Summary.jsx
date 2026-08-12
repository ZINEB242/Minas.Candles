const Summary = ({ formData }) => {

  const handleSubmit = () => {

    // Plus tard :
    // axios.post("http://localhost:3001/orders", formData)

    alert("Votre commande a été envoyée avec succès !");

    console.log(formData);

  };

  return (

    <div className="container py-5">

      <div
        className="card shadow-lg border-0 mx-auto"
        style={{
          maxWidth: "700px",
          borderRadius: "20px",
        }}
      >

        <div className="card-body p-5">

          <h2
            className="text-center mb-5 fw-bold"
            style={{ color: "#4E3A33" }}
          >
            Récapitulatif de votre commande
          </h2>

          <div className="row">

            <div className="col-6">

              <h5>🎁 Occasion</h5>
              <p>{formData.occasion}</p>

              <h5>🌸 Senteur</h5>
              <p>{formData.fragrance}</p>

              <h5>🎨 Couleur</h5>

              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: formData.color,
                  border: "1px solid #ccc",
                }}
              />

            </div>

            <div className="col-6">

              <h5>👤 Client</h5>

              <p>
                {formData.firstName} {formData.lastName}
              </p>

              <h5>📞 Téléphone</h5>

              <p>{formData.phone}</p>

              <h5>📍 Adresse</h5>

              <p>
                {formData.address}
                <br />
                {formData.commune}
                <br />
                {formData.wilaya}
              </p>

            </div>

          </div>

          <hr />

          <h5>💌 Message</h5>

          <div
            className="p-3 rounded"
            style={{
              background: "#F8F3EC",
            }}
          >
            {formData.message || "Aucun message"}
          </div>

          <hr />

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h4
                className="fw-bold"
                style={{
                  color: "#C98E7A",
                }}
              >
                Prix estimé
              </h4>

              <h3>2500 DA</h3>

            </div>

            <button
              className="btn btn-lg"
              style={{
                background: "#C98E7A",
                color: "white",
              }}
              onClick={handleSubmit}
            >
              Confirmer la commande
            </button>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Summary;
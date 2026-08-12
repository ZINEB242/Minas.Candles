const Step5 = ({ nextStep, prevStep, formData, setFormData }) => {

  return (

    <div className="container py-5">

      <h2 className="text-center mb-5">

        Informations de livraison

      </h2>

      <div className="row g-3">

        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Nom"
            onChange={(e) =>
              setFormData({
                ...formData,
                lastName: e.target.value,
              })
            }
          />
        </div>

        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Prénom"
            onChange={(e) =>
              setFormData({
                ...formData,
                firstName: e.target.value,
              })
            }
          />
        </div>

        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Téléphone"
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />
        </div>

        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Wilaya"
            onChange={(e) =>
              setFormData({
                ...formData,
                wilaya: e.target.value,
              })
            }
          />
        </div>

        <div className="col-12">
          <input
            className="form-control"
            placeholder="Commune"
            onChange={(e) =>
              setFormData({
                ...formData,
                commune: e.target.value,
              })
            }
          />
        </div>

        <div className="col-12">
          <textarea
            className="form-control"
            rows="4"
            placeholder="Adresse exacte..."
            onChange={(e) =>
              setFormData({
                ...formData,
                address: e.target.value,
              })
            }
          />
        </div>

      </div>

      <div className="d-flex justify-content-between mt-5">

        <button
          className="btn btn-outline-secondary"
          onClick={prevStep}
        >
          Retour
        </button>

        <button
          className="btn btn-success"
          onClick={nextStep}
        >
          Voir le récapitulatif
        </button>

      </div>

    </div>

  );

};

export default Step5;
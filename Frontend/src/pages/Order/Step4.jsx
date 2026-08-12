const Step4 = ({ nextStep, prevStep, formData, setFormData }) => {

  return (

    <div className="container py-5">

      <h2 className="text-center mb-5">

        Votre message

      </h2>

      <textarea
        className="form-control"
        rows="6"
        placeholder="Écrivez votre message..."
        value={formData.message}
        onChange={(e) =>
          setFormData({
            ...formData,
            message: e.target.value,
          })
        }
      />

      <div className="mt-4">

        <label className="form-label">

          Ajouter une image (optionnel)

        </label>

        <input
          type="file"
          className="form-control"
        />

      </div>

      <div className="d-flex justify-content-between mt-5">

        <button
          className="btn btn-outline-secondary"
          onClick={prevStep}
        >
          Retour
        </button>

        <button
          className="btn btn-dark"
          onClick={nextStep}
        >
          Suivant
        </button>

      </div>

    </div>

  );

};

export default Step4;
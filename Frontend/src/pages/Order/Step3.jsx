const colors = [
  "#FFFFFF",
  "#F7D7D7",
  "#F5E6CC",
  "#B68D6D",
  "#8B5E3C",
  "#000000",
];

const Step3 = ({ nextStep, prevStep, formData, setFormData }) => {

  return (

    <div className="container py-5">

      <h2 className="text-center mb-5">

        Choisissez la couleur

      </h2>

      <div className="d-flex justify-content-center gap-4 flex-wrap">

        {colors.map((color) => (

          <div
            key={color}
            onClick={() =>
              setFormData({
                ...formData,
                color,
              })
            }
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: color,
              cursor: "pointer",
              border:
                formData.color === color
                  ? "5px solid #C98E7A"
                  : "2px solid #ddd",
            }}
          />

        ))}

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
          disabled={!formData.color}
          onClick={nextStep}
        >
          Suivant
        </button>

      </div>

    </div>

  );

};

export default Step3;
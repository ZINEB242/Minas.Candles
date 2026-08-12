const fragrances = [
  {
    id: 1,
    name: "Lait de Coco",
    emoji: "🥥",
    description: "Douce et exotique",
  },
  {
    id: 2,
    name: "Lait d'Amande",
    emoji: "🌰",
    description: "Chaleureuse et gourmande",
  },
  {
    id: 3,
    name: "Jasmin",
    emoji: "🌸",
    description: "Florale et élégante",
  },
  {
    id: 4,
    name: "Rose",
    emoji: "🌹",
    description: "Romantique",
  },
  {
    id: 5,
    name: "Rose Petal",
    emoji: "🌺",
    description: "Délicate",
  },
  {
    id: 6,
    name: "Lovely",
    emoji: "🌴",
    description: "Exotique",
  },
];

const Step2 = ({ nextStep, prevStep, formData, setFormData }) => {
  return (
    <div className="container py-5">

      <h2 className="text-center mb-5">
        Choisissez une senteur
      </h2>

      <div className="row g-4">

        {fragrances.map((item) => (

          <div className="col-md-4" key={item.id}>

            <div
              className={`card p-4 text-center shadow-sm ${
                formData.fragrance === item.name
                  ? "border border-3 border-danger"
                  : ""
              }`}
              style={{
                cursor: "pointer",
                borderRadius: "20px",
              }}
              onClick={() =>
                setFormData({
                  ...formData,
                  fragrance: item.name,
                })
              }
            >
              <h1>{item.emoji}</h1>

              <h4>{item.name}</h4>

              <p>{item.description}</p>

            </div>

          </div>

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
          disabled={!formData.fragrance}
          onClick={nextStep}
        >
          Suivant
        </button>

      </div>

    </div>
  );
};

export default Step2;
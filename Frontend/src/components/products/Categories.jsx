const fragrances = [
  {
    id: 1,
    name: "Lait de Coco",
    emoji: "🥥",
    description: "Douceur exotique et crémeuse",
  },
  {
    id: 2,
    name: "Lait d'Amande",
    emoji: "🌰",
    description: "Chaleureuse et réconfortante",
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
    description: "Romantique et intemporelle",
  },
  {
    id: 5,
    name: "Rose Petal",
    emoji: "🌺",
    description: "Délicate et raffinée",
  },
  {
    id: 6,
    name: "Lovely",
    emoji: "🌴",
    description: "Exotique et envoûtante",
  },
];

const Categories = () => {
  return (
    <section className="container py-5">

      <h2
        className="text-center mb-5 fw-bold"
        style={{ color: "#4E3A33" }}
      >
        Nos senteurs
      </h2>

      <div className="row g-4">

        {fragrances.map((item) => (
          <div key={item.id} className="col-md-4">

            <div
              className="card border-0 shadow-sm text-center p-4 h-100"
              style={{
                borderRadius: "20px",
                transition: ".3s",
                cursor: "pointer",
              }}
            >

              <h1>{item.emoji}</h1>

              <h4 className="mt-3">{item.name}</h4>

              <p className="text-muted">
                {item.description}
              </p>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
};

export default Categories;
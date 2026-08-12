import { useState } from "react";

import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Summary from "./Summary";
import "./Order.css";

const Order = () => {

  const [step, setStep] = useState(0);

  const [occasion, setOccasion] = useState("");

  const [fragrance, setFragrance] = useState("");
const [colors, setColors] = useState([]);
const [message, setMessage] = useState("");

const [messageImage, setMessageImage] = useState(null);
  const occasions = [
    {
      id: "naissance",
      title: "Naissance",
      emoji: "👶",
    },
    {
      id: "mariage",
      title: "Mariage",
      emoji: "💍",
    },
    {
      id: "cadeau",
      title: "Cadeau à offrir",
      emoji: "🎁",
    },
    {
      id: "plaisir",
      title: "Pour me faire plaisir",
      emoji: "🕯️",
    },
  ];
const [customer, setCustomer] = useState({
  firstName: "",
  lastName: "",
  phone: "",
  wilaya: "",
  commune: "",
  address: "",
  note: "",
});

  /* =========================
     PAGE DE DÉPART
  ========================= */

  if (step === 0) {

    return (
      <main className="order-page">

        <section className="order-container">

          <span className="order-subtitle">
            MINAS CANDLES
          </span>

          <h1>
            Créez votre bougie
          </h1>

          <p>
            Personnalisez votre bougie étape par étape.
          </p>

          <button
            className="start-order-btn"
            onClick={() => setStep(1)}
          >
            Commencer ma commande
          </button>

        </section>

      </main>
    );
  }


  /* =========================
     ÉTAPE 1
  ========================= */

  if (step === 1) {

    return (
      <main className="order-page">

        <section className="order-container">

          <div className="step-number">
            Étape 1 sur 5
          </div>

          <span className="order-subtitle">
            VOTRE CRÉATION
          </span>

          <h1>
            Pour quelle occasion ?
          </h1>

          <p>
            Choisissez l'occasion pour laquelle vous créez votre bougie.
          </p>

          <div className="occasion-grid">

            {occasions.map((item) => (

              <button
                key={item.id}
                className={`occasion-card ${
                  occasion === item.id ? "selected" : ""
                }`}
                onClick={() => setOccasion(item.id)}
              >

                <span className="occasion-emoji">
                  {item.emoji}
                </span>

                <span className="occasion-title">
                  {item.title}
                </span>

              </button>

            ))}

          </div>

          <button
            className="next-btn"
            disabled={!occasion}
            onClick={() => setStep(2)}
          >
            Continuer →
          </button>

        </section>

      </main>
    );
  }


  /* =========================
     ÉTAPE 2
  ========================= */

  if (step === 2) {

    return (
      <main className="order-page">

        <Step2
          fragrance={fragrance}
          setFragrance={setFragrance}

          onNext={() => setStep(3)}

          onBack={() => setStep(1)}
        />

      </main>
    );
  }


  /* =========================
     ÉTAPE 3
  ========================= */

if (step === 3) {

  return (
    <main className="order-page">

      <Step3
        colors={colors}
        setColors={setColors}

        onNext={() => setStep(4)}

        onBack={() => setStep(2)}
      />

    </main>
  );
}

if (step === 4) {

  return (
    <main className="order-page">

      <Step4
        message={message}
        setMessage={setMessage}

        messageImage={messageImage}
        setMessageImage={setMessageImage}

        onNext={() => setStep(5)}

        onBack={() => setStep(3)}
      />

    </main>
  );
}
if (step === 5) {
  return (
    <main className="order-page">

      <Step5
        customer={customer}
        setCustomer={setCustomer}

        onBack={() => setStep(4)}

        onNext={() => setStep(6)}
      />

    </main>
  );
}
if (step === 6) {
  return (
    <main className="order-page">

      <Summary
        occasion={occasion}
        fragrance={fragrance}
        colors={colors}
        message={message}
        messageImage={messageImage}
        customer={customer}

        onBack={() => setStep(5)}

        onConfirm={() => {
          alert(
            "Votre commande a été enregistrée avec succès ! 🕯️❤️"
          );
        }}
      />

    </main>
  );
}
};


export default Order;
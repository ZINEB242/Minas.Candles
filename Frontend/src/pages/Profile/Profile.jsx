
import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaShieldAlt,
  FaEdit,
} from "react-icons/fa";
import "./Profile.css";

function Profile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("minasToken");

    if (!token) {
      setError("Veuillez vous connecter pour consulter votre profil.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:3000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Impossible de charger le profil.");
        }

        return data;
      })
      .then((data) => {
        setName(data.user.name || "");
        setEmail(data.user.email || "");
        setRole(data.user.role || "customer");

        // Actualise les informations du navigateur depuis le backend.
        localStorage.setItem("minasUser", JSON.stringify(data.user));
      })
      .catch((err) => {
        setError(err.message || "Une erreur est survenue.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const roleLabels = {
    admin: "Administrateur",
    customer: "Client",
  };

  const roleLabel = roleLabels[role] || "Client";

 
const handleSave = async () => {
  setError("");

  const token = localStorage.getItem("minasToken");

  if (!token) {
    setError("Votre session a expiré. Veuillez vous reconnecter.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Impossible de modifier le profil.");
    }

    setName(data.user.name);
    setEmail(data.user.email);
    setRole(data.user.role);

    localStorage.setItem("minasUser", JSON.stringify(data.user));

    setEditing(false);
    setError("");
  } catch (err) {
    setError(err.message || "Une erreur est survenue.");
  }
};


  if (loading) {
    return (
      <main className="profile-page">
        <p>Chargement de votre profil...</p>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-header">
        <p className="profile-eyebrow">MINAS CANDLES · MON ESPACE</p>
        <h1>Mon profil</h1>
        <p>Gérez les informations de votre compte Minas Candles.</p>
      </div>

      <section className="profile-card">
        <div className="profile-cover" />

        <div className="profile-content">
          <div className="profile-avatar-large">
            <FaUserCircle />
          </div>

          <h2>{name || "Utilisateur"}</h2>
          <span className="profile-role">{roleLabel}</span>

          {error && (
            <p role="alert" className="profile-error">
              {error}
            </p>
          )}

          <div className="profile-details">
            <div className="profile-detail">
              <FaUserCircle />
              <div>
                <small>Nom du compte</small>
                {editing ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom complet"
                  />
                ) : (
                  <p>{name || "Non renseigné"}</p>
                )}
              </div>
            </div>

            <div className="profile-detail">
              <FaEnvelope />
              <div>
                <small>Adresse e-mail</small>
                {editing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse e-mail"
                  />
                ) : (
                  <p>{email || "Non renseignée"}</p>
                )}
              </div>
            </div>

            <div className="profile-detail">
              <FaShieldAlt />
              <div>
                <small>Type de compte</small>
                <p>{roleLabel}</p>
              </div>
            </div>
          </div>

          <button
            className="profile-edit-button"
            onClick={editing ? handleSave : () => setEditing(true)}
            disabled={Boolean(error)}
          >
            <FaEdit />
            {editing ? "Terminer la modification" : "Modifier mon profil"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Profile;

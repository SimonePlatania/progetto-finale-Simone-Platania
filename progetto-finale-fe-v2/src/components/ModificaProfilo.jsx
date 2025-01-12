import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";

function ModificaProfilo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/utenti/me",
          {
            headers: { Authorization: sessionId },
          }
        );
        setUser(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
        });
      } catch (err) {
        console.error("Errore nel caricamento dati utente:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const errors = validateForm();
    setIsDisabled(errors.length > 0);
  }, [formData]);

  const validateForm = () => {
    const errors = [];

    if (!formData.username || !formData.email) {
      errors.push("I campi non possono essere vuoti");
      return errors;
    }

    if (formData.username.length < 3) {
      errors.push("Lo username deve avere almeno 3 caratteri");
    }
    if (formData.username.length > 30) {
      errors.push("Lo username può avere massimo 30 caratteri");
    }

    if (!emailRegex.test(formData.email)) {
      errors.push("Formato email non valido");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sessionId = localStorage.getItem("sessionId");

    try {
      const errors = validateForm();
      if (errors.length > 0) {
        setError(errors.join(" | "));
        return;
      }

      await axios.put(`http://localhost:8080/api/utenti/${user.id}`, formData, {
        headers: { Authorization: sessionId },
      });
      setSuccess("Profilo aggiornato con successo!");
      setTimeout(() => navigate("/homepage"), 2000);
    } catch (err) {
      setError(err.response?.data || "Errore durante l'aggiornamento");
    }
  };

  return (
    <div className="mio-div">
      <form className="form" onSubmit={handleSubmit}>
      <h2 class="text-3xl font-bold text-transparent text-center bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Modifica Profilo
        </h2>
        <br />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "rgba(34, 197, 94, 0.1)",
              color: "#22c55e",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            {success}
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full"
            placeholder="Username"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full"
            placeholder="Email"
            required
          />
        </div>

        <button type="submit" className="btn registrati" disabled={isDisabled}>
          Salva Modifiche
        </button>
        <br />

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/homepage")}
            className="btn reset"
          >
            Torna alla Homepage
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModificaProfilo;

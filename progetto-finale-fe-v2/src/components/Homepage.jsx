// Homepage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NotificationBell from "./NotificationBell";

function Homepage() {
  const [user, setUser] = useState(null);
  const [asteAttive, setAsteAttive] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState({});
  const navigate = useNavigate();

  const modificaProfilo = () => {
    navigate("/modifica-profilo");
  };

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      navigate("/login");
      return;
    }

    const checkSession = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/utenti/me",
          {
            headers: { Authorization: sessionId },
          }
        );
        setUser(response.data);
      } catch (err) {
        console.error("Sessione non valida", err);
        navigate("/login");
      }
    };

    const fetchAste = async () => {
      try {
        const sessionId = localStorage.getItem("sessionId");
        const asteResponse = await axios.get(
          "http://localhost:8080/api/aste/attive",
          {
            headers: { Authorization: sessionId },
          }
        );
        setAsteAttive(asteResponse.data);

        if (asteResponse.data.length > 0) {
          const itemsMap = {};
          for (const asta of asteResponse.data) {
            try {
              const itemResponse = await axios.get(
                `http://localhost:8080/api/items/${asta.itemId}`,
                {
                  headers: { Authorization: sessionId },
                }
              );
              itemsMap[asta.itemId] = itemResponse.data;
            } catch (itemErr) {
              console.error(`Errore caricamento item ${asta.itemId}:`, itemErr);
            }
          }
          setItems(itemsMap);
        }
      } catch (err) {
        setError("Errore nel caricamento delle aste");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    fetchAste();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("sessionId");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br h-8 from-white to-gray-100 rounded-md">
      {" "}
      {/* Header */}
      <header className="bg-white shadow rounded-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Sistema Aste</h1>

            <div className="flex items-center space-x-4">
              {/* Prima la campanella */}
              <NotificationBell userId={user?.id} />
              {/* Navigazione per Gestore */}
              {user?.ruolo === "GESTORE" && (
                <button
                  onClick={() => navigate("/items")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  I Miei Items
                </button>
              )}

              {/* Navigazione per Partecipante */}
              {user?.ruolo === "PARTECIPANTE" && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate("/aste-partecipate")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Le Mie Aste
                  </button>
                  <button
                    onClick={() => navigate("/aste-vinte")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Aste Vinte
                  </button>
                </div>
              )}

              {/* Info Utente e Logout */}
              <div className="flex items-center space-x-4 border-l pl-4">
                <div
                  className="text-center cursor-pointer"
                  onClick={modificaProfilo}
                >
                  <span className="block text-sm font-medium">Account</span>
                  <span className="block text-xs text-gray-500">
                    {user?.username}
                  </span>
                  <span className="block text-xs text-gray-600">
                    {user?.ruolo}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Contenuto Principale */}
      <main className="max-w-[90%] mx-auto px-8 py-8">
        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {asteAttive.map((asta) => (
              <div
                key={asta.id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col min-h-[400px] 
              transform transition-all duration-300 hover:scale-105"
              >
                {/* Header della Card */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold">{asta.nomeItem}</h3>

                  <div className="text-sm text-gray-500 mt-1">
                    <p>
                      ID Asta: {asta.id} • ID Item: {asta.itemId}
                    </p>
                  </div>
                </div>

                {/* Dettagli Principali */}
                <div className="border-t border-b border-gray-100 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Prezzo Base</p>
                      <p className="font-medium text-lg">
                        €{items[asta.itemId]?.prezzoBase?.toFixed(2) || "N/D"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Offerta Corrente</p>
                      <p className="font-medium text-lg">
                        €{asta.offertaCorrente?.toFixed(2) || "Nessuna offerta"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        asta.startNow
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {asta.startNow ? "Asta Attiva" : "Inizio Programmato"}
                    </span>
                  </div>
                </div>

                {/* Info Offerente per Gestori */}
                {user?.ruolo === "GESTORE" && asta.usernameOfferente && (
                  <div className="mt-4 text-center bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Miglior Offerente</p>
                    <p className="font-semibold">{asta.usernameOfferente}</p>
                  </div>
                )}

                {/* Date e Azioni */}
                <div className="mt-auto">
                  <div className="text-sm text-gray-500 mb-4">
                    {asta.startNow ? (
                      <p>
                        Scade il: {new Date(asta.dataFine).toLocaleString()}
                      </p>
                    ) : (
                      <>
                        <p>
                          Inizia il:{" "}
                          {new Date(asta.dataInizio).toLocaleString()}
                        </p>
                        <p>
                          Termina il: {new Date(asta.dataFine).toLocaleString()}
                        </p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/asta/${asta.id}`)}
                    className={`w-full py-2.5 rounded-lg transition-colors ${
                      asta.startNow
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    disabled={!asta.startNow && user?.ruolo === "PARTECIPANTE"}
                  >
                    {user?.ruolo === "PARTECIPANTE"
                      ? asta.startNow
                        ? "Partecipa all'Asta"
                        : "Asta non ancora iniziata"
                      : "Visualizza Dettagli"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Homepage;

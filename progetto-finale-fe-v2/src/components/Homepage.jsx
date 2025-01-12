// Homepage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NotificationBell from "./NotificationBell";
import CountDownTimer from "./CountdownTimer";
import "../css/Flip.css";


function Homepage() {
  const [user, setUser] = useState(null);
  const [asteAttive, setAsteAttive] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState({});
  const navigate = useNavigate();
  const [flippedCardId, setFlippedCardId] = useState(null);

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (

    <div className="bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] min-h-screen h-full pb-12">
      {" "}
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow rounded-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                  Archivio
                </button>
              )}

              {/* Navigazione per Partecipante */}
              {user?.ruolo === "PARTECIPANTE" && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate("/aste-partecipate")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Partecipazioni
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
            {asteAttive.map((asta) => (
              <div
                key={asta.id}
                className={`flip-card ${flippedCardId === asta.id ? "flipped" : ""
                  }`}
                onClick={() =>
                  setFlippedCardId(flippedCardId === asta.id ? null : asta.id)
                }
              >
                <div className="flip-card-inner">
                  {/* FRONT DELLA CARD */}
                  <div className="flip-card-front bg-white rounded-lg shadow-md p-6 flex flex-col min-h-[400px]">
                    {/* HEADER CARD */}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        <div>
                          <p className="text-md text-gray-600 pb-2">
                            Prezzo Base
                          </p>
                          <p className="font-medium text-lg">
                            €
                            {items[asta.itemId]?.prezzoBase?.toFixed(2) ||
                              "N/D"}
                          </p>
                        </div>
                        <div>
                          <p className="text-md text-gray-600 pb-2 pl-56">
                            Offerta
                          </p>
                          <p className="font-medium text-lg right pl-56">
                            €
                            {asta.offertaCorrente?.toFixed(2) ||
                              "Nessuna offerta"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 text-center pb-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm ${asta.startNow
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
                        <p className="text-sm text-gray-600">
                          Miglior Offerente
                        </p>
                        <p className="font-semibold">
                          {asta.usernameOfferente}
                        </p>
                      </div>
                    )}

                    {/* Date e Azioni */}
                    <div className="mt-auto">
                    <div className="text-sm text-gray-500 mb-4 flex-grow flex flex-col justify-center">
                    {asta.startNow ? (
                          <>
                            <div className="space-y-2 mt-1 py-2 px-2 pb-6">
                              <p className="text-base italic">
                                Scade il:{" "}
                                {new Date(asta.dataFine).toLocaleString()}
                              </p>
                            </div>
                            <p className="pr-6 py-4">Tempo rimanente:</p>

                            <div className="flex justify-center">
                              <CountDownTimer targetDate={asta.dataFine} />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-2 mb-4">
                              <p>Inizia il: {new Date(asta.dataInizio).toLocaleString()}</p>
                              <p className="text-center">Tempo all'inizio:</p>
                              <div className="flex justify-center">
                                <CountDownTimer targetDate={asta.dataInizio} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p>Termina il: {new Date(asta.dataFine).toLocaleString()}</p>
                              <p className="text-center">Tempo alla fine:</p>
                              <div className="flex justify-center">
                                <CountDownTimer targetDate={asta.dataFine} />
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/asta/${asta.id}`);
                          }}
                          className={`w-3/4 py-2.5 rounded-lg transition-colors ${asta.startNow
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-100 text-gray-700"
                            }`}
                          disabled={
                            !asta.startNow && user?.ruolo === "PARTECIPANTE"
                          }
                        >
                          {user?.ruolo === "PARTECIPANTE"
                            ? asta.startNow
                              ? "Partecipa all'Asta"
                              : "Asta non ancora iniziata"
                            : "Visualizza Dettagli"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlippedCardId(asta.id);
                          }}
                          className="w-1/4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                        >
                          <span role="img" aria-label="flip">
                            🖼️
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RETRO DELLA CARD */}
                  <div className="flip-card-back bg-gray-100 rounded-lg shadow-md p-6 flex flex-col min-h-[400px]">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold">
                        {items[asta.itemId]?.nome || "Oggetto Sconosciuto"}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {items[asta.itemId]?.descrizione ||
                          "Descrizione non disponibile"}
                      </p>
                    </div>

                    <div className="flex-grow flex items-center justify-center">
                      {items[asta.itemId]?.imageUrl ? (
                        <img
                          src={`http://localhost:8080${items[asta.itemId].imageUrl
                            }`}
                          alt={asta.nomeItem}
                          className="max-w-full max-h-[250px] object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-gray-500 text-center">
                          Nessuna immagine disponibile
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlippedCardId(null);
                      }}
                      className="mt-4 w-full bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 "
                    >
                      Torna ai dettagli
                    </button>
                  </div>
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

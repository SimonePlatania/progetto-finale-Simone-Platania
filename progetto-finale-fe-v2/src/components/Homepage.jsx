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
    <div className="bg-gradient-to-br from-zinc-300/90 via-zinc-400/35 to-indigo-400/35 min-h-screen w-full overflow-x-hidden pb-24 rounded-lg">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Sistema Aste
            </h1>

            <div className="flex items-center space-x-4">
              <NotificationBell userId={user?.id} />
              {user?.ruolo === "GESTORE" && (
                <button
                  onClick={() => navigate("/items")}
                  className="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-purple-700 rounded-full backdrop-blur-sm border border-white/30 shadow-sm transition-all hover:shadow-lg"
                >
                  Archivio
                </button>
              )}

              {user?.ruolo === "PARTECIPANTE" && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate("/aste-partecipate")}
                    className="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-purple-700 rounded-full backdrop-blur-sm border border-white/30 shadow-sm transition-all hover:shadow-lg"
                  >
                    Partecipazioni
                  </button>
                  <button
                    onClick={() => navigate("/aste-vinte")}
                    className="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-green-700 rounded-full backdrop-blur-sm border border-white/30 shadow-sm transition-all hover:shadow-lg"
                  >
                    Aste Vinte
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-4 border-l border-white/30 pl-4">
                <div
                  className="text-center cursor-pointer group"
                  onClick={modificaProfilo}
                >
                  <div className="transform transition-all group-hover:scale-105">
                    <span className="block text-sm font-medium text-gray-700">{user?.username}</span>
                    <span className="block text-xs text-gray-500">
                      {user?.ruolo}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full backdrop-blur-sm border border-red-200 shadow-sm transition-all hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenuto Principale */}
      <main className="max-w-7xl mx-auto px-8 py-12 flex-grow">
        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
            {asteAttive.map((asta) => (
              <div
                key={asta.id}
                className={`flip-card ${flippedCardId === asta.id ? "flipped" : ""}`}
                onClick={() =>
                  setFlippedCardId(flippedCardId === asta.id ? null : asta.id)
                }
              >
                <div className="flip-card-inner">
                  {/* FRONT DELLA CARD */}
                  <div className="flip-card-front bg-white/60 backdrop-blur-md rounded-xl shadow-xl p-6 flex flex-col min-h-[400px] border border-white/50">
                    {/* HEADER CARD */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        {asta.nomeItem}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        <p>
                          ID Asta: {asta.id} • ID Item: {asta.itemId}
                        </p>
                      </div>
                    </div>

                    {/* Dettagli Principali */}
                    <div className="border-t border-b border-gray-100 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                        <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm">
                          <p className="text-md text-gray-600 pb-2">
                            Prezzo Base
                          </p>
                          <p className="font-medium text-lg">
                            €
                            {items[asta.itemId]?.prezzoBase?.toFixed(2) ||
                              "N/D"}
                          </p>
                        </div>
                        <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm">
                          <p className="text-md text-gray-600 pb-2">
                            Offerta
                          </p>
                          <p className="font-medium text-lg">
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
                      <div className="mt-4 text-center bg-white/50 p-3 rounded-xl backdrop-blur-sm">
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
                          className={`w-3/4 py-2.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg ${
                            asta.startNow
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                              : "bg-white/50 backdrop-blur-sm text-gray-700"
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
                          className="w-1/4 py-2.5 bg-white/50 hover:bg-white/70 rounded-xl backdrop-blur-sm transition-all shadow-md hover:shadow-lg"
                        >
                          <span role="img" aria-label="flip">
                            🖼️
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RETRO DELLA CARD */}
                  <div className="flip-card-back bg-white/60 backdrop-blur-md rounded-xl shadow-xl p-6 flex flex-col min-h-[400px] border border-white/50">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        {items[asta.itemId]?.nome || "Oggetto Sconosciuto"}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {items[asta.itemId]?.descrizione ||
                          "Descrizione non disponibile"}
                      </p>
                    </div>

                    <div className="flex-grow flex items-center justify-center bg-white/50 p-4 rounded-xl backdrop-blur-sm">
                      {items[asta.itemId]?.imageUrl ? (
                        <img
                          src={`http://localhost:8080${items[asta.itemId].imageUrl}`}
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

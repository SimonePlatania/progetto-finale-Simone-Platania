import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CountDownTimer from "./CountdownTimer";

function AstaDettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [asta, setAsta] = useState(null);
  const [item, setItem] = useState(null);
  const [offerte, setOfferte] = useState([]);
  const [importoOfferta, setImportoOfferta] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userResponse = await axios.get(
          "http://localhost:8080/api/utenti/me",
          {
            headers: { Authorization: sessionId },
          }
        );
        setUser(userResponse.data);

        const astaResponse = await axios.get(
          `http://localhost:8080/api/aste/${id}`,
          {
            headers: { Authorization: sessionId },
          }
        );
        setAsta(astaResponse.data);

        const itemResponse = await axios.get(
          `http://localhost:8080/api/items/${astaResponse.data.itemId}`,
          { headers: { Authorization: sessionId } }
        );
        setItem(itemResponse.data);

        const offerteResponse = await axios.get(
          `http://localhost:8080/api/aste/${id}/offerte`,
          {
            params: { userId: userResponse.data.id },
            headers: { Authorization: sessionId },
          }
        );
        setOfferte(offerteResponse.data);
      } catch (err) {
        console.error("Errore nel caricamento dei dati:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleOfferta = async (e) => {
    e.preventDefault();
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      navigate("/login");
      return;
    }

    if (!importoOfferta || importoOfferta.trim() === "") {
      setError("Inserisci un importo valido");
      return;
    }

    const numeroOfferta = parseFloat(importoOfferta);
    if (isNaN(numeroOfferta)) {
      setError("L'importo deve essere un numero valido");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/aste/${id}/offerte`,
        null,
        {
          params: {
            userId: user.id,
            importoOfferta: parseFloat(importoOfferta),
          },
          headers: { Authorization: sessionId },
        }
      );

      const [astaResponse, offerteResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/aste/${id}`, {
          headers: { Authorization: sessionId },
        }),
        axios.get(`http://localhost:8080/api/aste/${id}/offerte`, {
          params: { userId: user.id },
          headers: { Authorization: sessionId },
        }),
      ]);

      setAsta(astaResponse.data);
      setOfferte(offerteResponse.data);
      setImportoOfferta("");
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("sessionId");
        navigate("/login");
      } else if (err.response?.status === 400) {
        setError(err.response?.data || "Offerta non valida");
      } else {
        setError("Errore durante l'offerta. Riprova.");
      }
    }
  };

  const handleTerminaAsta = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/aste/${id}/termina`,
        null,
        {
          params: { gestoreId: user.id },
          headers: { Authorization: localStorage.getItem("sessionId") },
        }
      );

      setAsta((prevAsta) => ({
        ...prevAsta,
        isAttiva: false,
        stato: "TERMINATA",
      }));
    } catch (err) {
      setError("Errore durante la terminazione dell'asta");
    }
  };

  if (isLoading || !asta || !item) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (


    <div className="bg-gradient-to-br from-zinc-300/90 via-zinc-400/35 to-indigo-400/35 min-h-screen w-full overflow-x-hidden pb-24 rounded-lg">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a
                    className="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-green-700 rounded-full backdrop-blur-sm border border-white/30 shadow-sm transition-all hover:shadow-lg cursor-pointer"
                    onClick={() => window.history.back()}
            >
              ← Torna indietro
            </a>

            <p className=" text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-center cursor-pointer "
      onClick={() => navigate ("/homepage") }>
              Sistema Aste
            </p>


            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold">
              Ciao, {user?.username}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/50">
          {/* Notifica Asta Terminata */}
          {asta.stato === "TERMINATA" && (
            <div className="bg-emerald-50/80 border-l-4 border-emerald-500 p-5 mb-8 rounded-lg backdrop-blur-sm">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-emerald-600 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-emerald-800 font-semibold">Asta Terminata</p>
              </div>

              {user.ruolo === "GESTORE" && asta.usernameOfferente && (
                <p className="mt-2 text-emerald-700">
                  Aggiudicata a: {asta.usernameOfferente}, per{" "}
                  <span className="text-xl font-bold">
                    €{asta.offertaCorrente?.toFixed(2)}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Intestazione */}
          <div className="border-b border-gray-200/50 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {asta.nomeItem}
            </h2>
            <p className="text-gray-600 mt-2">{item.descrizione}</p>
          </div>

          <div className="mb-6 flex justify-center">
  {item.imageUrl ? (
    <div>
      <div
        className="relative w-48 h-48 overflow-hidden rounded-lg shadow-lg cursor-pointer"
        onClick={() => setIsImageZoomed(true)}
      >
        <img
          src={`http://localhost:8080${item.imageUrl}`}
          alt={asta.nomeItem}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {isImageZoomed && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 rounded-xl">
        <div className="relative">
          <img
            src={`http://localhost:8080${item.imageUrl}`}
            alt={asta.nomeItem}
            className="max-h-full max-w-full rounded-lg transform transition-all duration-1000 ease-in-out scale-75 hover:scale-95"
            />
          <button
        className="absolute bottom-4 right-4 p-2 bg-white text-purple-600 text-xl font-bold rounded-full opacity-70 hover:opacity-100 focus:outline-none transform transition-all duration-300 ease-in-out"
        onClick={() => setIsImageZoomed(false)}
          >
            &times;
          </button>
        </div>
      </div>
      )}
    </div>
  ) : (
    <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm text-center">
      Nessuna immagine disponibile
    </div>
  )}
</div>

          {/* Info Principali */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-gray-600 text-sm font-medium">Prezzo Base</p>
              <p className="text-xl font-semibold mt-1">
                €{item.prezzoBase?.toFixed(2)}
              </p>
            </div>

            <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-gray-600 text-sm font-medium">Rilancio Minimo</p>
              <p className="text-xl font-semibold mt-1">
                €{item.rilancioMinimo?.toFixed(2)}
              </p>
            </div>

            <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-gray-600 text-sm font-medium">
                Offerta Corrente
              </p>
              <p className="text-xl font-semibold mt-1">
                {asta.offertaCorrente
                  ? `€${asta.offertaCorrente.toFixed(2)}`
                  : "Nessuna offerta"}
              </p>
            </div>

            <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm text-center">
  <p className="text-gray-600 text-sm font-medium">
    Tempo rimanente
  </p>
  <div className="mt-2 flex justify-center items-center">
    <CountDownTimer targetDate={asta.dataFine} />
  </div>
</div>
          </div>

          {/* Controlli Gestore */}
          {user.ruolo === "GESTORE" && asta.isAttiva && (
            <div className="mb-6">
              <button
                onClick={handleTerminaAsta}
                className="w-full py-2.5 bg-red-500/90 hover:bg-red-600/90 text-white rounded-xl transition-all shadow-md hover:shadow-lg backdrop-blur-sm"
              >
                Termina Asta
              </button>
            </div>
          )}

          {/* Form Offerta per Partecipanti */}
          {user.ruolo === "PARTECIPANTE" && 
           asta.isAttiva && 
           asta.stato !== "TERMINATA" && (
            <form onSubmit={handleOfferta} className="mb-6">
              <div className="flex gap-4">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={importoOfferta}
                  onChange={(e) => setImportoOfferta(e.target.value)}
                  placeholder="Inserisci la tua offerta"
                  className="flex-1 p-2.5 rounded-xl bg-white/50 border border-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Fai Offerta
                </button>
              </div>
              {error && (
                <p className="mt-2 text-red-600 bg-red-50/50 backdrop-blur-sm p-2 rounded-lg">
                  {error}
                </p>
              )}
            </form>
          )}

          {/* Messaggio Asta Terminata per Partecipanti */}
          {asta.stato === "TERMINATA" && user.ruolo === "PARTECIPANTE" && (
            <div className="bg-white/50 p-4 rounded-xl backdrop-blur-sm mb-6 text-center">
              <p className="text-gray-700">
                Questa asta è terminata. Non sono più consentite offerte.
              </p>
              {asta.offertaCorrenteId === user.id ? (
                <p className="text-emerald-600 font-semibold mt-2">
                  Congratulazioni! Hai vinto questa asta con un'offerta di €
                  {asta.offertaCorrente.toFixed(2)}
                </p>
              ) : (
                <p className="text-gray-600 mt-2">
                  {asta.offertaCorrente
                    ? `L'asta è stata aggiudicata per €${asta.offertaCorrente.toFixed(2)}`
                    : "L'asta è terminata senza offerte"}
                </p>
              )}
            </div>
          )}

          {/* Storico Offerte */}
          <div className="border-t border-gray-200/50 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Storico Offerte
            </h3>
            <div className="space-y-2">
              {offerte.map((offerta) => (
                <div
                  key={offerta.id}
                  className="bg-white/50 p-4 rounded-xl backdrop-blur-sm flex justify-between items-center"
                >
                  <div>
                    {user.ruolo === "PARTECIPANTE" ? (
                      <span
                        className={`font-medium ${
                          offerta.currentUserOfferta
                            ? "text-purple-600"
                            : "text-gray-600"
                        }`}
                      >
                        {offerta.currentUserOfferta ? "Tu hai offerto" : "Qualcuno ha offerto"}:{" "}
                        €{offerta.importo?.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-700">
                        <span className="font-medium">{offerta.usernameOfferente}</span> ha offerto:{" "}
                        <span className="font-semibold">€{offerta.importo?.toFixed(2)}</span>
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(offerta.dataOfferta).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AstaDettaglio;

// AstaDettaglio.jsx corretto
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CountDownTimer from "./CountdownTimer";
import 'bootstrap/dist/css/bootstrap.css'


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

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true); //Problemi con il caricamento dell'utente 06/01/2025 Simone
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
        console.log("Dati offerte ricevuti:", {
          offerte: offerteResponse.data,
          primaOfferta: offerteResponse.data[0],
          // Verifichiamo la presenza della proprietà
          isCurrentUserOfferta: offerteResponse.data[0]?.isCurrentUserOfferta,
        });
        setOfferte(offerteResponse.data);

        if (astaResponse.data.stato === "TERMINATA") {
          setItem(itemResponse.data);
        }
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

  if (isLoading || !user || !asta || !item) {
    return (

      <div className="spinner-border" role="status">
        <span className="sr-only">Caricamento...</span>
      </div>
    );
  }

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
      await axios.post(`http://localhost:8080/api/aste/${id}/offerte`, null, {
        params: {
          userId: user.id,
          importoOfferta: parseFloat(importoOfferta),
        },
        headers: { Authorization: sessionId },
      });

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
        try {
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
        } catch (refreshErr) {
          console.error("Errore nel refresh dei dati:", refreshErr);
        }
      }
    }
  };

  const handleTerminaAsta = async (astaId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/aste/${astaId}/termina`,
        null,
        {
          params: {
            gestoreId: user.id,
          },
          headers: {
            Authorization: localStorage.getItem("sessionId"),
          },
        }
      );

      setAsta((prevAsta) => ({
        ...prevAsta,
        isAttiva: false,
        stato: "TERMINATA",
        dataFine: new Date(asta.dataFine).toLocaleString(),
      }));
    } catch (err) {
      setError("Errore durante la terminazione dell'asta");
      console.error("Errore durante la terminazione", err.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 rounded-md">
      {/* HEADER */}
      <header className="bg-white shadow rounded-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* <button
            onClick={() => navigate("/homepage")}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Torna alla lista
          </button> */}
          <a className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate("/homepage")}>
            ← Torna alla lista
          </a>
          <div className="flex items-center gap-2">
            <span>Benvenuto, {user.username}</span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* SE L'ASTA E' AGGIUDICATA */}
          {asta.stato === "TERMINATA" && (
            <div className="bg-green-100 border-l-4 border-green-500 p-5 mb-8 text-center rounded-md shadow-inner">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-green-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3 3 0 00-2.234.334.75.75 0 00-.427.7v7.5a.75.75 0 00.376.648 3 3 0 001.302.355c.423 0 .831-.08 1.212-.232l4.53-1.882a2.5 2.5 0 001.412-2.26v-3.17a.75.75 0 00-.376-.648 3 3 0 00-2.192-.391L6.267 3.455z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-green-800 font-semibold">Asta Terminata</p>
              </div>

              {user.ruolo === "GESTORE" && asta.usernameOfferente && (
                <p className="mt-2 text-green-700">
                  Aggiudicata a: {asta.usernameOfferente}, per{" "}
                  <p className="text-xl font-bold italic">
                    € {asta.offertaCorrente?.toFixed(2)}
                  </p>
                </p>
              )}
            </div>
          )}

          {/* INTESTAZIONE */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {asta.nomeItem}
            </h2>
            <p className="text-gray-600 mt-2 leading-relaxed">
              {item.descrizione}
            </p>
          </div>

          {/* INFO PRINCIPALI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm font-medium">Prezzo Base</p>
              <p className="text-xl font-semibold mt-1">
                €{item.prezzoBase?.toFixed(2)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm font-medium">
                Rilancio Minimo
              </p>
              <p className="text-xl font-semibold mt-1">
                €{item.rilancioMinimo?.toFixed(2)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm font-medium">
                Offerta Corrente
              </p>
              <p className="text-xl font-semibold mt-1">
                {asta.offertaCorrente
                  ? `€${asta.offertaCorrente.toFixed(2)}`
                  : "Nessuna offerta"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm font-medium text-center">
                Tempo rimanente
              </p>
              <div className="mt-1 py-2 px-2">
                <CountDownTimer targetDate={asta.dataFine} />
              </div>
            </div>
          </div>

          {/* INFORMAZIONE DELL'ASTA */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-600">
                Stato:{" "}
                <span
                  className={`font-medium ${asta.isAttiva ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {asta.stato || (asta.isAttiva ? "ATTIVA" : "TERMINATA")}
                </span>
              </p>
              <p className="text-gray-600">
                Scadenza: {new Date(asta.dataFine).toLocaleString()}
              </p>
            </div>

            {user.ruolo === "GESTORE" && asta.isAttiva && (
              <button
                onClick={() => handleTerminaAsta(asta.id)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Termina Asta
              </button>
            )}
          </div>

          {/* MIGLIOR OFFERENTE (GESTORI) */}
          {user.ruolo === "GESTORE" && asta.usernameOfferente && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2">Miglior Offerente</h3>
              <p className="text-xl">{asta.usernameOfferente}</p>
            </div>
          )}

          {/* FORM OFFERTA (PARTECIPANTI) */}
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
                    className="flex-1 border rounded-lg p-2 bg-gray-50"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Fai Offerta
                  </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </form>
            )}

          {asta.stato === "TERMINATA" && user.ruolo === "PARTECIPANTE" && (
            <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
              <p className="text-gray-700 font-medium">
                Questa asta è terminata. Non sono più consentite offerte.
              </p>

              {/* SE L'UTENTE HA VINTO */}
              {asta.offertaCorrenteId === user.id ? (
                <p className="text-green-600 font-semibold mt-2">
                  Congratulazioni! Hai vinto questa asta con un'offerta di €
                  {asta.offertaCorrente.toFixed(2)}
                </p>
              ) : (
                <p className="text-gray-600 mt-2">
                  {asta.offertaCorrente
                    ? `L'asta è stata aggiudicata per €${asta.offertaCorrente.toFixed(
                      2
                    )}`
                    : "L'asta è terminata senza offerte"}
                </p>
              )}
            </div>
          )}

          {/* STORICO OFFERTE */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Storico Offerte</h3>
            <div className="space-y-2">
              {offerte.map((offerta) => (
                <div
                  key={offerta.id}
                  className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    {offerta.currentUserOfferta &&
                      user.ruolo === "PARTECIPANTE" && (
                        <span className="text-sky-700 font-medium flex items-center shadow-md">
                          Tu hai offerto: €{offerta.importo?.toFixed(2)}
                        </span>
                      )}
                    {user.ruolo === "PARTECIPANTE" &&
                      !offerta.currentUserOfferta && (
                        <span className="text-red-700 font-medium flex items-center shadow-md">
                          Qualcuno ha offerto: €{offerta.importo?.toFixed(2)}
                        </span>
                      )}
                    {user.ruolo === "GESTORE" && (
                      <span className="ml-2 text-indigo-600 font-medium shadow-indigo-900">
                        {offerta.usernameOfferente} ha offerto:
                        <span className="ml-2 text-gray-900 italic shadow-inner">
                          €{offerta.importo?.toFixed(2)}
                        </span>
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

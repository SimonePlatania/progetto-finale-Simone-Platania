import { useState } from "react";
import '../css/AstaCard.css';
import axios from "axios";

function AstaCard({user, asta, onTermina, onOfferta}) {
    console.log("Dati asta ricevuti in AstaCard:", asta); //Non vedo il nome dell'oggetto

    const [error, setError] = useState ("");
    const [importoOfferta, setImportoOfferta] = useState ("");

    const [offerte, setOfferte] = useState([]);
    const [mostraOfferte, setMostraOfferte] = useState(false);
    const [loadingOfferte, setLoadingOfferte] = useState(false);
    const [errorOfferte, setErrorOfferte] = useState("");

    const caricaOfferte = async () => {
        try {
            setLoadingOfferte(true);
            setErrorOfferte('');
            const response = await axios.get("http://localhost:8080/api/aste/${asta.id}/offerte", {
                params: {userId : user.id}
            })

            const offerteOrdinate = response.data.sort((a, b) => 
            new Date(b.dataOfferta) - new Date(a.dataOfferta)
        );

        setOfferte(offerteOrdinate);

        } catch (err) {
            setErrorOfferte("Errore nel caricamento delle offerte");
            console.error("Errore nel caricamento delle offerte", err);
        } finally {
            setLoadingOfferte(false);
        }
    };



    const handleSubmitOfferta = async (e) => {
        e.preventDefault();
        setError('');

        const importo = parseFloat(importoOfferta);
        if (isNaN(importo)) {
            setError("Inserisci un importo valida")
            return;
        }

        if (importo <= asta.offertaCorrente) {
            setError("L'offerta deve essere maggiore dell'offerta corrente");
            return;
        }

        try {
            await onOfferta(asta.id, user.id, importo);
            setImportoOfferta('');
        } catch (err) {
            setError(err.response?.data || "Errore durante l'offerta");
        }
    };

    const formatDataFine = (data) => {
        return new Date(data).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDataOfferta = (data) => {
        return new Date(data).toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };


    return (
        <div className="asta-card">
            <div className="asta-header">
                <div className="asta-titolo">
                    <h3>{asta.nomeItem || "Nome non disponibile"}</h3>
                    <p className="asta-id">ID Asta: {asta.id}</p>
                    <p className="asta-item-id">ID Item: {asta.itemId}</p>
                </div>
                <span className="asta-tempo">Termina: {formatDataFine(asta.dataFine)}</span>
            </div>

            <div className="asta-info">
                <p>
                    Offerta corrente : €{Number(asta.offertaCorrente || 0).toFixed(2)}
                </p>
                <p className="asta-bidder">
                    {user.ruolo === "GESTORE"
                    ? `Offerta di: ${asta.usernameOfferente || "Nessuna offerta"}`
                    : asta.offertaCorrenteId
                    ? `ID Offerente: ${asta.offertaCorrenteId}`
                    : "Nessuna offerta"
                    }
                </p>
            </div>

            {user.ruolo === "PARTECIPANTE" && asta.isAttiva && (
                <form onSubmit={handleSubmitOfferta} className="asta-form">
                    <div>
                        <input
                            type = "number"
                            step="0.01"
                            value= {importoOfferta}
                            onChange={(e) => setImportoOfferta(e.target.value)}
                            placeholder="Inserisci offerta"
                            className="offerta-input"
                        />
                        <button
                            type ="submit"
                            className="bottone-offerta">
                                Offri
                            </button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                </form>
            )}

                <button 
                 onClick={() => setMostraOfferte(!mostraOfferte)}
                 className="toggle-offerte-button"
                 >
                {mostraOfferte ? 'Nascondi Offerte' : `Mostra Offerte ${offerte.length ? `(${offerte.length})` : ''}`}
                </button>

                {mostraOfferte && (
                <div className="offerte-section">
                    {loadingOfferte ? (
                        <div className="loading">Caricamento offerte...</div>
                    ) : errorOfferte ? (
                        <div className="error">{errorOfferte}</div>
                    ) : offerte.length === 0 ? (
                        <p className="no-offerte">Nessuna offerta per questa asta</p>
                    ) : (
                        <div className="offerte-list">
                            {offerte.map((offerta) => (
                                <div key={offerta.id} className="offerta-item">
                                    <div className="offerta-details">
                                        <span className="offerta-importo">
                                            €{Number(offerta.importo).toFixed(2)}
                                        </span>
                                        {user.ruolo === 'GESTORE' ? (
                                            <span className="offerta-utente">
                                                Offerta di: {offerta.usernameOfferente}
                                            </span>
                                        ) : (
                                            <span className="offerta-utente">
                                                ID Utente: {offerta.utenteId}
                                            </span>
                                        )}
                                        <span className="offerta-data">
                                            {formatDataOfferta(offerta.dataOfferta)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {user.ruolo === "GESTORE" && asta.isAttiva && (
                <button
                    onClick={() => onTermina(asta.id)}
                    className="termina-asta"
                >
                    Termina asta
                </button>
            )}

            {!asta.isAttiva && (
                <p className="asta-closed">Asta terminata</p>
            )}
        </div>
    );
}

export default AstaCard
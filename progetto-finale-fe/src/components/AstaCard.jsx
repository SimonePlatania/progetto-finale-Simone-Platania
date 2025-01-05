import { useState, useEffect } from "react";
import '../css/AstaCard.css';
import axios from "axios";
import AstaCountdown from "./AstaCountdown";

function AstaCard({user, asta, onTermina, onOfferta}) {
    console.log("Dati asta ricevuti in AstaCard:", asta); //Non vedo il nome dell'oggetto

    const [error, setError] = useState ("");
    const [importoOfferta, setImportoOfferta] = useState ("");
    const [itemDetails, setItemDetails] = useState(null);
    const [offerte, setOfferte] = useState([]);
    const [mostraOfferte, setMostraOfferte] = useState(false);
    const [loadingOfferte, setLoadingOfferte] = useState(false);
    const [errorOfferte, setErrorOfferte] = useState("");

    const caricaOfferte = async () => {
        try {
            setLoadingOfferte(true);
            setErrorOfferte('');
            console.log("Caricamento offerte per asta:", asta.id);
            const response = await axios.get(`http://localhost:8080/api/aste/${asta.id}/offerte`, {
                params: { userId: user.id }
            });
            console.log("Risposta offerte:", response.data);
            
            const offerteOrdinate = response.data.sort((a, b) => 
                new Date(b.dataOfferta) - new Date(a.dataOfferta)
            );
    
            setOfferte(offerteOrdinate);
        } catch (err) {
            console.error("Errore dettagliato:", err.response || err);
            setErrorOfferte("Errore nel caricamento delle offerte");
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

        const offertaCorrente = asta.offertaCorrente != null ? Number(asta.offertaCorrente) : 0;
        const rilancioMinimo = asta.rilancioMinimo != null ? Number(asta.rilancioMinimo) : 0;
        const prezzoBase = asta.prezzoBase != null ? Number(asta.prezzoBase) : 0;
    
        const offertaMinima = offertaCorrente > 0 
            ? offertaCorrente + rilancioMinimo 
            : prezzoBase;
    
        if (importo < offertaMinima) {
            setError(`L'offerta deve essere almeno €${offertaMinima.toFixed(2)}`);
            return;
        }
    
        try {
            await onOfferta(asta.id, user.id, importo);
            setImportoOfferta('');
        } catch (err) {
            setError(err.response?.data || "Errore durante l'offerta");
        }
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

    const handleTerminaAsta = () => {
        if (window.confirm('Sei sicuro di voler terminare questa asta?')) {
            onTermina(asta.id);
        }
    };

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/items/${asta.itemId}`);
                setItemDetails(response.data);
            } catch (err) {
                console.error("Errore nel recupero dei dettagli dell'item:", err);
            }
        };
    
        if (asta.itemId) {
            fetchItemDetails();
        }
    }, [asta.itemId]);

    const handleToggleOfferte = () => {
        if (!mostraOfferte) {
            caricaOfferte();
        }
        setMostraOfferte(!mostraOfferte);
    };


    return (
        <div className="asta-card">
            <div className="asta-header">
                <div className="asta-titolo">
                    <h3>{asta.nomeItem || "Nome non disponibile"}</h3>
                    <p className="asta-id">ID Asta: {asta.id}</p>
                    <p className="asta-item-id">ID Item: {asta.itemId}</p>
                </div>
                <AstaCountdown dataFine={asta.dataFine}/>
            </div>

            <div className="asta-info">
            <div className="item-details">
        <p className="item-descrizione">
            {itemDetails?.descrizione || "Descrizione non disponibile"}
        </p>
    </div>
            <div className="prezzi-grid">
    <div className="prezzo-box">
        <span className="label">Prezzo Base</span>
        <span className="value">
            €{itemDetails?.prezzoBase.toFixed(2) || '0.00'}
        </span>
    </div>
    <div className="prezzo-box">
        <span className="label">Rilancio Minimo</span>
        <span className="value">
            €{itemDetails?.rilancioMinimo.toFixed(2) || '0.00'}
        </span>
    </div>
</div>
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
    type="number"
    step="0.01"
    value={importoOfferta}
    onChange={(e) => setImportoOfferta(e.target.value)}
    placeholder={`Minimo: €${((() => {
        const offertaCorrente = asta.offertaCorrente != null ? Number(asta.offertaCorrente) : 0;
        const rilancioMinimo = asta.rilancioMinimo != null ? Number(asta.rilancioMinimo) : 0;
        const prezzoBase = asta.prezzoBase != null ? Number(asta.prezzoBase) : 0;
        return offertaCorrente > 0 
            ? offertaCorrente + rilancioMinimo 
            : prezzoBase;
    })()).toFixed(2)}`}
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
                 onClick={handleToggleOfferte}
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
                                            € {Number(offerta.importo).toFixed(2)}
                                        </span>
                                        {user.ruolo === 'GESTORE' ? (
                                            <span className="offerta-utente">
                                                 , offerta di: {offerta.usernameOfferente}
                                            </span>
                                        ) : (
                                            <span className="offerta-utente">
                                                ID Utente: {offerta.utenteId}
                                            </span>
                                        )}
                                        <span className="offerta-data">
                                            , {formatDataOfferta(offerta.dataOfferta)}
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
                    value={handleTerminaAsta}
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
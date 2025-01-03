import { useEffect, useState } from "react";

function ListaOfferte ({astaId, user}) {
    const [offerte, setOfferte] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOfferte = async () => {
            try {
                setLoading(true);

                const response = await axios.get("http://localhost:8080/api/aste/${astaId}/offerte", {
                    params: { userId: user.id }
                });

                const offerteOrdinate = response.data.sort((a,b) =>
                new Date(b.dataOfferta) - new Date(a.dataOfferta)
            );

            setOfferte(offerteOrdinate);
            
            
        } catch (err) {
            setError("Errore nel caricamento delle offerte");
            console.error("Errore nel caricamento delle offerte", err);
        } finally {
            setLoading(false);
        }
    }
            if (astaId) {
                fetchOfferte();
            }
        }, [astaId, user.id]);


        const formatDataOfferta = (data) => {
            return new Date(data).toLocaleString('it-IT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        if (loading) {
            return <div className="loading">Caricamento offerte...</div>;
        }

        if (error) {
            
            return <div className="error">{error}</div>
            
        }

    return (
        <div className="container-lista-offerte">
            <h3>Storico offerte</h3>

            {offerte.length === 0 ? (
                <p className="no-offerte">Nessuna offerta per questa asta</p>
            ) : (
                <div className="lista-offerte">
                    {offerte.map((offerta) => (
                        <div key = {offerta.id} className="offerta-item">
                            <div className="dettagli-offerta">
                                <span className="offerta-importo">
                                 €{Number(offerta.importo).toFixed(2)}
                                </span>

                                {user.ruolo === "GESTORE" ? (
                                    <span className="offerta-utente">
                                        Offerta di : {offerta.usernameOfferente}
                                    </span>
                                ) : (
                                    <span className="offerta-utente">
                                        ID Utente: {offerta.utenteId}
                                    </span>                               
                                )}

                                <span className="offerta data">
                                    {formatDataOfferta(offerta.dataOfferta)}
                                </span>
                            </div>

                        </div>
                    ))}

                </div>

            )}

        </div>
    )

}

export default ListaOfferte;
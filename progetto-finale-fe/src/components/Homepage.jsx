import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import AstaCard from './AstaCard';
import TabNavigation from './TabNavigation';

function Homepage() {
    // Gestione dello stato dell'applicazione
    const [asteAttive, setAsteAttive] = useState([]);
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [tabAttiva, setTabAttive] = useState("aste");
    const navigate = useNavigate();

    // Verifica della sessione utente all'avvio
    useEffect(() => {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            axios.defaults.headers.common['Authorization'] = sessionId;
        }
        
        const checkSession = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/utenti/me", {
                    withCredentials: true,
                    headers: {
                        'Authorization': sessionId
                    }
                });
                setUser(response.data);
                console.log("Utente caricato:", response.data);
            } catch (err) {
                console.error("Sessione non valida", err);
                navigate("/login");
            }
        };

        checkSession();
    }, [navigate]);

    // Caricamento dati (aste e items) in base al ruolo utente
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const asteResponse = await axios.get("http://localhost:8080/api/aste/attive", {
                    withCredentials: true
                });
                setAsteAttive(asteResponse.data);

                if (user.ruolo === "GESTORE") {
                    const itemsResponse = await axios.get(`http://localhost:8080/api/items/gestore/${user.id}`, {
                        withCredentials: true
                    });
                    setItems(itemsResponse.data);
                } else {
                    const itemsResponse = await axios.get("http://localhost:8080/api/items", {
                        withCredentials: true
                    });
                    setItems(itemsResponse.data);
                }
            } catch (err) {
                setError("Errore nel caricamento dei dati");
                console.error("Errore durante il recupero dei dati", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('sessionId');
        setUser(null);
        navigate("/login");
    };

    const handleOfferta = async (astaId, userId, importoOfferta) => {
        try {
            await axios.post(`http://localhost:8080/api/aste/${astaId}/offerte`, null, {
                params: {
                    userId: userId,
                    importoOfferta: importoOfferta
                }
            });
    
            const response = await axios.get('http://localhost:8080/api/aste/attive');
            setAsteAttive(response.data);
        } catch (err) {
            console.error("Dettaglio errore:", err.response?.data);
            throw err;
        }
    };

    const handleTerminaAsta = async (astaId) => {
        try {
            await axios.post(`http://localhost:8080/api/aste/${astaId}/termina`);
            const response = await axios.get('http://localhost:8080/api/aste/attive');
            setAsteAttive(response.data);
        } catch (err) {
            setError("Errore durante la terminazione dell'asta");
            console.error("Errore durante la terminazione", err);
        }
    };

    const renderContent = () => {
        if (loading) return <div>Caricamento in corso...</div>;
        if (error) return <div className="error">{error}</div>;
    
        switch(tabAttiva) {
            case "aste":
                return (
                    <div className="aste-grid">
                        {asteAttive.length === 0 ? (
                            <p>Nessuna asta attiva al momento</p>
                        ) : (
                            asteAttive.map(asta => (
                                <AstaCard
                                    key={asta.id}
                                    asta={asta}
                                    user={user}
                                    onOfferta={handleOfferta}
                                    onTermina={handleTerminaAsta}
                                />
                            ))
                        )}
                    </div>
                );
            case "items":
                if (user?.ruolo !== "GESTORE") return null;
                return (
                    <div className="items-grid">
                        {items.length === 0 ? (
                            <p>Nessun item disponibile</p>
                        ) : (
                            items.map(item => (
                                <div key={item.id} className="item-card">
                                    <h3>{item.nome}</h3>
                                    <p>{item.descrizione}</p>
                                    <p>Prezzo Base: €{item.prezzoBase}</p>
                                    <p>Rilancio Minimo: €{item.rilancioMinimo}</p>
                                    {!item.inAsta && (
                                        <button onClick={() => handleCreaAsta(item.id)}>
                                            Crea Asta
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    const handleCreaAsta = async (itemId) => {
        try {
            const dataFine = new Date();
            dataFine.setDate(dataFine.getDate());
            
            await axios.post(`http://localhost:8080/api/aste`, {
                itemId: itemId,
                dataFine: dataFine.toISOString(), 
                startNow: true
            }, {
                params: {
                    gestoreId: user.id  
                }
            });
    
            const [asteResponse, itemsResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/aste/attive'),
                axios.get(`http://localhost:8080/api/items/gestore/${user.id}`)
            ]);
    
            setAsteAttive(asteResponse.data);
            setItems(itemsResponse.data);
        } catch (err) {
            console.error('Errore dettagliato:', err.response?.data);  
            setError('Errore durante la creazione dell\'asta');
        }
    };

    return (
        <div className="homepage">
            <header>
                <h2>Dashboard Aste</h2>
                <div className="user-section">
                    <span>Benvenuto, {user?.username || ''}</span>
                    <button onClick={handleLogout} className="btn reset">
                        Logout
                    </button>
                </div>
            </header>

            <TabNavigation 
                tabAttiva={tabAttiva}
                setTabAttive={setTabAttive}
                ruolo={user?.ruolo}
            />

            <main className="content">
                {renderContent()}
            </main>
        </div>
    );
}

export default Homepage;
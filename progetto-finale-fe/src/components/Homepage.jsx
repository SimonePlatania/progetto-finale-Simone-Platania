import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import AstaCard from './AstaCard';
import TabNavigation from './TabNavigation';
import CreateItem from "./CreateItem";
import ItemCard from "./ItemCard";

function Homepage() {
    const [asteAttive, setAsteAttive] = useState([]);
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [tabAttiva, setTabAttive] = useState("aste");
    const navigate = useNavigate();

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
            await axios.post(
                `http://localhost:8080/api/aste/${astaId}/termina`,
                null, 
                {
                    params: {
                        gestoreId: user.id 
                    },
                    headers: {
                        'Authorization': localStorage.getItem('sessionId')
                    }
                }
            );
            
            const response = await axios.get('http://localhost:8080/api/aste/attive');
            setAsteAttive(response.data);
        } catch (err) {
            setError("Errore durante la terminazione dell'asta");
            console.error("Errore durante la terminazione:", err.response?.data);
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
                        <div className="items-section">
                            <CreateItem 
                                user={user}
                                onItemCreated={(newItem) => {
                                    setItems(prev => [...prev, newItem]);
                                }}
                            />
                            <div className="items-list">
                                {items.length === 0 ? (
                                    <p>Nessun oggetto disponibile</p>
                                ) : (
                                    items.map(item => (
                                        <ItemCard
                                            key={item.id}
                                            item={item}
                                            user={user}
                                            onDelete={(itemId) => {
                                                setItems(prev => prev.filter(i => i.id !== itemId));
                                            }}
                                            onUpdate={(updatedItem) => {
                                                setItems(prev => prev.map(i => 
                                                    i.id === updatedItem.id ? updatedItem : i
                                                ));
                                            }}
                                            onCreaAsta={handleCreaAsta}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    );
            
        default:
            return null;
    }
};

const handleCreaAsta = async (itemId) => {
    try {
        const dataFine = new Date();
        dataFine.setHours(dataFine.getHours() + 24);

        const response = await axios.post(
            'http://localhost:8080/api/aste',
            {
                itemId: itemId,
                dataFine: dataFine.toISOString(),
                startNow: true
            },
            {
                params: { gestoreId: user.id },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('sessionId')
                }
            }
        );

        if (response.status === 200) {
            const [asteResponse, itemsResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/aste/attive', {
                    headers: { 'Authorization': localStorage.getItem('sessionId') }
                }),
                axios.get(`http://localhost:8080/api/items/gestore/${user.id}`, {
                    headers: { 'Authorization': localStorage.getItem('sessionId') }
                })
            ]);

            setAsteAttive(asteResponse.data);
            setItems(itemsResponse.data);
            setError('');
        }
    } catch (err) {
        console.error('Errore durante la creazione dell\'asta:', err);
        setError(err.response?.data || 'Errore durante la creazione dell\'asta');
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
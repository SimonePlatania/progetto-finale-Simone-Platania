import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Homepage () {

    const [asteAttive, setAsteAttive] = useState([]);
    const [items, setItems] = useState([]);
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null)
    const navigate = useNavigate();


    const [tabAttiva, setTabAttive] = useState("aste");

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
                navigate("/login")
            }
        };

        checkSession();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return; //Questo mi serve a non fare chiamate se non ci sono utenti
            setLoading(true);
            try {
                const asteResponse = await axios.get("http://localhost:8080/api/aste/attive", {
                    withCredentials: true
                });
                setAsteAttive(asteResponse.date);

                if (user?.ruolo === "GESTORE") {
                    const gestoreId = user.id;

                    const itemsResponse = await axios.get(`http://localhost:8080/api/items/gestore/${gestoreId}`, {
                    withCredentials: true
                    });

                    setItems(itemsResponse.data);
                } else  {
                    const itemsResponse = await axios.get("http://localhost:8080/api/items", {
                        withCredentials: true
                    });
                    setItems(itemsResponse.data);
                }
            } catch (err) {
                setError("Errore nel caricamento dei dati")
                console.error("Errore durante il recupero dei dati", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleLogout = () => {
        setUser(null);
        navigate("/login");
    }

    const handleOfferta = async (astaId, importoOfferta) => {
        try {
            await axios.post(`http://localhost:8080/api/aste/${astaId}/offerte`, {
                userId: user.id,
                importoOfferta: importoOfferta

            
            });

            const response = await axios.get('http://localhost:8080/api/aste/attive');
            setAsteAttive(response.data);
        } catch(err) {
            setError("Errore durante l'offerta");
            console.error("Errore durante l'offerta", err);
        }
    };

    const handleTerminaAsta = async(astaId) => {
        try {
            await axios.get(`http://localhost:8080/api/aste/${astaId}/termina`);

            const response = await axios.get('http://localhost:8080/api/aste/attive');
            setAsteAttive(response.data);

            } catch (err) {
                setError("Errore durante la terminazione dell'asta")
                console.error("Errore durate la terminazione", err);
            }
        };

        const handleCreaAsta = async (itemId, dataFine) => {
            try {
                await axios.post ('http://localhost:8080/api/aste', {
                    itemId: itemId,
                    dataFine: dataFine,
                    startNow: true
                })

                const response = await axios.get('http://localhost:8080/api/aste/attive');
                setAsteAttive(response.data);
            } catch (err) {
                setError("Errore durante la creazione dell'asta");
                console.error("Errore durante la creazione", err);
            }
        };

    return (
    
        <>
            <div>
                <div>
                    <h2>Dashboard aste</h2>
                    <div>
                    <span>Benvenuto, {user?.username || ''}</span>
                        <button
                            onClick={handleLogout}
                            className="btn reset"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Homepage;

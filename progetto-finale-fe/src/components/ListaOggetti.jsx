import React, { useState } from 'react';
import CreateItem from './CreateItem';  
import CreateAstaForm from './CreateAstaForm';
import axios from 'axios';
import '../css/ListaOggetti.css';  

function ListaOggetti({ items, user, onCreaAsta, onUpdateItems }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAstaForm, setShowAstaForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleCreaAstaClick = (item) => {
        setSelectedItem(item);
        setShowAstaForm(true);
    };

    const handleItemCreated = (newItem) => {
        if (onCreaAsta) {
            onCreaAsta(newItem);
        }
    };

    const handleAstaSubmit = async (astaData) => {
        try {
            setLoading(true);
            
            const requestData = {
                itemId: astaData.itemId,
                dataInizio: astaData.startNow ? null : astaData.dataInizio,
                dataFine: astaData.dataFine,
                startNow: astaData.startNow,
                prezzoIniziale: astaData.prezzoIniziale
            };

            const response = await axios.post(
                'http://localhost:8080/api/aste',
                requestData,
                {
                    params: { gestoreId: user.id },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('sessionId')
                    }
                }
            );

            if (response.status === 200) {
                setShowAstaForm(false);
                setSelectedItem(null);
                
                if (onCreaAsta) {
                    onCreaAsta(selectedItem.id);
                }

                if  (onUpdateItems) {
                    const updatedItems = items.map(item => 
                        item.id === selectedItem.id
                        ? { ...item, inAsta: true}
                        : item
                    );
                    onUpdateItems(updatedItems);
                }
                
                setError('');
            }
        } catch (err) {
            const errorMessage = err.response?.data || 'Errore durante la creazione dell\'asta'
            console.error('Errore durante la creazione dell\'asta:', err);
            setError(errorMessage);

            if (err.response?.status === 400) {
                setError(`Errore nella creazione dell'asta: ${errorMessage}`);
            }
            
        } finally {
            setLoading(false);
        }
        
    };

    return (
        <div className="lista-oggetti-container">
            {error && (
                <div className="error-message">{error}
                    <button onClick={() => setError("")} className='close-error'>×</button>
                </div>
            )}
            
            {user.ruolo === "GESTORE" && (
                <div className="sezione-creazione">
                    <CreateItem 
                        user={user} 
                        onItemCreated={handleItemCreated}
                        disabled={loading}
                    />
                </div>
            )}

            <div className="griglia-oggetti">
                {items.length === 0 ? (
                    <p className="no-items">Nessun oggetto disponibile</p>
                ) : (
                    // Qui inizia la sezione che aveva problemi di sintassi
                    <>
                        {items.map(item => (
                            <div key={item.id} className="card-oggetto">
                                <div className="info-oggetto">
                                    <h3 className="titolo-oggetto">{item.nome}</h3>
                                    <p className="descrizione-oggetto">{item.descrizione}</p>
                                    
                                    <div className="dettagli-economici">
                                        <span>Prezzo Base: €{item.prezzoBase.toFixed(2)}</span>
                                        <span>Rilancio Minimo: €{item.rilancioMinimo.toFixed(2)}</span>
                                    </div>
                                </div>

                                {!item.inAsta ? (
                                    <div className="azioni-oggetto">
                                        <button 
                                            onClick={() => handleCreaAstaClick(item)}
                                            className="bottone-crea-asta"
                                        >
                                            Crea Asta
                                        </button>
                                    </div>
                                ) : (
                                    <div className="badge-in-asta">
                                        In Asta
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {showAstaForm && selectedItem && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <CreateAstaForm
                            item={selectedItem}
                            onSubmit={handleAstaSubmit}
                            onCancel={() => {
                                setShowAstaForm(false);
                                setSelectedItem(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListaOggetti;
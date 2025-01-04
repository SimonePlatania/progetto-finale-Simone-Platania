// ItemCard.jsx - Creiamo un nuovo componente per gestire il singolo oggetto
import React, { useState } from 'react';
import axios from 'axios';
import '../css/ItemCard.css';

function ItemCard({ item, user, onDelete, onUpdate, onCreaAsta }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        nome: item.nome,
        descrizione: item.descrizione,
        prezzoBase: item.prezzoBase,
        rilancioMinimo: item.rilancioMinimo
    });
    const [error, setError] = useState('');

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:8080/api/items/${item.id}?gestoreId=${user.id}`,
                editData
            );
            onUpdate(response.data);
            setIsEditing(false);
            setError('');
        } catch (err) {
            setError('Errore durante la modifica dell\'oggetto');
        }
    };

    const handleDelete = async () => {
        if (item.inAsta) {
            setError('Non puoi eliminare un oggetto in asta, però puoi terminare un\'asta');
            return;
        }
    
        if (window.confirm('Sei sicuro di voler eliminare questo oggetto?')) {
            try {
                await axios.delete(
                    `http://localhost:8080/api/items/${item.id}`,
                    {
                        params: { gestoreId: user.id },
                        headers: {
                            'Authorization': localStorage.getItem('sessionId'),
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                onDelete(item.id);
            } catch (err) {
                console.error('Dettaglio errore:', err.response?.data);
                
                if (err.response?.status === 403) {
                    setError('Non sei autorizzato a eliminare questo oggetto');
                } else if (err.response?.status === 400) {
                    setError(err.response.data);
                } else {
                    setError('Si è verificato un errore durante l\'eliminazione dell\'oggetto');
                }
            }
        }
    };

    if (isEditing) {
        return (
            <div className="item-card editing">
                <form onSubmit={handleEdit}>
                    <div className="form-group">
                        <label>Nome:</label>
                        <input
                            type="text"
                            value={editData.nome}
                            onChange={(e) => setEditData({...editData, nome: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Descrizione:</label>
                        <textarea
                            value={editData.descrizione}
                            onChange={(e) => setEditData({...editData, descrizione: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Prezzo Base (€):</label>
                        <input
                            type="number"
                            step="0.01"
                            value={editData.prezzoBase}
                            onChange={(e) => setEditData({...editData, prezzoBase: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Rilancio Minimo (€):</label>
                        <input
                            type="number"
                            step="0.01"
                            value={editData.rilancioMinimo}
                            onChange={(e) => setEditData({...editData, rilancioMinimo: e.target.value})}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="button-group">
                        <button type="submit" className="save-button">Salva</button>
                        <button 
                            type="button" 
                            onClick={() => setIsEditing(false)}
                            className="cancel-button"
                        >
                            Annulla
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="item-card">
            <h3>{item.nome}</h3>
            <p className="description">{item.descrizione}</p>
            <div className="price-details">
                <p>Prezzo Base: €{item.prezzoBase.toFixed(2)}</p>
                <p>Rilancio Minimo: €{item.rilancioMinimo.toFixed(2)}</p>
            </div>
            
            <div className="button-group">
                {!item.inAsta && (
                    <>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="edit-button"
                        >
                            Modifica
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="delete-button"
                        >
                            Elimina
                        </button>
                        <button 
                            onClick={() => onCreaAsta(item.id)}
                            className="create-auction-button"
                        >
                            Crea Asta
                        </button>
                    </>
                )}
                {item.inAsta && (
                    <div className="in-auction-badge">In Asta</div>
                )}
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default ItemCard;
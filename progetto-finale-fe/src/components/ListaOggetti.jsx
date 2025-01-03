// ItemsList.js
import React from 'react';
import '../css/ItemsList.css';

function ItemsList({ items, user, onCreaAsta }) {

    return (
        <div className="items-container">
            {user.ruolo === "GESTORE" && (
                <div className="create-item-section">
                    <CreateItem user={user} />
                </div>
            )}

            <div className="items-list">
                {items.map(item => (
                    <div key={item.id} className="item-card">
                        <div className="item-info">
                            <h3>{item.nome}</h3>
                            <p>{item.descrizione}</p>
                            <div className="item-details">
                                <span>Prezzo Base: €{item.prezzoBase.toFixed(2)}</span>
                                <span>Rilancio Minimo: €{item.rilancioMinimo.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        {!item.inAsta && (
                            <div className="item-actions">
                                <button 
                                    onClick={() => onCreaAsta(item.id)} 
                                    className="create-auction-button"
                                >
                                    Crea Asta
                                </button>
                            </div>
                        )}

                        {item.inAsta && (
                            <div className="in-auction-badge">
                                In Asta
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ItemsList;
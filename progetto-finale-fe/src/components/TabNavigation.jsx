// TabNavigation.js
import React from 'react';

function TabNavigation({ tabAttiva, setTabAttive, ruolo }) {
    return (
        <div className="tab-navigation">
            <button 
                className={`tab ${tabAttiva === "aste" ? "active" : ""}`}
                onClick={() => setTabAttive("aste")}
            >
                Aste Attive
            </button>
            
            {ruolo === "GESTORE" && (
                <button 
                    className={`tab ${tabAttiva === "items" ? "active" : ""}`}
                    onClick={() => setTabAttive("items")}
                >
                    I Miei Items
                </button>
            )}
        </div>
    );
}

export default TabNavigation;
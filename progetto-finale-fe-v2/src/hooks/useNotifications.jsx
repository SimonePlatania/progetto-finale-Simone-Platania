// hooks/useNotifications.js
import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

export const useNotifications = (userId) => {
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    
    useEffect(() => {
        if (!userId) return;

        console.log('Inizializzazione connessione WebSocket...');
        
        const client = new Client({
            brokerURL: `ws://localhost:8080/ws`,
            
            connectionTimeout: 10000,
            
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            
            debug: function(str) {
                console.log('STOMP Debug:', str);
            },
            
            onWebSocketError: (error) => {
                console.error('Errore WebSocket:', error);
                setIsConnected(false);
            },
            
            onStompError: (frame) => {
                console.error('Errore STOMP:', frame);
                setIsConnected(false);
            }
        });

        client.onConnect = (frame) => {
            console.log('Connessione WebSocket stabilita!');
            setIsConnected(true);

            client.subscribe(`user/notifica/utente/${userId}`, (message) => {
                try {
                    const notifica = JSON.parse(message.body);
                    console.log('Notifica ricevuta:', notifica);
                    setNotifications(prev => [notifica, ...prev]);
                } catch (error) {
                    console.error('Errore parsing notifica:', error);
                }
            });
        };

        try {
            console.log('Tentativo di connessione...');
            client.activate();
        } catch (error) {
            console.error('Errore durante l\'attivazione:', error);
        }

        return () => {
            if (client.active) {
                console.log('Chiusura connessione WebSocket...');
                client.deactivate();
            }
        };
    }, [userId]);

    return { notifications, isConnected };
};
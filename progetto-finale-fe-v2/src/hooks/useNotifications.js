import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchInitialNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/notifiche/utente/${userId}`,
          {
            credentials: "include",
            headers: {
              Authorization: localStorage.getItem("sessionId"), // se usi un sessionId
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Errore caricamento notifiche:", error);
      }
    };

    fetchInitialNotifications();

    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {
        userId: userId.toString(),
      },
      debug: (str) => {
        console.log("STOMP Debug:", str);
      },
      onConnect: () => {
        console.log("Connected to WebSocket");
        setIsConnected(true);

        stompClient.subscribe(`/user/${userId}/notifica/utente`, (message) => {
          try {
            const notifica = JSON.parse(message.body);
            console.log("Nuova notifica ricevuta:", notifica);
            setNotifications((prev) => [notifica, ...prev]);
          } catch (error) {
            console.error("Errore parsing notifica:", error);
          }
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        setIsConnected(false);
      },
    });

    stompClient.activate();

    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await fetch(
        `http://localhost:8080/api/notifiche/${notificationId}/read`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: localStorage.getItem("sessionId"),
          },
        }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, letta: true } : n))
      );
    } catch (error) {
      console.error("Errore nella marcatura come letta:", error);
    }
  };

  return {
    notifications,
    isConnected,
    markAsRead,
  };
};

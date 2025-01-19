import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import {
  Bell,
  Trophy,
  Clock,
  Users,
  ArrowUpCircle,
  Ban,
  Info,
  PlusCircle,
  AlarmClockOff
} from "lucide-react";

const TIPI_NOTIFICA = {
  NUOVA_OFFERTA: "NUOVA_OFFERTA",
  ASTA_SCADUTA: "ASTA_SCADUTA",
  PARTECIPAZIONE_ASTA: "PARTECIPAZIONE_ASTA",
  ASTA_VINTA: "ASTA_VINTA",
  ASTA_TERMINATA: "ASTA_TERMINATA",
  OFFERTA_SUPERATA: "OFFERTA_SUPERATA",
  NUOVA_ASTA: "NUOVA_ASTA"
};

const NotificationBell = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications, isConnected, markAsRead, markAllAsRead } = useNotifications(userId);

  const unreadCount = notifications.filter((n) => !n.letta).length;

  const handleNotificationClick = async (notifica) => {
    if (notifica.astaId) {
      await markAsRead(notifica.id);
      navigate(`/asta/${notifica.astaId}`);
      setIsOpen(false);
    }
  };

  const handleClearAll = async (e) => {
    e.stopPropagation();
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Errore durante la pulizia delle notifiche:", error)
    }
  };

  // Enhanced notification type handling with icons and colors
  const getNotificationConfig = (tipo) => {
    const configs = {
      [TIPI_NOTIFICA.NUOVA_OFFERTA]: {
        icon: <ArrowUpCircle className="w-5 h-5 text-blue-500" />,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-100"
      },
      [TIPI_NOTIFICA.ASTA_SCADUTA]: {
        icon: <Clock className="w-5 h-5 text-orange-500" />,
        bgColor: "bg-orange-50",
        borderColor: "border-orange-100"
      },
      [TIPI_NOTIFICA.PARTECIPAZIONE_ASTA]: {
        icon: <Users className="w-5 h-5 text-indigo-500" />,
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-100"
      },
      [TIPI_NOTIFICA.ASTA_VINTA]: {
        icon: <Trophy className="w-5 h-5 text-yellow-500" />,
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-100"
      },
      [TIPI_NOTIFICA.ASTA_TERMINATA]: {
        icon: <AlarmClockOff className="w-5 h-5 text-red-500" />,
        bgColor: "bg-red-50",
        borderColor: "border-red-100"
      },
      [TIPI_NOTIFICA.OFFERTA_SUPERATA]: {
        icon: <ArrowUpCircle className="w-5 h-5 text-purple-500" />,
        bgColor: "bg-purple-50",
        borderColor: "border-purple-100"
      },

      [TIPI_NOTIFICA.NUOVA_ASTA]: {
        icon: <PlusCircle className="w-5 h-5 text-green-500"/>,
        bgColor: "bg-green-50",
        borderColor: "border-green-100"
      },
      DEFAULT: {
        icon: <Info className="w-5 h-5 text-gray-500" />,
        bgColor: "bg-gray-50",
        borderColor: "border-gray-100"
      }
    };

    console.log('Tipo notifica ricevuto:', tipo); // Aggiunto per debug
    return configs[tipo] || configs.DEFAULT;
  };

  const formatNotificationTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Proprio ora";
    if (diffInMinutes < 60) return `${diffInMinutes}m fa`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h fa`;
    return notificationDate.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200 font-semibold flex justify-between items-center">
            <span>Notifiche</span>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <span>Segna tutte come lette</span>
                </button>
              )}
            </div>
            {isConnected && (
              <span className="text-xs text-green-500 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Connesso
              </span>
            )}
          </div>

          <div className="max-h-[32rem] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notifica, index) => {
                console.log('Notifica completa:', notifica); 
                const config = getNotificationConfig(notifica.tipo);
                return (
                  <div
                    key={notifica.id || index}
                    onClick={() => handleNotificationClick(notifica)}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors
                      ${!notifica.letta ? config.bgColor : "bg-white"}
                      ${config.borderColor}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{config.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          {notifica.messaggio}
                        </p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {formatNotificationTime(notifica.data)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nessuna notifica</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

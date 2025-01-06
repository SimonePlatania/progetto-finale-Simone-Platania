import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

const NotificationBell = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { notifications, isConnected, markAsRead } = useNotifications(userId);

    const unreadCount = notifications.filter(n => !n.letta).length;

    const handleNotificationClick = async (notifica) => {
        if (notifica.astaId) {
            await markAsRead(notifica.id);
            navigate(`/asta/${notifica.astaId}`);
            setIsOpen(false);
        }
    };

    const getNotificationIcon = (tipo) => {
        switch(tipo) {
            case 'NUOVA_OFFERTA':
                return '💰';
            case 'ASTA_SCADUTA':
                return '⏰';
            case 'PARTECIPAZIONE_ASTA':
                return '👤';
            default:
                return '📋';
        }
    };

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} 
                    className="relative p-2 text-gray-600 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" 
                     className="w-6 h-6"
                     viewBox="0 0 24 24" 
                     fill="none" 
                     stroke="currentColor">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2 border-b border-gray-200 font-semibold">
                        Notifiche
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notifica, index) => (
                                <div
                                    key={notifica.id || index}
                                    onClick={() => handleNotificationClick(notifica)}
                                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer
                                        ${notifica.letta ? 'bg-white' : 'bg-blue-50'}`}
                                >
                                    <span className="mr-2">{getNotificationIcon(notifica.tipo)}</span>
                                    <p className="text-sm text-gray-800">
                                        {notifica.messaggio}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        {new Date(notifica.data).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                Nessuna notifica
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
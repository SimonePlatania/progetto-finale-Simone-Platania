# Sistema di Notifiche - Documentazione Completa

## Indice
1. [Database](#database)
2. [Backend](#backend)
3. [Frontend](#frontend)
4. [WebSocket Configuration](#websocket-configuration)

## Database

### Schema Notifiche
```sql
CREATE TABLE notifiche (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    messaggio TEXT NOT NULL,
    asta_id BIGINT,
    data TIMESTAMP NOT NULL,
    user_id BIGINT NOT NULL,
    letta BOOLEAN DEFAULT FALSE,
    tipo_utente VARCHAR(20),
    FOREIGN KEY (asta_id) REFERENCES aste(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Backend

### Entity (Notifica.java)
```java
public class Notifica {
    public static final String TIPO_NUOVA_OFFERTA = "NUOVA_OFFERTA";
    public static final String TIPO_ASTA_SCADUTA = "ASTA_SCADUTA";
    public static final String TIPO_PARTECIPAZIONE_ASTA = "PARTECIPAZIONE_ASTA";

    private Long id;
    private String tipo;
    private String messaggio;
    private Long astaId;
    private LocalDateTime data;
    private Long userId;
    private boolean letta;
    private String tipoUtente;

    // Costruttori
    public Notifica() {
        this.letta = false;
        this.data = LocalDateTime.now();
    }

    // Getters e Setters
    // ... (implementare tutti i getters e setters necessari)
}
```

### Mapper (NotificaMapper.java)
```java
@Mapper
public interface NotificaMapper {
    @Insert("INSERT INTO notifiche (tipo, messaggio, asta_id, data, user_id, letta, tipo_utente) " +
            "VALUES (#{tipo}, #{messaggio}, #{astaId}, #{data}, #{userId}, #{letta}, #{tipoUtente})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Notifica notifica);

    @Select("SELECT * FROM notifiche WHERE user_id = #{userId} ORDER BY data DESC")
    List<Notifica> findByUserId(Long userId);

    @Update("UPDATE notifiche SET letta = true WHERE id = #{id}")
    void markAsRead(Long id);

    @Delete("DELETE FROM notifiche WHERE id = #{id}")
    void delete(Long id);
}
```

### Service (NotificaService.java)
```java
@Service
public class NotificaService {
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificaMapper notificaMapper;

    @Autowired
    public NotificaService(SimpMessagingTemplate messagingTemplate, NotificaMapper notificaMapper) {
        this.messagingTemplate = messagingTemplate;
        this.notificaMapper = notificaMapper;
    }

    public void inviaNotificaOfferta(Long astaId, Long userId, BigDecimal importo) {
        // ... implementazione
    }

    public void inviaNotificaScadenza(Long astaId, Long userId) {
        // ... implementazione
    }

    public void inviaNotificaPartecipazione(Long astaId, Long userId, Long gestoreId, String usernamePartecipante) {
        // ... implementazione
    }

    public List<Notifica> getNotificheUtente(Long userId) {
        return notificaMapper.findByUserId(userId);
    }

    public void markAsRead(Long id) {
        notificaMapper.markAsRead(id);
    }
}
```

### Controller (NotificaController.java)
```java
@RestController
@RequestMapping("/api/notifiche")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class NotificaController {
    private final NotificaService notificaService;
    
    @Autowired
    public NotificaController(NotificaService notificaService) {
        this.notificaService = notificaService;
    }

    @GetMapping("/utente/{userId}")
    public ResponseEntity<List<Notifica>> getNotificheUtente(@PathVariable Long userId) {
        List<Notifica> notifiche = notificaService.getNotificheUtente(userId);
        return ResponseEntity.ok(notifiche);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificaService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
```

## Frontend

### Hook (useNotifications.js)
```javascript
import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useNotifications = (userId) => {
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    
    useEffect(() => {
        if (!userId) return;

        const fetchInitialNotifications = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/notifiche/utente/${userId}`, {
                    credentials: 'include',
                    headers: {
                        'Authorization': localStorage.getItem('sessionId')
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error('Errore caricamento notifiche:', error);
            }
        };

        fetchInitialNotifications();

        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            connectHeaders: {
                'userId': userId.toString()
            },
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            onConnect: () => {
                setIsConnected(true);
                
                stompClient.subscribe(`/user/${userId}/notifica/utente`, (message) => {
                    try {
                        const notifica = JSON.parse(message.body);
                        setNotifications(prev => [notifica, ...prev]);
                    } catch (error) {
                        console.error('Errore parsing notifica:', error);
                    }
                });
            }
        });

        stompClient.activate();

        return () => {
            if (stompClient.active) {
                stompClient.deactivate();
            }
        };
    }, [userId]);

    return { notifications, isConnected };
};
```

### Component (NotificationBell.jsx)
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

const NotificationBell = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { notifications, isConnected } = useNotifications(userId);

    const unreadCount = notifications.filter(n => !n.letta).length;

    const handleNotificationClick = (notifica) => {
        if (notifica.astaId) {
            navigate(`/asta/${notifica.astaId}`);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative p-2 text-gray-600 hover:text-gray-800"
            >
                {/* Campana SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" 
                     viewBox="0 0 24 24" 
                     fill="none" 
                     stroke="currentColor" 
                     className="w-6 h-6"
                >
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
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg">
                    {/* ... contenuto del dropdown ... */}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
```

## WebSocket Configuration

### WebSocketConfig.java
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/notifica", "/user");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
               .setAllowedOrigins("http://localhost:5173")
               .withSockJS();
    }
}
```

### SecurityConfig.java (Aggiornamento)
```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            // ... altre configurazioni
            .authorizeHttpRequests(auth -> {
                auth.requestMatchers(
                    "/ws/**",
                    "/api/notifiche/**"
                ).permitAll();
                // ... resto delle configurazioni
            })
            .build();
    }
}
```

## Dipendenze Necessarie

### Backend (pom.xml)
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>
</dependencies>
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "@stomp/stompjs": "^7.0.0",
    "sockjs-client": "^1.6.1"
  }
}
```

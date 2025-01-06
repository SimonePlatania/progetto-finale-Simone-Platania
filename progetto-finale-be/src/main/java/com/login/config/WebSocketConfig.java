package com.login.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/notifica");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Registra l'endpoint WebSocket e configura CORS
    	registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:5173").withSockJS();
                // Permette connessioni dal frontend // Aggiunge supporto per SockJS come fallback
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        // Configura parametri di trasporto
        registration.setMessageSizeLimit(8192) // Limite dimensione messaggi
                   .setSendBufferSizeLimit(8192)
                   .setSendTimeLimit(10000); // Timeout in millisecondi
    }
}
package com.login.config;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.login.entity.Utente;
import com.login.service.UtenteService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class SessionAuthenticationFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(SessionAuthenticationFilter.class);
    private final UtenteService utenteService;
    
    public SessionAuthenticationFilter(UtenteService utenteService) {
        this.utenteService = utenteService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            String sessionId = request.getHeader("Authorization");
            logger.debug("Ricevuto sessionId: {}", sessionId);
            
            if (sessionId != null && !sessionId.isEmpty()) {
                Utente utente = utenteService.getCurrentUser(sessionId);
                if (utente != null) {
                    logger.debug("Utente autenticato: {}, ruolo: {}", 
                               utente.getUsername(), 
                               utente.getRuolo());
                    UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                            utente, 
                            null, 
                            null
                        );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            logger.error("Errore durante la verifica della sessione", e);
        }
        
        filterChain.doFilter(request, response);
    }
}
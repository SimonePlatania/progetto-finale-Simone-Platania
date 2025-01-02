package com.login.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.login.service.UtenteService;

@Configuration
public class SecurityConfig {
    
    @Autowired
    private UtenteService utenteService;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        SessionAuthenticationFilter sessionFilter = new SessionAuthenticationFilter(utenteService);
        
        return http
            .addFilterBefore(sessionFilter, UsernamePasswordAuthenticationFilter.class)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1)
                .expiredUrl("/api/utenti/login")
            )
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> {
                // DOCUMENTI E SWAGGER
                auth.requestMatchers(
                    "/api-docs",
                    "/api-docs/**",
                    "/v3/api-docs/**",
                    "/v3/api-docs",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/webjars/**"
                ).permitAll();

                // AUTENTICAZIONE UTENTE
                auth.requestMatchers(
                    "/api/utenti/registra",
                    "/api/utenti/registra/gestore",
                    "/api/utenti/login",
                    "/api/utenti/me"
                ).permitAll();

                // ASTE E OFFERTE (Tutti GET)
                auth.requestMatchers(
                    "/api/aste/attive",
                    "/api/aste/{id}",
                    "/api/aste/{astaId}/offerte"
                ).permitAll();

                // ITEMS
                auth.requestMatchers(
                    "/api/items/**"
                ).authenticated();

                auth.anyRequest().authenticated();
            })
            .build();
    }
	    @Bean
	    public CorsConfigurationSource corsConfigurationSource() {
	        CorsConfiguration configuration = new CorsConfiguration();
	        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
	        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	        configuration.setAllowedHeaders(Arrays.asList("*"));
	        configuration.setAllowCredentials(true);
	        configuration.setExposedHeaders(Arrays.asList("Authorization"));
	        
	        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	        source.registerCorsConfiguration("/**", configuration);
	        return source;
	    }
	}
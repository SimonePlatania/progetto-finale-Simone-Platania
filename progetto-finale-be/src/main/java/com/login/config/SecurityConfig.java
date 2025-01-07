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
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin())
            )
            .authorizeHttpRequests(auth -> {
                auth.requestMatchers(
                    "/api-docs",
                    "/api-docs/**",
                    "/v3/api-docs/**",
                    "/v3/api-docs",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/ws/**",
                    "/ws",
                    "/user/**",
                    "/app/**",
                    "/notifica/**",
                    "/webjars/**",
                    "/api/notifiche/**"
                ).permitAll();
                auth.requestMatchers(
                    "/api/utenti/registra",
                    "/api/utenti/registra/gestore",
                    "/api/utenti/login",
                    "/api/utenti/me"
                ).permitAll();
                auth.requestMatchers(
                    "/api/aste/attive",
                    "/api/aste/{id}",
                    "/api/aste/{astaId}/offerte"
                ).permitAll();
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
        configuration.setAllowedHeaders(Arrays.asList(
            "*",
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
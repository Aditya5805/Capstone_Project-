package com.aditya.interaction_service.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",  // Vite default
                "http://localhost:5174 ",  // Vite second instance
                "http://localhost:4173"   // Vite preview
        ));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With"
        ));

        config.setExposedHeaders(List.of(
                "Authorization"
        ));

        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // Swagger — public
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/app/{appId}/count"
                        ).permitAll()

                        // Public — view reviews for an app (anyone can read reviews)
                        .requestMatchers(HttpMethod.GET, "/reviews/app/**").permitAll()

                        // USER — submit and manage their own reviews
                        .requestMatchers(HttpMethod.POST,   "/reviews/**").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT,    "/reviews/**").hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE, "/reviews/**").hasRole("USER")



                        // Notifications — each user/owner sees only their own
                        .requestMatchers("/notifications/**").authenticated()

                        // Everything else requires authentication
                        // USER actions (download app)
                        .requestMatchers(HttpMethod.POST, "/downloads").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/downloads/my").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/downloads/app/*/check").hasRole("USER")

                        // OWNER (ADMIN) dashboard
                        .requestMatchers(HttpMethod.GET, "/downloads/app/*").hasRole("OWNER")
                        .requestMatchers(HttpMethod.GET, "/downloads/app/*/count").hasRole("OWNER")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
package com.aditya.app_service.security;

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
                "http://localhost:5174",  // Vite second instance
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

                        // Allow internal Feign call from interaction-service (no JWT)
                        .requestMatchers(HttpMethod.PATCH, "/apps/*/rating").permitAll()

                        // Swagger — public
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // Authenticated users only — viewing their own downloads, etc.
                        .requestMatchers(HttpMethod.GET, "/apps/my").authenticated()

                        // OWNER only — full CRUD on apps and categories
                        .requestMatchers(HttpMethod.POST,   "/apps/**").hasRole("OWNER")
                        .requestMatchers(HttpMethod.PUT,    "/apps/**").hasRole("OWNER")
                        .requestMatchers(HttpMethod.DELETE, "/apps/**").hasRole("OWNER")
                        .requestMatchers(HttpMethod.PATCH,  "/apps/**").hasRole("OWNER")

                        .requestMatchers(HttpMethod.POST,   "/categories/**").hasRole("OWNER")
                        .requestMatchers(HttpMethod.PUT,    "/categories/**").hasRole("OWNER")
                        .requestMatchers(HttpMethod.DELETE, "/categories/**").hasRole("OWNER")

                        // Deny everything else
                        .requestMatchers(HttpMethod.GET, "/apps/*").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
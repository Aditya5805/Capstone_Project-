package com.aditya.interaction_service.client;

// Placeholder for future Feign integration with auth-service.
// When Eureka + OpenFeign are enabled, replace with:
// @FeignClient(name = "auth-service")
// to call GET /auth/{id} for user existence validation.

import org.springframework.stereotype.Component;

@Component
public class AuthClient {
    // Future: validate userEmail exists via GET http://auth-service/auth/{id}
}

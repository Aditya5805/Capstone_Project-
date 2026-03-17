package com.aditya.app_service.client;

// Placeholder for future Feign/RestTemplate integration with auth-service.
// JWT validation is done locally using the shared secret key.
// When Eureka is enabled, replace with @FeignClient(name = "auth-service").

import org.springframework.stereotype.Component;

@Component
public class AuthClient {
    // Future: call GET http://auth-service/auth/{id} to validate user existence
}

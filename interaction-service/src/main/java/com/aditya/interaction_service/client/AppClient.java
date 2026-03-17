package com.aditya.interaction_service.client;

import com.aditya.interaction_service.DTO.AppResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

// name = service name registered in Eureka
// url  = fallback direct URL if Eureka is not used
@FeignClient(name = "app-service", url = "http://localhost:8081")
public interface AppClient {

    // Calls GET http://localhost:8081/apps/{id} on app-service
    @GetMapping("/apps/{id}")
    AppResponseDTO getAppById(@PathVariable("id") Long id);

    // Pushes new average rating back to app-service after a review is submitted
    @PatchMapping("/apps/{id}/rating")
    void updateRating(@PathVariable("id") Long id, @RequestParam("rating") Double rating);

}
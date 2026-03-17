package com.aditya.auth_service.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {
    private String name;
    private String email;
    private String password;
    private String role; // "USER" or "OWNER"
}

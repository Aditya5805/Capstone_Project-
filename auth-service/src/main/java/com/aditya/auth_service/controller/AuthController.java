package com.aditya.auth_service.controller;


import com.aditya.auth_service.DTO.LoginRequestDTO;
import com.aditya.auth_service.DTO.LoginResponseDTO;
import com.aditya.auth_service.DTO.RegisterRequestDTO;
import com.aditya.auth_service.DTO.UserDTO;
import com.aditya.auth_service.entity.User;
import com.aditya.auth_service.mapper.UserMapper;
import com.aditya.auth_service.service.AuthService;
import com.aditya.auth_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterRequestDTO request){
        User user = userService.register(request);
        return ResponseEntity.ok(UserMapper.toDTO(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id){
        User user = userService.getUserById(id);
        return ResponseEntity.ok(UserMapper.toDTO(user));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public String logout() {

        SecurityContextHolder.clearContext();

        return "Logged out successfully";
    }

}

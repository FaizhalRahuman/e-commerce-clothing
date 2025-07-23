package com.ecommerce.closetculture.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.closetculture.DTO.LoginAccountDTO;
import com.ecommerce.closetculture.services.AccServices;
import com.ecommerce.closetculture.services.TokenServices;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/auth")
public class AuthController {


    @Autowired
    TokenServices tokenservice;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    AccServices accService;


    @PostMapping("/login/token")
    @Operation(summary="Get Token For The Account")
    public ResponseEntity<?> loginAccount(@RequestBody LoginAccountDTO loginAccDto) throws AuthenticationException{

        Authentication authentication;

        try{
            Authentication loginData = new UsernamePasswordAuthenticationToken(loginAccDto.getNameOrEmail(),loginAccDto.getPassword());
            authentication = authManager.authenticate(loginData);
            
        }catch(AuthenticationException authFails){
            return ResponseEntity.badRequest().body("Login Fails: check name/password");
        }

        return ResponseEntity.ok(tokenservice.generateToken(authentication));
    }

}

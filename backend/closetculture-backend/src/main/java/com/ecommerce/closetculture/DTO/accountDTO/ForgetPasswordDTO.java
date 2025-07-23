package com.ecommerce.closetculture.DTO.accountDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ForgetPasswordDTO {

    @NotEmpty(message = "Email Required")
    @Email
    private String registeredEmail;
    
}

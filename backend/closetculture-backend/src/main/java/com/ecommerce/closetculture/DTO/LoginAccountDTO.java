package com.ecommerce.closetculture.DTO;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class LoginAccountDTO {

    @NotEmpty(message = "nameOrEmail Required")
    private String nameOrEmail;

    @NotEmpty(message = "password Required to login")
    private String password;
    
}

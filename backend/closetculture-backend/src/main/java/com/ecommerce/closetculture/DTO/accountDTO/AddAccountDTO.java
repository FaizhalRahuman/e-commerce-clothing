package com.ecommerce.closetculture.DTO.accountDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class AddAccountDTO {

    @NotEmpty(message = "Account name Required")
    private String name;

    @NotEmpty(message = "email Required")
    @Email
    private String email;

    @NotEmpty(message = "Password Required")
    private String password;
    
}

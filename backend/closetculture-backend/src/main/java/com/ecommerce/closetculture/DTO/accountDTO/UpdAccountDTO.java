package com.ecommerce.closetculture.DTO.accountDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class UpdAccountDTO {

    @NotEmpty(message = "name Required")
    private String name;

    @NotEmpty(message = "email Required")
    @Email
    private String email;
    
}

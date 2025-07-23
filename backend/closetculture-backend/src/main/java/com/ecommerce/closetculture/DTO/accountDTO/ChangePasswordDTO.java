package com.ecommerce.closetculture.DTO.accountDTO;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ChangePasswordDTO {

    @NotEmpty(message = "oldPassword Required")
    private String oldPassword;

    @NotEmpty(message = "newPassword Required")
    private String newPassword;
    
}

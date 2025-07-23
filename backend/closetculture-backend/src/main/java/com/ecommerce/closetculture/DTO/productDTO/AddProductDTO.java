package com.ecommerce.closetculture.DTO.productDTO;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AddProductDTO {

    @NotEmpty(message = "Product Name Required")
    private String prdName;
    
    @NotEmpty(message = "Estimation rate Required")
    private String priceRange;
    
}

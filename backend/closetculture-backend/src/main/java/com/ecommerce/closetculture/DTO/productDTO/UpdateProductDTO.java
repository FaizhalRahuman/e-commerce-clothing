package com.ecommerce.closetculture.DTO.productDTO;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UpdateProductDTO {

    @NotEmpty
    private String prdName;

    private String priceRange;
    
}

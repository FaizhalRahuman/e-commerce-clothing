package com.ecommerce.closetculture.DTO.stockDTO;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddUpdStockDTO {

    @NotEmpty(message = "size of dress Required")
    private String size;

    private String color;

    @NotNull(message = "rate is Required")
    private Long rate;

    @NotNull(message = "no.of.stock is Required")
    private Long stockAvl;
    
}

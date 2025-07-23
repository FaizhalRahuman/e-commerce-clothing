package com.ecommerce.closetculture.DTO.cartDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ViewCartDTO {

    private Long itmId;
    
    private String collName;

    private String size;

    private String color;

    private Long rate;

    private Long qty;
}

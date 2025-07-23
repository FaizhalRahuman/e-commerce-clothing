package com.ecommerce.closetculture.DTO.productDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ViewProductDTO {

    private Long prdId;

    private String prdName;

    private String priceRange;

}

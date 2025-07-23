package com.ecommerce.closetculture.DTO.stockDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ViewStockDTO {

    private Long collId;

    private Long StkId;

    private String collName;

    private String size;

    private String color;

    private Long rate;

    private Long stock;
    
}

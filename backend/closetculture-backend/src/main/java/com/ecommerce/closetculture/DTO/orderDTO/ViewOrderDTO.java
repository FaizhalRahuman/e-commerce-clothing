package com.ecommerce.closetculture.DTO.orderDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ViewOrderDTO {

    private long orderId;

    private String collName;

    private Long quantity;

    private String deliverTime;
    
}

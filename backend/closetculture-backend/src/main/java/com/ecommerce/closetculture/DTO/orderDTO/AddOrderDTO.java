package com.ecommerce.closetculture.DTO.orderDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddOrderDTO {

    private Long quantity;

    private String buyerPhNo;

    private String buyerAddress;

    private String paymentType;
}

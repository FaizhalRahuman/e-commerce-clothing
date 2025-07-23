package com.ecommerce.closetculture.model.clientSide;

import com.ecommerce.closetculture.model.Account;
import com.ecommerce.closetculture.model.adminSide.Stock;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItmId;

    private Long quantity;

    private Boolean inCart;

    @ManyToOne
    @JoinColumn(name="stkId",referencedColumnName = "stkId",nullable=false)
    private Stock stock;

    @ManyToOne
    @JoinColumn(name="orderId",referencedColumnName = "orderId",nullable=true)
    private Order order;

    @ManyToOne
    @JoinColumn(name="accId",referencedColumnName = "accId")
    private Account account;
    
}

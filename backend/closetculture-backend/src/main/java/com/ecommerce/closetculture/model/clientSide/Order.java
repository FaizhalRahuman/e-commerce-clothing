package com.ecommerce.closetculture.model.clientSide;

import java.util.ArrayList;
import java.util.List;

import com.ecommerce.closetculture.model.Account;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private String buyerName;

    private String buyerPhNo;

    private String buyerAddress;

    private Long totAmt;

    private String paymentType;

    private String orderTime;

    private String deliveryTime;

    @ManyToOne
    @JoinColumn(name="accId",referencedColumnName = "accId")
    private Account account;

    @OneToMany(mappedBy = "order",cascade=CascadeType.ALL)
    List<OrderItem> orderedItems = new ArrayList<>();


}

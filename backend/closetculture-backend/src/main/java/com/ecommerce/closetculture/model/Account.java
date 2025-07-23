package com.ecommerce.closetculture.model;

import java.util.ArrayList;
import java.util.List;

import com.ecommerce.closetculture.model.clientSide.Order;
import com.ecommerce.closetculture.model.clientSide.OrderItem;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accId;

    private String name;
    
    private String email;

    private String password;

    private String authority;

    @OneToMany(mappedBy = "account",cascade = CascadeType.ALL)
    List<OrderItem> cart = new ArrayList<>();

    @OneToMany(mappedBy="account",cascade=CascadeType.ALL)
    List<Order> order = new ArrayList<>();
    
}

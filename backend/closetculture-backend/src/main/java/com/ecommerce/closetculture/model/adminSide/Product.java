package com.ecommerce.closetculture.model.adminSide;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long prdId;

    private String prdName;

    private String priceRange;

    @OneToMany(mappedBy="product", cascade=CascadeType.ALL)
    List<CollectionStore> collections = new ArrayList<>();
    
}

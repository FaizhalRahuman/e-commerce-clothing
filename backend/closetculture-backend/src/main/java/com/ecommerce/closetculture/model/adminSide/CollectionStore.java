package com.ecommerce.closetculture.model.adminSide;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class CollectionStore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long collId;

    private String collName;                                             

    private String collType;

    private String img;
    
    @ManyToOne
    @JoinColumn(name = "prd_Id" ,referencedColumnName="prdId",nullable=false)
    private Product product;

    @OneToMany(mappedBy="collectionStore", cascade=CascadeType.ALL )
    List<Stock> collectionStocks = new ArrayList<>();
}

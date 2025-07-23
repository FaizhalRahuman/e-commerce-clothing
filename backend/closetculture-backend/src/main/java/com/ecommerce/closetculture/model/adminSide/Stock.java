package com.ecommerce.closetculture.model.adminSide;

import java.util.ArrayList;
import java.util.List;

import com.ecommerce.closetculture.model.clientSide.OrderItem;

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
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long StkId;

    private String size;

    private String color;

    private Long rate;

    private Long stockAvl;

    private String img;

    @ManyToOne
    @JoinColumn(name="coll_Id",referencedColumnName="collId",nullable=false)
    private CollectionStore collectionStore;

    @OneToMany(mappedBy="stock",cascade = CascadeType.ALL)
    List<OrderItem> orderItmForStock = new ArrayList<>() ;

}

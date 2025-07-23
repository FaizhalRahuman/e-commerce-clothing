package com.ecommerce.closetculture.repository.adminRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.closetculture.model.adminSide.Product;

@Repository
public interface ProdRepo extends JpaRepository<Product,Long> {
    
}

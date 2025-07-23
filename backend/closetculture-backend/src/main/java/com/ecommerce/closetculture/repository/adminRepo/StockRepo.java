package com.ecommerce.closetculture.repository.adminRepo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.closetculture.model.adminSide.Stock;

@Repository
public interface StockRepo extends JpaRepository<Stock,Long> {
    
    public List<Stock> findByCollectionStore_collId(Long id);
}

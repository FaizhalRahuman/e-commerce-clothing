package com.ecommerce.closetculture.services.adminSide_Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.closetculture.model.adminSide.Stock;
import com.ecommerce.closetculture.repository.adminRepo.StockRepo;

@Service
public class StockServices {

    @Autowired
    StockRepo stkRepo;

//----- Get/View Stock ---------------------------------------------------------------------------------------------------------------------

//-----Find By Id
    public Optional<Stock> findById(Long id){
        return stkRepo.findById(id);
        
    }

//-----Find By Collection Id
    public List<Stock> findByCollId(Long id){
        return stkRepo.findByCollectionStore_collId(id);
    }

//-----Find All
    public List<Stock> findAll(){
        return stkRepo.findAll();
    }

//----- Save Stock -------------------------------------------------------------------------------------------------------------------------
    public void save(Stock stk){
        stkRepo.save(stk);
    }

//----- Delete Stock -------------------------------------------------------------------------------------------------------------------------
    public void deleteById(Long id){
        stkRepo.deleteById(id);
    }
    
}

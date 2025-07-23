package com.ecommerce.closetculture.services.clientSide_Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.closetculture.model.clientSide.OrderItem;
import com.ecommerce.closetculture.repository.clientRepo.OrderItemRepo;

@Service
public class OrderItemServices {

    @Autowired
    OrderItemRepo odrItmRepo;

//----- Save Order Item ----------------------------------------------------------------------------------------------------------------------------

    public void save(OrderItem odrItm){
        odrItmRepo.save(odrItm);
    }

//----- Delete By Id --------------------------------------------------------------------------------------------------------------------------------

    public void deleteById(Long id){
        odrItmRepo.deleteById(id);
    }
    
}

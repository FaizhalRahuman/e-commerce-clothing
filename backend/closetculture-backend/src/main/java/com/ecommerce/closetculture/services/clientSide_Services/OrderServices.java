package com.ecommerce.closetculture.services.clientSide_Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.closetculture.model.clientSide.Order;
import com.ecommerce.closetculture.repository.clientRepo.OrderRepo;

@Service
public class OrderServices {

    @Autowired
    OrderRepo orderRepo;

//----- Get/View Order ----------------------------------------------------------------------------------------------------------------------

//----- Find Order By Id
    public Optional<Order> findById(Long orderId){
        return orderRepo.findById(orderId);
    }

//----- Find All
   public List<Order> findAll(){
    return orderRepo.findAll();
   }

//----- Place/Save the order -----------------------------------------------------------------------------------------------------------------

    public void save(Order order){
     orderRepo.save(order);
    }

//----- Delete/cancel the order ---------------------------------------------------------------------------------------------------------------

    public void deleteById(Long orderId){
        orderRepo.deleteById(orderId);
    }
}

package com.ecommerce.closetculture.repository.clientRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.closetculture.model.clientSide.Order;

@Repository
public interface OrderRepo extends JpaRepository<Order,Long> {

}

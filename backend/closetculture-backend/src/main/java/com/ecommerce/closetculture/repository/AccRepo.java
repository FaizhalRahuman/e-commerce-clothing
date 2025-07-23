package com.ecommerce.closetculture.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.closetculture.model.Account;

@Repository
public interface AccRepo extends JpaRepository<Account,Long> {

    public Optional<Account> findByEmail(String email);
    public Optional<Account> findByName(String name);
    
}

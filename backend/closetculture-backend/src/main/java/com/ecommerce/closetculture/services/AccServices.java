package com.ecommerce.closetculture.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.closetculture.model.Account;
import com.ecommerce.closetculture.repository.AccRepo;

@Service
public class AccServices implements UserDetailsService {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AccRepo accRepo;

//----- Get/View Account -------------------------------------------------------------------------------------------------------------------------

//-----Find By Email
    public Optional<Account> findByEmail(String email){

        Optional<Account> optAcc = accRepo.findByEmail(email);
        return optAcc;
    }

//-----Find By Name
    public Optional<Account> findByName(String name){
        Optional<Account> optAcc = accRepo.findByName(name);
        return optAcc;
    }

//-----Find By Id
    public Optional<Account> findById(Long id){
        Optional<Account> optAcc = accRepo.findById(id);
        return optAcc;
    }

//-----Find All
    public List<Account> findAll(){
        return accRepo.findAll();
    }



//----- Save Account ------------------------------------------------------------------------------------------------------------------------------

    public void save(Account acc){
                                                    //BCrypt always starts with: $2a$ or $2b$ or $2y$
        String password = acc.getPassword();
        if(acc.getAccId() == null || !(password.startsWith("$2a$") 
                                  || password.startsWith("$2b$") 
                                  || password.startsWith("$2y$"))){
                                    
            acc.setPassword( passwordEncoder.encode(acc.getPassword()));

        if( (acc.getName()).contains("ADMIN_CC")){
            acc.setAuthority("ADMIN");
        }else{
            acc.setAuthority("USER");
        }
    }
        
        accRepo.save(acc);
    }

//----- Delete Account ------------------------------------------------------------------------------------------------------------------------------

    public void deleteById(Long id){
        accRepo.deleteById(id);
    }


//----- loadUserByName Method -----------------------------------------------------------------------------------------------------------------------

    @Override
    public UserDetails loadUserByUsername(String nameOrEmail){

        Optional<Account> optAcc = null;

        if(nameOrEmail.contains("@")){
            optAcc= accRepo.findByEmail(nameOrEmail);
        }else{
            optAcc =accRepo.findByName(nameOrEmail);
        }

        if(!optAcc.isPresent()){
            throw new UsernameNotFoundException("No User Exist In DB!!");
        }

        Account acc = optAcc.get();

        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        grantedAuthorities.add(new SimpleGrantedAuthority(acc.getAuthority()));

        return new User(acc.getEmail(),acc.getPassword(),grantedAuthorities);
        
    }
    
}

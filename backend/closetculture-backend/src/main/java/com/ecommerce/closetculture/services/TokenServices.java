package com.ecommerce.closetculture.services;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.ecommerce.closetculture.model.Account;

@Service
public class TokenServices {

    @Autowired
    private JwtEncoder jwtEncoder;

    @Autowired
    AccServices accService;

    public String generateToken(Authentication authentication){

        Optional<Account> optAcc = accService.findByEmail(authentication.getName());
        if(!optAcc.isPresent()){
            return "No Account Exist!";
        } 
        Account acc = optAcc.get();

        Instant now = Instant.now();

        String scope = authentication.getAuthorities() 
                            .stream()
                            .map(GrantedAuthority :: getAuthority)
                            .collect(Collectors.joining(" "));
                            

        JwtClaimsSet claimSet = JwtClaimsSet.builder()
                                            .issuer("Faizhal")
                                            .subject(authentication.getName())
                                            .issuedAt(now)
                                            .expiresAt(now.plus(2,ChronoUnit.DAYS))
                                            .claim("scope",scope)
                                            .claim("accId",acc.getAccId())
                                            .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claimSet)).getTokenValue();
        

    }

}

package com.ecommerce.closetculture.config.keygenerator;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.nimbusds.jose.jwk.RSAKey;

@Configuration
public class GenerateKeys {

    public RSAPublicKey rsaPublicKey;
    public RSAPrivateKey rsaPrivateKey;

            
    public KeyPair keyGenerator(){    

        try{
            
            KeyPairGenerator keyPair = KeyPairGenerator.getInstance("RSA");
            keyPair.initialize(2048);
            return keyPair.generateKeyPair();

        }catch(NoSuchAlgorithmException e){
            throw new RuntimeException("no such algo exist!!");
        }

    }

    @Bean
    public  RSAKey rsaKeyGenerator(){

        KeyPair keyPair = keyGenerator();

        rsaPublicKey = (RSAPublicKey) keyPair.getPublic();
        rsaPrivateKey = (RSAPrivateKey) keyPair.getPrivate();

        // return new RSAKey.Builder(rsaPublicKey)
        //              .privateKey(rsaPrivateKey)
        //              .build();

        RSAKey.Builder builder = new RSAKey.Builder(rsaPublicKey);
        builder.privateKey(rsaPrivateKey);
        
        RSAKey rsaKeyBuilder = builder.build();

        return rsaKeyBuilder;

    }

}

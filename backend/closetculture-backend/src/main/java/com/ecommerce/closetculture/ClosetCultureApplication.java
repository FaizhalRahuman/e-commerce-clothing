package com.ecommerce.closetculture;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@SpringBootApplication
@SecurityScheme(
	name= "faiz",
	type=SecuritySchemeType.HTTP,
	in=SecuritySchemeIn.HEADER,
	scheme="bearer"
)
public class ClosetCultureApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClosetCultureApplication.class, args);
	}

}     

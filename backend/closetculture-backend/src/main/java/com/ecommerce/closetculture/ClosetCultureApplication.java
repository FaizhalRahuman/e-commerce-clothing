package com.ecommerce.closetculture;

import java.sql.Connection;
import java.sql.DriverManager;

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

        try {
            String url = "jdbc:mysql://nozomi.proxy.rlwy.net:56538/railway";
            String user = "root";
            String pass = "mOomWoxYDwrNJJElLCJcqnThbNSXKLsS";

            Connection conn = DriverManager.getConnection(url, user, pass);
            System.out.println("Connected successfully!");
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}

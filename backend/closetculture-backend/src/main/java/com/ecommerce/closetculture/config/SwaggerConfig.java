package com.ecommerce.closetculture.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title="ClosetCulture",
        description="E-commerce Websites API",
        version="1.0.0",
        contact = @Contact(
            name="Faizhal Rahuman",
            email="faizhalrahuman2004@gmail.com",
            url="http://lalalala.com"
        )
    ),
    servers= @Server(
        url="http://localhost:8080",
        description="Local Dev Server"
    )
)
public class SwaggerConfig {


}

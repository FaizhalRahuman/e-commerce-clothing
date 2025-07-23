package com.ecommerce.closetculture.controller.adminSide;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class HomeController {

    @GetMapping("/")
    public String requestMethodName() {
        return "index";
    }
    
    
}

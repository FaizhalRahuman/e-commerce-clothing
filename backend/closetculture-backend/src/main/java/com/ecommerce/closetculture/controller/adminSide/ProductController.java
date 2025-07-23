package com.ecommerce.closetculture.controller.adminSide;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.closetculture.DTO.productDTO.AddProductDTO;
import com.ecommerce.closetculture.DTO.productDTO.UpdateProductDTO;
import com.ecommerce.closetculture.DTO.productDTO.ViewProductDTO;
import com.ecommerce.closetculture.model.adminSide.Product;
import com.ecommerce.closetculture.services.adminSide_Services.ProdServices;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    ProdServices prodService;

//----- Add Product -----------------------------------------------------------------------------------------------------------------------------------

    @PostMapping("/add")
    @Operation(summary = "Add New Product -----:ADMIN")
    @ApiResponse(responseCode="403", description="Forbidden:Need Higher Authority Level")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> addProduct(@Valid @RequestBody AddProductDTO addProductDTO) {

        Product prod = new Product();
        prod.setPrdName(addProductDTO.getPrdName());
        prod.setPriceRange(addProductDTO.getPriceRange());
        prodService.save(prod);
        
        return ResponseEntity.ok("Successfully Product Added !!");
    }

//----- View Product -----------------------------------------------------------------------------------------------------------------------------

//-----View All

    @GetMapping("/view-all")
    @Operation(summary = "view Products")
    public ResponseEntity<?> viewAllProduct() {

        List<Product> allProducts = prodService.findAll();
        List<ViewProductDTO> viewProd = new ArrayList<>();

        for(Product prod:allProducts){

            viewProd.add(new ViewProductDTO(prod.getPrdId(),prod.getPrdName(),prod.getPriceRange()));
        }

        return ResponseEntity.ok(viewProd);
    }

//----- View Product By Product Id

    @GetMapping("/view-by-prdId/{prdId}")
    @Operation(summary = "View Product By Its Id -----: ADMIN")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> viewPrdById(@PathVariable Long prdId) {

        Optional<Product> optPrd = prodService.findById(prdId);
        if(!optPrd.isPresent()){
            return ResponseEntity.badRequest().body("No Product Exist!");
        }
        Product prd = optPrd.get();

        return ResponseEntity.ok(new ViewProductDTO(prdId,prd.getPrdName() ,prd.getPriceRange()));
    }

//----- Update Product By Id--------------------------------------------------------------------------------------------------------------------------------

    @PutMapping("/update-by-id/{prdId}")
    @Operation(summary = "Update a Product -----:ADMIN")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> updateProduct(@RequestBody UpdateProductDTO updateProductDTO,@PathVariable Long prdId){

        Optional<Product> optProd = prodService.findById(prdId);
        
        if(!optProd.isPresent()){
            return ResponseEntity.badRequest().body("No Product Exist !!");
        }

        Product prod = optProd.get();
        prod.setPrdName(updateProductDTO.getPrdName());
        prod.setPriceRange(updateProductDTO.getPriceRange());
        prodService.save(prod);

        return ResponseEntity.ok("Updated Succesfully !!");
    }

//----- Delete Product By Id -------------------------------------------------------------------------------------------------------------------------------

    @DeleteMapping("/delete-by-id/{prdId}")
    @Operation(summary="Delete a product -----:ADMIN")
    @SecurityRequirement(name = "faiz")
    public ResponseEntity<?> deleteProduct(@PathVariable Long prdId){
        Optional<Product> optProd = prodService.findById(prdId);
        if(!optProd.isPresent()){
            return ResponseEntity.badRequest().body("No Product Exist !");
        }

        prodService.deleteById(prdId);
        return ResponseEntity.ok("Product Successfully Deleted!");
    }
    
}

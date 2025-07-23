package com.ecommerce.closetculture.services.adminSide_Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.closetculture.model.adminSide.Product;
import com.ecommerce.closetculture.repository.adminRepo.ProdRepo;

@Service
public class ProdServices {

    @Autowired
    ProdRepo prodRepo;

//-----Get/View Account -------------------------------------------------------------------------------------------------------------------------

//-----Find By Id
    public Optional<Product> findById(Long id){

        Optional<Product> optProd = prodRepo.findById(id);
        return optProd;
    }

//-----Find All
    public List<Product> findAll(){
        return prodRepo.findAll();
    }

//----- Save Product ----------------------------------------------------------------------------------------------------------------------------
    public void save(Product prod){
        prodRepo.save(prod);
    }

//----- Delete prduct By id -----------------------------------------------------------------------------------------------------------------------
    public void deleteById(Long id){
        System.out.println("Trying to delete product with ID: " + id);

        if (!prodRepo.existsById(id)) {
        throw new RuntimeException("Product with ID " + id + " does not exist");
    }

        prodRepo.deleteById(id);

        System.out.println("Deleted product with ID: " + id);
    }
    
}

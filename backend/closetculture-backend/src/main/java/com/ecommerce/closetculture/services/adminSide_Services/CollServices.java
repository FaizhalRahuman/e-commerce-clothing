package com.ecommerce.closetculture.services.adminSide_Services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ecommerce.closetculture.model.adminSide.CollectionStore;
import com.ecommerce.closetculture.repository.adminRepo.CollRepo;

@Service
public class CollServices {

    @Autowired
    CollRepo collRepo;

//----- Get/View collection ---------------------------------------------------------------------------------------------------------------------

//-----Find By Id
    public Optional<CollectionStore> findById(Long id){
        return collRepo.findById(id);
        
    }

//-----Find By Product Id
    public List<CollectionStore> findByPrdId(Long id){
        return collRepo.findByProduct_prdId(id);
    }

//-----Find All
    public List<CollectionStore> findAll(){
        return collRepo.findAll();
    }

//----- Save collection -------------------------------------------------------------------------------------------------------------------------
    public void save(CollectionStore coll){
        collRepo.save(coll);
    }

//----- Delete Collection -------------------------------------------------------------------------------------------------------------------------
    public void deleteById(Long id){
        collRepo.deleteById(id);
    }

//----- Pagination For showing all collections ------------------------------------------------------------------------------------------------------

    public Page<CollectionStore> Pagination(int pageNo,int collPerPage){

        return collRepo.findAll( PageRequest.of(pageNo,collPerPage));

    }

//----- filter and pagination -------------------------------------------------------------------------------------------------------------------------------

    public Page<CollectionStore> filterBySizeColor(String size,String color,int minprice,int maxprice,Pageable pageable){
        System.out.println("Entered into Service filterBySizeColor ................................................................");

        return collRepo.filterBySizeColor(size,color,minprice,maxprice,pageable);
    }

    public Page<CollectionStore> filterBySize(String size,int minprice,int maxprice,Pageable pageable){
        System.out.println("Entered into Service filterBySize ................................................................");
        
        return collRepo.filterBySize(size, minprice, maxprice, pageable);
    }

    public Page<CollectionStore> filterByColor(String color,int minprice,int maxprice,Pageable pageable){
        System.out.println("Entered into Service filterByColor ................................................................");

        return collRepo.filterByColor(color, minprice, maxprice, pageable);
    }

    public Page<CollectionStore> filterByRate(int minprice, int maxprice,Pageable pageable){
        System.out.println("Entered into Service filterByRate ................................................................");
        return collRepo.filterByRate(minprice, maxprice,pageable);
    }

//----- filter and pagination for collections by product -----------------------------------------------------------------------------------------

        public Page<CollectionStore> filterBySizeColorPrd(String size,String color,int minprice,int maxprice,Long prdId,Pageable pageable){
        System.out.println("Entered into Service filterBySizeColor ................................................................");

        return collRepo.filterBySizeColorPrd(size,color,minprice,maxprice,prdId,pageable);
    }

    public Page<CollectionStore> filterBySizePrd(String size,int minprice,int maxprice,Long prdId,Pageable pageable){
        System.out.println("Entered into Service filterBySize ................................................................");
        
        return collRepo.filterBySizePrd(size, minprice, maxprice,prdId,pageable);
    }

    public Page<CollectionStore> filterByColorPrd(String color,int minprice,int maxprice,Long prdId,Pageable pageable){
        System.out.println("Entered into Service filterByColor ................................................................");

        return collRepo.filterByColorPrd(color, minprice, maxprice,prdId, pageable);
    }

    public Page<CollectionStore> filterByRatePrd(int minprice, int maxprice,Long prdId,Pageable pageable){
        System.out.println("Entered into Service filterByRate ................................................................");
        return collRepo.filterByRatePrd(minprice, maxprice,prdId,pageable);
    }
    
}

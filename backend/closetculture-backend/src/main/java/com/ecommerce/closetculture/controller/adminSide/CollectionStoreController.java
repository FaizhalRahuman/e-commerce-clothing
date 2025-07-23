package com.ecommerce.closetculture.controller.adminSide;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.closetculture.DTO.PageCollectionsAndTotal;
import com.ecommerce.closetculture.DTO.collectionStoreDTO.AddUpdCollectionDTO;
import com.ecommerce.closetculture.DTO.collectionStoreDTO.ViewCollectionDTO;
import com.ecommerce.closetculture.model.adminSide.CollectionStore;
import com.ecommerce.closetculture.model.adminSide.Product;
import com.ecommerce.closetculture.services.adminSide_Services.CollServices;
import com.ecommerce.closetculture.services.adminSide_Services.ProdServices;
import com.ecommerce.closetculture.utils.appUtils.Urls_Images;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/collection")
public class CollectionStoreController {

    @Autowired
    ProdServices prodService;

    @Autowired
    CollServices collService;

//----- Pagination ----------------------------------------------------------------------------------------------------------------------------------

    @GetMapping("/pagination")
    @Operation(summary="Get Paginationed Collections")
    public ResponseEntity<?> pagination(@RequestParam(defaultValue="0") int pageNo, @RequestParam(defaultValue="8") int collPerPage ){

        Page<CollectionStore> paginationedCollections = collService.Pagination(pageNo, collPerPage);

        List<ViewCollectionDTO> viewCollection = new ArrayList<>();

        for(CollectionStore coll : paginationedCollections){/*Or paginationCollections.getContent() ,, even if we loop paginationedCollections also in defaukt loops .getContent()*/
             
            viewCollection.add( new ViewCollectionDTO(coll.getProduct().getPrdId(),coll.getCollId(), coll.getCollName(), coll.getCollType(), coll.getImg()));
        }

        Long totColl = paginationedCollections.getTotalElements();

        PageCollectionsAndTotal collTot = new PageCollectionsAndTotal(viewCollection,totColl);

        return ResponseEntity.ok(collTot);

    }

//----- Filter and Pagination --------------------------------------------------------------------------------------------------------------------------------------

    @GetMapping("/filter-pagination")
    @Operation(summary="Get Filtered Collections")
    public ResponseEntity<?> filterAndPagination(@RequestParam(defaultValue="") String size,@RequestParam(defaultValue="") String color,
    @RequestParam(defaultValue="0") int minprice,@RequestParam(defaultValue="2000") int maxprice,@RequestParam(defaultValue="0") int pageNo,
    @RequestParam(defaultValue="4") int collPerPage) {

        Page<CollectionStore> coll = new PageImpl<>(new ArrayList<>());
        System.out.println("Not Enter into consitions ....................................................");
    
    if(size.isEmpty() && color.isEmpty()){
        System.out.println("Enter into Both empty................................................");
        coll = (collService.filterByRate(minprice, maxprice, PageRequest.of(pageNo,collPerPage)));

    }else if(size.isEmpty()){
        System.out.println("Enter into size only  empty................................................");
        coll = (collService.filterByColor(color, minprice, maxprice, PageRequest.of(pageNo,collPerPage)));

    }else if(color.isEmpty()){
        System.out.println("Enter into color only  empty................................................");
        coll = (collService.filterBySize(size, minprice, maxprice, PageRequest.of(pageNo,collPerPage)));

    }else{
        System.out.println("Enter into not size and color empty................................................");
        coll = (collService.filterBySizeColor(size, color, minprice, maxprice, PageRequest.of(pageNo,collPerPage)));
    }

    List<ViewCollectionDTO> viewCollection = new ArrayList<>();
    
    for(CollectionStore collInLoop : coll.getContent() ){

        viewCollection.add(new ViewCollectionDTO(collInLoop.getProduct().getPrdId(), collInLoop.getCollId(), collInLoop.getCollName(), collInLoop.getCollType(), collInLoop.getImg()));
    }

    Long totColl = coll.getTotalElements();

    PageCollectionsAndTotal collTot = new PageCollectionsAndTotal(viewCollection,totColl);

    if (viewCollection.isEmpty()) {
        return ResponseEntity.badRequest().body("There Is No Collection Exist For This Product!");
    }

    return ResponseEntity.ok(collTot);
    
}

//----- Filter and Pagination For Collections by prd ---------------------------------------------------------------------------------------------------------------

    @GetMapping("/filter-pagination-prod/{prdId}")
    @Operation(summary = "Get Filtered Collection For a Product")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> filterForProdByColl(@PathVariable Long prdId,
        @RequestParam(defaultValue="") String size,@RequestParam(defaultValue="") String color,@RequestParam(defaultValue="0") int minprice,
        @RequestParam(defaultValue="9999") int maxprice,@RequestParam(defaultValue="0") int pageNo,@RequestParam(defaultValue="4") int collPerPage){

            Page<CollectionStore> coll = new PageImpl<>(new ArrayList<>());

            if(size.isEmpty() && color.isEmpty()){

                coll = collService.filterByRatePrd(minprice, maxprice, prdId, PageRequest.of(pageNo, collPerPage));

            }else if(size.isEmpty()){

                coll = collService.filterByColorPrd(color, minprice, maxprice, prdId, PageRequest.of(pageNo,collPerPage));

            }else if(color.isEmpty()){

                coll = collService.filterBySizePrd(size, minprice, maxprice, prdId, PageRequest.of(pageNo,collPerPage));

            }else{

                coll = collService.filterBySizeColorPrd(size, color, minprice, maxprice, prdId, PageRequest.of(pageNo,collPerPage));
            }

            List<ViewCollectionDTO> viewCollection = new ArrayList<>();

            for(CollectionStore collInLoop : coll.getContent()){

                viewCollection.add(new ViewCollectionDTO(prdId, collInLoop.getCollId(), collInLoop.getCollName(),
                    collInLoop.getCollType(), collInLoop.getImg()));
            }

            Long totColl = coll.getTotalElements();

            PageCollectionsAndTotal collTot = new PageCollectionsAndTotal(viewCollection,totColl);

            if (viewCollection.isEmpty()) {
                return ResponseEntity.badRequest().body("There Is No Collection Exist For This Product!");
            }

        return ResponseEntity.ok(collTot);
    }

//----- Add Collections ---------------------------------------------------------------------------------------------------------------------------------------------
    
    @PostMapping("/add/{prdId}")
    @Operation(summary="Add a Collection -----: ADMIN")
    @ApiResponse(responseCode="403", description="Forbidden:Need Higher Authority Level")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> addCollectionByPrdId(@Valid @RequestBody AddUpdCollectionDTO addUpdCollectionDTO,@PathVariable long prdId) {

        Optional<Product> optProd = prodService.findById(prdId);
        if(!optProd.isPresent()){
            return ResponseEntity.badRequest().body("No product Exist!");
        }

        Product prod = optProd.get();

        CollectionStore coll = new CollectionStore();
        coll.setCollName(addUpdCollectionDTO.getCollName());
        coll.setCollType(addUpdCollectionDTO.getCollType());
        coll.setProduct(prod);
        collService.save(coll);       
        
        return ResponseEntity.ok("Collection Added Successfully!");
    }

//----- View Collections -----------------------------------------------------------------------------------------------------------------------------

//----- View All Collections
    
    @GetMapping("/view-all")
    @Operation(summary="view All Collections")
    public ResponseEntity<?> viewAllCollections() {

        List<CollectionStore> allCollections = collService.findAll();
        List<ViewCollectionDTO> viewCollection = new ArrayList<>();

        for(CollectionStore coll : allCollections){
            Product prod = coll.getProduct();
            viewCollection.add(new ViewCollectionDTO(prod.getPrdId(),coll.getCollId(), coll.getCollName(),coll.getCollType(),coll.getImg()));
        }
        
        return ResponseEntity.ok(viewCollection);
    }

//---- View Collection By Colection Id

    @GetMapping("/view-by-collId/{collId}")
    @Operation(summary="View Collection By Collection Id")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> viewCollById(@PathVariable Long collId) {

        Optional<CollectionStore> optColl = collService.findById(collId);
        if(!optColl.isPresent()){
            return ResponseEntity.badRequest().body("No Collection Exist!");
        }

        CollectionStore coll = optColl.get();
        ViewCollectionDTO viewCollection = new ViewCollectionDTO(coll.getProduct().getPrdId(), collId, coll.getCollName(),coll.getCollType(), coll.getImg());
        return ResponseEntity.ok(viewCollection);
    }
    

//----- View Collection Product Id 
    
    @GetMapping("/view-by-prdId/{prdId}")
    @Operation(summary="View Collection By Product Id")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> viewCollectionByPrdId(@PathVariable Long prdId){

        Optional<Product> optProd = prodService.findById(prdId);
        if(!optProd.isPresent()){
            return ResponseEntity.badRequest().body("No Product Exist!");
        }

        List<CollectionStore> collByProdId = collService.findByPrdId(prdId);
        List<ViewCollectionDTO> viewCollection = new ArrayList<>();

        for(CollectionStore coll : collByProdId){
            viewCollection.add(new ViewCollectionDTO(prdId, coll.getCollId(), coll.getCollName(), coll.getCollType(),coll.getImg()));
        }

        return ResponseEntity.ok(viewCollection);

    }

//----- Upload Images For Collection -------------------------------------------------------------------------------------------------------------------

    @PostMapping(value="/upload-coll-img/{collId}",consumes = "multipart/form-data" )
    @Operation(summary = "Add Collection Image -----:ADMIN")
    @SecurityRequirement(name ="faiz")
    public ResponseEntity<?> uploadCollImg(@PathVariable Long collId,@RequestPart MultipartFile file) throws IOException {

        //----- STORE IMAGE IN DATABASE ------------------------------------------------------------------------------------

        String contentType = file.getContentType();
        if(!( (contentType.equals("image/png")) ||
               (contentType.equals("image/jpg")) ||
               (contentType.equals("image/jpeg")) )
            ){
                return ResponseEntity.badRequest().body("Image Type Invalid");
            }

        String originalFileName = file.getOriginalFilename();

        String randomGeneratedString = RandomStringUtils.randomAlphabetic(3);
        String filename = randomGeneratedString+originalFileName;

        Optional<CollectionStore> optColl = collService.findById(collId);
        if(!optColl.isPresent()){
            return ResponseEntity.badRequest().body("No Collection Exist!");
        }
        
        CollectionStore coll = optColl.get();
        coll.setImg(filename);
        collService.save(coll);

        //----- STORE IMAGE IN OUR SERVER ------------------------------------------------------------------------------------------

        String fileLocation = Urls_Images.getAbsolutePath("collection_images",coll.getCollName(),collId,filename);
        Files.copy(file.getInputStream(),Paths.get(fileLocation),StandardCopyOption.REPLACE_EXISTING);

        return ResponseEntity.ok("Collection Image Uploaded Successfully");
    }

//----- Download Collection Image ----------------------------------------------------------------------------------------------------------------------

    @GetMapping("/get-coll-img/{collId}")
    @Operation(summary = "Get the Collection Image")
    public ResponseEntity<?> getCollectionImage(@PathVariable Long collId) throws IOException,MalformedURLException {

        Optional<CollectionStore> optColl = collService.findById(collId);
        if(!optColl.isPresent()){
            return ResponseEntity.badRequest().body("No Collection Exists!");
        }

        CollectionStore coll = optColl.get();

        Resource resourceLink = Urls_Images.getResourceUrl("collection_images",coll.getCollName(), collId,coll.getImg());

        String contentType = Files.probeContentType(resourceLink.getFile().toPath());

        String headerContentDispositionValues = "attachment;filename="+coll.getImg();

        return ResponseEntity.ok()
                             .contentType(MediaType.parseMediaType(contentType))
                             .header(HttpHeaders.CONTENT_DISPOSITION,headerContentDispositionValues)
                             .body(resourceLink);
        }

//----- Update Collections By Id -----------------------------------------------------------------------------------------------------------------------
    
    @PutMapping("/update-by-id/{collId}")
    @Operation(summary="Update Collection -----: ADMIN")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> updateCollectionById(@RequestBody AddUpdCollectionDTO addUpdCollectionDTO,@PathVariable Long collId ) {

        Optional<CollectionStore> optColl = collService.findById(collId);
        if(!optColl.isPresent()){
            return ResponseEntity.badRequest().body("No Collection Exist!");
        }

        CollectionStore coll = optColl.get();

        String oldFolder = coll.getCollName();
        String newFolder = addUpdCollectionDTO.getCollName();

        coll.setCollName(addUpdCollectionDTO.getCollName());
        coll.setCollType(addUpdCollectionDTO.getCollType());
        collService.save(coll);

        File oldFolderName = new File("closetculture-backend\\uploads\\Images\\collection_images\\"+oldFolder);
        File newFolderName = new File("closetculture-backend\\uploads\\Images\\collection_images\\"+newFolder);
        oldFolderName.renameTo(newFolderName);
        System.out.println("Folder Name Changed Successfully!!!..................................................................");
        
        return ResponseEntity.ok("Collection Updated Successfully!");
    }

//----- Delete Collection By id ------------------------------------------------------------------------------------------------------------------------
    
    @DeleteMapping("/delete-by-id/{collId}")
    @Operation(summary="Delete Collection -----: ADMIN")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> deleteCollectionById(@PathVariable Long collId) throws IOException{
         
        Optional<CollectionStore> optColl = collService.findById(collId);
        if(!optColl.isPresent()){
            return ResponseEntity.badRequest().body("No Collection Exist!");
        }

        CollectionStore coll  = optColl.get();

        /*Deleting Image */
        Path imgDeletePath = Paths.get("closetculture-backend\\uploads\\Images\\collection_images\\"+coll.getCollName()+"\\"+coll.getCollId()+"\\"+coll.getImg());
        if(Files.exists(imgDeletePath)){
            Files.delete(imgDeletePath);
        } 

        /*Deleteing the CollId folder */
        Path collIdDeletePath = Paths.get("closetculture-backend\\uploads\\Images\\collection_images\\"+coll.getCollName()+"\\"+coll.getCollId());
        if(Files.exists(collIdDeletePath)){
            Files.delete(collIdDeletePath);
        } 
        
        /*Deleteing the Collection name folder */
        Path collNameDeletePath = Paths.get("closetculture-backend\\uploads\\Images\\collection_images\\"+coll.getCollName());
        if(Files.exists(collNameDeletePath)){
            Files.delete(collNameDeletePath);
        } 

        /** WE CAN ALSO USE Recursive Deletion ---> check StockController delete by id */


        collService.deleteById(collId);

        return ResponseEntity.ok("Collection Deleted Successfully!");
    }
    

    
}

package com.ecommerce.closetculture.controller.adminSide;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.closetculture.DTO.stockDTO.AddUpdStockDTO;
import com.ecommerce.closetculture.DTO.stockDTO.ViewStockDTO;
import com.ecommerce.closetculture.model.adminSide.CollectionStore;
import com.ecommerce.closetculture.model.adminSide.Stock;
import com.ecommerce.closetculture.services.adminSide_Services.CollServices;
import com.ecommerce.closetculture.services.adminSide_Services.StockServices;
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

@RestController
@RequestMapping("/stock")
public class StockController {

    @Autowired
    CollServices collService;
    
    @Autowired
    StockServices stkService;

//----- Add A Stock -------------------------------------------------------------------------------------------------------------------------------

    @PostMapping(value="/add/{collId}")
    @Operation(summary="Add a Stock -----: ADMIN")
    @ApiResponse(responseCode="403", description="Forbidden:Need Higher Authority Level")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> addStockByCollId(
        @Valid @RequestBody AddUpdStockDTO addUpdStockDto,@PathVariable long collId) {

        Optional<CollectionStore> optColl = collService.findById(collId);
        if(!optColl.isPresent()){
            return ResponseEntity.badRequest().body("No Collection Exist!");
        }

        CollectionStore coll = optColl.get();

        Stock stk = new Stock();
        stk.setSize(addUpdStockDto.getSize());
        stk.setColor(addUpdStockDto.getColor());
        stk.setRate(addUpdStockDto.getRate());
        stk.setStockAvl(addUpdStockDto.getStockAvl());
        stk.setCollectionStore(coll);
        stkService.save(stk);       
        
        return ResponseEntity.ok("Stock Added Successfully!");
    }

//----- View Stocks -----------------------------------------------------------------------------------------------------------------------------

//----- View All Stocks
    
    @GetMapping("/view-all")
    @Operation(summary="view All Stocks -----:ADMIN")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> viewAllStocks() {

        List<Stock> allStocks = stkService.findAll();
        List<ViewStockDTO> viewStock = new ArrayList<>();

        for(Stock stk : allStocks){
            CollectionStore coll = stk.getCollectionStore();
            viewStock.add(new ViewStockDTO(coll.getCollId(),stk.getStkId(),coll.getCollName(), stk.getSize(),stk.getColor(),stk.getRate(),stk.getStockAvl()));
        }
        
        return ResponseEntity.ok(viewStock);
    }

//----- View Stock By Stock Id

    @GetMapping("/view-by-stkId/{stkId}")
    @Operation(summary="View Stock By Stock Id")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> viewStkByStkId(@PathVariable Long stkId ) {

        Optional<Stock> optStk = stkService.findById(stkId);
        if(!optStk.isPresent()){
            return ResponseEntity.badRequest().body("No Stock Exists !");
        }

        Stock stk = optStk.get();
        return ResponseEntity.ok(new ViewStockDTO(stk.getCollectionStore().getCollId(),stkId,stk.getCollectionStore().getCollName(),
                                stk.getSize(),stk.getColor(),stk.getRate(),stk.getStockAvl()));
    }

//----- View Stock By Collection Id 
    
    @GetMapping("/view-by-collId/{collId}")
    @Operation(summary="View Stock By Collection Id")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> viewStockByCollId(@PathVariable Long collId){

        Optional<CollectionStore> optColl = collService.findById(collId);
        if(!optColl.isPresent()){
            return ResponseEntity.badRequest().body("No Collection Exist!");
        }

        CollectionStore coll = optColl.get();

        List<Stock> stkByCollId = stkService.findByCollId(collId);
        List<ViewStockDTO> viewStock = new ArrayList<>();

        for(Stock stk : stkByCollId){
            viewStock.add(new ViewStockDTO(collId, stk.getStkId(),coll.getCollName(), stk.getSize(),stk.getColor(),stk.getRate(),stk.getStockAvl()));
        }

        return ResponseEntity.ok(viewStock);

    }

//----- Update Stock By Stock Id -----------------------------------------------------------------------------------------------------------------------
    
    @PutMapping("/update-by-id/{stkId}")
    @Operation(summary="Update Stock -----: ADMIN")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> updateStockById(@RequestBody AddUpdStockDTO addUpdStockDTO,@PathVariable Long stkId ) {

        Optional<Stock> optStk = stkService.findById(stkId);
        if(!optStk.isPresent()){
            return ResponseEntity.badRequest().body("No Stock Exist!");
        }

        Stock stk = optStk.get();
        stk.setSize(addUpdStockDTO.getSize());
        stk.setColor(addUpdStockDTO.getColor());
        stk.setRate(addUpdStockDTO.getRate());
        stk.setStockAvl(addUpdStockDTO.getStockAvl());
        stkService.save(stk);
        
        return ResponseEntity.ok("Stock Updated Successfully!");
    }

//----- Image Upload For Stock -------------------------------------------------------------------------------------------------------------------------

    @PostMapping(value ="/upload-stk-img/{stkId}",consumes="multipart/form-data")
    @Operation(summary = "Add Stock Image -----:ADMIN")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> uploadStockImg(@RequestPart(name="file",required=true) MultipartFile file,@PathVariable Long stkId) throws IOException {

        //----- STORE IMAGE IN DATABASE ------------------------------------------------------------------------------------

        String uploadedFileContentType = file.getContentType();
        if(!(uploadedFileContentType.equals("image/png")||
            uploadedFileContentType.equals("image/jpg")||
            uploadedFileContentType.equals("image/jpeg"))){
                return ResponseEntity.badRequest().body("Image Type Invalid");
            }

        String originalfileName = file.getOriginalFilename();
        String randomGeneratedString = RandomStringUtils.randomAlphabetic(3);

        String filename = randomGeneratedString+originalfileName;

        Optional<Stock> optStk = stkService.findById(stkId);
        if(!optStk.isPresent()){
            return ResponseEntity.badRequest().body("No Stock Exist!");
        }

        Stock stk = optStk.get();
        stk.setImg(filename);
        stkService.save(stk);

        //----- STORE IMAGE IN OUR SERVER ------------------------------------------------------------------------------------------

        String fileLocation = Urls_Images.getAbsolutePath("stock_images",stk.getCollectionStore().getCollName(),stk.getStkId(),filename);
        Files.copy(file.getInputStream(), Paths.get(fileLocation), StandardCopyOption.REPLACE_EXISTING);
            
        return ResponseEntity.ok("Stock Image Uploaded Successfully");
    }

//----- Download Stock Image -----------------------------------------------------------------------------------------------------------------------

    @GetMapping("/get-stock-img/{stkId}")
    @Operation(summary = "Get the Stock Image")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> getStockImage(@PathVariable Long stkId) throws IOException{

        Optional<Stock> optStk = stkService.findById(stkId);
        if(!optStk.isPresent()){
            return ResponseEntity.badRequest().body("No Stock Exist");
        }

        Stock stk = optStk.get();

        try{
        
            Resource resourceLink = Urls_Images.getResourceUrl("stock_images",stk.getCollectionStore().getCollName(),stkId,stk.getImg()); 
            
            String contentType = Files.probeContentType(resourceLink.getFile().toPath());

            String headerContentDispositionValues = "attachment;filename="+stk.getImg();

            return ResponseEntity.ok()
                                .contentType(MediaType.parseMediaType(contentType))
                                .header(HttpHeaders.CONTENT_DISPOSITION,headerContentDispositionValues)
                                .body(resourceLink);
            
        }catch(MalformedURLException e){
            return ResponseEntity.badRequest().body("MalformedURLException occured!");
        }

    }
    
    

//----- Delete stock By Stock Id ------------------------------------------------------------------------------------------------------------------------
    
    @DeleteMapping("/delete-by-id/{stkId}")
    @Operation(summary="Delete Stock -----: ADMIN")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> deleteStockById(@PathVariable Long stkId) throws IOException{
         
        Optional<Stock> optStk = stkService.findById(stkId);
        if(!optStk.isPresent()){
            return ResponseEntity.badRequest().body("No Stock Exist!");
        }

        Stock stk = optStk.get();

        Path imgDeletePath = Paths.get("closetculture-backend\\uploads\\Images\\stock_images\\"+stk.getCollectionStore().getCollName()+"\\"+stkId);

        if(Files.exists(imgDeletePath)){
            Files.walk(imgDeletePath)
                .sorted(Comparator.reverseOrder())
                .forEach( (path) -> {
                    try{
                        Files.delete(path);
                    }catch(IOException e){
                        e.printStackTrace();
                    }
                });
        }

        /*We can do like this or here we know we have only one file image in the stkId folder so we just directly give the path like 
         * "closetculture-backend\\uploads\\Images\\stock_images\\"+stk.getCollectionStore().getCollName()+"\\"+stkId+stk.getImg() and delete the image 
         * AND THEN , again do one deletion for empty stkId folder by giving the path like "closetculture-backend\\uploads\\Images\\stock_images\\"+stk.getCollectionStore().getCollName()+"\\"+stkId
         * 
         * Here,we first delete the file inside the folder nd then delete the folder. ---> check collection controller delete by id.
         * 
         * The ABOVE METHOD IS VERY USEFUL WHEN WE HAVE MULTIPLE FILES.
         */


        stkService.deleteById(stkId);

        return ResponseEntity.ok("Stock Deleted Successfully!");
    }

}

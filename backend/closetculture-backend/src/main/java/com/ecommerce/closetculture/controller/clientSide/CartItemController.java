package com.ecommerce.closetculture.controller.clientSide;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.closetculture.DTO.cartDTO.CartQtyUpdDTO;
import com.ecommerce.closetculture.DTO.cartDTO.ViewCartDTO;
import com.ecommerce.closetculture.model.Account;
import com.ecommerce.closetculture.model.adminSide.Stock;
import com.ecommerce.closetculture.model.clientSide.OrderItem;
import com.ecommerce.closetculture.services.AccServices;
import com.ecommerce.closetculture.services.adminSide_Services.StockServices;
import com.ecommerce.closetculture.services.clientSide_Services.OrderItemServices;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/cart-item")
public class CartItemController {

    @Autowired
    AccServices accService;

    @Autowired
    StockServices stkService;

    @Autowired
    OrderItemServices odrItmService;


//----- Add to Cart -------------------------------------------------------------------------------------------------------------------------------

    @PostMapping("/add/{stkId}")
    @Operation(summary = "Add Item To Cart")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> addToCart(@PathVariable Long stkId,Authentication authentication) {

        Optional<Stock> optStk = stkService.findById(stkId);
        if(!optStk.isPresent()){
            return ResponseEntity.badRequest().body("No Stock Exist!");
        }

        Stock stk = optStk.get();
        Optional<Account> optAcc = accService.findByEmail(authentication.getName());
        if(!optAcc.isPresent()){
            return ResponseEntity.badRequest().body("No Account Exists");
        }

        Account acc = optAcc.get();

        boolean inCart = acc.getCart().stream().anyMatch(odrItm -> odrItm.getStock().getStkId().equals(stkId) && odrItm.getInCart());

        if(inCart){
            return ResponseEntity.badRequest().body("Item Already In Cart");
        }

        OrderItem odrItm = new OrderItem();
        odrItm.setQuantity(1L);
        odrItm.setInCart(true);
        odrItm.setStock(stk);
        odrItm.setAccount(acc);
        odrItmService.save(odrItm);

        return ResponseEntity.ok("Cart Added Succesfully!!");
    }

//----- View Cart --------------------------------------------------------------------------------------------------------------------------------
    
//----- View All Cart Items
    @GetMapping("/view-all")
    @Operation(summary="View All Cart Items")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> viewAllCart(Authentication authentication) {

        Optional<Account> optAcc = accService.findByEmail(authentication.getName());
        if(!optAcc.isPresent()){
            return ResponseEntity.badRequest().body("No Account Exist!");
        }

        Account acc = optAcc.get();

        List<ViewCartDTO> viewCarts = new ArrayList<>(); 

        for(OrderItem odrItm : acc.getCart() ){

            if(odrItm.getInCart()){
                viewCarts.add(new ViewCartDTO(odrItm.getStock().getStkId(), odrItm.getStock().getCollectionStore().getCollName(), 
                                        odrItm.getStock().getSize(), odrItm.getStock().getColor(), odrItm.getStock().getRate(),odrItm.getQuantity()));
            }
            
        }

        return ResponseEntity.ok(viewCarts);
    }

//----- Update Cart Quantity Only -----------------------------------------------------------------------------------------------------------------------

    @PutMapping("/update-cart-item-quantity/{stkId}")
    @Operation(summary ="Update You Cart Item Quantity")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> updateCrtItmQty(Authentication authentication,@PathVariable Long stkId,@RequestBody CartQtyUpdDTO crtQtyUpdDto) {

        Optional<Account> optAcc = accService.findByEmail(authentication.getName());
        Account acc = optAcc.get();

        acc.getCart().stream()
                     .filter( odrItm -> odrItm.getStock().getStkId().equals(stkId) && odrItm.getInCart())
                     .findFirst()
                     .ifPresent( odrItm ->{ 
                                    odrItm.setQuantity(crtQtyUpdDto.getQuantity());
                                    odrItmService.save(odrItm);
                     });


        return ResponseEntity.ok("Successfully Quantity Updated !");
    }

//----- View Cart By Account Id
    // @GetMapping("/view-by-accId/{accId}")
    // @Operation(summary = "View Cart Items By Account Id -----: ADMIN")
    // @SecurityRequirement(name="faiz")
    // public ResponseEntity<?> viewCartItmByAccId(@PathVariable Long accId) {
    //     Optional<Account> optAcc = accService.findById(accId);
    //     if(!optAcc.isPresent()){
    //         return ResponseEntity.badRequest().body("No Account Exist!");
    //     }
    //     Account acc = optAcc.get();
    //     Cart crt = crtService.findByAccId(acc.getAccId());
    //     List<CartItems> cartItmByAccId = crtItmService.findByCrtId(crt.getCrtId());
    //     List<ViewCartDTO> viewCarts = new ArrayList<>(); 
    //     for(CartItems crtInLoop : cartItmByAccId ){
    //         viewCarts.add(new ViewCartDTO(crtInLoop.getItemId(), crtInLoop.getCollName(), crtInLoop.getSize(), crtInLoop.getColor(), crtInLoop.getRate()));
    //     }
    //     return ResponseEntity.ok(viewCarts);
    // }
    
//----- View Cart By Cart Id 
    // @GetMapping("/view-by-crtId/{crtId}")
    // @Operation(summary = "View Cart Items By CrtId -----:ADMIN")
    // @SecurityRequirement(name="faiz")
    // public ResponseEntity<?> viewCartItmByCrtId(@PathVariable Long crtId,Authentication authentication) {
    //     Optional<Cart> optCrt = crtService.findById(crtId);
    //     if(!optCrt.isPresent()){
    //         return ResponseEntity.badRequest().body("No Cart Exist!");
    //     }
    //     List<CartItems> cartItemsByCrtId = crtItmService.findByCrtId(crtId);
    //     List<ViewCartDTO> viewCartItems = new ArrayList<>();
    //     for(CartItems crt : cartItemsByCrtId ){
    //         viewCartItems.add(new ViewCartDTO(crt.getItemId(), crt.getCollName(), crt.getSize(), crt.getColor(), crt.getRate()));
    //     }
    //     return ResponseEntity.ok(viewCartItems);
    // }

//----- View Cart By Stock Id(to see ethana per indha stock ah order potrukanga)

//----- Delete Cart item By Id --------------------------------------------------------------------------------------------------------------------------

    @DeleteMapping("/delete/{stkId}")
    @Operation(summary = "Delete a Cart Item")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> deleteCartItemById(@PathVariable Long stkId,Authentication authentication){
        
        Optional<Account> optAcc = accService.findByEmail(authentication.getName());
        Account acc = optAcc.get();

        acc.getCart().stream()
                    .filter( odrItm -> odrItm.getStock().getStkId().equals(stkId) && odrItm.getInCart())
                    .findFirst()
                    .ifPresent( odrItm -> {
                        System.out.println("Entered ifPresent "+odrItm.getOrderItmId()+"...........................................................................");
                        acc.getCart().remove(odrItm); 
                        /*Removing here manually because,
                         * we put cascade in the account for the cart list -> it means when there is any modification happen in parent(Account),do the
                         * same to the child List<OrderItem>. -=-=-=>BUT HERE"S THE CATCH!!
                         * so when i directly try to delete a child(any OrderItem in List) like below,Hibernate sees thet it is attached to this 
                         * Account(parent) and faiz says me to do changes in child if Account(parent) gets any changes(cascade).So hibernate thought 
                         * like "this child is connected to Account , “Why is he trying to delete something that's still attached to the parent? 
                         * 🤔 I’ll ignore this to avoid breaking consistency.”"
                         */
                        odrItmService.deleteById(odrItm.getOrderItmId());
                    
                    });
        
        return ResponseEntity.ok("Item Successfully Removed!");

    }

//----- Clear Cart items ----------------------------------------------------------------------------------------------------------------------------------

    @DeleteMapping("/clear")
    @Operation(summary = "Clear All Cart Items")
    @SecurityRequirement(name = "faiz")
    public ResponseEntity<?> clearCartItems(Authentication authentication){

        Optional<Account> optAcc =accService.findByEmail(authentication.getName());
        Account acc = optAcc.get();

        if(acc.getCart().size() <= 0){
            return ResponseEntity.badRequest().body("No Cart Item Exists");
        } 

        // for(OrderItem odrItm : acc.getCart()){
            
        //     if(odrItm.getInCart()){
        //         acc.getCart().remove(odrItm);
        //         odrItmService.deleteById(odrItm.getOrderItmId());
        //     }
        // }
        //We can't do like above, because we modify the list during iteration on the same list.trying to remove elements from a list while iterating over it using a for-each loop. That’s illegal in Java.

        Iterator<OrderItem> iterator= acc.getCart().iterator();

        while(iterator.hasNext()){

            OrderItem odrItm = iterator.next();

            if(odrItm.getInCart()){
                iterator.remove();
                odrItmService.deleteById(odrItm.getOrderItmId());
            }

        }

        return ResponseEntity.ok("Cart Items cleared !");
    }
    
}

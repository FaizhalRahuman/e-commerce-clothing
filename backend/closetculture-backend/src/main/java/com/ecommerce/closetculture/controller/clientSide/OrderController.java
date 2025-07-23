package com.ecommerce.closetculture.controller.clientSide;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.closetculture.DTO.orderDTO.AddOrderByCartDTO;
import com.ecommerce.closetculture.DTO.orderDTO.AddOrderDTO;
import com.ecommerce.closetculture.DTO.orderDTO.ViewOrderDTO;
import com.ecommerce.closetculture.model.Account;
import com.ecommerce.closetculture.model.adminSide.Stock;
import com.ecommerce.closetculture.model.clientSide.Order;
import com.ecommerce.closetculture.model.clientSide.OrderItem;
import com.ecommerce.closetculture.services.AccServices;
import com.ecommerce.closetculture.services.EmailServices;
import com.ecommerce.closetculture.services.adminSide_Services.StockServices;
import com.ecommerce.closetculture.services.clientSide_Services.OrderItemServices;
import com.ecommerce.closetculture.services.clientSide_Services.OrderServices;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    AccServices accService;

    @Autowired
    StockServices stkService;

    @Autowired
    OrderItemServices odrItmService;

    @Autowired
    OrderServices orderService;

    @Autowired
    EmailServices emailService;

//----- Place Order /add order to db ---------------------------------------------------------------------------------------------------------------------------
    
    @PostMapping("/place/{stkId}")
    @Operation(summary = "Place your Order Here!")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> placeOrder(@PathVariable Long stkId,@RequestBody AddOrderDTO addOrderDto,Authentication authentication) {

        Optional<Account> optAcc = accService.findByEmail(authentication.getName());
        Account acc = optAcc.get();

        Optional<Stock> optStk = stkService.findById(stkId);
        Stock stk = optStk.get();

        if(stk.getStockAvl() < addOrderDto.getQuantity() ){
            return ResponseEntity.badRequest().body("No Stocks Available!");
        }

        //----- Order Place -------------

        ZoneId zone = ZoneId.of("Asia/Kolkata");
        // ✔️ Gets the time zone for India (IST).

        ZonedDateTime orderTime = Instant.now().atZone(zone);
        ZonedDateTime delivertime = Instant.now().atZone(zone).plus(2,ChronoUnit.DAYS);
        // ✔️ Converts Instant.now() (which is in UTC) into ZonedDateTime using IST.
        // ✔️ Adds 2 days for delivery time. Clean and correct.

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy | HH.mm");
        // ✔️ Formatter for day-month-year | hour.minute.second format. Perfect for display!

        String formattedOrderTime = orderTime.format(formatter);
        String formattedDeliverTime = delivertime.format(formatter);
        // ✔️ Formats the date/time to string properly.



        Order order = new Order();
        order.setBuyerName(acc.getName());
        order.setBuyerAddress(addOrderDto.getBuyerAddress());
        order.setBuyerPhNo(addOrderDto.getBuyerPhNo());
        order.setTotAmt(stk.getRate());
        order.setPaymentType(addOrderDto.getPaymentType());
        order.setOrderTime(formattedOrderTime);
        order.setDeliveryTime(formattedDeliverTime);
        order.setAccount(acc);
        

        //----- Order Item --------------

        OrderItem odrItm = new OrderItem();

        odrItm.setQuantity(addOrderDto.getQuantity());
        odrItm.setInCart(false);
        odrItm.setStock(stk);
        odrItm.setOrder(order);
        odrItm.setAccount(acc);

        //manually adding into list ---> List<OrderItem> orderedItems = new ArrayList<>();
        order.getOrderedItems().add(odrItm);
        orderService.save(order); //---> when i save order and it have the list OrderItems,here i when put the orderIems inside list in Order and save Order,JPA automatically saves orderItem also(which we put in the list) 

        //----- Reducing Stock ----------

        stk.setStockAvl(stk.getStockAvl()-addOrderDto.getQuantity());
        stkService.save(stk);

        //----- Sending Order Mail To User ------

        emailService.sendOrderEmail(acc.getEmail(), "Closet Culture", order);


        return ResponseEntity.ok("Order Placed Successfully!");
    }

//----- Place Order Via Cart ------------------------------------------------------------------------------------------------------------------------------------
    @PostMapping("/place-via-cart")
    @Operation(summary = "Place Order Via Cart")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> placeOrderViaCart(Authentication authentication,@RequestBody AddOrderByCartDTO addOrderByCartDto) {

        Optional<Account> optAcc = accService.findByEmail(authentication.getName());
        if(!optAcc.isPresent()){
            return ResponseEntity.badRequest().body("No Account Exist!");
        }

        Account acc = optAcc.get();
        List<OrderItem> cartItems = acc.getCart(); //IMPORTANT:- even if we clear the cart list after order is placed and again the user place an another order,and enter into this api and this excutes it again takes all the order items in the DB and put it in this list ,because we just clear the cart list below and not in the db(because of data need),so when this line executes it takes all the orderItems in db which matches this accId(acc) so again previously ordered items also come(which is not in cart),so we do below for loop.

        Iterator<OrderItem> iterator = acc.getCart().iterator();

        while(iterator.hasNext()){
            OrderItem itm = iterator.next();
            if(itm.getInCart() == false){
                iterator.remove();
            }
        }

        if(cartItems.isEmpty()){
            return ResponseEntity.badRequest().body("Your Cart Is Empty!!");
        }


        //----- Order Place -------------

        ZoneId zone = ZoneId.of("Asia/Kolkata");
        // ✔️ Gets the time zone for India (IST).

        ZonedDateTime orderTime = Instant.now().atZone(zone);
        ZonedDateTime delivertime = Instant.now().atZone(zone).plus(2,ChronoUnit.DAYS);
        // ✔️ Converts Instant.now() (which is in UTC) into ZonedDateTime using IST.
        // ✔️ Adds 2 days for delivery time. Clean and correct.

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy | HH.mm");
        // ✔️ Formatter for day-month-year | hour.minute.second format. Perfect for display!

        String formattedOrderTime = orderTime.format(formatter);
        String formattedDeliverTime = delivertime.format(formatter);
        // ✔️ Formats the date/time to string properly.

        for(OrderItem odrItm : cartItems){

            System.out.println("ORDERITEMS>>>>>>>>"+odrItm.getOrderItmId()+odrItm.getQuantity()+odrItm.getInCart() +"..........................");
            if(odrItm.getStock().getStockAvl() == 0){
                return ResponseEntity.badRequest().body("No Stock Available For This Item: "+odrItm.getStock().getCollectionStore().getCollName()
                                                            +"\n REMOVE THIS ITEM BEFORE PLACING ORDER !");

            }else if(odrItm.getStock().getStockAvl() > 0 &&  odrItm.getStock().getStockAvl() < odrItm.getQuantity()){
                return ResponseEntity.badRequest().body("Less Stock Available, Please Reduce Quantity !");
        }

        }

        Long totAmt = 0L;

        for(OrderItem odrItm : cartItems){

            Stock stk = odrItm.getStock();
            stk.setStockAvl(stk.getStockAvl()-odrItm.getQuantity());

            totAmt += (Long)odrItm.getQuantity() * stk.getRate();

        }

        Order order = new Order();
        order.setBuyerName(acc.getName());
        order.setBuyerAddress(addOrderByCartDto.getBuyerAddress());
        order.setBuyerPhNo(addOrderByCartDto.getBuyerPhNo());
        order.setTotAmt(totAmt);
        order.setPaymentType(addOrderByCartDto.getPaymentType());
        order.setOrderTime(formattedOrderTime);
        order.setDeliveryTime(formattedDeliverTime);
        order.setAccount(acc);
        orderService.save(order);

        for(OrderItem odrItm : cartItems){
            odrItm.setOrder(order);
            odrItm.setInCart(false);

            order.getOrderedItems().add(odrItm);
            orderService.save(order);
        }

        cartItems.clear();

        accService.save(acc);



        emailService.sendOrderEmail(acc.getEmail(), "Closet Culture", order);

        return ResponseEntity.ok("Order Placed Successfully!!");
    }
    

//----- View Orders History --------------------------------------------------------------------------------------------------------------------------------------

    @GetMapping("/view-orders")
    @Operation(summary = "View All Orders Placed So Far")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> viewOrders(Authentication authentication) {

        Optional<Account> optAcc = accService.findByEmail(authentication.getName());
        Account acc = optAcc.get();

        List<ViewOrderDTO> viewOrders = new ArrayList<>();
        List<Order> ordersForAcc = acc.getOrder();

        for(Order order : ordersForAcc){

            for(OrderItem odrItm : order.getOrderedItems()){

                if(odrItm.getInCart() == false){
                    viewOrders.add( new ViewOrderDTO(order.getOrderId(), odrItm.getStock().getCollectionStore().getCollName(), odrItm.getQuantity() , order.getDeliveryTime()));
                }

            }
            
        }

        return ResponseEntity.ok(viewOrders);
    }

//----- Cancel Order / delete order from db by Order Id -----------------------------------------------------------------------------------------------------------

    @DeleteMapping("/cancel/{orderId}")
    @Operation(summary="Cancel Order")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> cancelOrder (@PathVariable Long orderId) {

        Optional<Order> optOrder = orderService.findById(orderId);
        if(!optOrder.isPresent()){
            return ResponseEntity.badRequest().body("No Order Exist");
        }

        Order order = optOrder.get();

        for(OrderItem odrItm : order.getOrderedItems()){

            odrItm.setInCart(true);

            Stock stk = odrItm.getStock();
            stk.setStockAvl(stk.getStockAvl()+odrItm.getQuantity());
            stkService.save(stk);
        }

        orderService.deleteById(orderId);

        return ResponseEntity.ok("Order Cancelled !! ");
    }
    
    
}

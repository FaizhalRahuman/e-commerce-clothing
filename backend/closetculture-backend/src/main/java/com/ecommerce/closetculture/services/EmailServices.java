package com.ecommerce.closetculture.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ecommerce.closetculture.model.clientSide.Order;
import com.ecommerce.closetculture.model.clientSide.OrderItem;

import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class EmailServices {

    @Autowired
    JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    String fromName;

    public void sendEmail(String to, String subject, String body) {

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromName);
            mail.setTo(to);
            mail.setSubject(subject);
            mail.setText(body);

            javaMailSender.send(mail);
            System.out.println("Mail Sent Successfully!!.............................................................");
        } catch (MailException e) {
            throw new MailSendException("Error While Sending Email");
        }
    }

//----- Sending Order Mail To User ---------------------------------------------------------------------------------------------------

    public void sendOrderEmail(String to, String subject, Order order) {

        String orderDetails = convertOrderToString(order);

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromName);
            mail.setTo(to);
            mail.setSubject(subject);
            mail.setText(orderDetails);

            javaMailSender.send(mail);
            System.out.println("Mail Sent Successfully!!.............................................................");
        } catch (MailException e) {
            throw new MailSendException("Error While Sending Email");
        }

    }

    //----- Converting Order Details Into String --------------------------------------------------------------------------------------

    public String convertOrderToString(Order order){

        String orderDetails = "Heyy!!"+order.getBuyerName()+","
            +"\nYour Order Is Placed !!"
            +"\n\nOrder Details :"
            +"\n Order Id : "+order.getOrderId()
            +"\n Order Time : "+order.getOrderTime()
            +"\n Delivery Time : "+order.getDeliveryTime()
            +"\n\nOrder Item : "; 

        for(OrderItem odrItm : order.getOrderedItems()){

            orderDetails += "\n Item : "+odrItm.getStock().getCollectionStore().getCollName()+" | "+odrItm.getStock().getColor()+" |" +odrItm.getStock().getSize();
            orderDetails += "\n Quantity : "+odrItm.getQuantity();
            orderDetails += "\n Item Price : "+odrItm.getStock().getRate();
            orderDetails += "\n -------------------------------------------";
        }

        orderDetails += "\n\n To Address : "+order.getBuyerAddress();
        orderDetails += "\n\n THANKS FOR VISITING US !! :) Be In Touch";
        orderDetails += "\n\t -Closet Culture";

        return orderDetails;



    }
}

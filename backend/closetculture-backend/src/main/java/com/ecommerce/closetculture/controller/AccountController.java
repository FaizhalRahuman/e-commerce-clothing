package com.ecommerce.closetculture.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.closetculture.DTO.accountDTO.AddAccountDTO;
import com.ecommerce.closetculture.DTO.accountDTO.ChangePasswordDTO;
import com.ecommerce.closetculture.DTO.accountDTO.ForgetPasswordDTO;
import com.ecommerce.closetculture.DTO.accountDTO.UpdAccountDTO;
import com.ecommerce.closetculture.DTO.accountDTO.ViewAccountDTO;
import com.ecommerce.closetculture.model.Account;
import com.ecommerce.closetculture.services.AccServices;
import com.ecommerce.closetculture.services.EmailServices;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/account")
public class AccountController {

    @Autowired
    AccServices accService;

    @Autowired
    EmailServices emailService;

    @Autowired
    PasswordEncoder passwordEncoder;

//----- Register New Account ----------------------------------------------------------------------------------------------------------------------

    @PostMapping("/register")
    @Operation(summary = "Register Account Here!")
    public ResponseEntity<?> registerAcc(@Valid @RequestBody AddAccountDTO addAccDto) {

        Optional<Account> optAccEmail = accService.findByEmail(addAccDto.getEmail());
        Optional<Account> optAccName = accService.findByName(addAccDto.getName());
        if(optAccEmail.isPresent()){
            return ResponseEntity.badRequest().body("Email already Exist: Try Another Email");
        }
        if(optAccName.isPresent()){
            return ResponseEntity.badRequest().body("Name already Exist: Try Another name");
        }

        Account acc = new Account();
        acc.setName(addAccDto.getName());
        acc.setEmail(addAccDto.getEmail());
        acc.setPassword(addAccDto.getPassword());
        accService.save(acc);

        return ResponseEntity.ok("successfully Registered!!");
    }

//----- View Account(By Admin/User) -------------------------------------------------------------------------------------------------------------------

    @GetMapping("/view")
    @Operation(summary = "View Your Account")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> viewAcc(Authentication authentication) {

        Optional<Account> optAcc = accService.findByEmail(authentication.getName());

        if(!optAcc.isPresent()){
            return ResponseEntity.badRequest().body("No Account Exist!");
        }

        Account acc = optAcc.get();
        ViewAccountDTO viewAcc = new ViewAccountDTO(acc.getAccId(),acc.getName(),acc.getEmail(),acc.getAuthority());

        return ResponseEntity.ok(viewAcc);
    }

//----- View Account By Id(For Admin) ------------------------------------------------------------------------------------------------------------------
    
    @GetMapping("/view-by-id/{accId}")
    @Operation(summary="View By Id -----: By ADMIN")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> viewAccById(@PathVariable Long accId) {

        Optional<Account> optAcc = accService.findById(accId);
        if(!optAcc.isPresent()){
            return ResponseEntity.badRequest().body("No Account Exist!");
        }

        Account acc = optAcc.get();

        ViewAccountDTO viewAcc = new ViewAccountDTO(acc.getAccId(),acc.getName(),acc.getEmail(),acc.getAuthority());

        return ResponseEntity.ok(viewAcc);
    }

//----- view Account By Account Email ----------------------------------------------------------------------------------------------------------------------

    @GetMapping("/view-by-email/{email}")
    @Operation(summary = "View Account By Email")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> getMethodName(@PathVariable String email) {

        Optional<Account> optAcc = accService.findByEmail(email);
        if(!optAcc.isPresent()){
            return ResponseEntity.badRequest().body("No Account Exist !");
        }

        Account acc = optAcc.get();

        return ResponseEntity.ok(new ViewAccountDTO(acc.getAccId(),acc.getName(),acc.getEmail(),acc.getAuthority()));
    }
    

//----- view/List All Account(By Admin) --------------------------------------------------------------------------------------------------------------------

    @GetMapping("/view-all")
    @Operation(summary = "View All Account -----: By ADMIN")
    @ApiResponse(responseCode="403",description="You Are Not Allowed To View Users!")
    @ApiResponse(responseCode="401",description="You Are Not Allowed To View Users!")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> viewAllAcc(){

        List<Account> allAcc = accService.findAll();
        if(allAcc.isEmpty()){
            return ResponseEntity.badRequest().body("NO ACCOUNTS AVAILABLE !");
        }
        List<ViewAccountDTO> allAccWithoutPass = new ArrayList<>();

        for(Account acc : allAcc){
            allAccWithoutPass.add(new ViewAccountDTO(acc.getAccId(), acc.getName(), acc.getEmail(), acc.getAuthority()));
        }

        return ResponseEntity.ok(allAccWithoutPass);
    }

//----- Update Account(By Admin/User) ----------------------------------------------------------------------------------------------------------------

    @PutMapping("/update")
    @Operation(summary = "Update Your Account")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> updateAcc(@Valid @RequestBody UpdAccountDTO updAccDto,Authentication authentication) {
        
        List<Account> allAcc = accService.findAll();

        Optional<Account> optAcc = accService.findByEmail(authentication.getName());
        if(!optAcc.isPresent()){
            return ResponseEntity.badRequest().body("No Account Exist!");
        }
        Account acc = optAcc.get();

        for(Account accInLoop : allAcc){

            if(accInLoop.equals(acc)) continue;

            if(accInLoop.getName().equals(updAccDto.getName())){
                System.out.println("Enter Name check");
                return ResponseEntity.badRequest().body("Name already Exist");
            }
            if(accInLoop.getEmail().equals(updAccDto.getEmail())){
                System.out.println("Enter Email check");
                return ResponseEntity.badRequest().body("Email already Exist");
            }
        }

        acc.setName(updAccDto.getName());
        acc.setEmail(updAccDto.getEmail());
        accService.save(acc);
        return ResponseEntity.ok("Successfully Updated!");
    }

//----- Change Password ---------------------------------------------------------------------------------------------------------------------------

    @PostMapping("/change-password")
    @Operation(summary = "Change Password For Account")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDto,Authentication authentication) {

        Optional<Account> optAcc = accService.findByEmail(authentication.getName());
        if(!optAcc.isPresent()){
            return ResponseEntity.badRequest().body("No Account Exist!");
        }
        Account acc = optAcc.get();

        if(!passwordEncoder.matches(changePasswordDto.getOldPassword(),acc.getPassword())){
            return ResponseEntity.badRequest().body("Old Password Didn't Match!!");
        }

        acc.setPassword(changePasswordDto.getNewPassword());
        accService.save(acc);

        return ResponseEntity.ok("Password Changed Successfully!");
    }

//----- Forget Password Token ---------------------------------------------------------------------------------------------------------------------------

    @PostMapping("/forget-password")
    @Operation(summary = "Token For Resetting Password For Account")
    // @SecurityRequirement(name="faiz")
    public ResponseEntity<?> forgetPassword(@Valid @RequestBody ForgetPasswordDTO forgetPasswordDTO) {

        Optional<Account> optAcc = accService.findByEmail(forgetPasswordDTO.getRegisteredEmail());
        if(!optAcc.isPresent()){
            return ResponseEntity.badRequest().body("No Account Exist!");
        }

        Account acc = optAcc.get();

        String randomGeneratedPassword = RandomStringUtils.random(10,true,true);
        //RandomStringUtils.randomAlphanumeric(10);

        try{
            emailService.sendEmail(forgetPasswordDTO.getRegisteredEmail(), "Password Reset Token", "Secret Code:"+ randomGeneratedPassword+"\n\nThis Token Would Be Valid For less time,Make It Fast;");

            acc.setPassword(randomGeneratedPassword);
            accService.save(acc);

            return ResponseEntity.ok("Password Change token Sent!!");

        }catch(MailException e){
            return ResponseEntity.badRequest().body("Error While Sending Email: "+e.getMessage());
        }
        
    }
    
//----- Delete their Acc(By Admin/User) ------------------------------------------------------------------------------------------------------------

    @DeleteMapping("/delete")
    @Operation(summary = "Delete Your Account Here")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> deleteAcc(Authentication authentication){

        Optional<Account> optAcc = accService.findByEmail(authentication.getName());
        if(!optAcc.isPresent()){
            return ResponseEntity.badRequest().body("No Account Exist!");
        }

        Account acc = optAcc.get();
        accService.deleteById(acc.getAccId());
        return ResponseEntity.ok("Successfully Deleted!");

    }

//----- Delete By Id(By admin) ----------------------------------------------------------------------------------------------------------------------------------
    
    @DeleteMapping("/delete-by-id/{accId}")
    @Operation(summary="Delete By Id -----: By ADMIN")
    @SecurityRequirement(name="faiz")
    public ResponseEntity<?> deleteAccById(@PathVariable Long accId){

        Optional<Account> optAcc = accService.findById(accId);
        if(!optAcc.isPresent()){
            return ResponseEntity.badRequest().body("No Account Exist!");
        }

        accService.deleteById(accId);
        return ResponseEntity.ok("Account Deleted!!");
        
    }
}

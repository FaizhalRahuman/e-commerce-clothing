package com.ecommerce.closetculture.DTO.accountDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ViewAccountDTO {

    private Long accId;

    private String name;

    private String email;

    private String authority;
    
}

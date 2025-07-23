package com.ecommerce.closetculture.DTO.collectionStoreDTO;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AddUpdCollectionDTO {
    
    @NotEmpty(message = "collection name Required")
    private String collName;

    @NotEmpty(message = "collection type Required")
    private String collType;
    
}

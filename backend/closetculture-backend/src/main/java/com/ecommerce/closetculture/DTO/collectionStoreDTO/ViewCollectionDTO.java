package com.ecommerce.closetculture.DTO.collectionStoreDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ViewCollectionDTO {

    private Long prdId;

    private Long collId;

    private String collName;

    private String collType;

    private String img;
    
}

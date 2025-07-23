package com.ecommerce.closetculture.DTO;

import java.util.List;

import com.ecommerce.closetculture.DTO.collectionStoreDTO.ViewCollectionDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PageCollectionsAndTotal {

    private List<ViewCollectionDTO> collections;

    private Long totColl;
    
}

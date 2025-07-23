package com.ecommerce.closetculture.repository.adminRepo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.closetculture.model.adminSide.CollectionStore;

@Repository
public interface CollRepo extends JpaRepository<CollectionStore,Long> {

    public List<CollectionStore> findByProduct_prdId(Long id);

//----- Filter and Pagination Repos for all collections --------------------------------------------------------------------------------------------------------------------

    @Query("SELECT DISTINCT s.collectionStore FROM Stock s WHERE s.size = :size AND s.color = :color AND s.rate BETWEEN :minprice AND :maxprice")
    public Page<CollectionStore> filterBySizeColor(@Param("size") String size,@Param("color") String color,
                                                    @Param("minprice") int minprice,@Param("maxprice") int maxprice, 
                                                    Pageable pageable);

    @Query("SELECT DISTINCT s.collectionStore FROM Stock s WHERE s.size = :size AND s.rate BETWEEN :minprice AND :maxprice")
    public Page<CollectionStore> filterBySize(@Param("size") String size,@Param("minprice") int minprice,@Param("maxprice") int maxPrice,Pageable pageable);

    @Query("SELECT DISTINCT s.collectionStore FROM Stock s WHERE s.color = :color AND s.rate BETWEEN :minprice AND :maxprice")
    public Page<CollectionStore> filterByColor(@Param("color") String color,@Param("minprice") int minprice,@Param("maxprice") int maxprice,Pageable pageable);

    /*If User Didn't give both size and color,then we take the collections by the minprice and maxprice(user can give it or it uses the defaultValue we set in controller) */
    @Query("SELECT DISTINCT s.collectionStore FROM Stock s WHERE s.rate BETWEEN :minprice AND :maxprice")
    public Page<CollectionStore> filterByRate(@Param("minprice") int minprice,@Param("maxprice") int maxprice,Pageable pageable);

//----- Filter and Pagination Repos for collection by prod --------------------------------------------------------------------------------------------------------------------

    @Query("SELECT DISTINCT s.collectionStore From Stock s WHERE s.size=:size AND s.color=:color AND s.rate BETWEEN :minprice AND :maxprice AND s.collectionStore.product.prdId = :prdId")
    public Page<CollectionStore> filterBySizeColorPrd(@Param("size") String size,@Param("color") String color,@Param("minprice") int minprice,
                                                    @Param("maxprice") int maxprice,@Param("prdId") Long prdId,Pageable pageable);

    @Query("SELECT DIStINCT s.collectionStore From Stock s WHERE s.size=:size AND s.rate BETWEEN :minprice and :maxprice AND s.collectionStore.product.prdId = :prdId")
    public Page<CollectionStore> filterBySizePrd(@Param("size") String size,@Param("minprice") int minprice,@Param("maxprice") int maxPrice,
                                                @Param("prdId") Long prdId,Pageable pageable);
   
    @Query("SELECT DISTINCT s.collectionStore From Stock s WHERE s.color=:color AND s.rate BETWEEN :minprice AND :minprice AND s.collectionStore.product.prdId=:prdId")
    public Page<CollectionStore> filterByColorPrd(@Param("color") String color,@Param("minprice") int minprice,@Param("maxprice") int maxprice,
                                                @Param("prdId") Long prdId,Pageable pageable);

    @Query("SELECT DISTINCT s.collectionStore From Stock s Where s.rate BETWEEN :minprice AND :maxprice AND s.collectionStore.product.prdId = :prdId")
    public Page<CollectionStore> filterByRatePrd(@Param("minprice") int minprice,@Param("maxprice") int maxprice,
                                                @Param("prdId") Long prdId,Pageable pageable);

    /*How It Works (Step-by-Step)
FROM Stock s

Begins with all stock items in database

WHERE s.size = :size AND s.color = :color

Filters stock items by exact size and color matches

SELECT DISTINCT s.collection

For matching stock items, gets their parent collection

DISTINCT ensures each collection appears only once

@Param("size") Long size ---- > this @Param("size") takes the :size and we map the user given size Long size to that :size.

 */
    
}

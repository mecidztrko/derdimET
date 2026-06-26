package com.derdimet.repository;

import com.derdimet.entity.Stock;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StockRepository extends JpaRepository<Stock, Long> {

    @Query(
            """
            select s from Stock s
            join fetch s.meatProduct mp
            join fetch mp.slaughterhouse sh
            where sh.id = :slaughterhouseId
            order by s.lastUpdate desc
            """)
    List<Stock> findBySlaughterhouseId(@Param("slaughterhouseId") Long slaughterhouseId);

    Optional<Stock> findByIdAndMeatProduct_Slaughterhouse_Id(Long stockId, Long slaughterhouseId);
}

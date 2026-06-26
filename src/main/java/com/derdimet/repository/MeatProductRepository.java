package com.derdimet.repository;

import com.derdimet.entity.MeatProduct;
import com.derdimet.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeatProductRepository extends JpaRepository<MeatProduct, Long> {

    List<MeatProduct> findBySlaughterhouseOrderByCreatedAtDesc(User slaughterhouse);
}

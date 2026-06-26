package com.derdimet.repository;

import com.derdimet.entity.Animal;
import com.derdimet.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimalRepository extends JpaRepository<Animal, Long> {

    boolean existsByAnimalDeal_Id(Long animalDealId);

    List<Animal> findBySlaughterhouseOrderByArrivalDateDesc(User slaughterhouse);
}

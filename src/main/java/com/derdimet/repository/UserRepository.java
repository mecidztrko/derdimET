package com.derdimet.repository;

import com.derdimet.entity.User;
import com.derdimet.entity.UserRole;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<User> findByRoleOrderByNameAsc(UserRole role);
}

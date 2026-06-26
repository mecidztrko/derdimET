package com.derdimet.repository;

import com.derdimet.entity.DeviceToken;
import com.derdimet.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceTokenRepository extends JpaRepository<DeviceToken, Long> {

    Optional<DeviceToken> findByUser_IdAndToken(Long userId, String token);

    List<DeviceToken> findByUser_Id(Long userId);
}

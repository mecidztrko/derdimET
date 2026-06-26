package com.derdimet.repository;

import com.derdimet.entity.User;
import com.derdimet.entity.UserReview;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserReviewRepository extends JpaRepository<UserReview, Long> {

    List<UserReview> findByTargetUserOrderByCreatedAtDesc(User targetUser);

    Optional<UserReview> findByReviewer_IdAndTargetUser_Id(Long reviewerId, Long targetUserId);

    long countByTargetUser(User targetUser);

    @Query("select coalesce(avg(r.rating), 0) from UserReview r where r.targetUser = :target")
    double averageRatingByTargetUser(@Param("target") User targetUser);
}

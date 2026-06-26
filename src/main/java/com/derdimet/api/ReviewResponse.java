package com.derdimet.api;

import com.derdimet.entity.UserReview;
import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long reviewerId,
        String reviewerName,
        Long targetUserId,
        Integer rating,
        String comment,
        LocalDateTime createdAt) {

    public static ReviewResponse fromEntity(UserReview review) {
        var reviewer = review.getReviewer();
        var target = review.getTargetUser();
        return new ReviewResponse(
                review.getId(),
                reviewer != null ? reviewer.getId() : null,
                reviewer != null ? reviewer.getName() : null,
                target != null ? target.getId() : null,
                review.getRating(),
                review.getComment(),
                review.getCreatedAt());
    }
}

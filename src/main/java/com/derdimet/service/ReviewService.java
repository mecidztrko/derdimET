package com.derdimet.service;

import com.derdimet.api.CreateReviewRequest;
import com.derdimet.api.ReviewResponse;
import com.derdimet.api.UserReviewSummaryResponse;
import com.derdimet.entity.User;
import com.derdimet.entity.UserReview;
import com.derdimet.repository.UserRepository;
import com.derdimet.repository.UserReviewRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final UserReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final AccountGuardService accountGuard;

    @Transactional
    public ReviewResponse createReview(User reviewer, CreateReviewRequest body) {
        accountGuard.requireEmailVerified(reviewer);
        if (reviewer.getId().equals(body.targetUserId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kendinizi değerlendiremezsiniz");
        }
        User target = userRepository
                .findById(body.targetUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));
        reviewRepository
                .findByReviewer_IdAndTargetUser_Id(reviewer.getId(), target.getId())
                .ifPresent(r -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Bu kullanıcıyı zaten değerlendirdiniz");
                });

        UserReview review = new UserReview();
        review.setReviewer(reviewer);
        review.setTargetUser(target);
        review.setRating(body.rating());
        review.setComment(blankToNull(body.comment()));
        return ReviewResponse.fromEntity(reviewRepository.save(review));
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> listForUser(Long userId) {
        User target = userRepository
                .findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));
        return reviewRepository.findByTargetUserOrderByCreatedAtDesc(target).stream()
                .map(ReviewResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserReviewSummaryResponse summaryForUser(Long userId) {
        User target = userRepository
                .findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));
        return new UserReviewSummaryResponse(
                reviewRepository.averageRatingByTargetUser(target),
                reviewRepository.countByTargetUser(target));
    }

    private static String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}

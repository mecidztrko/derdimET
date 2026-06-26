package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.ReviewService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponse> create(
            @AuthenticationPrincipal UserDetails principal, @Valid @RequestBody CreateReviewRequest body) {
        User reviewer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(reviewer, body));
    }

    @GetMapping("/users/{userId}/reviews")
    public List<ReviewResponse> list(@PathVariable Long userId) {
        return reviewService.listForUser(userId);
    }

    @GetMapping("/users/{userId}/reviews/summary")
    public UserReviewSummaryResponse summary(@PathVariable Long userId) {
        return reviewService.summaryForUser(userId);
    }
}

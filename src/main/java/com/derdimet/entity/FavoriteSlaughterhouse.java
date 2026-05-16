package com.derdimet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** MEAT_BUYER kullanıcıların favori kesimhane (SLAUGHTERHOUSE) ilişkisi. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "favorite_slaughterhouses",
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uk_favorite_slaughterhouses_buyer_slaughterhouse",
                        columnNames = {"buyer_id", "slaughterhouse_id"}))
public class FavoriteSlaughterhouse extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slaughterhouse_id", nullable = false)
    private User slaughterhouse;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

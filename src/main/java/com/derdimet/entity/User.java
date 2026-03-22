package com.derdimet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone")
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false)
    private AccountType accountType = AccountType.INDIVIDUAL;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "tax_number")
    private String taxNumber;

    @Column(name = "address_line", length = 500)
    private String addressLine;

    @Column(name = "city")
    private String city;

    @Column(name = "contact_secondary_name")
    private String contactSecondaryName;

    @Column(name = "contact_secondary_phone")
    private String contactSecondaryPhone;

    @Column(name = "profile_image_url", length = 1024)
    private String profileImageUrl;

    /** Eski satırlarda NULL olabilir; primitive boolean Hibernate'de hata verir. */
    @Column(name = "business_verified")
    private Boolean businessVerified;

    public boolean isBusinessVerified() {
        return Boolean.TRUE.equals(businessVerified);
    }

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

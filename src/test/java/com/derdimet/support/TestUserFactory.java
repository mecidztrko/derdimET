package com.derdimet.support;

import com.derdimet.entity.AccountType;
import com.derdimet.entity.User;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.UserRepository;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TestUserFactory {

    public static final String DEFAULT_PASSWORD = "Password1!";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AtomicInteger sequence = new AtomicInteger();

    public TestUser verified(UserRole role) {
        return save(role, true);
    }

    public TestUser unverified(UserRole role) {
        return save(role, false);
    }

    private TestUser save(UserRole role, boolean emailVerified) {
        int n = sequence.incrementAndGet();
        User user = new User();
        user.setEmail(role.name().toLowerCase() + "-" + n + "@test.local");
        user.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
        user.setName("Test " + role.name());
        user.setRole(role);
        user.setAccountType(AccountType.INDIVIDUAL);
        user.setCity("Ankara");
        user.setEmailVerified(emailVerified);
        user.setBusinessVerified(false);
        user = userRepository.save(user);
        return new TestUser(user.getEmail(), DEFAULT_PASSWORD, user);
    }

    public record TestUser(String email, String password, User entity) {}
}

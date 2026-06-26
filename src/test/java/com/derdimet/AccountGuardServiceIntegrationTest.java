package com.derdimet;

import static org.assertj.core.api.Assertions.assertThat;

import com.derdimet.service.AccountGuardService;
import com.derdimet.support.TestUserFactory;
import com.derdimet.entity.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;

@SpringBootTest
@ActiveProfiles("test")
class AccountGuardServiceIntegrationTest {

    @Autowired
    private AccountGuardService accountGuardService;

    @Autowired
    private TestUserFactory users;

    @Test
    void verifiedUserPassesGuard() {
        var user = users.verified(UserRole.MEAT_BUYER);
        accountGuardService.requireEmailVerified(user.entity());
    }

    @Test
    void unverifiedUserFailsGuard() {
        var user = users.unverified(UserRole.MEAT_BUYER);

        org.assertj.core.api.Assertions.assertThatThrownBy(() -> accountGuardService.requireEmailVerified(user.entity()))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("e-posta");
    }
}

package com.derdimet.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "derdimet.rate-limit")
public class RateLimitProperties {

    private boolean enabled = true;
    private int loginMaxPerMinute = 10;
    private int registerMaxPerHour = 5;
    private int passwordRecoveryMaxPerHour = 5;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getLoginMaxPerMinute() {
        return loginMaxPerMinute;
    }

    public void setLoginMaxPerMinute(int loginMaxPerMinute) {
        this.loginMaxPerMinute = loginMaxPerMinute;
    }

    public int getRegisterMaxPerHour() {
        return registerMaxPerHour;
    }

    public void setRegisterMaxPerHour(int registerMaxPerHour) {
        this.registerMaxPerHour = registerMaxPerHour;
    }

    public int getPasswordRecoveryMaxPerHour() {
        return passwordRecoveryMaxPerHour;
    }

    public void setPasswordRecoveryMaxPerHour(int passwordRecoveryMaxPerHour) {
        this.passwordRecoveryMaxPerHour = passwordRecoveryMaxPerHour;
    }
}

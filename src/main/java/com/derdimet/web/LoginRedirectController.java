package com.derdimet.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

/**
 * Tarayıcıda {@code /login} açıldığında React giriş ekranına yönlendirir (varsayılan Spring formu yerine).
 */
@Controller
public class LoginRedirectController {

    @GetMapping("/login")
    public RedirectView loginGet(HttpServletRequest request) {
        String q = request.getQueryString();
        String url = "/auth/index.html?r=login";
        if (q != null && !q.isBlank()) {
            url += "&" + q;
        }
        return new RedirectView(url);
    }
}

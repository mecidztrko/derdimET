package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.StockService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/slaughterhouse/stock")
@RequiredArgsConstructor
public class SlaughterhouseStockController {

    private final StockService stockService;
    private final UserRepository userRepository;

    @GetMapping
    public List<StockItemResponse> list(@AuthenticationPrincipal UserDetails principal) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return stockService.listStock(slaughterhouse);
    }
}

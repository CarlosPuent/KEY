package com.carlospuente.fullstackauth.web;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/api/me")
    public Map<String,Object> me(@AuthenticationPrincipal Jwt jwt) {
        // Devuelve claims para inspeccionar en Postman
        return Map.of(
                "sub", jwt.getSubject(),
                "perms", jwt.getClaimAsStringList("permissions"),
                "allClaims", jwt.getClaims()
        );
    }
}

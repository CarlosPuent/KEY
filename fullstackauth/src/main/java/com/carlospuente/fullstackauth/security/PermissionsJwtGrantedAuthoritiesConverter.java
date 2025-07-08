package com.carlospuente.fullstackauth.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import java.util.*;
import java.util.stream.Collectors;

public class PermissionsJwtGrantedAuthoritiesConverter
        implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        List<String> authorities = new ArrayList<>();

        // 1) extraigo los scopes estándar
        String scope = jwt.getClaimAsString("scope");
        if (scope != null && !scope.isBlank()) {
            authorities.addAll(Arrays.asList(scope.split(" ")));
        }

        // 2) extraigo el array "permissions" si existe
        List<String> perms = jwt.getClaimAsStringList("permissions");
        if (perms != null) {
            authorities.addAll(perms);
        }

        // 3) convierto todo a GrantedAuthority en mayúsculas
        return authorities.stream()
                .map(String::toUpperCase)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}

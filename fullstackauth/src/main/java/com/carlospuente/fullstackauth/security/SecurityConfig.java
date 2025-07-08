package com.carlospuente.fullstackauth.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        PermissionsJwtGrantedAuthoritiesConverter authzConverter =
                new PermissionsJwtGrantedAuthoritiesConverter();
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authzConverter);
        converter.setPrincipalClaimName("email");
        return converter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationConverter jwtConverter
    ) throws Exception {
        http
                // 1) Habilitar CORS usando la configuración definida en CorsConfig
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)

                // 2) OAuth2 Login (opcional)
                .oauth2Login(Customizer.withDefaults())

                // 3) Resource Server JWT
                .oauth2ResourceServer(rs -> rs
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter))
                )

                // 4) Reglas de autorización
                .authorizeHttpRequests(auth -> auth
                        // preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // health endpoint
                        .requestMatchers(HttpMethod.GET, "/api/health").permitAll()
                        // public docs
                        .requestMatchers("/public/**", "/v3/api-docs/**", "/swagger-ui/**").permitAll()

                        // protected endpoints...
                        .requestMatchers(HttpMethod.GET,    "/api/alumnos/me").             hasAuthority("READ:ALUMNOS")
                        .requestMatchers(HttpMethod.GET,    "/api/alumnos/**").            hasAuthority("READ:ALUMNOS")
                        .requestMatchers(HttpMethod.POST,   "/api/alumnos").               hasAuthority("WRITE:ALUMNOS")
                        .requestMatchers(HttpMethod.PUT,    "/api/alumnos/**").            hasAuthority("WRITE:ALUMNOS")
                        .requestMatchers(HttpMethod.DELETE, "/api/alumnos/**").            hasAuthority("DELETE:ALUMNOS")

                        .requestMatchers(HttpMethod.GET,    "/api/materias/**").           hasAuthority("READ:MATERIAS")
                        .requestMatchers(HttpMethod.POST,   "/api/materias").              hasAuthority("WRITE:MATERIAS")
                        .requestMatchers(HttpMethod.PUT,    "/api/materias/**").           hasAuthority("WRITE:MATERIAS")
                        .requestMatchers(HttpMethod.DELETE, "/api/materias/**").           hasAuthority("DELETE:MATERIAS")

                        .requestMatchers(HttpMethod.GET,    "/api/docentes/**").           hasAuthority("READ:DOCENTES")
                        .requestMatchers(HttpMethod.POST,   "/api/docentes").              hasAuthority("WRITE:DOCENTES")
                        .requestMatchers(HttpMethod.PUT,    "/api/docentes/**").           hasAuthority("WRITE:DOCENTES")
                        .requestMatchers(HttpMethod.DELETE, "/api/docentes/**").           hasAuthority("DELETE:DOCENTES")

                        .requestMatchers(HttpMethod.GET,    "/api/alumno-materias/**").    hasAuthority("READ:ALUMNO_MATERIAS")
                        .requestMatchers(HttpMethod.POST,   "/api/alumno-materias").       hasAuthority("WRITE:ALUMNO_MATERIAS")
                        .requestMatchers(HttpMethod.PUT,    "/api/alumno-materias/**").    hasAuthority("WRITE:ALUMNO_MATERIAS")
                        .requestMatchers(HttpMethod.DELETE, "/api/alumno-materias/**").    hasAuthority("DELETE:ALUMNO_MATERIAS")

                        // any other
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}

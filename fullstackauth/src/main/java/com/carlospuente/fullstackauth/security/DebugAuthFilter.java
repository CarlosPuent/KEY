package com.carlospuente.fullstackauth.security;

import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class DebugAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(DebugAuthFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
            throws ServletException, IOException {
        String auth = req.getHeader("Authorization");
        log.info(">> Authorization header: {}", auth);
        chain.doFilter(req, res);
    }
}


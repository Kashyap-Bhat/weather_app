package com.weather.dashboard.config;

import com.weather.dashboard.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            var claims = jwtService.validateAccessToken(token);

            if (claims != null) {
                Long userId = Long.parseLong(claims.getSubject());
                String email = claims.get("email", String.class);
                log.debug("Authenticated userId={} uri={}", userId, path);

                var auth = new UsernamePasswordAuthenticationToken(
                        email, userId, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                log.warn("Invalid token for uri={}", path);
            }
        } else {
            log.debug("No token for uri={}", path);
        }

        filterChain.doFilter(request, response);
    }
}

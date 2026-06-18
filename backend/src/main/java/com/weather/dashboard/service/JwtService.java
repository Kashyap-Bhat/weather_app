package com.weather.dashboard.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey accessKey;
    private final SecretKey refreshKey;
    private final long accessExpiration;
    private final long refreshExpiration;

    public JwtService(
            @Value("${jwt.access-secret}") String accessSecret,
            @Value("${jwt.refresh-secret}") String refreshSecret,
            @Value("${jwt.access-expiration-ms}") long accessExpiration,
            @Value("${jwt.refresh-expiration-ms}") long refreshExpiration) {
        this.accessKey = Keys.hmacShaKeyFor(accessSecret.getBytes(StandardCharsets.UTF_8));
        this.refreshKey = Keys.hmacShaKeyFor(refreshSecret.getBytes(StandardCharsets.UTF_8));
        this.accessExpiration = accessExpiration;
        this.refreshExpiration = refreshExpiration;
    }

    public String generateAccessToken(Long userId, String email) {
        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessExpiration))
                .signWith(accessKey)
                .compact();
    }

    public String generateRefreshToken(Long userId, String email) {
        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(refreshKey)
                .compact();
    }

    public Claims validateAccessToken(String token) {
        try {
            return Jwts.parser().verifyWith(accessKey).build()
                    .parseSignedClaims(token).getPayload();
        } catch (JwtException e) {
            return null;
        }
    }

    public Claims validateRefreshToken(String token) {
        try {
            return Jwts.parser().verifyWith(refreshKey).build()
                    .parseSignedClaims(token).getPayload();
        } catch (JwtException e) {
            return null;
        }
    }

    public long getAccessExpirationMs() {
        return accessExpiration;
    }

    public long getRefreshExpirationMs() {
        return refreshExpiration;
    }
}

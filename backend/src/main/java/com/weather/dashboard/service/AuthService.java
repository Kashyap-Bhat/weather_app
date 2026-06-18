package com.weather.dashboard.service;

import com.weather.dashboard.dto.AuthResponse;
import com.weather.dashboard.dto.LoginRequest;
import com.weather.dashboard.dto.SignupRequest;
import com.weather.dashboard.model.RefreshToken;
import com.weather.dashboard.model.User;
import com.weather.dashboard.repository.RefreshTokenRepository;
import com.weather.dashboard.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse signup(SignupRequest request) {
        log.info("Signing up email={}", request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Signup failed - email already exists: {}", request.getEmail());
            throw new EmailAlreadyExistsException("Email already registered: " + request.getEmail());
        }

        User user = new User(request.getEmail(), passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);
        log.info("User created id={}", user.getId());

        return generateAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt email={}", request.getEmail());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed - user not found: {}", request.getEmail());
                    return new InvalidCredentialsException("Invalid email or password");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed - wrong password: {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        }

        log.info("Login success userId={}", user.getId());
        return generateAuthResponse(user);
    }

    public AuthResponse refresh(String refreshTokenValue) {
        log.info("Token refresh attempt");
        Claims claims = jwtService.validateRefreshToken(refreshTokenValue);
        if (claims == null) {
            log.warn("Refresh failed - invalid JWT");
            throw new InvalidTokenException("Invalid or expired refresh token");
        }

        RefreshToken stored = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> {
                    log.warn("Refresh failed - token not in DB");
                    return new InvalidTokenException("Refresh token not found");
                });

        if (stored.isRevoked() || stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("Refresh failed - token revoked or expired");
            throw new InvalidTokenException("Refresh token has been revoked or expired");
        }

        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        Long userId = Long.parseLong(claims.getSubject());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("Refresh failed - user not found: {}", userId);
                    return new InvalidTokenException("User not found");
                });

        log.info("Token refreshed for userId={}", userId);
        return generateAuthResponse(user);
    }

    public void logout(Long userId) {
        log.info("Logout userId={}", userId);
        refreshTokenRepository.deleteByUserId(userId);
    }

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String newRefreshTokenValue = UUID.randomUUID().toString();
        long refreshExpMs = jwtService.getRefreshExpirationMs();

        RefreshToken rt = new RefreshToken(
                newRefreshTokenValue,
                user.getId(),
                LocalDateTime.now().plusSeconds(refreshExpMs / 1000)
        );
        refreshTokenRepository.save(rt);

        long accessExpSec = jwtService.getAccessExpirationMs() / 1000;
        return new AuthResponse(accessToken, newRefreshTokenValue, accessExpSec, user.getEmail());
    }
}

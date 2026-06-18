package com.weather.dashboard.dto;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private long expiresIn;
    private String email;

    public AuthResponse() {}

    public AuthResponse(String accessToken, String refreshToken, long expiresIn, String email) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.email = email;
    }

    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public long getExpiresIn() { return expiresIn; }
    public String getEmail() { return email; }
}

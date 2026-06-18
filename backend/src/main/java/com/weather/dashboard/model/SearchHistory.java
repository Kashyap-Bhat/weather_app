package com.weather.dashboard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_history")
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String city;

    private Double temperature;

    private Double feelsLike;

    private Double humidity;

    private Integer weatherCode;

    private Double windSpeed;

    @Column(name = "searched_at", nullable = false)
    private LocalDateTime searchedAt;

    public SearchHistory() {}

    public SearchHistory(Long userId, String city, Double temperature, Double feelsLike,
                         Double humidity, Integer weatherCode, Double windSpeed) {
        this.userId = userId;
        this.city = city;
        this.temperature = temperature;
        this.feelsLike = feelsLike;
        this.humidity = humidity;
        this.weatherCode = weatherCode;
        this.windSpeed = windSpeed;
        this.searchedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getCity() { return city; }
    public Double getTemperature() { return temperature; }
    public Double getFeelsLike() { return feelsLike; }
    public Double getHumidity() { return humidity; }
    public Integer getWeatherCode() { return weatherCode; }
    public Double getWindSpeed() { return windSpeed; }
    public LocalDateTime getSearchedAt() { return searchedAt; }
}

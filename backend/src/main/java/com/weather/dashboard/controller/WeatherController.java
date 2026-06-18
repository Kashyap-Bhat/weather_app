package com.weather.dashboard.controller;

import com.weather.dashboard.dto.CitySuggestion;
import com.weather.dashboard.dto.ErrorResponse;
import com.weather.dashboard.dto.WeatherResponse;
import com.weather.dashboard.service.CityNotFoundException;
import com.weather.dashboard.service.GeocodingService;
import com.weather.dashboard.service.WeatherApiException;
import com.weather.dashboard.service.WeatherService;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class WeatherController {

    private static final Logger log = LoggerFactory.getLogger(WeatherController.class);

    private final WeatherService weatherService;
    private final GeocodingService geocodingService;

    public WeatherController(WeatherService weatherService, GeocodingService geocodingService) {
        this.weatherService = weatherService;
        this.geocodingService = geocodingService;
    }

    @GetMapping("/weather")
    public ResponseEntity<WeatherResponse> getWeather(
            @RequestParam @NotBlank String city,
            Authentication authentication) {
        if (city.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Long userId = (Long) authentication.getCredentials();
        log.info("getWeather city={} userId={}", city, userId);
        WeatherResponse response = weatherService.getWeather(city.trim(), userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<WeatherResponse>> getHistory(Authentication authentication) {
        Long userId = (Long) authentication.getCredentials();
        log.info("getHistory userId={}", userId);
        return ResponseEntity.ok(weatherService.getHistory(userId));
    }

    @GetMapping("/weather/cities")
    public ResponseEntity<List<CitySuggestion>> suggestCities(
            @RequestParam @NotBlank String q,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        log.info("suggestCities query={} lat={} lon={}", q, lat, lon);
        return ResponseEntity.ok(geocodingService.suggestCities(q.trim(), lat, lon));
    }

    @DeleteMapping("/history")
    public ResponseEntity<Void> clearHistory(Authentication authentication) {
        Long userId = (Long) authentication.getCredentials();
        log.info("clearHistory userId={}", userId);
        weatherService.clearHistory(userId);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(CityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCityNotFound(CityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(404, e.getMessage()));
    }

    @ExceptionHandler(WeatherApiException.class)
    public ResponseEntity<ErrorResponse> handleWeatherApi(WeatherApiException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(500, e.getMessage()));
    }
}

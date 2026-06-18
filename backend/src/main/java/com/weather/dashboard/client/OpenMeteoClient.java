package com.weather.dashboard.client;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
public class OpenMeteoClient {

    private static final Logger log = LoggerFactory.getLogger(OpenMeteoClient.class);

    private static final String GEOCODING_URL =
            "https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json";
    private static final String SEARCH_URL =
            "https://geocoding-api.open-meteo.com/v1/search?name={query}&count=6&language=en&format=json";
    private static final String WEATHER_URL =
            "https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
            + "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m"
            + "&hourly=temperature_2m,weather_code&forecast_hours=12"
            + "&daily=temperature_2m_max,temperature_2m_min,weather_code";

    private final RestTemplate restTemplate;

    public OpenMeteoClient() {
        this.restTemplate = new RestTemplate();
    }

    public Optional<double[]> geocode(String city) {
        try {
            log.info("Geocoding city={}", city);
            JsonNode root = restTemplate.getForObject(GEOCODING_URL, JsonNode.class, city);
            if (root == null || !root.has("results")) {
                log.warn("Geocoding no results for {}", city);
                return Optional.empty();
            }
            JsonNode result = root.get("results").get(0);
            double lat = result.get("latitude").asDouble();
            double lon = result.get("longitude").asDouble();
            log.info("Geocoded {} -> {},{}", city, lat, lon);
            return Optional.of(new double[]{lat, lon});
        } catch (Exception e) {
            log.warn("Geocoding failed for {}: {}", city, e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<JsonNode> searchCities(String query) {
        try {
            log.debug("Searching cities q={}", query);
            JsonNode root = restTemplate.getForObject(SEARCH_URL, JsonNode.class, query);
            return Optional.ofNullable(root);
        } catch (Exception e) {
            log.warn("City search failed: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<JsonNode> fetchWeather(double lat, double lon) {
        try {
            log.info("Fetching weather for {},{}", lat, lon);
            JsonNode root = restTemplate.getForObject(WEATHER_URL, JsonNode.class, lat, lon);
            if (root != null) log.debug("Weather response received");
            return Optional.ofNullable(root);
        } catch (Exception e) {
            log.error("Weather fetch failed for {},{}: {}", lat, lon, e.getMessage());
            return Optional.empty();
        }
    }
}

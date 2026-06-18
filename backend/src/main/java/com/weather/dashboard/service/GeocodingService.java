package com.weather.dashboard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.weather.dashboard.client.OpenMeteoClient;
import com.weather.dashboard.dto.CitySuggestion;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class GeocodingService {

    private final OpenMeteoClient openMeteoClient;

    public GeocodingService(OpenMeteoClient openMeteoClient) {
        this.openMeteoClient = openMeteoClient;
    }

    public Optional<double[]> getCoordinates(String city) {
        return openMeteoClient.geocode(city);
    }

    public List<CitySuggestion> suggestCities(String query) {
        return suggestCities(query, null, null);
    }

    public List<CitySuggestion> suggestCities(String query, Double lat, Double lon) {
        List<CitySuggestion> suggestions = new ArrayList<>();
        Optional<JsonNode> result = openMeteoClient.searchCities(query);
        if (result.isEmpty() || !result.get().has("results")) return suggestions;

        JsonNode results = result.get().get("results");
        for (JsonNode node : results) {
            String name = node.get("name").asText();
            String admin1 = node.has("admin1") ? node.get("admin1").asText() : "";
            String country = node.has("country") ? node.get("country").asText() : "";
            double clat = node.get("latitude").asDouble();
            double clon = node.get("longitude").asDouble();
            suggestions.add(new CitySuggestion(name, admin1, country, clat, clon));
        }

        if (lat != null && lon != null) {
            suggestions.sort(Comparator.comparingDouble(s -> haversine(lat, lon, s.getLatitude(), s.getLongitude())));
        }

        return suggestions;
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}

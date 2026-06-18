package com.weather.dashboard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.weather.dashboard.client.OpenMeteoClient;
import com.weather.dashboard.dto.DailyForecast;
import com.weather.dashboard.dto.HourlyForecast;
import com.weather.dashboard.dto.WeatherResponse;
import com.weather.dashboard.model.SearchHistory;
import com.weather.dashboard.repository.SearchHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class WeatherService {

    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);

    private final OpenMeteoClient openMeteoClient;
    private final GeocodingService geocodingService;
    private final SearchHistoryRepository historyRepository;

    public WeatherService(OpenMeteoClient openMeteoClient,
                          GeocodingService geocodingService,
                          SearchHistoryRepository historyRepository) {
        this.openMeteoClient = openMeteoClient;
        this.geocodingService = geocodingService;
        this.historyRepository = historyRepository;
    }

    public WeatherResponse getWeather(String city, Long userId) {
        log.info("Fetching weather city={} userId={}", city, userId);
        double[] coords = geocodingService.getCoordinates(city)
                .orElseThrow(() -> {
                    log.warn("City not found: {}", city);
                    return new CityNotFoundException("City not found: " + city);
                });
        log.debug("Geocoded {} -> lat={} lon={}", city, coords[0], coords[1]);

        JsonNode weather = openMeteoClient.fetchWeather(coords[0], coords[1])
                .orElseThrow(() -> {
                    log.error("Open-Meteo API failed for {}", city);
                    return new WeatherApiException("Failed to fetch weather data");
                });

        JsonNode current = weather.get("current");
        double temperature = current.get("temperature_2m").asDouble();
        double feelsLike = current.get("apparent_temperature").asDouble();
        double humidity = current.get("relative_humidity_2m").asDouble();
        int weatherCode = current.get("weather_code").asInt();
        double windSpeed = current.get("wind_speed_10m").asDouble();

        List<HourlyForecast> forecast = new ArrayList<>();
        JsonNode hourly = weather.get("hourly");
        if (hourly != null) {
            JsonNode times = hourly.get("time");
            JsonNode temps = hourly.get("temperature_2m");
            JsonNode codes = hourly.get("weather_code");
            for (int i = 0; i < times.size(); i++) {
                forecast.add(new HourlyForecast(
                        times.get(i).asText(),
                        temps.get(i).asDouble(),
                        codes.get(i).asInt()
                ));
            }
        }

        List<DailyForecast> dailyForecast = new ArrayList<>();
        JsonNode daily = weather.get("daily");
        if (daily != null) {
            JsonNode dates = daily.get("time");
            JsonNode maxTemps = daily.get("temperature_2m_max");
            JsonNode minTemps = daily.get("temperature_2m_min");
            JsonNode codes = daily.get("weather_code");
            for (int i = 0; i < dates.size(); i++) {
                dailyForecast.add(new DailyForecast(
                        dates.get(i).asText(),
                        maxTemps.get(i).asDouble(),
                        minTemps.get(i).asDouble(),
                        codes.get(i).asInt()
                ));
            }
        }

        SearchHistory history = new SearchHistory(userId, city, temperature, feelsLike,
                humidity, weatherCode, windSpeed);
        history = historyRepository.save(history);

        WeatherResponse response = new WeatherResponse(city, temperature, feelsLike,
                humidity, weatherCode, windSpeed, history.getSearchedAt());
        response.setLatitude(coords[0]);
        response.setLongitude(coords[1]);
        response.setForecast(forecast);
        response.setDailyForecast(dailyForecast);
        return response;
    }

    public List<WeatherResponse> getHistory(Long userId) {
        return historyRepository.findAllByUserIdOrderBySearchedAtDesc(userId).stream()
                .map(WeatherResponse::from)
                .toList();
    }

    @Transactional
    public void clearHistory(Long userId) {
        historyRepository.deleteByUserId(userId);
    }
}

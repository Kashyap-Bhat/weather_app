package com.weather.dashboard.dto;

import com.weather.dashboard.model.SearchHistory;
import java.time.LocalDateTime;
import java.util.List;

public class WeatherResponse {

    private String city;
    private Double temperature;
    private Double feelsLike;
    private Double humidity;
    private Integer weatherCode;
    private Double windSpeed;
    private LocalDateTime searchedAt;
    private List<HourlyForecast> forecast;
    private List<DailyForecast> dailyForecast;
    private Double latitude;
    private Double longitude;

    public WeatherResponse() {}

    public WeatherResponse(String city, Double temperature, Double feelsLike,
                           Double humidity, Integer weatherCode, Double windSpeed,
                           LocalDateTime searchedAt) {
        this.city = city;
        this.temperature = temperature;
        this.feelsLike = feelsLike;
        this.humidity = humidity;
        this.weatherCode = weatherCode;
        this.windSpeed = windSpeed;
        this.searchedAt = searchedAt;
    }

    public static WeatherResponse from(SearchHistory history) {
        WeatherResponse r = new WeatherResponse(
                history.getCity(), history.getTemperature(), history.getFeelsLike(),
                history.getHumidity(), history.getWeatherCode(), history.getWindSpeed(),
                history.getSearchedAt());
        return r;
    }

    public String getCity() { return city; }
    public Double getTemperature() { return temperature; }
    public Double getFeelsLike() { return feelsLike; }
    public Double getHumidity() { return humidity; }
    public Integer getWeatherCode() { return weatherCode; }
    public Double getWindSpeed() { return windSpeed; }
    public LocalDateTime getSearchedAt() { return searchedAt; }
    public List<HourlyForecast> getForecast() { return forecast; }
    public List<DailyForecast> getDailyForecast() { return dailyForecast; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public void setForecast(List<HourlyForecast> forecast) { this.forecast = forecast; }
    public void setDailyForecast(List<DailyForecast> dailyForecast) { this.dailyForecast = dailyForecast; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}

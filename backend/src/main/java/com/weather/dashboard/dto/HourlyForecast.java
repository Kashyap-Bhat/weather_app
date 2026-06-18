package com.weather.dashboard.dto;

public class HourlyForecast {

    private String time;
    private Double temperature;
    private Integer weatherCode;

    public HourlyForecast() {}

    public HourlyForecast(String time, Double temperature, Integer weatherCode) {
        this.time = time;
        this.temperature = temperature;
        this.weatherCode = weatherCode;
    }

    public String getTime() { return time; }
    public Double getTemperature() { return temperature; }
    public Integer getWeatherCode() { return weatherCode; }
}

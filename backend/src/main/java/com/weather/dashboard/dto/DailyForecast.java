package com.weather.dashboard.dto;

public class DailyForecast {

    private String date;
    private Double tempMax;
    private Double tempMin;
    private Integer weatherCode;

    public DailyForecast() {}

    public DailyForecast(String date, Double tempMax, Double tempMin, Integer weatherCode) {
        this.date = date;
        this.tempMax = tempMax;
        this.tempMin = tempMin;
        this.weatherCode = weatherCode;
    }

    public String getDate() { return date; }
    public Double getTempMax() { return tempMax; }
    public Double getTempMin() { return tempMin; }
    public Integer getWeatherCode() { return weatherCode; }
}

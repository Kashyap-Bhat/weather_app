package com.weather.dashboard.dto;

public class CitySuggestion {

    private String name;
    private String admin1;
    private String country;
    private double latitude;
    private double longitude;

    public CitySuggestion() {}

    public CitySuggestion(String name, String admin1, String country, double latitude, double longitude) {
        this.name = name;
        this.admin1 = admin1;
        this.country = country;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getName() { return name; }
    public String getAdmin1() { return admin1; }
    public String getCountry() { return country; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
}

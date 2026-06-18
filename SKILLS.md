# Weather Dashboard — Project Map

## tech stack
- **backend:** Spring Boot 3.4.4, Java 21, Maven
- **frontend:** React 19, Vite 6, Tailwind CSS 3
- **database:** PostgreSQL (via JPA/Hibernate)
- **auth:** JWT access (1h) + refresh (24h) tokens
- **api:** Open-Meteo (free, no key required)

## directory structure

```
weather/
├── Makefile                           # make backend | frontend | all
├── .gitignore
├── SKILLS.md
├── FEATURES.md
│
├── backend/
│   ├── pom.xml                        # Spring Boot + Security + JPA + jjwt
│   └── src/main/java/com/weather/dashboard/
│       ├── WeatherDashboardApplication.java
│       ├── config/
│       │   ├── WebConfig.java         — CORS (MVC + Spring Security source) for localhost:5173
│       │   ├── SecurityConfig.java    — stateless, permit /api/auth/** + /api/weather/cities, JWT filter
│       │   └── JwtAuthFilter.java     — OncePerRequestFilter: Bearer → SecurityContext (logs auth)
│       ├── controller/
│       │   ├── WeatherController.java — /api/weather?city=, /api/history (auth)
│       │   └── AuthController.java    — /api/auth/signup|login|refresh|logout
│       ├── service/
│       │   ├── WeatherService.java    — fetch weather + save per-user history
│       │   ├── GeocodingService.java  — city → lat/lon via Open-Meteo
│       │   ├── AuthService.java       — signup, login, refresh rotation
│       │   ├── JwtService.java        — generate/validate access + refresh tokens
│       │   ├── CityNotFoundException.java
│       │   ├── WeatherApiException.java
│       │   ├── EmailAlreadyExistsException.java
│       │   ├── InvalidCredentialsException.java
│       │   └── InvalidTokenException.java
│       ├── model/
│       │   ├── SearchHistory.java     — userId, city, temperature, feelsLike, humidity, weatherCode, windSpeed, searchedAt
│       │   ├── User.java              — id, email, password (BCrypt), createdAt
│       │   └── RefreshToken.java      — token, userId, expiresAt, revoked
│       ├── repository/
│       │   ├── SearchHistoryRepository.java  — user-scoped queries
│       │   ├── UserRepository.java           — findByEmail, existsByEmail
│       │   └── RefreshTokenRepository.java   — findByToken, deleteByUserId
│       ├── dto/
│       │   ├── WeatherResponse.java
│       │   ├── HourlyForecast.java     — time, temperature, weatherCode (12-hour)
│       │   ├── DailyForecast.java      — date, tempMin, tempMax, weatherCode (7-day)
│       │   ├── ErrorResponse.java
│       │   ├── SignupRequest.java
│       │   ├── LoginRequest.java
│       │   ├── AuthResponse.java
│       │   └── RefreshTokenRequest.java
│       └── client/
│           └── OpenMeteoClient.java   — RestTemplate: geocoding + weather API
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js                 — proxy /api → localhost:8080
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                    — root: AuthProvider → Navbar → AuthGate → Dashboard
│       ├── index.css                  — @tailwind directives
│       ├── api/
│       │   ├── client.js              — authFetch wrapper: auto-attach Bearer, auto-refresh on 401
│       │   ├── weather.js             — fetchWeather, fetchHistory, clearHistory
│       │   └── auth.js               — signup, login, logout
│       ├── components/
│       │   ├── SearchBar.jsx          — city input + autocomplete (proximity-sorted API + recent history)
│       │   ├── WeatherCard.jsx        — current weather + hourly + 7-day forecast
│       │   ├── HourlyForecastBar.jsx  — horizontal scrollable 12-hour forecast
│       │   ├── DailyForecastBar.jsx   — 7-day forecast with temperature range bars
│       │   ├── SearchHistoryList.jsx  — table wrapper
│       │   ├── HistoryItem.jsx        — single history row
│       │   ├── ErrorAlert.jsx         — error banner
│       │   ├── LoadingSpinner.jsx     — spinner
│       │   ├── Navbar.jsx             — top bar with email + logout
│       │   ├── LoginForm.jsx          — email + password
│       │   └── SignupForm.jsx         — email + password + confirm
│       ├── context/
│       │   └── AuthContext.jsx        — auth state, login/signup/logout callbacks
│       ├── hooks/
│       │   └── useWeather.js          — weather, history, loading, error state
│       └── utils/
│           ├── tokenStorage.js        — localStorage helpers
│           ├── weatherCodes.js        — WMO code → description + icon
│           └── formatDate.js          — date formatting
```

## key patterns
- **dependency injection:** constructor injection everywhere
- **auth:** `Authentication.getPrincipal()` = email, `Authentication.getCredentials()` = userId (Long)
- **frontend tokens:** stored in localStorage, auto-refreshed via `client.js` on 401
- **all frontend files ≤ 200 lines**

## env vars required
```
DB_URL=jdbc:postgresql://localhost:5432/weather_dashboard
DB_USERNAME=<user>
DB_PASSWORD=<pass>
JWT_ACCESS_SECRET=<32+ chars>
JWT_REFRESH_SECRET=<32+ chars>
```

## commands
```bash
cp backend/.env.example backend/.env   # configure credentials
make backend                            # start backend :8080
make frontend                           # start frontend :5173
make all                                # start both
```

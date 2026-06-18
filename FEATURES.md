# Weather Dashboard — Features

---

## 1. User Authentication (Signup / Login)

**Purpose:** Users create an account and log in to access the dashboard.

**Backend files:**
- `backend/.../controller/AuthController.java` — `POST /api/auth/signup`, `/login`, `/refresh`, `/logout`
- `backend/.../service/AuthService.java` — business logic: signup, login, refresh rotation, logout
- `backend/.../service/JwtService.java` — generate/validate access token (1h) and refresh token (24h)
- `backend/.../model/User.java` — JPA entity: id, email, password (BCrypt), createdAt
- `backend/.../model/RefreshToken.java` — JPA entity: token, userId, expiresAt, revoked
- `backend/.../repository/UserRepository.java` — findByEmail, existsByEmail
- `backend/.../repository/RefreshTokenRepository.java` — findByToken, deleteByUserId
- `backend/.../config/SecurityConfig.java` — permit `/api/auth/**`, require auth for all other endpoints
- `backend/.../config/JwtAuthFilter.java` — extract Bearer token, validate, set SecurityContext
- `backend/.../dto/SignupRequest.java`, `LoginRequest.java`, `AuthResponse.java`, `RefreshTokenRequest.java`

**Frontend files:**
- `frontend/src/api/auth.js` — signup(), login(), logout() API calls
- `frontend/src/api/client.js` — authFetch wrapper: auto-attaches Bearer token, auto-refreshes on 401
- `frontend/src/context/AuthContext.jsx` — React context: user state, login/signup/logout callbacks
- `frontend/src/components/LoginForm.jsx` — email + password form
- `frontend/src/components/SignupForm.jsx` — email + password + confirm form
- `frontend/src/components/Navbar.jsx` — displays email + logout button
- `frontend/src/utils/tokenStorage.js` — localStorage get/set/clear for tokens

**Flow:**
1. User submits email + password → `POST /api/auth/signup` (or `/login`)
2. Backend validates, hashes password (BCrypt), creates user + refresh token in DB
3. Returns `{ accessToken, refreshToken, expiresIn, email }`
4. Frontend stores tokens in localStorage, sets user in AuthContext
5. All subsequent API calls use `authFetch()` which reads the access token and attaches `Authorization: Bearer <token>`
6. On 401, `client.js` automatically calls `/api/auth/refresh` with the refresh token to get a new pair. If refresh fails, tokens are cleared and the app reloads to the login screen.

---

## 2. Search Current Weather

**Purpose:** User enters a city name and sees current conditions plus forecasts.

**Backend files:**
- `backend/.../controller/WeatherController.java` — `GET /api/weather?city={name}`
- `backend/.../service/WeatherService.java` — orchestrates geocode → fetch → save → respond
- `backend/.../service/GeocodingService.java` — delegates to OpenMeteoClient, sorts by proximity when lat/lon provided
- `backend/.../client/OpenMeteoClient.java` — HTTP calls to Open-Meteo APIs (current + hourly + daily)
- `backend/.../model/SearchHistory.java` — persisted weather snapshot per user
- `backend/.../dto/WeatherResponse.java` — city, temperature, feelsLike, humidity, weatherCode, windSpeed, forecast, dailyForecast
- `backend/.../dto/HourlyForecast.java` — time, temperature, weatherCode
- `backend/.../dto/DailyForecast.java` — date, tempMin, tempMax, weatherCode

**Frontend files:**
- `frontend/src/api/weather.js` — fetchWeather(city) via authFetch, suggestCities(query, lat, lon)
- `frontend/src/hooks/useWeather.js` — searchCity() sets weather state, loading, error
- `frontend/src/components/SearchBar.jsx` — text input with autocomplete (API suggestions + recent history), geolocation-based proximity sorting
- `frontend/src/components/WeatherCard.jsx` — weather icon, temp, conditions, humidity, wind, hourly + daily forecast
- `frontend/src/components/HourlyForecastBar.jsx` — horizontal scrollable 12-hour forecast
- `frontend/src/components/DailyForecastBar.jsx` — 7-day forecast with temperature range bars
- `frontend/src/components/ErrorAlert.jsx` — error display
- `frontend/src/components/LoadingSpinner.jsx` — loading indicator
- `frontend/src/utils/weatherCodes.js` — WMO weather code → display label + icon

**Flow:**
1. User types in SearchBar → autocomplete shows recent history + API suggestions sorted by proximity (based on browser geolocation)
2. User clicks Search → calls `GET /api/weather?city=London` (with Bearer token)
3. Backend geocodes city to lat/lon via Open-Meteo Geocoding API
4. Backend fetches current + hourly (12h) + daily (7d) data from Open-Meteo Forecast API
5. Backend saves the result to `search_history` scoped to the authenticated user
6. Returns `{ city, temperature, feelsLike, humidity, weatherCode, windSpeed, forecast, dailyForecast }`
7. Frontend renders WeatherCard with icon, current conditions, hourly bar, and 7-day forecast

---

## 3. Search History (Per-User)

**Purpose:** User sees their past weather searches and can clear them. Recent searches also appear in the autocomplete dropdown.

**Backend files:**
- `backend/.../controller/WeatherController.java` — `GET /api/history`, `DELETE /api/history`
- `backend/.../service/WeatherService.java` — getHistory(userId), clearHistory(userId)
- `backend/.../model/SearchHistory.java` — userId-scoped entity
- `backend/.../repository/SearchHistoryRepository.java` — findAllByUserIdOrderBySearchedAtDesc, deleteByUserId
- `backend/.../dto/WeatherResponse.java` — `from(SearchHistory)` factory method

**Frontend files:**
- `frontend/src/api/weather.js` — fetchHistory(), clearHistory()
- `frontend/src/hooks/useWeather.js` — loads history on mount + after each search, clearAllHistory()
- `frontend/src/components/SearchBar.jsx` — filters history by typed query, shows up to 5 matches in a "Recent" section
- `frontend/src/components/SearchHistoryList.jsx` — table with header, count, clear button
- `frontend/src/components/HistoryItem.jsx` — single row: icon, city, temp, conditions, time
- `frontend/src/utils/formatDate.js` — timestamp formatting

**Flow:**
1. On login, App loads history via `fetchHistory()`
2. After each successful weather search, history is auto-refreshed (newest first)
3. Each entry shows: weather icon, city name, temperature, conditions, timestamp
4. When typing in SearchBar, matching history entries appear in a "Recent" section at the top of the autocomplete (deduplicated, max 5, sorted by proximity-sorted API suggestions below)
5. "Clear all" button calls `DELETE /api/history` which deletes only the current user's records
6. History is scoped per user — User A never sees User B's searches

---

## 4. Open-Meteo API Integration

**Purpose:** Fetch weather data without an API key.

**Backend files:**
- `backend/.../client/OpenMeteoClient.java` — RestTemplate calls with SLF4J logging
- `backend/.../service/GeocodingService.java` — thin wrapper for city lookup, Haversine proximity sorting

**Endpoints used:**
- **Geocoding:** `GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json`
  - Returns lat, lon, country for the city
- **City search:** `GET https://geocoding-api.open-meteo.com/v1/search?name={query}&count=6&language=en&format=json`
  - Returns up to 6 matching cities (sorted by proximity when lat/lon provided)
- **Weather:** `GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&forecast_hours=12&daily=temperature_2m_max,temperature_2m_min,weather_code`
  - Returns current conditions + 12-hour hourly forecast + 7-day daily forecast

**Caching:** No caching implemented (each request is fresh). Rate limit is 10,000/day for non-commercial use.

**Error handling:**
- City not found → `CityNotFoundException` → 404 response
- API failure → `WeatherApiException` → 500 response

---

## 5. Error Handling & Validation

**Backend:**
- `CityNotFoundException` → 404 `{ status: 404, message: "..." }`
- `WeatherApiException` → 500 `{ status: 500, message: "..." }`
- `EmailAlreadyExistsException` → 409 (Conflict)
- `InvalidCredentialsException` → 401 (Unauthorized)
- `InvalidTokenException` → 401 (Unauthorized)
- All handled via `@ExceptionHandler` in respective controllers
- Input validation via `@Valid`, `@NotBlank`, `@Email`, `@Size`

**Frontend:**
- `authFetch()` in `client.js` handles 401 by attempting token refresh automatically
- If refresh fails → clear tokens, reload page → user sees login screen
- API errors displayed via `ErrorAlert` component (red banner with message)
- Client-side validation: empty city blocked, password length ≥ 6, passwords must match
- Loading states: SearchBar button disabled, LoadingSpinner shown during API calls

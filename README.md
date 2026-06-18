# Weather Dashboard

A full-stack weather dashboard with user authentication, city-based weather search (with autocomplete and geolocation proximity), 12-hour hourly and 7-day daily forecasts, an interactive weather map, and per-user search history.

## Technology Stack

| Layer   | Technology                                           |
| ------- | ---------------------------------------------------- |
| Backend | Java 21, Spring Boot 3.4.4, Spring Security, JPA     |
| Frontend| React 19, Vite 6, Tailwind CSS 3                     |
| Database| PostgreSQL                                           |
| Auth    | JWT (access + refresh tokens) via jjwt 0.12.6        |
| APIs    | Open-Meteo (weather, geocoding — free, no API key)   |
| Map     | MapLibre GL JS, CartoDB dark tiles, DWD ICON weather overlay via @openmeteo/weather-map-layer |
| Fonts   | DM Serif Display, DM Sans, JetBrains Mono            |

## Quick Start

```bash
# 1. Prerequisites: Java 21, Node.js 20+, PostgreSQL running
brew services start postgresql

# 2. Create the database
createdb weather_dashboard

# 3. Configure credentials
cp backend/.env.example backend/.env
# edit backend/.env with your DB credentials if not postgres/postgres

# 4. Start backend (terminal 1) — listens on :8080
make backend

# 5. Start frontend (terminal 2) — opens on :5173
make frontend
```

Open **http://localhost:5173** → sign up → search a city.

## Features

| Feature | Description | Auth |
|---------|-------------|------|
| **Sign up / Log in** | Email + password, JWT access (1h) + refresh (24h) tokens | No |
| **Logout** | Revokes all refresh tokens server-side | Yes |
| **Token auto-refresh** | Client intercepts 401, tries refresh, redirects to login on failure | Yes |
| **City autocomplete** | Search-as-you-type with Open-Meteo geocoding, Haversine proximity sorting, deduplicated recent history section | No (public) |
| **Current weather** | Temperature, feels-like, humidity, wind, conditions code + icon | Yes |
| **Hourly forecast** | 12-hour scrollable bar with temperature per hour | Yes |
| **Daily forecast** | 7-day rows with temperature range bars (absolute-positioned min→max) | Yes |
| **Weather map** | Full-screen MapLibre GL map, CartoDB dark raster tiles, DWD ICON temperature overlay, fly-to on search | Yes |
| **Search history** | Per-user history in right sidebar (desktop) / bottom drawer (mobile), clearable | Yes |
| **Responsive** | Desktop: right sidebar (w-72, backdrop-blur). Mobile: top bar + bottom sheet drawer | Yes |
| **Geolocation** | Browser geolocation for proximity-sorted autocomplete suggestions | Yes |

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/signup` | No | Create account |
| `POST` | `/api/auth/login` | No | Log in, get tokens |
| `POST` | `/api/auth/refresh` | No | Refresh expired access token |
| `POST` | `/api/auth/logout` | Yes | Revoke all refresh tokens |
| `GET` | `/api/weather?city={name}` | Yes | Current weather, hourly (12h), daily (7d), lat/lon |
| `GET` | `/api/weather/cities?q={query}&lat={}&lon={}` | No | City autocomplete with optional proximity sort |
| `GET` | `/api/history` | Yes | List search history (scoped to user) |
| `DELETE` | `/api/history` | Yes | Clear search history |

## Project Map

```
weather/
├── Makefile                   # backend / frontend / all / db-create targets
├── AGENTS.md                  # AI session prompts
├── FEATURES.md                # feature-to-file mapping
├── SKILLS.md                  # full directory tree for AI agents
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/weather/dashboard/
│       ├── WeatherDashboardApplication.java
│       ├── client/OpenMeteoClient.java
│       ├── config/{SecurityConfig,WebConfig,JwtAuthFilter}.java
│       ├── controller/{AuthController,WeatherController}.java
│       ├── dto/{WeatherResponse,HourlyForecast,DailyForecast,
│       |         CitySuggestion,ErrorResponse,AuthResponse,
│       |         LoginRequest,SignupRequest,RefreshTokenRequest}.java
│       ├── model/{User,SearchHistory,RefreshToken}.java
│       ├── repository/{UserRepository,SearchHistoryRepository,
│       |               RefreshTokenRepository}.java
│       └── service/{AuthService,JwtService,WeatherService,
│                     GeocodingService, …Exception}.java
├── frontend/
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── api/{client,auth,weather}.js
│       ├── components/{SearchBar,WeatherCard,
│       |     HourlyForecastBar,DailyForecastBar,WeatherMap,
│       |     SearchHistoryList,HistoryItem,Navbar,
│       |     LoginForm,SignupForm,ErrorAlert,LoadingSpinner}.jsx
│       ├── context/AuthContext.jsx
│       ├── hooks/useWeather.js
│       └── utils/{tokenStorage,weatherCodes,formatDate}.js
```

## Environment Variables

```
DB_URL=jdbc:postgresql://localhost:5432/weather_dashboard
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_ACCESS_SECRET=my-access-secret-key-change-in-production-1234567890
JWT_REFRESH_SECRET=my-refresh-secret-key-change-in-production-0987654321
```

Quickest setup — copy-paste defaults:

```bash
cp backend/.env.example backend/.env
# JWT secrets have working defaults, no need to change
```

## Make Targets

```
make backend        # start Spring Boot on :8080
make frontend       # start Vite on :5173
make all            # both (backend background, frontend foreground)
make db-create      # createdb weather_dashboard
make backend-env    # verify loaded env vars
```

## Assumptions

- **PostgreSQL** is running locally on default port 5432 with the `weather_dashboard` database already created
- **Java 21** and **Node.js 20+** are installed
- The **Open-Meteo API** remains free and does not require an API key (no SLA guarantees)
- The **map tiles** (CartoDB dark raster) and **weather layer** (DWD ICON via @openmeteo/weather-map-layer) are publicly available
- **Browser geolocation** is optional — app works without it, but autocomplete won't be proximity-sorted
- **Refresh tokens** are stored in the database and revoked on logout; lost refresh tokens require re-login
- **PostgreSQL** runs via `brew services start postgresql` on macOS; on other platforms adjust accordingly
- The **@openmeteo/weather-map-layer** WASM binary (~2MB) is bundled by Vite automatically

## Notable Patterns

- **Frontend files ≤ 200 lines** — small, focused components
- **Auth** — `Authentication.getPrincipal()` = email, `Authentication.getCredentials()` = userId (Long)
- **Token refresh** — automatic via `client.js` on any 401; redirects to login if refresh fails
- **History scoping** — all search history queries filtered by `userId`
- **CORS** — configured both via `WebMvcConfigurer` AND `CorsConfigurationSource` bean for Spring Security's `.cors()` to work
- **`@Transactional`** — required on `clearHistory()` to avoid `TransactionRequiredException` when performing a bulk delete

## AI Tools

This project was developed with the assistance of **Claude Code (Anthropic)**, an AI coding assistant. The AI helped with:

- Generating boilerplate code for Spring Boot controllers, services, repositories, and entities
- Scaffolding the React frontend components, auth context, and API client with token refresh logic
- Implementing the Open-Meteo API integration (geocoding, current weather, hourly/daily parsing)
- Adding the MapLibre GL weather map with the DWD ICON temperature overlay
- Debugging issues like the CORS 403 (dual WebMvcConfigurer + CorsConfigurationSource fix) and the `@Transactional` missing annotation on `clearHistory()`
- Responsive layout design for mobile (history drawer, top bar) and desktop (sidebar)

Challenges that required human guidance included configuring Spring Security's CORS filter correctly (the MVC-only `WebMvcConfigurer` wasn't sufficient — a `CorsConfigurationSource` bean was needed for the security filter chain), ensuring the weather map's `om://` protocol layer loaded properly within MapLibre GL, and handling the autocomplete dropdown not closing after search (a `lastSearched` ref was needed to suppress the effect re-run when history updated after a search).

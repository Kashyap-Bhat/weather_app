# AI Agent Prompts — Feature Work

Use these prompts to start a session when working on a new feature or bug fix. Read the relevant files first instead of scanning the full codebase.

---

## for AI agents: before starting any feature

1. Read `SKILLS.md` — understand the project structure, tech stack, patterns
2. Read `FEATURES.md` — find the feature section relevant to your task
3. Read the specific files listed in that feature section
4. Follow existing patterns: constructor injection, JPA conventions, `authFetch()` for frontend API calls
5. Keep all frontend files ≤ 200 lines
6. Use Tailwind utility classes (no CSS modules or styled-components)
7. Error responses follow `{ status, message }` JSON format

---

## feature prompt: "add a new feature"

```
You are working on the Weather Dashboard project at /path/to/weather.

Read SKILLS.md first to understand the project structure, then FEATURES.md to find
the relevant feature section. Use the file paths listed there instead of scanning
the full codebase.

Feature: <describe what to build>

Requirements:
- <requirement 1>
- <requirement 2>

Follow existing patterns:
- Backend: constructor injection, @Service/@Controller/@Repository annotations
- Frontend: authFetch() for API calls, Tailwind for styling, ≤200 lines per file
- Auth: access via Authentication.getCredentials() for userId
```

---

## feature prompt: "add a new backend REST endpoint"

```
You are working on the Weather Dashboard backend at /path/to/weather/backend.

Pattern to follow (read WeatherController.java and WeatherService.java):
1. Create DTO class in dto/
2. Add service method in existing or new service
3. Add controller endpoint with @GetMapping/@PostMapping/@DeleteMapping
4. Extract userId via Authentication.getCredentials()
5. Add @ExceptionHandler for any new exceptions
6. Use ErrorResponse for error JSON: { status, message }
```

---

## feature prompt: "add a new frontend component"

```
You are working on the Weather Dashboard frontend at /path/to/weather/frontend.

Pattern to follow (read existing components in components/):
1. Create component file in components/
2. Use Tailwind utility classes for all styling
3. Keep file ≤ 200 lines
4. Use authFetch() from api/client.js for authenticated API calls
5. Import useAuth() from context/AuthContext.jsx if user info needed
6. Handle loading and error states
```

---

## feature prompt: "fix a bug"

```
Bug: <describe the bug>

Read SKILLS.md to find relevant files, then FEATURES.md for the feature flow.
Focus on the specific files involved.

Steps:
1. Reproduce the issue (check backend logs, browser console)
2. Identify the root cause
3. Fix with minimal changes following existing patterns
4. Verify with `mvn compile -q` (backend) and `npm run build` (frontend)
```

---

## feature prompt: "add a new database table"

```
Read the existing entities in backend/.../model/ for the JPA pattern.
Read the existing repositories in backend/.../repository/ for the query pattern.

To add a new table:
1. Create a JPA entity in model/
2. Create a JPA repository in repository/
3. Hibernate auto-creates the table (ddl-auto=update)
```

---

## feature prompt: "add a new env var"

```
1. Add the env var to backend/.env and backend/.env.example
2. Reference it in application.properties as ${VAR_NAME:default_value}
3. If it should be required, use ${VAR_NAME} without default
4. If the Makefile check-env needs updating, update it too
```

.PHONY: all backend frontend db db-create backend-env

BACKEND_DIR = backend
FRONTEND_DIR = frontend
BACKEND_ENV = $(BACKEND_DIR)/.env
BACKEND_LOG = /tmp/weather-backend.log

all: db-create
	@echo "Starting backend in background..."
	@$(MAKE) _backend > $(BACKEND_LOG) 2>&1 & \
	BACKEND_PID=$$!; \
	echo "Backend PID: $$BACKEND_PID (logs: $(BACKEND_LOG))"; \
	sleep 8; \
	echo "Starting frontend..."; \
	$(MAKE) frontend; \
	echo "Stopping backend..."; \
	kill $$BACKEND_PID 2>/dev/null; wait $$BACKEND_PID 2>/dev/null; \
	echo "Done."

_backend:
	@if [ -f $(BACKEND_ENV) ]; then \
		set -a; . $(BACKEND_ENV); set +a; \
		cd $(BACKEND_DIR) && mvn spring-boot:run; \
	else \
		echo "Missing $(BACKEND_ENV) — copy .env.example to .env and fill in your credentials."; \
		exit 1; \
	fi

backend:
	@echo "Starting backend on http://localhost:8080..."
	@if [ -f $(BACKEND_ENV) ]; then \
		set -a; . $(BACKEND_ENV); set +a; \
		cd $(BACKEND_DIR) && mvn spring-boot:run; \
	else \
		echo "Missing $(BACKEND_ENV) — copy .env.example to .env and fill in your credentials."; \
		exit 1; \
	fi

backend-env:
	@if [ -f $(BACKEND_ENV) ]; then \
		set -a; . $(BACKEND_ENV); set +a; \
		env | grep -E '^(DB_URL|DB_USERNAME|DB_PASSWORD)='; \
	else \
		echo "Missing $(BACKEND_ENV)"; \
	fi

frontend:
	@echo "Starting frontend on http://localhost:5173..."
	cd $(FRONTEND_DIR) && npm run dev

db-create:
	@echo "Creating PostgreSQL database if it doesn't exist..."
	@createdb weather_dashboard 2>/dev/null || echo "Database already exists"

db:
	@echo "Starting PostgreSQL..."
	@brew services start postgresql 2>/dev/null || pg_ctl -D /usr/local/var/postgres start 2>/dev/null || echo "PostgreSQL may already be running"

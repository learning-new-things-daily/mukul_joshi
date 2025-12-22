# Root Makefile for common DevOps tasks

# Variables
APP_DIR ?= portfolio-react
IMAGE_NAME ?= portfolio-react:latest
CONTAINER_NAME ?= portfolio-react
PORT ?= 8080

.PHONY: install build dev docker-build docker-run docker-stop compose-up compose-down sitemap clean ci-local

install:
	@echo "[install] npm ci in $(APP_DIR)"
	npm ci --prefix $(APP_DIR)

build:
	@echo "[build] npm run build in $(APP_DIR)"
	npm run build --prefix $(APP_DIR)

dev:
	@echo "[dev] npm run dev in $(APP_DIR)"
	npm run dev --prefix $(APP_DIR)

docker-build:
	@echo "[docker-build] Building $(IMAGE_NAME) from $(APP_DIR)"
	docker build -t $(IMAGE_NAME) $(APP_DIR)

docker-run:
	@echo "[docker-run] Starting $(CONTAINER_NAME) on port $(PORT)"
	docker run -d --rm -p $(PORT):80 --name $(CONTAINER_NAME) $(IMAGE_NAME)

docker-stop:
	@echo "[docker-stop] Stopping $(CONTAINER_NAME)"
	- docker stop $(CONTAINER_NAME)

compose-up:
	@echo "[compose-up] docker compose up"
	docker compose -f $(APP_DIR)/docker-compose.yml up --build -d

compose-down:
	@echo "[compose-down] docker compose down"
	docker compose -f $(APP_DIR)/docker-compose.yml down

sitemap:
	@echo "[sitemap] Generating sitemap via scripts/generate-sitemap.js"
	node scripts/generate-sitemap.js

clean:
	@echo "[clean] Removing build output in $(APP_DIR)/dist"
	- rm -rf $(APP_DIR)/dist

ci-local:
	@echo "[ci-local] Lint, test (if present), build, sitemap"
	npm run lint --if-present --prefix $(APP_DIR)
	npm test --if-present --prefix $(APP_DIR)
	npm run build --prefix $(APP_DIR)
	node scripts/generate-sitemap.js

.PHONY: all install install-dev test lint format clean build venv

# Variables
VENV = .venv
PYTHON = $(VENV)/bin/python
PIP = $(VENV)/bin/pip

all: install-dev format lint test build

venv:
	python -m venv $(VENV)
	$(PIP) install -r requirements-dev.txt

install:
	pip install -r requirements.txt

install-dev:
	pip install -r requirements-dev.txt

test:
	PYTHONPATH=src pytest tests/ -v

lint:
	flake8 src/ tests/
	mypy src/

format:
	black src/ tests/
	isort src/ tests/

# Build deployment package for Lambda
build: venv clean
	mkdir -p dist
	$(PIP) install -r requirements.txt \
		--platform manylinux2014_x86_64 \
		--only-binary=:all: \
		--python-version 3.13 \
		--implementation cp \
		--target dist/
	cp -r src/* dist/
	cd dist && zip -r ../deployment.zip .
	@echo ""
	@echo "Build complete: deployment.zip"

clean:
	rm -rf __pycache__ .pytest_cache .mypy_cache .coverage dist
	rm -f deployment.zip
	find . -type d -name "__pycache__" -exec rm -rf {} +

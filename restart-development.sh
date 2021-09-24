#!/usr/bin/env bash
docker-compose -f docker-compose.development.yml down
git pull
docker-compose -f docker-compose.development.yml up --build -V -d
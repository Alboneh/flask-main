#!/bin/sh

echo "Starting Watchdog..."

while true
do
  echo "Watching for changes..."
  inotifywait -r -e modify,create,delete
  echo "Changes detected. Rebuilding and restarting..."
  go build -o /docker-start
  pkill docker-start
  /docker-start &
done
#!/bin/sh

echo "Starting Watchdog..."

# Start the initial process
/docker-start &

# Capture the PID of the process
PID=$!

# Watch for changes
while true
do
  echo "Watching for changes..."
  inotifywait -r -e modify,create,delete --exclude '\./vendor/.*' /app

  # Send a SIGTERM signal to the process
  echo "Stopping the process..."
  kill -15 $PID
  wait $PID

  # Rebuild the binary
  echo "Building the binary..."
  go build -o /docker-start

  # Stop and Restart the Docker container
  echo "Starting the new process..."
  /docker-start &


  # Capture the PID of the new process
    PID=$!
done

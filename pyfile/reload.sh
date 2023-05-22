#!/bin/sh

echo "Starting Watchdog..."

# Start the initial process
python api.py &

# Capture the PID of the process
PID=$!

# Watch for changes
while true
do
  echo "Watching for changes..."
  inotifywait -r -e modify,create,delete --exclude './model.h5' /app

  # Send a SIGTERM signal to the process
  echo "Stopping the process..."
  kill -15 $PID
  wait $PID

  # Restart the Python script
  echo "Restarting the script..."
  python api.py &

  # Capture the PID of the new process
  PID=$!
done

#!/bin/bash

   while true; do
       changes=$(inotifywait -r -e modify,move,create,delete /app)
       echo "Changes detected: $changes"
       docker-compose stop
       docker-compose up -d --build
   done
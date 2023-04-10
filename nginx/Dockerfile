FROM nginx:stable as build-stage
EXPOSE 80
COPY nginx.conf /etc/nginx/nginx.conf
#COPY angular-service:/app/dist/hello-world /usr/share/nginx/html
#COPY hello-world/dist/hello-world /usr/share/nginx/html
# Copy contents from the other container with alias "build" #
# onto the specified path in the current container#

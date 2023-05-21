FROM node:latest as build-stage

RUN mkdir -p /app

WORKDIR /app
RUN npm install -g @angular/cli
COPY package.json /app

RUN npm install --legacy-peer-deps
COPY . /app

RUN ng build --configuration production --output-path=/app/dist

FROM nginx:stable
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
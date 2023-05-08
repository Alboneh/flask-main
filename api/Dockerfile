FROM golang:1.18-bullseye

WORKDIR /app

RUN apt-get update && \
    apt-get install -y docker-compose curl

# Download and install 'air'
RUN go install github.com/cosmtrek/air@latest

COPY . .

# RUN go build -o /docker-start

EXPOSE 3030

ENTRYPOINT ["air"]
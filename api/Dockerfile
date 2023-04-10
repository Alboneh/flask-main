FROM golang:1.18-bullseye

WORKDIR /app

COPY go.mod go.sum ./

#RUN go mod download

RUN go mod vendor

RUN apt-get update && \
    apt-get install -y inotify-tools

COPY . .

RUN go build -o /docker-start

EXPOSE 3030

CMD ["/docker-start"]
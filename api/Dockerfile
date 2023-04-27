FROM golang:1.18-bullseye

# Create a new user and group inside the container
#RUN addgroup --system ibrahim && adduser --system --ingroup ibrahim ibrahim

# Set the user and group to use inside the container
# ENV USER=golang
# ENV GROUP=golang
# ENV UID=1000
# ENV GID=1000

WORKDIR /app

# Create the user and group with the specified UID/GID
# RUN addgroup --gid $GID $GROUP && \
#     adduser --disabled-password --gecos '' --uid $UID --gid $GID $USER && \
#     chown -R $USER:$GROUP /app

RUN apt-get update && \
    apt-get install -y inotify-tools docker-compose

COPY . .

#RUN go mod download
# RUN chown -R $USER:$GROUP /app

RUN go build -o /docker-start

EXPOSE 3030

ENTRYPOINT ["sh", "-c", "/app/watcher.sh && /docker-start"]
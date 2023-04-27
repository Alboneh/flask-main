FROM python:3.8

ENV PORT 3000
ENV HOST 0.0.0.0

EXPOSE 3000

RUN apt-get update -y && \
    apt-get install -y python3-pip inotify-tools docker-compose

COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip install -r requirements.txt

COPY . /app


# Run api.py by default
CMD ["python", "api.py"]

# Run watcher.sh as the entrypoint
ENTRYPOINT ["/app/reload.sh"]
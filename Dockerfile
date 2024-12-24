FROM python:3.12-slim

# node, npm and yarn
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		nodejs \
        npm \
	&& rm -rf /var/lib/apt/lists/*
RUN npm install --global yarn

WORKDIR /code
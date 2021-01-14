FROM node:14-stretch-slim

# Create app directory
WORKDIR /usr/src/app

# Use installed jq
# Package node-jq requires this variable set when installed
# with NODE_JQ_SKIP_INSTALL_BINARY=true
ENV JQ_PATH=/usr/bin/jq

# Man folders are required to install postgres-client without errors
RUN mkdir -p /usr/share/man/man1 /usr/share/man/man7

# Clone the skeleton project and install dependencies
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y git procps autoconf libtool make jq postgresql-client

EXPOSE 3000
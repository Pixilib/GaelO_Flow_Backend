# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app
RUN mkdir node_modules
# Bundle app source
COPY ./GaelO-Flow/dist .
COPY ./GaelO-Flow/.env .

COPY ./GaelO-Flow/node_modules ./node_modules

# Start the server using the production build
CMD [ "node", "main.js" ]
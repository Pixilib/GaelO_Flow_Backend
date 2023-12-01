# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY ./GaelO-Flow/dist .

# Start the server using the production build
CMD [ "node", "main.js" ]
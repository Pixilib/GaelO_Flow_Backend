# Base image
FROM node:20-bullseye

ENV JWT_SECRET ="verySecretKey"
ENV ORTHANC_ADDRESS="http://localhost"
ENV ORTHANC_PORT="8042"
ENV ORTHANC_USERNAME="orthanc"
ENV ORTHANC_PASSWORD="orthanc"
ENV APP_URL="http://localhost"
ENV TYPEORM_TYPE="postgres"
ENV TYPEORM_HOST="localhost"
ENV TYPEORM_PORT="5432"
ENV TYPEORM_USERNAME="postgres"
ENV TYPEORM_PASSWORD="postgres"
ENV TYPEORM_DATABASE="gaelo-flow"
ENV REDIS_ADDRESS="localhost"
ENV REDIS_PORT="6379"
ENV API_PORT="3000"

# Create app directory
WORKDIR /usr/src/app
# Bundle app source
COPY ./GaelO-Flow .

# Start the server using the production build
CMD ["npm", "run", "start:prod"]
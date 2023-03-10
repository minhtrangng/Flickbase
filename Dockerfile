FROM node:16-alpine as build
ARG APP_ENV=prod
ENV APP_ENV=${APP_ENV}

WORKDIR /app
RUN echo "Build environment: ${APP_ENV}"
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./


EXPOSE 3001
CMD ["npm", "start"]
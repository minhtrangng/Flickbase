FROM node as build
ARG REACT_ENV=prod
ENV REACT_ENV=${REACT_ENV}

WORKDIR /app

FROM build-${REACT_ENV} as build-final
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN echo "Build environment: ${REACT_ENV}"
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
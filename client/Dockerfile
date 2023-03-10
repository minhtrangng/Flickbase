ARG REACT_APP_ENV=prod

FROM node as build
ARG REACT_APP_ENV=prod
ENV REACT_APP_ENV=${REACT_APP_ENV}
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm set timeout=1000000
RUN npm install react-scripts -g --silent

FROM build as build-development
WORKDIR /app

FROM build as build-prod
WORKDIR /app
ONBUILD COPY dependencies/node-v15.3.0-headers.tar.gz node-v15.3.0-headers.tar.gz
ONBUILD RUN npm config set tarball $(pwd)/node-v15.3.0-headers.tar.gz

FROM build as build-cloud
WORKDIR /app

FROM build-${REACT_APP_ENV} as build-final
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN echo "Build environment: ${REACT_APP_ENV}"
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build-final /app/build /usr/share/nginx/html/client
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
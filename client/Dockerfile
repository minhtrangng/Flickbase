# # Select the image to use
# FROM node

# # Install dependencies in the root of the Container
# COPY package.json ./
# COPY package-lock.json ./
# ENV NODE_PATH=/node_modules
# ENV PATH=$PATH:/node_modules/.bin
# RUN npm install

# # Add project files to /app route in Container
# ADD . /app

# # Set working dir to /app
# WORKDIR /app

# # Expose port 3000
# EXPOSE 3000

# # Start the app
# CMD [ "npm", "start" ]

ARG REACT_APP_ENV=prod

FROM node:16-alpine as build
ARG REACT_APP_ENV=prod
ENV REACT_APP_ENV=${REACT_APP_ENV}
RUN npm install react-scripts -g --silent


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
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
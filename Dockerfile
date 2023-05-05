#FROM node:16-alpine AS build
#WORKDIR /app

#COPY . .
#RUN npm install
#RUN npm run build
# Serve Application using Nginx Server

FROM nginx:alpine
COPY /dist/ng15-reserva-frontend/ /usr/share/nginx/html
#EXPOSE 4200
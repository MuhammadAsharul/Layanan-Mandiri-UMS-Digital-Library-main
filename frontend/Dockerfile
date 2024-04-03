# Stage 1
FROM node:18-alpine as build-stage

WORKDIR /frontend
COPY package.json ./
RUN npm install
COPY . .

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

RUN npm run build

# Stage 2
FROM nginx:1.17.0-alpine

RUN rm -r /usr/share/nginx/html/*

COPY --from=build-stage /frontend/dist /usr/share/nginx/html
COPY ./nginx.conf /usr/share/nginx/conf.d/default.conf

# Expose React Docker Port
EXPOSE 80

# ENTRYPOINT [ "nginx" ]  

CMD nginx -g 'daemon off;'




# FROM nginx

# WORKDIR /frontend
# RUN curl RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
# RUN apt-get install -y nodejs

# COPY package*.json ./

# RUN npm install
# COPY . .

# RUN npm run build

# RUN rm -r /usr/share/nginx/html/*

# RUN cp -a dist/. /usr/share/nginx/html

# # # Expose React Docker Port
# EXPOSE 80  

# CMD nginx -g 'daemon off;'

FROM node:alpine as build

WORKDIR /app

COPY package.json /app/package.json
RUN yarn install --silent
COPY . /app
RUN yarn build --silent

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM node:alpine

ENV PORT=3000

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE ${PORT}

ENTRYPOINT [ "node", "src/index.js" ]

FROM node:14-alpine

WORKDIR /usr/src/metacare_microservice

COPY . .

COPY .*json ./

RUN npm install

EXPOSE 8000

CMD [ "node", "index.js" ]
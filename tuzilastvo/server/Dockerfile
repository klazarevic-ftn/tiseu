FROM node:20-alpine

WORKDIR /app

COPY ./tuzilastvo/server/ .

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8010

CMD ["node", "server.js"]

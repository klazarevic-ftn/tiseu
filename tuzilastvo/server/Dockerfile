FROM node:latest

WORKDIR /app

COPY ./tuzilastvo/server/ .

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
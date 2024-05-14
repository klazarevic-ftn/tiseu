FROM node:20-alpine

WORKDIR /app

COPY ./tuzilastvo/ .

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=8015

EXPOSE 8015

CMD ["npm", "start"]
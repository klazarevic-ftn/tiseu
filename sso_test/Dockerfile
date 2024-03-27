FROM node:20-alpine

WORKDIR /app

COPY ./sso_test/ .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]

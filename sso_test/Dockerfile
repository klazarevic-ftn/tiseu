FROM node:latest

WORKDIR /app

COPY ./sso_test/ .

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
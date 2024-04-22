FROM node

RUN npm install -g pnpm

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm i

COPY . .

EXPOSE 5173

CMD pnpm run dev
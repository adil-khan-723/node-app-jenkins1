FROM node:25-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 5001

CMD ["node", "server.js"]
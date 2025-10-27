FROM node:25-alpine3.21 as build 

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY . .

EXPOSE 5001

CMD ["node", "server.js"]
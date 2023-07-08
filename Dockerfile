FROM node:latest as builder

WORKDIR /app
COPY ./src /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY . .

RUN npm run build

FROM node:slim

ENV NODE_ENV production
USER node
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --production
COPY --from=builder ./dist ./dist

CMD [ "node", "dist/index.js" ]
FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json ./

RUN npm ci

COPY src src

CMD ["npx", "ts-node", "./src/main.ts"]

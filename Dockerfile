FROM node:20-alpine As development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

FROM development As test

CMD [ "npm", "run", "test" ]


FROM node:20-alpine As build

WORKDIR /app

COPY package*.json ./

COPY --from=development /app/node_modules ./node_modules

COPY . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force


FROM node:20-alpine As production

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

CMD [ "node", "dist/main.js" ]
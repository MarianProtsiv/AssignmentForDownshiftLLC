FROM node:lts

WORKDIR /usr/src/app

RUN npm install pm2 -g
COPY package*.json ./
RUN npm ci

COPY . .

COPY wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh

CMD [ "npm run db:migration:run && pm2-runtime", "pm2.config.js" ]
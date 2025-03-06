
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN cp .env.example .env


# COPY wait-for-it.sh /usr/docker/scripts/wait-for-it.sh
RUN chmod +x ./docker/scripts/wait-for-it.sh

RUN npm run build

EXPOSE 4000

CMD ["./docker/scripts/wait-for-it.sh", "postgres:5432", "--", "npm", "run", "start:prod"]

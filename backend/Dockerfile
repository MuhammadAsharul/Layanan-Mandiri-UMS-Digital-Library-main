FROM node:18

WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 7001

CMD npm run dev
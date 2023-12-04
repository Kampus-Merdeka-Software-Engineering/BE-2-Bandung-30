FROM node:18
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app
COPY ./prisma /app/node_modules/.prisma/client
RUN npx prisma generate
CMD ["node", "index.js"]
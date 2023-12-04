FROM node:18
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app
RUN prisma generate
CMD ["node", "index.js"]
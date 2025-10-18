FROM node:20 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build -- --output-path ./dist/BankAppTestFront

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/BankAppTestFront/browser /usr/share/nginx/html

EXPOSE 80
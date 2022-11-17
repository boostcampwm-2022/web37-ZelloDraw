From node:16-alpine

WORKDIR /app

COPY backend ./backend
COPY frontend ./frontend

WORKDIR /app/backend
RUN npm ci
RUN npm deploy:prod

WORKDIR /app/frontend
RUN npm ci
RUN npm start
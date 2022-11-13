From node:16-alpine

WORKDIR /app

# COPY package.json package-lock.json ./

COPY backend ./backend

# COPY frontend ./frontend

WORKDIR /app/backend
RUN npm ci
ENTRYPOINT [ "/usr/local/bin/npm" , "start"]

# WORKDIR /app/frontend
# RUN npm ci


# WORKDIR /app
# RUN npm ci
# ENTRYPOINT [ "/usr/local/bin/npm" , "start"]
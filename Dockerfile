# Build frontend
FROM node:latest AS frontend

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/vite.config.ts ./
RUN npm install
COPY frontend .
RUN npm run build

ENV PORT=5173
EXPOSE $PORT

CMD ["npm", "run", "serve"]

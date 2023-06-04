# Build frontend
FROM node:latest AS frontend

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/vite.config.ts ./
RUN npm install
COPY frontend .
RUN npm run build

EXPOSE 5173
CMD ["npm", "run", "dev"]



# Build frontend
FROM node:latest AS frontend

ENV VITE_FIREBASE_CREDENTIALS = VITE_FIREBASE_CREDENTIALS

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/vite.config.ts ./
RUN npm install
COPY frontend .
RUN npm run build

# Use serve to serve the built files
RUN npm install -g serve

ENV PORT=5173

CMD serve -s dist -l tcp://0.0.0.0:$PORT

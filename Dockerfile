# Build frontend
FROM node:latest AS frontend

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/vite.config.ts ./
RUN npm install
COPY frontend .
RUN npm run build

# Use serve to serve the built files
RUN npm install -g serve

# Note: Railway sets the PORT variable for you
# But you can still set a default port to use when running the container locally


ENV PORT=5173

ARG VITE_FIREBASE_CREDENTIALS

ENV VITE_FIREBASE_CREDENTIALS=$VITE_FIREBASE_CREDENTIALS


CMD serve -s dist -l tcp://0.0.0.0:$PORT

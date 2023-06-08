# Build frontend
FROM node:latest AS frontend

# Define a build argument for the Firebase credentials
ARG VITE_FIREBASE_CREDENTIALS
ARG VITE_BOT_USER_ID
# Set the environment variable
ENV VITE_FIREBASE_CREDENTIALS=${VITE_FIREBASE_CREDENTIALS}
ENV VITE_BOT_USER_ID=${VITE_BOT_USER_ID}

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

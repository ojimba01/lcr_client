# `lcr_client` Project README

## Description

`lcr_client` is a frontend project aimed at providing a user interface for interacting with the LCR (Left, Center, Right) game. The project is built using TypeScript, React, Vite, and other frameworks/libraries, ensuring an efficient and responsive user experience.

## Project Directory Structure

The project directory structure is as follows:

```terminal
.
├── frontend
│ ├── node_modules
│ ├── public
│ ├── src
│ ├── .eslintrc.cjs
│ ├── index.html
│ ├── package-lock.json
│ ├── package.json
│ ├── tsconfig.json
│ ├── tsconfig.node.json
│ ├── vite.config.ts
├── .gitignore
├── Dockerfile
├── README.md
```
### Directory Details

- `frontend`: This directory contains the main application code.
  - `node_modules`: This directory contains all the dependencies of the project.
  - `public`: This directory contains static files that can be served to the client.
  - `src`: This directory contains the source code for the application.
  - `.eslintrc.cjs`: This file contains configurations for ESLint, a tool for identifying and reporting on patterns in JavaScript.
  - `index.html`: This is the main HTML file for the application.
  - `package-lock.json` and `package.json`: These files contain the project metadata and dependencies.
  - `tsconfig.json` and `tsconfig.node.json`: These files contain configurations for TypeScript, a typed superset of JavaScript that adds static types.
  - `vite.config.ts`: This file contains configurations for Vite, a build tool that provides faster and leaner development experience for modern web projects.

## Running the Project Locally

Follow the steps below to run the project locally:

1. Clone the project from GitHub.
   ```sh
   git clone https://github.com/ojimba01/lcr_client.git
2. Navigate to the project directory.
   ```sh
   cd lcr_client/frontend
3. Install the project dependencies.
   ```sh
   npm install
4. Start the local development server.
   ```sh
   npm run dev --host

The application should now be running on http://localhost:5173 Open this address in your web browser to use the application.

Note: This tutorial assumes that the backend is also running locally aswell. Please follow the directions to run the backend locally [here](https://github.com/ojimba01/lcr_server/).

## Running the Project Locally with Docker

This project includes a Dockerfile for running the application within a Docker container. Docker offers a way to run applications securely isolated in a container, packaged with all its dependencies and libraries.

Before proceeding, ensure that you have Docker installed on your machine.

Follow the steps below to run the project locally:

1. Clone the project from GitHub.
   ```sh
   git clone https://github.com/ojimba01/lcr_client.git
2. Navigate to the project directory.
   ```sh
   cd lcr_client
   
3. Build the Docker image. Replace <FIREBASE_CREDENTIALS> and <BOT_USER_ID> with your actual Firebase credentials and bot user ID. This will build the Docker image with your provided arguments and tag it as lcr_client.
   ```sh
   docker build . --build-arg VITE_FIREBASE_CREDENTIALS=<FIREBASE_CREDENTIALS> --build-arg VITE_BOT_USER_ID=<BOT_USER_ID> -t lcr_client
4. Run the Docker image in a container.
   ```sh
   docker run -p 5173:5173 lcr_client


# Bitcoin Script IDE — static site served by a dependency-free Node server.
FROM node:20-alpine

WORKDIR /app

# Only the files needed to run the IDE (no node_modules, tests, or docs).
COPY serve.js index.html package.json ./
COPY build ./build

EXPOSE 8000
CMD ["node", "serve.js"]

# Use official Node.js 20 image
FROM node:20

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY src ./src

# Copy shared libs (db, middlewares)
COPY ../../libs ./libs

# Expose service port
EXPOSE 5001

# Start service
CMD ["node", "src/app.js"]

# Use official Node.js LTS version
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose backend port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]

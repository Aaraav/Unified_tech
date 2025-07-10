# Use a Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy everything into the container
COPY . .

# Install dependencies
RUN npm install

# Expose the port your token service uses (assumed 5001)
EXPOSE 5001

# Start the service
CMD ["node", "src/server.js"]

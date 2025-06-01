# Use Node LTS official image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy source code
COPY . .


# Start the service
CMD ["node", "src/index.js"]
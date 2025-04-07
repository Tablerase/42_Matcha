FROM node:20-slim

WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy the rest of the application code
COPY . .

EXPOSE 3000

# Package management tool
RUN npm install -g @craco/craco

# Build the application
CMD ["npm", "run", "build"]
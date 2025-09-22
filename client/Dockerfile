FROM node:20-slim

WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies (including devDependencies for build tools)
RUN npm ci

# Copy the rest of the application code
COPY . .

EXPOSE 3000

# Set environment variables
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build the application
CMD ["npm", "run", "build"]
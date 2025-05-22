# Use Node.js v20 as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install Prisma globally for migrations
RUN npm install -g prisma

# Copy package.json and package-lock.json files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create a temporary directory for file uploads
RUN mkdir -p ./public/temp

# Expose the port your app runs on
EXPOSE 8080

# Set environment variables (these will be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=8080

# Command to run the application
CMD ["npm", "start"]
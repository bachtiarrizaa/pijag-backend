# Base Image
FROM node:20-alpine

# Set Working Directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependency
RUN npm install

# Copy all source code
COPY . .

# Generate prisma clien
RUN npx prisma generate

# Expose app port
EXPOSE 3000

# Run app
CMD ["npm", "run", "dev"]
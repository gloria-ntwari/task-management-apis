FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm install

# Copy source code
COPY . .

# Clean any existing dist and build
RUN rm -rf dist

# Show what we're building
RUN echo "Building TypeScript files..."
RUN ls -la src/

# Build with verbose output
RUN npm run build || (echo "Build failed!" && exit 1)

# Verify build output exists
RUN echo "Checking build output..."
RUN ls -la dist/ || echo "No dist directory found"
RUN ls -la dist/main.js || echo "No main.js found"

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
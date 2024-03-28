FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy the rest of the app's source code to the working directory
COPY . /app

RUN npm run build-only

# Serve the app on port 8080
EXPOSE 8080

# Run the web service on container startup.
CMD [ "npm", "run", "dev", "--host", "0.0.0.0" ]

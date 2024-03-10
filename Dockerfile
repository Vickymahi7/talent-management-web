FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
# Avoid copying node_modules directory
COPY . ./
RUN rm -rf node_modules

# Install all dependencies.
RUN npm install

# Build the application
RUN npm run build

# Serve the app on port 8080
EXPOSE 8080

# Run the web service on container startup.
CMD [ "npm", "run", "dev" ]

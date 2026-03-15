# Use Node 18+ for built-in fetch support
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Expose the server port
EXPOSE 3001

# Command to run the application
CMD [ "node", "index.js" ]

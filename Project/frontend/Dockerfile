# Use an official Node runtime as a parent image

# Set the working directory in the container

# Copy package.json and package-lock.json

# Install app dependencies

# Copy the current directory contents into the container

# Build the app

# Make port 3000 available to the world outside this container

# Define environment variable

# Run the app when the container launches


FROM node:14-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

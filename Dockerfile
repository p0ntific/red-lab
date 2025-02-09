FROM node:18 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the container
COPY . ./

# Build the React app for production
RUN npm run build

CMD cp -r dist result_build

# Use Nginx as the production server
# FROM nginx:alpine

# Copy the built React app to Nginx's web server directory
# COPY --from=build /app/dist /usr/share/nginx/html

# Start Nginx when the container runs
# CMD ["nginx", "-g", "daemon off;"]
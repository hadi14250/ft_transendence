# Use an official Nginx image as a parent image
FROM nginx:alpine

# Remove the default configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d

# Copy SSL certificates
COPY ssl /etc/nginx/ssl

# Ensure the directory is clean before copying new files
RUN rm -rf /usr/share/nginx/html/*

# Copy the frontend files to the Nginx server
COPY . /usr/share/nginx/html

# Expose ports 80 and 443 to the outside world
EXPOSE 80 443

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]

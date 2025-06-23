# services/frontend/dashboard/Dockerfile
# >_ docker build -t dashboard:latest .
# >_ docker run -dit -p 3080:3080 --name dashboard dashboard:latest
# >_ docker ps -a --filter name=dashboard
# >_ docker attach dashboard
#    CTRL+p CTRL+q to detach, CTFL+c to exit

# Stage 1: Build the application
FROM node:24-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Copy your Bazel-managed node_modules if it's physically present
# This assumes 'npm_link_all_packages' creates a physical `node_modules`
# and you're not using Bazel to manage it inside the Docker build.
# COPY node_modules node_modules/

# Install dependencies. `npm ci` is good for CI/CD as it uses package-lock.json
RUN npm ci --prefer-offline || npm install # Fallback if `npm ci` fails without lockfile

# Copy all other necessary files
COPY BUILD vite_wrapper.js tsconfig.json tsconfig.build.json vite.config.ts index.html ./
COPY components.json postcss.config.js tailwind.config.js vercel.json ./
COPY src src/
COPY public public/

# Run the Vite build command
# Ensure your package.json has a "build" script, e.g., "build": "vite build"
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Label to auto-associate container with the source code repository
LABEL org.opencontainers.image.source=https://github.com/asarcar/ITSecOps

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy a custom Nginx configuration (optional but recommended)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the previous stage
# Vite typically outputs to a `dist` directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port Nginx will listen on
EXPOSE 3080

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]

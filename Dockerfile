FROM node:12.2.0-alpine as build

WORKDIR /app
# copy everything in the current dir to /app
# except whatever is excluded in .dockerignore
COPY . .

RUN yarn install 

RUN yarn build

# remove the node_modules directory to further slim down the image
RUN yarn rimraf node_modules

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
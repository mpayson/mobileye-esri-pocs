# base image
FROM amr-registry.caas.intel.com/intelaa/me-webmaps-base as build-stage

# set working directory

WORKDIR /app
COPY ./ /app
RUN npm run build

# start app
CMD ["npm", "start"]

#
#FROM nginx:1.17.9-alpine
#COPY /app/build /usr/share/nginx/html
#EXPOSE 80
#
#CMD ["nginx", "-g", "daemon off;"]


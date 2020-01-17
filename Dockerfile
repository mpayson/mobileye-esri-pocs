# base image
FROM amr-registry.caas.intel.com/intelaa/me-webmaps-base

# set working directory

WORKDIR /app
COPY ./ /app

EXPOSE 3000

# start app
CMD ["npm", "start"]

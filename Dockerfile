# base image
FROM node:alpine

# set working directory
RUN apk add git
WORKDIR /app
COPY ./ /app
ENV HTTPS_PROXY=$https_proxy
ENV HTTP_PROXY=$http_proxy
# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
RUN npm install
EXPOSE 3000

# start app
CMD ["npm", "start"]

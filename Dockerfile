# base image
#FROM node:alpine

# set working directory
#RUN apk add git
#WORKDIR /app
#COPY ./ /app
#ENV HTTPS_PROXY=$https_proxy
#ENV HTTP_PROXY=$http_proxy
#ENV HTTPS_PROXY=http://proxy-chain.intel.com:912
#ENV HTTP_PROXY=http://proxy-chain.intel.com:911
# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
#RUN npm install
#RUN npm install
#EXPOSE 3000

# start app
#CMD ["npm", "start"]


# base image
FROM node:slim

# set working directory

RUN apt update
RUN apt install -y git

WORKDIR /app
COPY ./ /app

RUN npm install

EXPOSE 3000

# start app
CMD ["npm", "start"]

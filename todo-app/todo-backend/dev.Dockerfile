# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/add/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install -D

# add app
COPY . ./

# start app
CMD ["npm", "start", "dev"]

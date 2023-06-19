FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]

 # docker buildx build -t preview-tx:amd64 -f  Dockerfile --platform=linux/amd64 .
 # docker build -t preview-tx:arm -f Dockerfile .

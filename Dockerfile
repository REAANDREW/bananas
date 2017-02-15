FROM node:6.9.2
EXPOSE 8080
COPY ./ .
CMD node app.js -c config/prod.json

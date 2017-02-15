FROM node:6.9.2
EXPOSE 8000
COPY ./ .
CMD node app.js -c config/prod.json

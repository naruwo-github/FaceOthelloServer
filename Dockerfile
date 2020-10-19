FROM node:14.11.0

COPY . /src/

EXPOSE 3000

WORKDIR /src/

RUN npm install

CMD npm start
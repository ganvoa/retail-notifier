FROM node:14
WORKDIR /usr/app
COPY yarn.lock .
COPY package.json .
RUN npx yarn install \
    && npm install -g typescript pm2
COPY src src
COPY app app
COPY tsconfig.json .
COPY pm2.scrapper.json processes.json
RUN tsc
ENV TZ America/Santiago
CMD ["pm2", "start", "--no-daemon", "processes.json"]
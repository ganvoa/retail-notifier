FROM node:14
WORKDIR /usr/app
COPY yarn.lock .
COPY package.json .
RUN npx yarn install \
    && npm install -g typescript pm2
COPY src src
COPY app app
COPY tsconfig.json .
COPY processes.json .
RUN tsc
CMD ["pm2", "start", "--no-daemon", "processes.json"]
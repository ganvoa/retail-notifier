FROM node:14
WORKDIR /usr/app
COPY yarn.lock .
COPY package.json .
RUN npx yarn install \
    && npm install -g typescript 
COPY src src
COPY app app
COPY tsconfig.json .
RUN tsc
ENTRYPOINT ["node"]
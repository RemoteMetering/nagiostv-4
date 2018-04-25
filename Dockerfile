FROM docker-registry.rmsconnect.net/rms-node


RUN apt-get update; \
  apt-get install git;
# Create app directory
RUN mkdir -p /usr/app
RUN mkdir -p /usr/app/log
WORKDIR /usr/app

# Bundle app source
COPY . /usr/app

RUN npm install -g bower; \
  npm install -g ember-cli; \
  npm install; \
  bower install --allow-root;

# replace this with your application's default port
CMD [ "yarn", "start" ]

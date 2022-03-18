FROM node:16-bullseye-slim as build

RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
	rename \
        wget; \ 
        apt-get clean;

# INSTALL zim-tools
ARG ZIMVERSION
RUN  wget -q -O - https://download.openzim.org/release/zim-tools/zim-tools_linux-x86_64-$ZIMVERSION.tar.gz | tar -xz \
    && cp zim-tools*/* /usr/local/bin/ \
    && rm -rf zim-tools*


WORKDIR /app
COPY package.json /app
RUN chown -R node:node /app
USER node

# INSTALL wiki2swarm
#RUN mkdir /app/wiki2swarm
#COPY package.json src/ /app/wiki2swarm/
#RUN npm pack /app/wiki2swarm
#RUN npm install wiki2swarm-*.tgz
# INSTALL swarm-cli & other dependencies
RUN npm install

FROM node:16-bullseye-slim

COPY --from=build /usr/local/bin/* /usr/local/bin/

WORKDIR /app
RUN chown -R node:node /app

USER node
COPY --from=build /app/node_modules/ /app/node_modules/
ENV PATH="/app/node_modules/.bin:$PATH"
CMD ["sleep", "infinity"]

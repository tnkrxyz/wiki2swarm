FROM node:16-bullseye-slim as build

RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
	wget; \ 
        apt-get clean;

# INSTALL zim-tools
ARG ZIMVERSION
RUN  wget -q -O - https://download.openzim.org/release/zim-tools/zim-tools_linux-x86_64-$ZIMVERSION.tar.gz | tar -xz \
#RUN wget -q -O - https://download.openzim.org/release/zim-tools/zim-tools_linux-x86_64-3.1.0.tar.gz | tar -xz \
    && cp zim-tools*/* /usr/local/bin/ \
    && rm -rf zim-tools*

WORKDIR /app
COPY package.json /app
# INSTALL swarm-cli & other dependencies
RUN npm install


FROM node:16-bullseye-slim
WORKDIR /app

COPY --from=build /app/node_modules/ /app/node_modules/
COPY --from=build /usr/local/bin/* /usr/local/bin/

#RUN zimdump --help
ENV PATH="/app/node_modules/.bin:$PATH"
#RUN swarm-cli status
#ENTRYPOINT ["tail"]
#CMD ["-f","/dev/null"]

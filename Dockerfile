FROM ruby:3.2.2

ENV NODE_VERSION=18.16.0
ENV ARCH=x64

RUN wget "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-$ARCH.tar.xz" \
    && tar -xJf "node-v$NODE_VERSION-linux-$ARCH.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
    && rm "node-v$NODE_VERSION-linux-$ARCH.tar.xz"

WORKDIR /app

COPY . /app

RUN bundle install && chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

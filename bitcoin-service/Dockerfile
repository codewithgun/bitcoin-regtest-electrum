FROM ubuntu:20.04
WORKDIR /
COPY ./bitcoin-service/bitcoin-cli /bin/
COPY ./bitcoin-service/bitcoind /bin/
COPY ./bitcoin-service/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
# Docker example for bitcoind regtest with electrumX server

Run bitcoind and electrumX container

```
docker-compose up --build
```

Sample script to query from electrumX server:

```
node src/main.js 127.0.0.1 50002 getLatestBlock regtest

node src/main.js 127.0.0.1 50002 getBalance regtest n44jKByaYzQCb3HW4BUQBXkW2hs7LRta2w

node src/main.js 127.0.0.1 50002 getUnspent regtest n44jKByaYzQCb3HW4BUQBXkW2hs7LRta2w

node src/main.js 127.0.0.1 50002 getTransaction regtest 00a7d048f4af43ddf1cd6c44c3f4857b4829a6e82265936de0a592de17425df6
```

### Sample .env

```
RPC_PORT=18443
RPC_USER=electrumX
RPC_PASSWORD=electrumX
COINBASE_ADDRESS=n44jKByaYzQCb3HW4BUQBXkW2hs7LRta2w
```

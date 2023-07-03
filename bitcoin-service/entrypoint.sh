#!/bin/bash

cd /bin

nohup bitcoind -rpcpassword=$RPC_PASSWORD -rpcport=$RPC_PORT -rpcuser=$RPC_USER -rpcallowip=192.168.254.0/24 -rpcbind=0.0.0.0:$RPC_PORT -txindex=1 -regtest &

(
n=0
until [ "$n" -ge 5 ]
do
   bitcoin-cli -regtest -rpcpassword=$RPC_PASSWORD -rpcuser=$RPC_USER -named generatetoaddress nblocks=101 address=$COINBASE_ADDRESS && break
   n=$((n+1)) 
   sleep 5
done
) &

(
while true
do
    sleep $BLOCK_TIME
    bitcoin-cli -regtest -rpcpassword=$RPC_PASSWORD -rpcuser=$RPC_USER -named generatetoaddress nblocks=1 address=$COINBASE_ADDRESS
done
) &

wait
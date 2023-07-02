const net = require("net");
const bitcoin = require("bitcoinjs-lib");

// const url = "blackie.c3-soft.com";
// const port = 57005;

function execute(url, port, method, params) {
  return new Promise((res) => {
    const client = new net.Socket();
    client.on("data", (chunks) => {
      const response = JSON.parse(chunks.toString());
      console.log(response);
      client.destroy();
      // TODO: handle invalid response
      res(response.result);
    });

    client.on("error", (err) => console.error(err.message));
    client.on("connect", () => {
      console.log("Connected");
    });
    client.on("close", () => {
      console.log("Closing");
    });
    console.log(`${url}:${port}`);
    client.connect(port, url, () => {
      const body = JSON.stringify({
        jsonrpc: "2.0",
        method,
        id: 0,
        params,
      });
      client.write(body);
      client.write("\n");
    });
  });
}

function getBalance(url, port, address, network) {
  const scriptPubkey = bitcoin.address.toOutputScript(address, network);
  const scriptHash = bitcoin.crypto.sha256(scriptPubkey);
  const reversedScriptHash = scriptHash.reverse();
  return execute(url, port, "blockchain.scripthash.get_balance", [
    reversedScriptHash.toString("hex"),
  ]);
}

function getUnspent(url, port, address, network) {
  const scriptPubkey = bitcoin.address.toOutputScript(address, network);
  const scriptHash = bitcoin.crypto.sha256(scriptPubkey);
  const reversedScriptHash = scriptHash.reverse();
  return execute(url, port, "blockchain.scripthash.listunspent", [
    reversedScriptHash.toString("hex"),
  ]);
}

async function main() {
  const url = process.argv[2];
  const port = process.argv[3];
  const cmd = process.argv[4];
  const network = process.argv[5];
  const param = process.argv[6];

  console.log("Executing", cmd, "Network", network, "Url", url, "Port", port);

  let btcNetwork = null;
  switch (network) {
    case "testnet":
      btcNetwork = bitcoin.networks.testnet;
      break;
    case "regtest":
      btcNetwork = bitcoin.networks.regtest;
      break;
    case "mainnet":
      btcNetwork = bitcoin.networks.bitcoin;
      break;
    default:
      throw new Error("Unknown network");
  }

  switch (cmd) {
    case "getBalance":
      await getBalance(url, port, param, btcNetwork);
      break;
    case "getUnspent":
      await getUnspent(url, port, param, btcNetwork);
      break;
    case "getLatestBlock":
      result = await execute(url, port, "blockchain.headers.subscribe", []);
      const blockHeaderHex = result.hex;

      const block = bitcoin.Block.fromHex(blockHeaderHex);
      console.log(block);
      console.log(
        "Reversed merkle root",
        block.merkleRoot.reverse().toString("hex")
      );
      console.log("Block hash", block.getId());
      break;
    case "getTransaction":
      result = await execute(url, port, "blockchain.transaction.get", [
        param,
        true,
      ]);
      for (const vout of result.vout) {
        console.log(vout);
      }
      break;
  }
}

main()
  .then((_) => console.log("Exiting"))
  .catch(console.error);

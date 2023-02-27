
export const Network = {
  Offline: { rpc: 'offline', tx_explorer: null },
  'Local RPC': { rpc: 'http://127.0.0.1:8545', tx_explorer: null },
  'Ropsten Testnet': { rpc: 'https://ropsten.infura.io/GjiCzFxpQAUkPtDUpKEP', tx_explorer: 'https://ropsten.etherscan.io/tx/' },
  'Rinkeby Testnet': { rpc: 'https://rinkeby.infura.io/v3/55b0d23db9bf4ef2b77e3eb471d4b326', tx_explorer: 'https://rinkeby.etherscan.io/tx/' },
  'Main Net': { rpc: 'https://mainnet.infura.io/GjiCzFxpQAUkPtDUpKEP', tx_explorer: 'https://etherscan.io/tx/' },
};

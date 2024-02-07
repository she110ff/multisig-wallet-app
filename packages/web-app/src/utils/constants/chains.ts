/* SUPPORTED NETWORK TYPES ================================================== */

import {infuraApiKey} from './api';

export const SUPPORTED_CHAIN_ID = [1, 5, 2151, 2019, 24680] as const;
export type SupportedChainID = typeof SUPPORTED_CHAIN_ID[number];

export function isSupportedChainId(
  chainId: number
): chainId is SupportedChainID {
  return SUPPORTED_CHAIN_ID.some(id => id === chainId);
}

export const ENS_SUPPORTED_NETWORKS = [];

const SUPPORTED_NETWORKS = [
  'ethereum',
  'goerli',
  'bosagora_mainnet',
  'bosagora_devnet',
  'bosagora_testnet',
  'localhost',
] as const;

export type availableNetworks = 'mainnet' | 'goerli' | 'bosagora_devnet';

export type SupportedNetworks =
  | typeof SUPPORTED_NETWORKS[number]
  | 'unsupported';

export function isSupportedNetwork(
  network: string
): network is SupportedNetworks {
  return SUPPORTED_NETWORKS.some(n => n === network);
}

export function toSupportedNetwork(network: string): SupportedNetworks {
  return SUPPORTED_NETWORKS.some(n => n === network)
    ? (network as SupportedNetworks)
    : 'unsupported';
}

/**
 * Get the network name with given chain id
 * @param chainId Chain id
 * @returns the name of the supported network or undefined if network is unsupported
 */
export function getSupportedNetworkByChainId(
  chainId: number
): SupportedNetworks | undefined {
  if (isSupportedChainId(chainId)) {
    return Object.entries(CHAIN_METADATA).find(
      entry => entry[1].id === chainId
    )?.[0] as SupportedNetworks;
  }
}

export type NetworkDomain = 'L1 Blockchain' | 'L2 Blockchain';

/* CHAIN DATA =============================================================== */

export type NativeTokenData = {
  name: string;
  symbol: string;
  decimals: number;
};

export type ChainData = {
  id: SupportedChainID;
  name: string;
  domain: NetworkDomain;
  testnet: boolean;
  explorer: string;
  logo: string;
  rpc: string[];
  nativeCurrency: NativeTokenData;
  etherscanApi: string;
  etherscanApiKey?: string;
  covalentApi?: string;
  alchemyApi: string;
  supportsEns: boolean;
  ipfs?: string;
};

const etherscanApiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;

export type ChainList = Record<SupportedNetworks, ChainData>;
export const CHAIN_METADATA: ChainList = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    domain: 'L1 Blockchain',
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    explorer: 'https://etherscan.io/',
    testnet: false,
    rpc: [
      `https://mainnet.infura.io/v3/${infuraApiKey}`,
      `wss://mainnet.infura.io/ws/v3/${infuraApiKey}`,
    ],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    etherscanApi: 'https://api.etherscan.io/api',
    etherscanApiKey: etherscanApiKey,
    covalentApi: 'https://api.covalenthq.com/v1/eth-mainnet',
    alchemyApi: 'https://eth-mainnet.g.alchemy.com/v2',
    supportsEns: false,
    ipfs: 'https://prod.ipfs.aragon.network',
  },
  goerli: {
    id: 5,
    name: 'Goerli',
    domain: 'L1 Blockchain',
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    explorer: 'https://goerli.etherscan.io/',
    testnet: true,
    rpc: [
      `https://goerli.infura.io/v3/${infuraApiKey}`,
      `wss://goerli.infura.io/ws/v3/${infuraApiKey}`,
    ],
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    etherscanApi: 'https://api-goerli.etherscan.io/api',
    etherscanApiKey: etherscanApiKey,
    covalentApi: 'https://api.covalenthq.com/v1/eth-goerli',
    alchemyApi: 'https://eth-goerli.g.alchemy.com/v2',
    supportsEns: false,
    ipfs: 'https://test.ipfs.aragon.network',
  },
  bosagora_mainnet: {
    id: 2151,
    name: 'BOSagora mainnet',
    domain: 'L1 Blockchain',
    logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
    explorer: 'https://boascan.io/',
    testnet: false,
    rpc: ['https://mainnet.bosagora.org'],
    nativeCurrency: {
      name: 'BOA',
      symbol: 'BOA',
      decimals: 18,
    },
    etherscanApi: '',
    etherscanApiKey: '',
    covalentApi: '',
    alchemyApi: '',
    supportsEns: false,
    ipfs: '',
  },
  bosagora_testnet: {
    id: 2019,
    name: 'BOSagora testnet',
    domain: 'L1 Blockchain',
    logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
    explorer: 'https://boascan.io/',
    testnet: true,
    rpc: ['https://testnet.bosagora.org'],
    nativeCurrency: {
      name: 'BOA',
      symbol: 'BOA',
      decimals: 18,
    },
    etherscanApi: '',
    etherscanApiKey: '',
    covalentApi: '',
    alchemyApi: '',
    supportsEns: false,
    ipfs: '',
  },
  bosagora_devnet: {
    id: 24680,
    name: 'BOSagora devnet',
    domain: 'L1 Blockchain',
    logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
    explorer: 'https://boascan.io/',
    testnet: true,
    rpc: ['http://localhost:8545'],
    nativeCurrency: {
      name: 'BOA',
      symbol: 'BOA',
      decimals: 18,
    },
    etherscanApi: '',
    etherscanApiKey: '',
    covalentApi: '',
    alchemyApi: '',
    supportsEns: false,
    ipfs: '',
  },
  localhost: {
    id: 24680,
    name: 'localhost',
    domain: 'L1 Blockchain',
    logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
    explorer: 'https://boascan.io/',
    testnet: true,
    rpc: ['http://localhost:8545'],
    nativeCurrency: {
      name: 'BOA',
      symbol: 'BOA',
      decimals: 18,
    },
    etherscanApi: '',
    etherscanApiKey: '',
    covalentApi: '',
    alchemyApi: '',
    supportsEns: false,
    ipfs: '',
  },
  unsupported: {
    id: 1,
    name: 'Unsupported',
    domain: 'L1 Blockchain',
    logo: '',
    explorer: '',
    testnet: false,
    rpc: [],
    nativeCurrency: {
      name: '',
      symbol: '',
      decimals: 18,
    },
    etherscanApi: '',
    alchemyApi: '',
    supportsEns: false,
    ipfs: '',
  },
};

export const chainExplorerAddressLink = (
  network: SupportedNetworks,
  address: string
) => {
  return `${CHAIN_METADATA[network].explorer}address/${address}`;
};

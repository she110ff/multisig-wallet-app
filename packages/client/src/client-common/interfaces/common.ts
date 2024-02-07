export enum SupportedNetwork {
    ETHEREUM_MAINNET = "homestead",
    ETHEREUM_TESTNET = "goerli",
    BOSAGORA_MAINNET = "bosagora_mainnet",
    BOSAGORA_TESTNET = "bosagora_testnet",
    BOSAGORA_DEVNET = "bosagora_devnet",
    BOSAGORA_LOCAL = "localhost"
}

export const SupportedNetworksArray = Object.values(SupportedNetwork);

export type NetworkDeployment = {
    MultiSigWalletFactoryAddress: string;
};

export type GasFeeEstimation = {
    average: bigint;
    max: bigint;
};

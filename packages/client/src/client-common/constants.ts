import { NetworkDeployment, SupportedNetwork } from "./interfaces/common";
import { activeContractsList } from "multisig-wallet-contracts-lib";

export const LIVE_CONTRACTS: { [K in SupportedNetwork]: NetworkDeployment } = {
    [SupportedNetwork.ETHEREUM_MAINNET]: {
        MultiSigWalletFactoryAddress: activeContractsList.bosagora_mainnet.MultiSigWalletFactory
    },
    [SupportedNetwork.ETHEREUM_TESTNET]: {
        MultiSigWalletFactoryAddress: activeContractsList.bosagora_testnet.MultiSigWalletFactory
    },
    [SupportedNetwork.BOSAGORA_MAINNET]: {
        MultiSigWalletFactoryAddress: activeContractsList.bosagora_mainnet.MultiSigWalletFactory
    },
    [SupportedNetwork.BOSAGORA_TESTNET]: {
        MultiSigWalletFactoryAddress: activeContractsList.bosagora_testnet.MultiSigWalletFactory
    },
    [SupportedNetwork.BOSAGORA_DEVNET]: {
        MultiSigWalletFactoryAddress: activeContractsList.bosagora_devnet.MultiSigWalletFactory
    },
    [SupportedNetwork.BOSAGORA_LOCAL]: {
        MultiSigWalletFactoryAddress: activeContractsList.bosagora_devnet.MultiSigWalletFactory
    }
};

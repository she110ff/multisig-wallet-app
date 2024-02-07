import { ClientCore, Context, SupportedNetwork, SupportedNetworksArray } from "../../client-common";
import { IMultiSigWalletFactoryMethods } from "../../interface/IMultiSigWalletFactory";
import { NormalSteps, CreateMultiSigWallet, ContractWalletInfo, ChangeInformation } from "../../interfaces";
import {
    ContractUtils,
    GasPriceManager,
    NonceManager,
    FailedCreateWallet,
    FailedChangeName,
    FailedChangeDescription
} from "../../utils";

import { NoProviderError, NoSignerError, UnsupportedNetworkError } from "multisig-wallet-sdk-common";
import { MultiSigWalletFactory, MultiSigWalletFactory__factory } from "multisig-wallet-contracts-lib";

import { getNetwork } from "@ethersproject/networks";
import { Provider } from "@ethersproject/providers";

export class MultiSigWalletFactoryMethods extends ClientCore implements IMultiSigWalletFactoryMethods {
    constructor(context: Context) {
        super(context);
        Object.freeze(MultiSigWalletFactoryMethods.prototype);
        Object.freeze(this);
    }

    public async *create(
        name: string,
        description: string,
        owners: string[],
        required: number
    ): AsyncGenerator<CreateMultiSigWallet> {
        const signer = this.web3.getConnectedSigner();
        if (!signer) {
            throw new NoSignerError();
        } else if (!signer.provider) {
            throw new NoProviderError();
        }

        console.log(`MultiSigWalletFactoryMethods.create`)
        const providerNetwork = await signer.provider.getNetwork();
        console.log(`MultiSigWalletFactoryMethods.create - providerNetwork: ${JSON.stringify(providerNetwork)}`)
        console.log(`MultiSigWalletFactoryMethods.create - chainId: ${providerNetwork.chainId}`)
        const network = getNetwork(providerNetwork.chainId);
        console.log(`MultiSigWalletFactoryMethods.create - network: ${JSON.stringify(network)}`)
        const networkName = network.name as SupportedNetwork;
        console.log(`MultiSigWalletFactoryMethods.create - networkName: ${networkName}`)
        if (!SupportedNetworksArray.includes(networkName)) {
            throw new UnsupportedNetworkError(networkName);
        }

        console.log(`MultiSigWalletFactoryMethods.create - contract: ${this.web3.getWalletFactoryAddress()}`)
        const contract: MultiSigWalletFactory = MultiSigWalletFactory__factory.connect(
            this.web3.getWalletFactoryAddress(),
            signer
        );

        try {
            console.log(`MultiSigWalletFactoryMethods.create - name: ${name}`)
            console.log(`MultiSigWalletFactoryMethods.create - description: ${description}`)
            console.log(`MultiSigWalletFactoryMethods.create - owners: ${JSON.stringify(owners)}`)
            console.log(`MultiSigWalletFactoryMethods.create - required: ${required}`)
            const tx = await contract.create(name, description, owners, required);
            yield {
                key: NormalSteps.SENT,
                creator: await signer.getAddress(),
                owners,
                required,
                txHash: tx.hash
            };

            const address = await ContractUtils.getEventValueString(
                tx,
                contract.interface,
                "ContractInstantiation",
                "wallet"
            );

            if (address !== undefined) {
                yield {
                    key: NormalSteps.SUCCESS,
                    address
                };
            } else {
                throw new FailedCreateWallet();
            }
        } catch (error) {
            throw new FailedCreateWallet();
        }
    }

    public async getNumberOfWalletsForCreator(creator: string): Promise<number> {
        const provider = this.web3.getProvider() as Provider;
        if (!provider) throw new NoProviderError();

        const network = getNetwork((await provider.getNetwork()).chainId);
        const networkName = network.name as SupportedNetwork;
        if (!SupportedNetworksArray.includes(networkName)) {
            throw new UnsupportedNetworkError(networkName);
        }

        const contract: MultiSigWalletFactory = MultiSigWalletFactory__factory.connect(
            this.web3.getWalletFactoryAddress(),
            provider
        );
        return (await contract.getNumberOfWalletsForCreator(creator)).toNumber();
    }

    public async getWalletsForCreator(creator: string, from: number, to: number): Promise<ContractWalletInfo[]> {
        const provider = this.web3.getProvider() as Provider;
        if (!provider) throw new NoProviderError();

        const network = getNetwork((await provider.getNetwork()).chainId);
        const networkName = network.name as SupportedNetwork;
        if (!SupportedNetworksArray.includes(networkName)) {
            throw new UnsupportedNetworkError(networkName);
        }

        const contract: MultiSigWalletFactory = MultiSigWalletFactory__factory.connect(
            this.web3.getWalletFactoryAddress(),
            provider
        );
        const res = await contract.getWalletsForCreator(creator, from, to);
        return res.map((m) => {
            return {
                creator: m.creator,
                wallet: m.wallet,
                name: m.name,
                description: m.description,
                time: m.time
            };
        });
    }

    public async getNumberOfWalletsForOwner(owner: string): Promise<number> {
        const provider = this.web3.getProvider() as Provider;
        if (!provider) throw new NoProviderError();

        const network = getNetwork((await provider.getNetwork()).chainId);
        const networkName = network.name as SupportedNetwork;
        if (!SupportedNetworksArray.includes(networkName)) {
            throw new UnsupportedNetworkError(networkName);
        }

        const contract: MultiSigWalletFactory = MultiSigWalletFactory__factory.connect(
            this.web3.getWalletFactoryAddress(),
            provider
        );
        return (await contract.getNumberOfWalletsForOwner(owner)).toNumber();
    }

    public async getWalletsForOwner(owner: string, from: number, to: number): Promise<ContractWalletInfo[]> {
        const provider = this.web3.getProvider() as Provider;
        if (!provider) throw new NoProviderError();

        const network = getNetwork((await provider.getNetwork()).chainId);
        const networkName = network.name as SupportedNetwork;
        if (!SupportedNetworksArray.includes(networkName)) {
            throw new UnsupportedNetworkError(networkName);
        }

        const contract: MultiSigWalletFactory = MultiSigWalletFactory__factory.connect(
            this.web3.getWalletFactoryAddress(),
            provider
        );
        const res = await contract.getWalletsForOwner(owner, from, to);
        return res.map((m) => {
            return {
                creator: m.creator,
                wallet: m.wallet,
                name: m.name,
                description: m.description,
                time: m.time
            };
        });
    }

    public async getWalletInfo(wallet: string): Promise<ContractWalletInfo> {
        const provider = this.web3.getProvider() as Provider;
        if (!provider) throw new NoProviderError();

        const network = getNetwork((await provider.getNetwork()).chainId);
        const networkName = network.name as SupportedNetwork;
        if (!SupportedNetworksArray.includes(networkName)) {
            throw new UnsupportedNetworkError(networkName);
        }

        const contract: MultiSigWalletFactory = MultiSigWalletFactory__factory.connect(
            this.web3.getWalletFactoryAddress(),
            provider
        );
        const res = await contract.getWalletInfo(wallet);
        return {
            creator: res.creator,
            wallet: res.wallet,
            name: res.name,
            description: res.description,
            time: res.time
        };
    }

    public async *changeName(wallet: string, name: string): AsyncGenerator<ChangeInformation> {
        const signer = this.web3.getConnectedSigner();
        if (!signer) {
            throw new NoSignerError();
        } else if (!signer.provider) {
            throw new NoProviderError();
        }

        const network = getNetwork((await signer.provider.getNetwork()).chainId);
        const networkName = network.name as SupportedNetwork;
        if (!SupportedNetworksArray.includes(networkName)) {
            throw new UnsupportedNetworkError(networkName);
        }

        const nonceSigner = new NonceManager(new GasPriceManager(signer));
        const contract: MultiSigWalletFactory = MultiSigWalletFactory__factory.connect(
            this.web3.getWalletFactoryAddress(),
            nonceSigner
        );

        let success = true;
        try {
            const tx = await contract.changeName(wallet, name);
            yield {
                key: NormalSteps.SENT,
                txHash: tx.hash
            };

            const newName = await ContractUtils.getEventValueString(tx, contract.interface, "ChangedName", "name");

            if (newName === name) {
                yield {
                    key: NormalSteps.SUCCESS
                };
            } else {
                success = false;
            }
        } catch (error) {
            success = false;
        }

        if (!success) throw new FailedChangeName();
    }

    public async *changeDescription(wallet: string, description: string): AsyncGenerator<ChangeInformation> {
        const signer = this.web3.getConnectedSigner();
        if (!signer) {
            throw new NoSignerError();
        } else if (!signer.provider) {
            throw new NoProviderError();
        }

        const network = getNetwork((await signer.provider.getNetwork()).chainId);
        const networkName = network.name as SupportedNetwork;
        if (!SupportedNetworksArray.includes(networkName)) {
            throw new UnsupportedNetworkError(networkName);
        }

        const nonceSigner = new NonceManager(new GasPriceManager(signer));
        const contract: MultiSigWalletFactory = MultiSigWalletFactory__factory.connect(
            this.web3.getWalletFactoryAddress(),
            nonceSigner
        );

        let success = true;
        try {
            const tx = await contract.changeDescription(wallet, description);
            yield {
                key: NormalSteps.SENT,
                txHash: tx.hash
            };

            const newDescription = await ContractUtils.getEventValueString(
                tx,
                contract.interface,
                "ChangedDescription",
                "description"
            );

            if (newDescription === description) {
                yield {
                    key: NormalSteps.SUCCESS
                };
            } else {
                success = false;
            }
        } catch (error) {
            success = false;
        }
        if (!success) throw new FailedChangeDescription();
    }
}

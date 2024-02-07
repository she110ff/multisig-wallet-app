import { IClientCore } from "../client-common";
import { ChangeInformation, ContractWalletInfo, CreateMultiSigWallet } from "../interfaces";

export interface IMultiSigWalletFactory {
    multiSigWalletFactory: IMultiSigWalletFactoryMethods;
}

/** Defines the shape of the general purpose Client class */
export interface IMultiSigWalletFactoryMethods extends IClientCore {
    create: (
        name: string,
        description: string,
        owners: string[],
        required: number
    ) => AsyncGenerator<CreateMultiSigWallet>;
    getNumberOfWalletsForCreator: (creator: string) => Promise<number>;
    getWalletsForCreator: (creator: string, from: number, to: number) => Promise<ContractWalletInfo[]>;

    getNumberOfWalletsForOwner: (owner: string) => Promise<number>;
    getWalletsForOwner: (owner: string, from: number, to: number) => Promise<ContractWalletInfo[]>;

    getWalletInfo: (wallet: string) => Promise<ContractWalletInfo>;
    changeName: (wallet: string, name: string) => AsyncGenerator<ChangeInformation>;
    changeDescription: (wallet: string, description: string) => AsyncGenerator<ChangeInformation>;
}

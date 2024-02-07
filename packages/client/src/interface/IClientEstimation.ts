import { GasFeeEstimation } from "../client-common/interfaces/common";

export interface IClientEstimation {
    estimation: IClientEstimationMethods;
}

export interface IClientEstimationMethods {
    createWallet: () => Promise<GasFeeEstimation>;
}

import { ClientCore, Context, GasFeeEstimation } from "../../client-common";
import { IClientEstimationMethods } from "../../interface/IClientEstimation";

export class ClientEstimationMethods extends ClientCore implements IClientEstimationMethods {
    constructor(context: Context) {
        super(context);
        Object.freeze(ClientEstimationMethods.prototype);
        Object.freeze(this);
    }

    public async createWallet(): Promise<GasFeeEstimation> {
        return this.web3.getApproximateGasFee(BigInt(2510238));
    }
}

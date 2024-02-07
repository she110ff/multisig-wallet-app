import { ContextParams, ContextState } from "./interfaces/context";
import { JsonRpcProvider, Networkish } from "@ethersproject/providers";
import { UnsupportedProtocolError } from "multisig-wallet-sdk-common";
import { activeContractsList } from "multisig-wallet-contracts-lib";
export { ContextParams } from "./interfaces/context";

const DEFAULT_GAS_FEE_ESTIMATION_FACTOR = 0.625;
const supportedProtocols = ["https:", "http:"];
// if (typeof process !== "undefined" && process.env?.TESTING) {
//     supportedProtocols.push("http:");
// }

// State
const defaultState: ContextState = {
    network: "mainnet",
    web3Providers: [],
    gasFeeEstimationFactor: DEFAULT_GAS_FEE_ESTIMATION_FACTOR,
};

export class Context {
    protected state: ContextState = Object.assign({}, defaultState);

    // INTERNAL CONTEXT STATE

    /**
     * @param {Object} params
     *
     * @constructor
     */
    constructor(params: Partial<ContextParams>) {
        this.set(params);
    }

    /**
     * Getter for the network
     *
     * @var network
     *
     * @returns {Networkish}
     *
     * @public
     */
    get network() {
        return this.state.network || defaultState.network;
    }

    /**
     * Getter for the Signer
     *
     * @var signer
     *
     * @returns {Signer}
     *
     * @public
     */
    get signer() {
        return this.state.signer || defaultState.signer;
    }

    // GETTERS

    /**
     * Getter for the web3 providers
     *
     * @var web3Providers
     *
     * @returns {JsonRpcProvider[]}
     *
     * @public
     */
    get web3Providers() {
        return this.state.web3Providers || defaultState.web3Providers;
    }

    /**
     * Getter for the gas fee reducer used in estimations
     *
     * @var gasFeeEstimationFactor
     *
     * @returns {number}
     *
     * @public
     */
    get gasFeeEstimationFactor(): number {
        return (
            this.state.gasFeeEstimationFactor || defaultState.gasFeeEstimationFactor
        );
    }

    get walletFactoryAddress(): string | undefined {
        return this.state.walletFactoryAddress;
    }

    // DEFAULT CONTEXT STATE
    static setDefault(params: Partial<ContextParams>) {
        if (params.signer) {
            defaultState.signer = params.signer;
        }
    }

    static getDefault() {
        return defaultState;
    }

    private static resolveWeb3Providers(
        endpoints: string | JsonRpcProvider | (string | JsonRpcProvider)[],
        network: Networkish
    ): JsonRpcProvider[] {
        if (Array.isArray(endpoints)) {
            return endpoints.map((item) => {
                if (typeof item === "string") {
                    const url = new URL(item);
                    if (!supportedProtocols.includes(url.protocol)) {
                        throw new UnsupportedProtocolError(url.protocol);
                    }
                    return new JsonRpcProvider(url.href, network);
                }
                return item;
            });
        } else if (typeof endpoints === "string") {
            const url = new URL(endpoints);
            if (!supportedProtocols.includes(url.protocol)) {
                throw new UnsupportedProtocolError(url.protocol);
            }
            return [new JsonRpcProvider(url.href, network)];
        } else {
            return [endpoints];
        }
    }

    /**
     * Does set and parse the given context configuration object
     *
     * @returns {void}
     *
     * @private
     */
    setFull(contextParams: ContextParams): void {
        if (!contextParams.network) {
            throw new Error("Missing network");
        } else if (!contextParams.signer) {
            throw new Error("Please pass the required signer");
        } else if (!contextParams.web3Providers) {
            throw new Error("No web3 endpoints defined");
        } else if (!contextParams.walletFactoryAddress) {
            throw new Error("Missing multi sig wallet factory contract address");
        } else if (!contextParams.gasFeeEstimationFactor) {
            throw new Error("No gas fee reducer defined");
        }

        this.state = {
            network: contextParams.network,
            signer: contextParams.signer,
            web3Providers: Context.resolveWeb3Providers(contextParams.web3Providers, contextParams.network),
            walletFactoryAddress: contextParams.walletFactoryAddress,
            gasFeeEstimationFactor: Context.resolveGasFeeEstimationFactor(
                contextParams.gasFeeEstimationFactor
            ),
        };
    }

    set(contextParams: Partial<ContextParams>) {

        console.log(`ContextParams - ${JSON.stringify(contextParams)}`)

        if (contextParams.network) {
            this.state.network = contextParams.network;
        }
        if (contextParams.signer) {
            this.state.signer = contextParams.signer;
        }
        if (contextParams.web3Providers) {
            this.state.web3Providers = Context.resolveWeb3Providers(contextParams.web3Providers, this.state.network);
        }
        if (contextParams.walletFactoryAddress) {
            this.state.walletFactoryAddress = contextParams.walletFactoryAddress;
        } else if (this.state.network.toString() in activeContractsList) {
            this.state.walletFactoryAddress =
                activeContractsList[
                    this.state.network.toString() as keyof typeof activeContractsList
                    ].MultiSigWalletFactory;
        }
        if (contextParams.gasFeeEstimationFactor) {
            this.state.gasFeeEstimationFactor = Context.resolveGasFeeEstimationFactor(
                contextParams.gasFeeEstimationFactor
            );
        }
    }

    private static resolveGasFeeEstimationFactor(
        gasFeeEstimationFactor: number
    ): number {
        if (typeof gasFeeEstimationFactor === "undefined") return 1;
        else if (gasFeeEstimationFactor < 0 || gasFeeEstimationFactor > 1) {
            throw new Error(
                "Gas estimation factor value should be a number between 0 and 1"
            );
        }
        return gasFeeEstimationFactor;
    }
}

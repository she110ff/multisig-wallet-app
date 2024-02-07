import { BytesLike } from "@ethersproject/bytes";
import { BigNumber } from "@ethersproject/bignumber";

export enum NormalSteps {
    SENT = "sent",
    SUCCESS = "success"
}

export type CreateMultiSigWallet =
    | {
          key: NormalSteps.SENT;
          creator: string;
          owners: string[];
          required: number;
          txHash: BytesLike;
      }
    | {
          key: NormalSteps.SUCCESS;
          address: string;
      };

export type SubmitTransaction =
    | {
          key: NormalSteps.SENT;
          txHash: BytesLike;
      }
    | {
          key: NormalSteps.SUCCESS;
          transactionId: BigNumber;
      };

export type ConfirmTransaction =
    | {
          key: NormalSteps.SENT;
          txHash: BytesLike;
      }
    | {
          key: NormalSteps.SUCCESS;
          transactionId: BigNumber;
      };

export type RevokeTransaction =
    | {
          key: NormalSteps.SENT;
          txHash: BytesLike;
      }
    | {
          key: NormalSteps.SUCCESS;
          transactionId: BigNumber;
      };

export type ChangeInformation =
    | {
          key: NormalSteps.SENT;
          txHash: BytesLike;
      }
    | {
          key: NormalSteps.SUCCESS;
      };

export interface ContractTransactionData {
    title: string;
    description: string;
    destination: string;
    value: BigNumber;
    data: string;
    executed: boolean;
}

export interface ContractWalletInfo {
    creator: string;
    wallet: string;
    name: string;
    description: string;
    time: BigNumber;
}

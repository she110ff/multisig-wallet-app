import { GanacheServer } from "../helper/GanacheServer";
import { BOACoin, ABIStorage } from "../../src";

import * as assert from "assert";
import { BigNumber } from "@ethersproject/bignumber";

describe("SDK Client", () => {
    const [account1, account2, account3] = GanacheServer.accounts();
    it("encodeFunctionData", async () => {
        const amount = BOACoin.make(100).value;
        const encoded = ABIStorage.encodeFunctionData("MultiSigToken", "transfer", [account1.address, amount]);
        assert.deepStrictEqual(
            encoded,
            "0xa9059cbb00000000000000000000000002eafc1091533f984db53483a7215c7a982a3ac10000000000000000000000000000000000000000000000056bc75e2d63100000"
        );
    });

    it("decodeFunctionData", async () => {
        const res = ABIStorage.decodeFunctionData(
            "0xa9059cbb00000000000000000000000002eafc1091533f984db53483a7215c7a982a3ac10000000000000000000000000000000000000000000000056bc75e2d63100000"
        );

        assert.ok(res !== undefined);
        console.log(ABIStorage.displayFunctionData(res));
    });

    it("encodeFunctionData", async () => {
        const encoded = ABIStorage.encodeFunctionData("MultiSigWalletFactory", "create", [
            [account1.address, account2.address, account3.address],
            BigNumber.from(2)
        ]);

        assert.deepStrictEqual(
            encoded,
            "0xf8f7380800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000300000000000000000000000002eafc1091533f984db53483a7215c7a982a3ac10000000000000000000000002312c098cef41c0f55350bc3ad8f4aff983d94320000000000000000000000005ad84ff1bd71cdea7c3083706f2d1232a453c604"
        );
    });

    it("decodeFunctionData", async () => {
        const res = ABIStorage.decodeFunctionData(
            "0xf8f7380800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000300000000000000000000000002eafc1091533f984db53483a7215c7a982a3ac10000000000000000000000002312c098cef41c0f55350bc3ad8f4aff983d94320000000000000000000000005ad84ff1bd71cdea7c3083706f2d1232a453c604"
        );

        assert.ok(res !== undefined);
        console.log(ABIStorage.displayFunctionData(res));
    });
});

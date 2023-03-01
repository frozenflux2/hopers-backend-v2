import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import dotenv from 'dotenv';

dotenv.config();

const rpcEndpoint = process.env.RPC_ENDPOINT;
const sender = {
    mnemonic: process.env.WALLET_MNEMONIC,
    address: process.env.WALLET_ADDRESS,
};

let senderClient: SigningCosmWasmClient | null = null;

const getClient = async () => {
    const senderWallet = await DirectSecp256k1HdWallet.fromMnemonic(
        sender.mnemonic,
        { prefix: 'juno' },
    );
    senderClient = await SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        senderWallet,
    );
};

export const runQuery = async (
    contractAddress: string,
    message: Record<string, any>,
) => {
    if (!contractAddress || !message) return null;
    try {
        if (!senderClient) {
            await getClient();
        }
        const result = await senderClient.queryContractSmart(
            contractAddress,
            message,
        );
        return result;
    } catch {
        return null;
    }
};

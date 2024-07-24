import "dotenv/config";
import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    clusterApiUrl,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

console.log(`⚡️ connected to devnet`);

const publicKey = new PublicKey("8Sjzk1xKsZdMrWUaVs1K1jbs7t7ZZToL2BaQ5aXarjSc");

const balanceInLamports = await connection.getBalance(publicKey);

const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(` 💰 Finished! The balance of the account ${publicKey} is ${balanceInSOL} !`);
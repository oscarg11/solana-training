import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import "dotenv/config";
import {
    getExplorerLink,
    getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey , clusterApiUrl} from "@solana/web3.js";
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const sender = getKeypairFromEnvironment("SECRET_KEY"); 

console.log(`
🔑 Loaded our keypair securely, using an env file! Our public key is ${sender.publicKey.toBase58()}`)

//substitute in your token mint account from create-token-mint.ts
const tokenMintAccount = new PublicKey("8va3gFBcBXm2826Kje8b8h1FsoRDCKm35wfKfuCWZ7jW");

//substitute in a recipient address
const recipient = new PublicKey("8Sjzk1xKsZdMrWUaVs1K1jbs7t7ZZToL2BaQ5aXarjSc");

const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    recipient
);

console.log(`Token Account: ${tokenAccount.address.toBase58()}`);

const link = getExplorerLink(
    "address",
    tokenAccount.address.toBase58(),
    "devnet"
);

console.log(`✅ Create Token Account: ${link}`);
import { mintTo } from "@solana/spl-token";
import "dotenv/config";
import {
    getExplorerLink,
    getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

//Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const sender = getKeypairFromEnvironment("SECRET_KEY");

//substitute in your token mint account from create-token-mint.ts
const tokenMintAccount = new PublicKey(
    "8va3gFBcBXm2826Kje8b8h1FsoRDCKm35wfKfuCWZ7jW"
);
 //substitute in a recipient token account 
const recipientAssociatedTokenAccount = new PublicKey(
    "8eHBc8ZNAePTiWmsyhWwVwN1Whobaf6pCcKAkK6za5Se");

const transactionSignature = await mintTo(
    connection,
    sender,
    tokenMintAccount,
    recipientAssociatedTokenAccount,
    sender,
    10 * MINOR_UNITS_PER_MAJOR_UNITS
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Success! Mint Token Transaction: ${link}`);


import "dotenv/config";
import {
    getExplorerLink,
    getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import {
    Connection,
    clusterApiUrl,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

import { createUpdateMetadataAccountV2Instruction } from "@metaplex-foundation/mpl-token-metadata";

const user = getKeypairFromEnvironment("SECRET_KEY");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log(`
🔑 Loaded our keypair securely, using an env file! Our public key is ${user.publicKey.toBase58()}`);

const TOKEN_META_DATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

//substite in your token mint account from create-token-mint.ts
const tokenMintAccount = new PublicKey(
    "8va3gFBcBXm2826Kje8b8h1FsoRDCKm35wfKfuCWZ7jW"
);

const metadataData = {
    name: "PAN Token",
    symbol: "PAN",
    // Arweave / IPFS / Pinata ect link using metaplex standard for off-chain data
    uri: "https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-token-metadata.json",
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
};

const metadataPDAAndBump = PublicKey.findProgramAddressSync(
    [
        Buffer.from("metadata"),
        TOKEN_META_DATA_PROGRAM_ID.toBuffer(),
        tokenMintAccount.toBuffer(),
    ],
    TOKEN_META_DATA_PROGRAM_ID   
);

const metadataPDA = metadataPDAAndBump[0];

const transaction = new Transaction();

const updateMetadataAccountInstruction  = createUpdateMetadataAccountV2Instruction(
    {
        metadata: metadataPDA,
        mint: tokenMintAccount,
        mintAuthority: user.publicKey,
        payer: user.publicKey,
        updateAuthority: user.publicKey,
    },
    {
        updateMetadataAccountArgsV2: {
            data: metadataData,
            updateAuthority: user.publicKey,
            primarySaleHappened: true,
            isMutable: true,
        }
    }
);

transaction.add(updateMetadataAccountInstruction);

await sendAndConfirmTransaction(
    connection,
    transaction,
    [user]
);

const tokenMintLink = getExplorerLink(
    "address",
    tokenMintAccount.toString(),
    "devnet"
);

console.log(`✅ Look at the token mint again: ${tokenMintLink}`);

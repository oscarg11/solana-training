import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    clusterApiUrl,
    SystemProgram,
    sendAndConfirmTransaction,
    Transaction,
    TransactionInstruction
} from "@solana/web3.js";

const sender = getKeypairFromEnvironment("SECRET_KEY");

const connection = new Connection(clusterApiUrl("devnet"));

console.log(`
🔑 Loaded our keypair securely, using an env file! Our public key is ${sender.publicKey.toBase58()}`)

const SAM = "DJMWKyzVNTqMuLh58NhETVEyp7sg41X142LnsuQwhwmu";

const recipient = new PublicKey(SAM);

console.log(`💸 Attempting to send 0.01 SOL to ${recipient.toBase58()}`);

const transaction = new Transaction();

const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: recipient,
    lamports: 0.01 * LAMPORTS_PER_SOL,
});

transaction.add(sendSolInstruction);

const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);

console.log(`✅ Transaction confirmed!, signature: ${signature}!`)

const memoProgram = new PublicKey(
    "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr" 
);

const memoText = "Hello from Solana!";

const addMemoInstruction = new TransactionInstruction({
    keys: [{ pubkey: sender.publicKey, isSigner: true, isWritable: true}],
    data: Buffer.from(memoText, "utf-8"),
    programId: memoProgram,
});

transaction.add(addMemoInstruction);
console.log(`💬 memo is: ${memoText}...`);

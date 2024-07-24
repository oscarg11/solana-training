import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Favorites } from "../target/types/favorites";
import { airdropIfRequired } from "@solana-developers/helpers";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { assert } from "chai";
const web3 = anchor.web3;

describe("Favorites", () => {
  // use the cluster and the keypair from the anchor.toml

 const provider = anchor.AnchorProvider.env();
 anchor.setProvider(provider);
 const user = (provider.wallet as anchor.Wallet).payer;
 const someRandomGuy = anchor.web3.Keypair.generate();
 const program = anchor.workspace.Favorites as Program<Favorites>;

 before(async () => {

  await airdropIfRequired(
    anchor.getProvider().connection,
    user.publicKey,
    0.5 * web3.LAMPORTS_PER_SOL,
    1 * web3.LAMPORTS_PER_SOL
  );
  });


it("Writes our favorites to the blockchain", async () => {
  //Heres what we want to write to the blockchain
  const favoriteNumber = new anchor.BN(23);
  const favoriteColor = "purple";
  const favoriteHobbies = ["skiing", "skydiving", "biking"];

  await program.methods
  // set_favorites in rust becomes setFavorites in typescript
    .setFavorites(favoriteNumber, favoriteColor, favoriteHobbies)
  // sign transaction
    .signers([user])
  // send the transaction to hte cluster rpc
    .rpc();


// find the pda for the users favorites
const favoritesPdaAndBummp = web3.PublicKey.findProgramAddressSync(
  [Buffer.from("favorites"), user.publicKey.toBuffer()],
  program.programId
);

const favoritesPda = favoritesPdaAndBummp[0];
const dataFromPda = await program.account.favorites.fetch(favoritesPda);
// and make sure it matches
assert.equal(dataFromPda.color, favoriteColor);
// a little extra work to make sure the Bns are equal
assert.equal(dataFromPda.number.toString(), favoriteNumber.toString());
//and check the hobbies
assert.deepEqual(dataFromPda.hobbies, favoriteHobbies);

try{
  await program.methods
  //set_favorites in rust becomes setFavorites in typescript
  .setFavorites(favoriteNumber, favoriteColor, favoriteHobbies)
  //sign transaction
  .signers([someRandomGuy])
  //send the transaction to the cluster rpc
  .rpc();
}catch (error){
  const errorMessage = (error as Error).message;
  assert.isTrue(errorMessage.includes("unknown signer"))
}

});

});
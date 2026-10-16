// Set the password for an existing account, e.g. the owner@local account that
// holds data from before sign-in was enabled.
//
//   EMAIL=owner@local NEW_PASSWORD='choose-a-password' DATABASE_URL=... npx tsx script/set-password.ts
//
// The password is read from the environment so it stays out of shell history.
import bcrypt from "bcrypt";
import { storage } from "../server/storage";

async function main() {
  const email = process.env.EMAIL?.trim();
  const password = process.env.NEW_PASSWORD;

  if (!email || !password) {
    console.error("Set EMAIL and NEW_PASSWORD environment variables.");
    process.exit(1);
  }
  if (password.length < 6) {
    console.error("Password must be at least 6 characters.");
    process.exit(1);
  }

  const user = await storage.getUserByEmail(email);
  if (!user) {
    console.error(`No account with email ${email}.`);
    process.exit(1);
  }

  await storage.updateUser(user.id, { password: await bcrypt.hash(password, 10) });
  console.log(`Password updated for ${email}.`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

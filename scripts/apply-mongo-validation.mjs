import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { MongoClient } = require("mongodb");

const validatorsPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../lib/mongo-validation.ts",
);
const { collectionValidators } = await import(
  pathToFileURL(validatorsPath).href
);

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set");
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db();

  for (const [name, validator] of Object.entries(collectionValidators)) {
    await db.command({
      collMod: name,
      validator,
      validationLevel: "moderate",
      validationAction: "warn",
    });
    const mismatches = await db
      .collection(name)
      .countDocuments({ $nor: [validator] });
    console.log(`validated ${name}: mismatches=${mismatches}`);
  }

  const leftover = db.collection("admins");
  const leftoverCount = await leftover.countDocuments();
  if (leftoverCount !== 0) {
    console.error(`refusing to drop admins: ${leftoverCount} documents`);
    process.exit(1);
  }
  const leftoverExists =
    (await db.listCollections({ name: "admins" }).toArray()).length > 0;
  if (leftoverExists) {
    await leftover.drop();
    console.log("dropped empty collection admins");
  } else {
    console.log("admins collection already absent");
  }
} finally {
  await client.close();
}

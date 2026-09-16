import { MongoClient, type Db } from "mongodb";

type MongoGlobal = typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoConnect?: Promise<MongoClient>;
};

const mongoGlobal = globalThis as MongoGlobal;

function getClient(): MongoClient {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!mongoGlobal._mongoClient) {
    mongoGlobal._mongoClient = new MongoClient(uri, {
      // Vercel: one pool per function instance; keep it small.
      maxPoolSize: 5,
      // Don't hold idle connections on cold instances.
      minPoolSize: 0,
      // Release unused sockets between invocations (10–30s serverless range).
      maxIdleTimeMS: 15_000,
    });
  }

  return mongoGlobal._mongoClient;
}

export async function getDb(): Promise<Db> {
  const client = getClient();
  if (!mongoGlobal._mongoConnect) {
    console.log("Connecting to MongoDB...");
    mongoGlobal._mongoConnect = client.connect().catch((error) => {
      mongoGlobal._mongoConnect = undefined;
      throw error;
    });
  }
  await mongoGlobal._mongoConnect;
  return client.db();
}

export async function connectDB(): Promise<void> {
  await getDb();
}

export default connectDB;

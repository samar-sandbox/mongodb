import { MongoClient } from "mongodb";
import config from "../config/config.js";

const client = new MongoClient(config.dbURI);

export const database = client.db(config.dbName);

export async function connectDatabase() {
  try {
    console.log(`Connecting to database`);

    // Connect the client to the server
    await client.connect();

    // Send a ping to confirm a successful connection
    const result = await database.command({ ping: 1 });

    console.log("Database connected successfully", result);
  } catch (error) {
    // Ensures that the client will close when you finish/error
    await client.close();

    throw error;
  }
}

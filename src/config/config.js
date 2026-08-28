import dotenv from "dotenv";

dotenv.config();

export default {
  dbURI: process.env.DB_URI,
  dbName: process.env.DB_NAME,
  port: process.env.PORT,
};

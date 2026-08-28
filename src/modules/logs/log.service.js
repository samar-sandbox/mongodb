import { ObjectId } from "mongodb";
import { database } from "../../database/db.js";

/**
 * Insert a new log into the logs collection.
 */
export async function createLog(logData) {
  if (!logData) {
    return {
      status: 400,
      error: "Invalid log data",
    };
  }

  if (logData.book_id !== undefined && logData.book_id !== null) {
    const book = await database
      .collection("books")
      .findOne(
        { _id: new ObjectId(logData.book_id) },
        { projection: { _id: 1 } },
      );

    if (!book) {
      return {
        status: 404,
        error: "Book not found",
      };
    }
  }

  const result = await database.collection("logs").insertOne({
    ...logData,
    book_id: logData.book_id ? new ObjectId(logData.book_id) : undefined,
  });

  return {
    message: "Log created successfully",
    result,
  };
}

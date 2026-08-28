import { database } from "../../database/db.js";

/**
 * Create an explicit collection named “books” with a validation rule
 * to ensure that each document has a non-empty “title” field.
 */
export async function createBooksCollection() {
  await database.createCollection("books", {
    validator: {
      title: { $type: "string", $ne: "" },
    },
  });

  return {
    message: "Books collection created successfully",
  };
}

/**
 * Create an implicit collection by inserting data directly into a new collection named “authors”.
 */
export async function createAuthor(authorData) {
  if (!authorData) {
    return {
      status: 400,
      error: "Invalid author data",
    };
  }

  const result = await database.collection("authors").insertOne(authorData);

  return {
    message: "Author created successfully",
    result,
  };
}

/**
 * Create a capped collection named “logs” with a size limit of 1MB.
 */
export async function createCappedLogsCollection() {
  await database.createCollection("logs", {
    capped: true,
    size: 1 * 1024 * 1024,
  });

  return {
    message: "Capped logs collection created successfully",
  };
}

/**
 * Create an index on the books collection for the title field.
 */
export async function createBooksTitleIndex() {
  const result = await database.collection("books").createIndex({ title: 1 });

  return {
    message: "Books title index created successfully",
    result,
  };
}

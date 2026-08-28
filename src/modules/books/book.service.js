import { database } from "../../database/db.js";

/**
 * Insert document into the books collection.
 */
export async function createBook(bookData) {
  if (!bookData) {
    return {
      status: 400,
      error: "Invalid book data",
    };
  }

  if (!bookData.title) {
    return {
      status: 400,
      error: "Title is required and cannot be empty",
    };
  }

  const result = await database.collection("books").insertOne(bookData);

  return {
    message: "Book created successfully",
    result,
  };
}

/**
 * Insert multiple documents into the books collection with at least three records.
 */
export async function createBooksBatch(booksData) {
  if (!booksData) {
    return {
      status: 400,
      error: "Invalid books data",
    };
  }

  if (booksData.length < 3) {
    return {
      status: 400,
      error: "At least 3 books can be inserted",
    };
  }

  if (booksData.some((b) => !b.title)) {
    return {
      status: 400,
      error: "Title is required and cannot be empty",
    };
  }

  const result = await database.collection("books").insertMany(booksData);

  return {
    message: "Books created successfully",
    result,
  };
}

/**
 * Update the book with title “Future” change the year to be 2022.
 */
export async function updateBook() {
  const result = await database
    .collection("books")
    .updateMany({ title: "Future" }, { $set: { year: 2022 } });

  if (!result.matchedCount) {
    return {
      status: 404,
      error: "No books to update",
    };
  }

  return {
    message: "Books updated successfully",
    result,
  };
}

/**
 * Find a book with title
 */
export async function findBookByTitle(title = "") {
  if (!title) {
    return {
      status: 400,
      error: "Title query param is required",
    };
  }

  const result = await database.collection("books").findOne({ title });

  if (!result) {
    return {
      status: 404,
      error: `No book with title "${title}"`,
    };
  }

  return {
    message: "Book found successfully",
    result,
  };
}

/**
 * Find all books published between date range
 */
export async function findBooksByYear(from, to) {
  if (!from || !to) {
    return {
      status: 400,
      error: "From & To query params are required",
    };
  }

  from = parseInt(from);
  to = parseInt(to);

  if (isNaN(from) || isNaN(to)) {
    return {
      status: 400,
      error: "From & To query params must be valid years",
    };
  }

  if (from > to) {
    return {
      status: 400,
      error: "Invalid year range",
    };
  }

  const result = await database
    .collection("books")
    .find({ year: { $gte: from, $lte: to } })
    .sort({ year: 1 })
    .toArray();

  return {
    message: "Books found successfully",
    count: result.length,
    result,
  };
}

/**
 * Find books where their genres include the given one
 */
export async function findBooksByGenre(genre) {
  if (!genre) {
    return {
      status: 400,
      error: "Genre query param is required",
    };
  }

  const result = await database
    .collection("books")
    .find({ genres: genre })
    .toArray();

  return {
    message: "Books found successfully",
    count: result.length,
    result,
  };
}

/**
 * Skip, limit the results, and sort by year in descending order.
 */
export async function findBooks(skip = 2, limit = 3) {
  skip = parseInt(skip);
  limit = parseInt(limit);

  if (isNaN(skip)) {
    skip = 2;
  }
  if (isNaN(limit)) {
    limit = 3;
  }

  const result = await database
    .collection("books")
    .find()
    .sort({ year: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return {
    message: "Books found successfully",
    count: result.length,
    result,
  };
}

/**
 * Find books where the year field stored as an integer.
 */
export async function findBooksWithIntYear() {
  const result = await database
    .collection("books")
    .find({ year: { $type: "int" } })
    .toArray();

  return {
    message: "Books found successfully",
    count: result.length,
    result,
  };
}

/**
 * Find all books where the genres field does not include any of the given genres.
 */
export async function findBooksByExcludingGenres(
  exclude = ["Horror", "Science Fiction"],
) {
  const result = await database
    .collection("books")
    .find({ genres: { $nin: exclude } })
    .toArray();

  return {
    message: "Books found successfully",
    count: result.length,
    result,
  };
}

/**
 * Delete all books published before the given year.
 */
export async function deleteBooksBeforeYear(year) {
  if (!year) {
    return {
      status: 400,
      error: "Year query params are required",
    };
  }

  year = parseInt(year);

  if (isNaN(year)) {
    return {
      status: 400,
      error: "Year query params must be valid years",
    };
  }

  const result = await database
    .collection("books")
    .deleteMany({ year: { $lte: year } });

  return {
    message: "Books deleted successfully",
    result,
  };
}

/**
 * Filter books published after 2000 and sort them by year descending.
 */
export async function findBooksAggregate1() {
  const result = await database
    .collection("books")
    .aggregate([
      { $match: { year: { $gt: 2000 } } },
      { $sort: { year: -1 } },
      { $project: { _id: 0 } },
    ])
    .toArray();

  return {
    message: "Books found successfully",
    count: result.length,
    result,
  };
}

/**
 * Find all books published after the year 2000.
 * For each matching book, show only the title, author, and year fields.
 */
export async function findBooksAggregate2() {
  const result = await database
    .collection("books")
    .aggregate([
      { $match: { year: { $gt: 2000 } } },
      { $project: { _id: 0, title: 1, author: 1, year: 1 } },
    ])
    .toArray();

  return {
    message: "Books found successfully",
    count: result.length,
    result,
  };
}

/**
 * Break an array of genres into separate documents.
 */
export async function findBooksAggregate3() {
  const result = await database
    .collection("books")
    .aggregate([
      { $unwind: { path: "$genres" } },
      { $project: { _id: 0, title: 1, genres: 1 } },
    ])
    .toArray();

  return {
    message: "Books found successfully",
    count: result.length,
    result,
  };
}

/**
 * Join the books collection with the logs collection.
 */
export async function findBooksAggregate4() {
  const result = await database
    .collection("logs")
    .aggregate([
      {
        $lookup: {
          from: "books",
          foreignField: "_id",
          localField: "book_id",
          as: "book_details",
        },
      },
      { $set: { book_details: { $first: "$book_details" } } },
      {
        $project: {
          _id: 0,
          action: 1,
          "book_details.title": 1,
          "book_details.author": 1,
          "book_details.year": 1,
        },
      },
    ])
    .toArray();

  return {
    message: "Books found successfully",
    count: result.length,
    result,
  };
}

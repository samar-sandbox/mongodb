```bash
use books_api
```

1. Create an explicit collection named “books” with a validation rule to ensure that each document has a non-empty “title” field.

```js
db.createCollection("books", {
  validator: {
    title: { $type: "string", $ne: "" },
  },
})
```

2. Create an implicit collection by inserting data directly into a new collection named “authors”.

```js
db.authors.insertOne({
  name: "Author 1",
  nationality: "British"
})
```

3. Create a capped collection named “logs” with a size limit of 1MB.

```js
db.createCollection("logs", {
  capped: true,
  size: 1 * 1024 * 1024,
})
```

4. Create an index on the books collection for the title field.

```js
db.books.createIndex({ title: 1 })
```

5. Insert one document into the books collection.

```js
db.books.insertOne({
  "title": "Brave New World",
  "author": "Ali",
  "year": 1937,
  "genres": [
    "Fantasy",
    "Adventure"
  ]
})
```

6. Insert multiple documents into the books collection with at least three records.

```js
db.books.insertMany([
  {
    "title": "Book 1",
    "author": "Author 1",
    "year": 2022,
    "genres": [
      "Fantasy"
    ]
  },
  {
    "title": "Book 2",
    "author": "Author 2",
    "year": 2000,
    "genres": [
      "Adventure"
    ]
  },
  {
    "title": "Book 3",
    "author": "Author 3",
    "year": 2002,
    "genres": [
      "Classic"
    ]
  }
])
```

7. Insert a new log into the logs collection.

```js
db.logs.insertOne({
  action: "borrowed",
  book_id: "6a90d8c79a242e3b9a7a7cc0"
})
```

8. Update the book with title “Future” change the year to be 2022.

```js
db.books.updateMany({ title: "Future" }, { $set: { year: 2022 } })
```

9. Find a Book with title “Brave New World”.

```js
db.books.findOne({ title: "Brave New World" })
```

10. Find all books published between 1990 and 2010.

```js
db.books
  .find({ year: { $gte: 1990, $lte: 2010 } })
  .sort({ year: 1 })
```

11. Find books where the genre includes "Science Fiction".

```js
db.books.find({ genres: "Science Fiction" })
```

12. Skip the first two books, limit the results to the next three, sorted by year in descending order.

```js
db.books
  .find()
  .sort({ year: -1 })
  .skip(2)
  .limit(3)
```

13. Find books where the year field stored as an integer.

```js
db.books.find({ year: { $type: "int" } })
```

14. Find all books where the genres field does not include any of the genres "Horror" or "Science Fiction".

```js
db.books.find({ genres: { $nin: ["Horror", "Science Fiction"] } })
```

15. Delete all books published before 2000.

```js
db.books.deleteMany({ year: { $lte: 2000 } })
```

16. Using aggregation Functions, Filter books published after 2000 and sort them by year descending.

```js
db.books
  .aggregate([
    { $match: { year: { $gt: 2000 } } },
    { $sort: { year: -1 } },
    { $project: { _id: 0 } },
  ])
```

17. Using aggregation functions, Find all books published after the year 2000. For each matching book, show only the title, author, and year fields.

```js
db.books
  .aggregate([
    { $match: { year: { $gt: 2000 } } },
    { $project: { _id: 0, title: 1, author: 1, year: 1 } },
  ])
```

18. Using aggregation functions,break an array of genres into separate documents.

```js
db.books
  .aggregate([
    { $unwind: { path: "$genres" } },
    { $project: { _id: 0, title: 1, genres: 1 } },
  ])
```

19. Using aggregation functions, Join the books collection with the logs collection.

```js
db.logs
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
```
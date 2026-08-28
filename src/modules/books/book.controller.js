import { Router } from "express";
import {
  createBook,
  createBooksBatch,
  deleteBooksBeforeYear,
  findBookByTitle,
  findBooks,
  findBooksAggregate1,
  findBooksAggregate2,
  findBooksAggregate3,
  findBooksAggregate4,
  findBooksByExcludingGenres,
  findBooksByGenre,
  findBooksByYear,
  findBooksWithIntYear,
  updateBook,
} from "./book.service.js";

const router = Router();

router.post("/", async (req, res) => {
  const result = await createBook(req.body);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(201).json({ success: true, ...result });
});

router.post("/batch", async (req, res) => {
  const result = await createBooksBatch(req.body);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(201).json({ success: true, ...result });
});

router.patch("/Future", async (req, res) => {
  const result = await updateBook();

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(200).json({ success: true, ...result });
});

router.get("/title", async (req, res) => {
  const title = req.query.title;

  const result = await findBookByTitle(title);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(200).json({ success: true, ...result });
});

router.get("/year", async (req, res) => {
  const { from, to } = req.query;

  const result = await findBooksByYear(from, to);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(200).json({ success: true, ...result });
});

router.get("/genre", async (req, res) => {
  const genre = req.query.genre;

  const result = await findBooksByGenre(genre);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(200).json({ success: true, ...result });
});

router.get("/skip-limit", async (req, res) => {
  const { skip, limit } = req.query;

  const result = await findBooks(skip, limit);

  return res.status(200).json({ success: true, ...result });
});

router.get("/year-integer", async (req, res) => {
  const result = await findBooksWithIntYear();

  return res.status(200).json({ success: true, ...result });
});

router.get("/exclude-genres", async (req, res) => {
  const exclude = req.body?.exclude;

  const result = await findBooksByExcludingGenres(exclude);

  return res.status(200).json({ success: true, ...result });
});

router.delete("/before-year", async (req, res) => {
  const year = req.query.year;

  const result = await deleteBooksBeforeYear(year);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(200).json({ success: true, ...result });
});

router.get("/aggregate1", async (req, res) => {
  const result = await findBooksAggregate1();

  return res.status(200).json({ success: true, ...result });
});

router.get("/aggregate2", async (req, res) => {
  const result = await findBooksAggregate2();

  return res.status(200).json({ success: true, ...result });
});

router.get("/aggregate3", async (req, res) => {
  const result = await findBooksAggregate3();

  return res.status(200).json({ success: true, ...result });
});

router.get("/aggregate4", async (req, res) => {
  const result = await findBooksAggregate4();

  return res.status(200).json({ success: true, ...result });
});

export default router;

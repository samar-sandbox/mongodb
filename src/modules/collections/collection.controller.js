import { Router } from "express";
import {
  createAuthor,
  createBooksCollection,
  createBooksTitleIndex,
  createCappedLogsCollection,
} from "./collection.service.js";

const router = Router();

router.post("/books", async (req, res) => {
  const result = await createBooksCollection();

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(201).json({ success: true, ...result });
});

router.post("/books/index", async (req, res) => {
  const result = await createBooksTitleIndex();

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(201).json({ success: true, ...result });
});

router.post("/authors", async (req, res) => {
  const result = await createAuthor(req.body);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(201).json({ success: true, ...result });
});

router.post("/logs/capped", async (req, res) => {
  const result = await createCappedLogsCollection();

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(201).json({ success: true, ...result });
});

export default router;

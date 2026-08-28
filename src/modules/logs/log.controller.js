import { Router } from "express";
import { createLog } from "./log.service.js";

const router = Router();

router.post("/", async (req, res) => {
  const result = await createLog(req.body);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(201).json({ success: true, ...result });
});

export default router;

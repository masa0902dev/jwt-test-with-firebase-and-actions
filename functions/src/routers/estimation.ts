import express, { Request, Response } from "express";

const router = express.Router();

router.route("/").get(async (req: Request, res: Response) => {
  res.send("Hello from estimation! GET");
});

router.route("/").post(async (req: Request, res: Response) => {
  res.send("Hello from estimation! POST");
});

export default router;

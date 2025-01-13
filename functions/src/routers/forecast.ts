import express, { Request, Response } from "express";

const router = express.Router();

router.route("/").get(async (req: Request, res: Response) => {
  res.send("Hello from forecast! GET");
});

router.route("/").post(async (req: Request, res: Response) => {
  res.send("Hello from forecast! POST");
});

export default router;

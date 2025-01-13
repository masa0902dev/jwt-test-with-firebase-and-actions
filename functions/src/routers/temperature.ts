import express, { Request, Response } from "express";
import getFromFirestore from "../utils/getFromFirestore";
import { DataFromApi, DataType } from "../types";
import saveToFirestore from "../utils/saveToFirestore";

const dataType: DataType = "temperature";
const router = express.Router();

router.route("/").get(async (req: Request, res: Response) => {
  const data: DataFromApi = await getFromFirestore(dataType);
  res.send(data);
});

router.route("/").post(async (req: Request, res: Response) => {
  saveToFirestore(dataType, req.body);
  const sending = {
    dataType: dataType,
    data: req.body,
  };
  res.send(sending);
});

export default router;

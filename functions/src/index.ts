import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import admin from "firebase-admin";
import serviceAccountKey from "./serviceAccountKey.json";
import { onRequest } from "firebase-functions/v2/https";
import authJwt from "./middlewares/jwt";
import { config } from "dotenv";
config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount),
});

const region = process.env.FUNCTIONS_REGION;
// const baseUrl = process.env.FUNCTIONS_URL;
// const baseUrl = `http://127.0.0.1:5001/jwt-test-with-actions/${region}/firestore`;

const app = express();
app.use(cors({ origin: true }));
app.use(helmet());
app.use(express.json());
app.set("trust proxy", 1);

// NOTE: 1h に 3 リクエストまで。実感できるように短くしている。
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  message: "Sorry😭 Too many requests, please try again later",
  statusCode: 429,
  // NOTE: undefined ip address error: https://express-rate-limit.mintlify.app/reference/error-codes#err-erl-undefined-ip-address
  validate: { ip: false },
});

import forecastRouter from "./routers/forecast";
import temperatureRouter from "./routers/temperature";
import estimationRouter from "./routers/estimation";

// forecast: GET -> rate-limit, POST -> JWT
app.get("/forecast", limiter);
app.post("/forecast", authJwt());

// temperature: GET -> rate-limit, POST -> JWT
app.get("/temperature", limiter);
app.post("/temperature", authJwt());

// estimation: GET -> JWT, POST -> JWT
app.get("/estimation", authJwt());
app.post("/estimation", authJwt());

app.use("/forecast", forecastRouter);
app.use("/temperature", temperatureRouter);
app.use("/estimation", estimationRouter);

export const firestore = onRequest({ region: region }, (req, res) => {
  app(req, res);
});
export const helloWorld = onRequest({ region: region }, (req, res) => {
  res.send("Hello from Firebase! this is a test api endpoint.");
});

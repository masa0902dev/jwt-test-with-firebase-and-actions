import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import admin from "firebase-admin";
import serviceAccountKey from "./serviceAccountKey.json";
import { onRequest } from "firebase-functions/v2/https";
// import { authenticateJWT } from "./middleware/jwt";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount),
});

const app = express();
app.use(cors({ origin: true }));
app.use(helmet());
app.use(express.json());

// レートリミット: 5min に 300 リクエストまで。動作確認完了
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 300,
  message: "Sorry😭 Too many requests, please try again later.",
  statusCode: 429,
  // NOTE: undefined ip address error: https://express-rate-limit.mintlify.app/reference/error-codes#err-erl-undefined-ip-address
  validate: { ip: false },
});

import forecastRouter from "./routers/forecast";
import temperatureRouter from "./routers/temperature";
import estimationRouter from "./routers/estimation";

// forecast: GET -> rate-limit, POST -> JWT
app.get("/forecast", limiter);
// app.post("/forecast", authenticateJWT);

// temperature: GET -> nothing, POST -> JWT
// app.post("/temperature", authenticateJWT);

// estimation: GET -> JWT, POST -> JWT
// app.get("/estimation", authenticateJWT);
// app.post("/estimation", authenticateJWT);

app.use("/forecast", forecastRouter);
app.use("/temperature", temperatureRouter);
app.use("/estimation", estimationRouter);

// region for functions: https://firebase.google.com/docs/functions/locations?hl=ja&_gl=1*18o985t*_up*MQ..*_ga*MTU0NTI1MDM5My4xNzM2NzQwMzU4*_ga_CW55HF8NVT*MTczNjc0MDM1OC4xLjAuMTczNjc0MDM1OC4wLjAuMA..
const region = "asia-northeast1";

export const firestore = onRequest({ region: region }, (req, res) => {
  app(req, res);
});
export const helloWorld = onRequest({ region: region }, (req, res) => {
  res.send("Hello from Firebase! this is a test api endpoint.");
});

import express from "express";
import jwt from "jsonwebtoken";

const authenticateJWT = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(403).send("Authorization header missing");
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    // TODO: jwtをちゃんと書く (SECRET_KEY は環境変数にする)
    const payload = jwt.verify(token, "SECRET_KEY");
    if ((payload as any).source !== "github-actions") {
      throw new Error("Invalid token source");
    }
    next();
  } catch (error) {
    res.status(403).send("Invalid or missing token");
    return;
  }
};

export { authenticateJWT };

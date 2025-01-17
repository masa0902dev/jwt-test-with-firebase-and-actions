import verifyToken from "../utils/verifyToken";
import { Request, Response, NextFunction } from "express";

const authJwt = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    try {
      const payload = await verifyToken(token);
      if (payload.repository !== process.env.ACTIONS_REPOSITORY) {
        throw new Error("Invalid repository");
      }
      next();
    } catch (error) {
      console.error("JWT validation failed:", error);
      res.status(403).json({ error: "Forbidden" });
    }
  };
};

export default authJwt;

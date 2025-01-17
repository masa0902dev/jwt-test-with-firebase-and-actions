import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

const authJwt = () => {
  // GitHub Actionsの公開鍵を取得する設定
  const publicKeyUrl =
    "https://token.actions.githubusercontent.com/.well-known/openid-configuration";
  client.getFederatedSignonCertsAsync = async () => {
    const response = await fetch(publicKeyUrl);
    // eslint-disable-next-line
    const { jwks_uri } = await response.json();
    const jwksResponse = await fetch(jwks_uri);
    return await jwksResponse.json();
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "https://github.com/masa0902dev", // 環境変数化も検討
      });
      const payload = ticket.getPayload();

      console.log("JWT payload:", payload);

      if (!payload || payload.iss !== "https://token.actions.githubusercontent.com") {
        throw new Error("Invalid issuer");
      }

      // if (payload.repository !== "masa0902dev/jwt-test-with-firebase-and-actions") {
      //   throw new Error("Invalid repository");
      // }

      next();
    } catch (error) {
      console.error("JWT validation failed:", error);
      res.status(403).json({ error: "Forbidden" });
    }
  };
};

export default authJwt;

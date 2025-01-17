import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

const authJwt = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    try {
      console.log("token:", token);
      const ticket = await client.verifyIdToken({
        idToken: token,
        // TODO: .envにする
        // NOTE: https://github.com/<userId>/<repoName>ではない！<userId>まで。
        audience: "https://github.com/masa0902dev",
      });
      console.log("ticket:", ticket);
      const payload = ticket.getPayload();
      console.log("payload:", payload);
      console.log("payload.iss:", payload?.iss);
      // NOTE: トークンがActionsのOpenID Connect(OIDC)プロバイダーによって発行されたものであることを保証(issuerがOIDCプロバイダーのURLであることを確認)
      if (!payload || payload.iss !== "https://token.actions.githubusercontent.com") {
        throw new Error("Invalid issuer");
      }

      // // 必要に応じてリポジトリ名などを検証
      // if (payload.repository !== "your-org/your-repo") {
      //   throw new Error("Invalid repository");
      // }

      // // リクエストに認証情報を添付可能
      // req.body.auth = payload;
      next();
    } catch (error) {
      console.error("JWT validation failed:", error);
      res.status(403).json({ error: "Forbidden" });
    }
  };
};

export default authJwt;

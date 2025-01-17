import jwt from "jsonwebtoken";
import jose from "node-jose";
import { githubPublicKeyUrl, jwtIssuer } from "../constants";

interface ExtendedJwtPayload extends jwt.JwtPayload {
  repository: string;
}

const publicKeyUrl = githubPublicKeyUrl;

const verifyToken = async (token: string): Promise<ExtendedJwtPayload> => {
  const response = await fetch(publicKeyUrl);
  const jwks = await response.json();

  // トークンヘッダーから`kid`を取得
  const decodedHeader = JSON.parse(
    Buffer.from(token.split(".")[0], "base64").toString("utf8")
  );
  const kid = decodedHeader.kid;

  // 公開鍵を選択
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const key = jwks.keys.find((key: any) => key.kid === kid);
  if (!key) {
    throw new Error("No matching key found");
  }

  // node-joseを使用してPEM形式の公開鍵を生成
  const keyStore = await jose.JWK.asKeyStore({ keys: [key] });
  const publicKey = keyStore.get(kid).toPEM();

  // JWTの検証
  try {
    const payload = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      audience: process.env.AUDIENCE,
      issuer: jwtIssuer,
    }) as ExtendedJwtPayload;
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    throw err;
  }
};

export default verifyToken;

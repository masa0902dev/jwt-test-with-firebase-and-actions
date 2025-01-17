import jwt from "jsonwebtoken";
import jose from "node-jose";

interface ExtendedJwtPayload extends jwt.JwtPayload {
  repository: string;
}

// Githubの公開鍵が置いてあるURL
const publicKeyUrl = "https://token.actions.githubusercontent.com/.well-known/jwks";

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

  // `node-jose`を使用してPEM形式の公開鍵を生成
  const keyStore = await jose.JWK.asKeyStore({ keys: [key] });
  const publicKey = keyStore.get(kid).toPEM();
  console.log("Public key:", publicKey);

  // JWTの検証
  try {
    const payload = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      audience: "https://github.com/masa0902dev",
      issuer: "https://token.actions.githubusercontent.com",
    }) as ExtendedJwtPayload;
    console.log("Verified payload:", payload);
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    throw err;
  }
};

export default verifyToken;

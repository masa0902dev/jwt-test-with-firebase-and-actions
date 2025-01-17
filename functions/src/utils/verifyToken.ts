import jwt from "jsonwebtoken";

const publicKeyUrl = "https://token.actions.githubusercontent.com/.well-known/jwks";

const verifyToken = async (token: string): Promise<string | jwt.JwtPayload> => {
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

  // 公開鍵を生成（正しいフォーマットで設定）
  const publicKey = `-----BEGIN PUBLIC KEY-----\n${Buffer.from(key.n, "base64").toString(
    "ascii"
  )}\n-----END PUBLIC KEY-----`;
  console.log("Public key:", publicKey);

  // JWTの検証
  try {
    const payload = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      audience: "https://github.com/masa0902dev",
      issuer: "https://token.actions.githubusercontent.com",
    });
    console.log("Verified payload:", payload);
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    throw err;
  }
};

export default verifyToken;

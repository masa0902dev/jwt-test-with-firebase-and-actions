# jwt-test

## 動作フロー

1. Actions
    1. OIDCトークンを取得（JWTなので<header>.<payload>.<signature>の形式）
    2. jsファイルにトークンを渡す
    3. jsファイル内でAuthorizationヘッダにBearerでつけて、 Functions上のAPIを叩く
2. firebase Functions
    1. Github OIDC用の公開鍵のデータを返すAPIにアクセスして、公開鍵として使用するデータ（複数ある）を取得
    2. 上記で取得したデータのうち、Actionsからのリクエストのkidと同じkidを持つデータを選択
    3. そのデータを元にPEM形式の公開鍵を生成
    4. Actionsからのトークン・上記の公開鍵を用いてJWTを検証
    5. 検証に成功すれば、JWTのpayloadを取得する
    6. (ついでに、実行元が指定されたユーザor組織かつレポジトリであることを検証)
    7. API EPの処理を実行

## JWS (JWTを使った認証) で設定する値

- aud (audience) には`https://github.com/<userId>`を指定する。audはJWTの受信者である。受信者はFuctionsのAPIかのような気もするが、github actionsでOIDCによってJWTトークンを受け取っているので、受信者はgithub側である。
    - 実際にactions上でJWTの値を見てみよう（Productionではログはセキュリティ上の理由で消す）。
    
    ```yaml
    # トークンのデバッグ出力
    echo "OIDC Token (Full): $oidcToken"
    echo ""
    echo "OIDC Token Header:"
    echo "$oidcToken" | cut -d "." -f 1 | base64 -d 2>/dev/null || base64 --decode | jq
    echo ""
    echo "OIDC Token Payload:"
    echo "$oidcToken" | cut -d "." -f 2 | base64 -d 2>/dev/null || base64 --decode | jq
    ```
    
- iss (issuer) には`[https://token.actions.githubusercontent.com](https://token.actions.githubusercontent.com/)`を指定する。今回は、JWTトークンを発行しているのはgithubであり、そのgithubが提示しているUrlがこれ。
    - https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect
- kid (key ID) : JWT headerにあり、鍵の識別に使用する。
- alg (algorithm) は RS256 を指定する。

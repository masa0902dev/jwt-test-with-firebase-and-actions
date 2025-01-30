# Jwt Auth with Firebase Functions and Github Actions

## 解説記事 (Notion):

[[2025 年] Github Actions から Cloud Functions for firebase 上の API を JWT 認証付きで叩く](https://masa0902dev.notion.site/2025-Github-Actions-Cloud-Functions-for-firebase-API-JWT-18ba46af991b8000837dd8965fd177fa)

## これで何ができる？

- Cloud Functions for firebase 上に構築した API を、JWT 認証を用いて、(定刻実行の)Github Actions からのみ叩けるようにする（Functions の API は Firestore の操作を行う）。API への認証されていないリクエストは全て`401 Unauthorized`または`403 Forbidden`を返す。

- JWT 認証用のミドルウェアを作成し、特定のエンドポイントのみに JWT 認証を付与できる。例えば`POST /api/aaa`のみ JWT 認証を必須にして`GET /api/aaa`は認証なしにできる。

- Actions ではなく手動で Firestore を操作したい時は、firebase-admin を用いてローカルから実行できる（ちょっとだけの操作なら firebase console からでも可能）。

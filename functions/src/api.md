全ての GET はクエリパラメータなしで、firestore の各ドキュメントの全データを返す。

全ての POST は body のデータを firestore の各ドキュメントに保存する。

## /forecast

- GET: rate-limit
- POST: JWT-auth

## /temperature

- GET: rate-limit
- POST: JWT-auth

## /estimation

- GET: JWT-auth
- POST: JWT-auth

# data example

body

```json
{
  "dataType": "forecast",
  "data": {
    "1-13": 7,
    "1-14": 6,
    "1-15": 7,
    "1-16": 6,
    "1-17": 7,
    "1-18": 6.5,
    "1-19": 6.5
  }
}
```

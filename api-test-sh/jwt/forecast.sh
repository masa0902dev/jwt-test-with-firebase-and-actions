curl -X POST https://firestore-fzxwlwc6iq-an.a.run.app/forecast \
  -H "Content-Type: application/json" \
  -d '{
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
  }'

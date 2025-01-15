for i in {1..10}; do
  echo "Request $i"
  curl -X GET https://firestore-fzxwlwc6iq-an.a.run.app/temperature
  echo
done

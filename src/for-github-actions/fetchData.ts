async function fetchData() {
  const dataType = "forecast";
  let dataToSend = {};

  // 外部APIからデータを取得
  try {
    const data = {
      "1-11": 4.5,
      "1-12": 4.6,
      "1-13": 4.7,
      "1-14": 4.8,
      "1-15": 4.9,
      "1-16": 5.0,
      "1-17": 5.1,
    };
    dataToSend = {
      dataType: dataType,
      data: data,
    };
    console.log("successfully fetched data:", dataToSend);
  } catch (err) {
    console.error("Error fetching data:", err);
    process.exit(1);
  }

  // FunctionsのAPIを叩く
  try {
    const baseUrl = process.env.FUCTIONS_URL;
    const url = baseUrl + "/forecast";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Auhtorization: `Bearer ${process.env.JWT_TOKEN}`,
      },
      body: JSON.stringify(dataToSend),
    });
    console.log("successfully saved to Firestore:", res);
  } catch (error) {
    console.error("Error saving data:", error);
    process.exit(1);
  }
}

fetchData();

import { config } from "dotenv";
config();

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
    const jwtToken = process.env.JWT_TOKEN;
    if (!jwtToken) {
      console.error("JWT_TOKEN is not set");
      process.exit(1);
    }
    console.log("jwtToken:", jwtToken);
    const baseUrl = process.env.FUNCTIONS_URL;
    if (!baseUrl) {
      console.error("FUNCTIONS_URL is not set");
      process.exit(1);
    }
    console.log("baseUrl:", baseUrl);
    const url = baseUrl + "/forecast";

    const resGET = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("GET response:", await resGET.json());

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(dataToSend),
    });
    if (!res.ok) {
      const errRes = await res.text();
      throw new Error(`Failed to save data:\n${res.statusText},\nDetails: ${errRes}`);
    }
    console.log("successfully saved to Firestore:", await res.json());
  } catch (error) {
    console.error("Error saving data:", error);
    process.exit(1);
  }
}

fetchData();

import { config } from "dotenv";
import path from "path";
config();

async function fetchData() {
  const dataType = "forecast";
  let dataToSend: { [key: string]: number } = {};

  // 外部APIからデータを取得する想定
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
    dataToSend = data;
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
    const baseUrl = process.env.FUNCTIONS_URL;
    if (!baseUrl) {
      console.error("FUNCTIONS_URL is not set");
      process.exit(1);
    }
    const url = path.join(baseUrl, dataType);

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

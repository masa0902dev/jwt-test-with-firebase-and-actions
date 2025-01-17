import { config } from "dotenv";
import path from "path";
config();

async function fetchData() {
  try {
    const data = {
      "1-12": 5,
      "1-13": 6,
      "1-14": 7,
      "1-15": 8,
      "1-16": 9,
      "1-17": 10,
      "1-18": 11.1,
    };
    console.log("successfully fetched data:", data);
    return data;
  } catch (err) {
    console.error("Error fetching data:", err);
    process.exit(1);
  }
}

async function processData(data: {
  [key: string]: number;
}): Promise<{ [key: string]: number }> {
  try {
    const dataToSend: { [key: string]: number } = data;
    console.log("successfully processed data:", dataToSend);
    return dataToSend;
  } catch (err) {
    console.error("Error processing data:", err);
    process.exit(1);
  }
}

export async function postData(dataType: string): Promise<void> {
  const data = await fetchData();
  const dataToSend = await processData(data);

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

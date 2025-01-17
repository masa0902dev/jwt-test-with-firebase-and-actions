import path from "path";
import { config } from "dotenv";
config();

export default async function postData(
  dataType: string,
  fetchData: () => Promise<any>,
  processData: (data: any) => Promise<any>
): Promise<void> {
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

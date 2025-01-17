import { config } from "dotenv";
import path from "path";
import postData from "./postData";
import { fetchForecast, processForecast } from "./dataTypes/forecast";
import { fetchTemperature, processTemperature } from "./dataTypes/temperature";
import { fetchEstimation, processEstimation } from "./dataTypes/estimation";
config();

async function postToFunctions() {
  type FuncsType = {
    [key: string]: {
      fetch: () => Promise<{ [key: string]: number }>;
      process: (data: { [key: string]: number }) => Promise<{ [key: string]: number }>;
    };
  };
  // fetchは叩く外部APIが違う・processはデータが違うので各dataTypeで異なる処理
  const funcs: FuncsType = {
    forecast: { fetch: fetchForecast, process: processForecast },
    temperature: { fetch: fetchTemperature, process: processTemperature },
    estimation: { fetch: fetchEstimation, process: processEstimation },
  };

  try {
    for (const dataType in funcs) {
      console.log("--------------------------------\n" + dataType);
      await postData(dataType, funcs[dataType].fetch, funcs[dataType].process);
    }
  } catch (error) {
    throw new Error("Error Posting Functions API" + error);
  }
}
postToFunctions();

// async function fetchData() {
//   const dataType = "forecast";
//   let dataToSend: { [key: string]: number } = {};

//   // 外部APIからデータを取得する想定
//   try {
//     const data = {
//       "1-11": 4.5,
//       "1-12": 4.6,
//       "1-13": 4.7,
//       "1-14": 4.8,
//       "1-15": 4.9,
//       "1-16": 5.0,
//       "1-17": 5.1,
//     };
//     dataToSend = data;
//     console.log("successfully fetched data:", dataToSend);
//   } catch (err) {
//     console.error("Error fetching data:", err);
//     process.exit(1);
//   }

//   // FunctionsのAPIを叩く
//   try {
//     const jwtToken = process.env.JWT_TOKEN;
//     if (!jwtToken) {
//       console.error("JWT_TOKEN is not set");
//       process.exit(1);
//     }
//     const baseUrl = process.env.FUNCTIONS_URL;
//     if (!baseUrl) {
//       console.error("FUNCTIONS_URL is not set");
//       process.exit(1);
//     }
//     const url = path.join(baseUrl, dataType);

//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${jwtToken}`,
//       },
//       body: JSON.stringify(dataToSend),
//     });
//     if (!res.ok) {
//       const errRes = await res.text();
//       throw new Error(`Failed to save data:\n${res.statusText},\nDetails: ${errRes}`);
//     }
//     console.log("successfully saved to Firestore:", await res.json());
//   } catch (error) {
//     console.error("Error saving data:", error);
//     process.exit(1);
//   }
// }

// fetchData();

// src/github-actions/postToFunctions.ts
import { config } from "dotenv";
import path from "path";
import postData from "./postData";
import { fetchForecast, parseForecast } from "./dataTypes/forecast";
import { fetchTemperature, parseTemperature } from "./dataTypes/temperature";
config();

async function postToFunctions() {
  type FuncsType = {
    [key: string]: {
      fetch: () => Promise<{ [key: string]: number }>;
      parse: (data: { [key: string]: number }) => Promise<{ [key: string]: number }>;
    };
  };
  // 各dataTypeについて、fetchは叩く外部APIが違う・parseはデータが違うことを想定し、異なる処理にしている。
  // postDataは全て同じ処理の想定。
  const funcs: FuncsType = {
    forecast: { fetch: fetchForecast, parse: parseForecast },
    temperature: { fetch: fetchTemperature, parse: parseTemperature },
  };

  try {
    for (const dataType in funcs) {
      console.log("--------------------------------\n" + dataType);
      await postData(dataType, funcs[dataType].fetch, funcs[dataType].parse);
    }
  } catch (error) {
    throw new Error("Error Posting Functions API" + error);
  }
}
postToFunctions();

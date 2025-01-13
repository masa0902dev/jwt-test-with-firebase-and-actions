import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json";
import { DataFromApi, DataType, isDataType } from "../types";
import forecastJson from "./dataForSave/forecast.json";
import temperatureJson from "./dataForSave/temperature.json";
import estimationJson from "./dataForSave/estimation.json";
import readline from "readline";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

console.log(`
データを「本番環境の」Firestoreに『保存』しますか？ (y/N) 
データは prodFirestore/data ディレクトリにあります。
どのデータにするかを "y forecast" のように指定してください。
`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question("", (input) => {
  input = input.trim();
  const [answer, dataType] = input.split(" ");

  if (answer.toLowerCase() !== "y") {
    console.log("保存しませんでした。");
    rl.close();
    return;
  }
  if (!isDataType(dataType)) {
    throw new Error(`存在しないデータの種類です: ${dataType}`);
  }

  const jsonObj = setLocalData(dataType);
  saveDataToProdFirestore(dataType, jsonObj);

  rl.close();
});

const saveDataToProdFirestore = async (dataType: DataType, jsonObj: DataFromApi) => {
  console.log("保存中...");
  console.log(jsonObj);
  await saveToFirestore(dataType, jsonObj.data);
  console.log("保存完了！");
};

const setLocalData = (dataType: DataType) => {
  let data: DataFromApi;
  if (dataType == ("forecast" as DataType)) {
    data = forecastJson as DataFromApi;
  } else if (dataType == ("temperature" as DataType)) {
    data = temperatureJson as DataFromApi;
  } else if (dataType == ("estimation" as DataType)) {
    data = estimationJson as DataFromApi;
  } else {
    throw new Error("Invalid data type");
  }
  return data;
};

/* NOTE: npx tsx saveData.ts で実行すると、別ファイル参照時にその別ファイルでもadmin.initializeApp()が必要になる。
運用時に使用するコードにそれを含めたくなかったので、こちらに切り出している。 */
const db = admin.firestore();
const saveToFirestore = async (
  type: DataType,
  data: { [key: string]: number }
): Promise<void> => {
  const firestorePath = `jwt-actions-test/${type}`;
  const docRef = db.doc(firestorePath);

  try {
    await docRef.set(
      {
        ...data,
      },
      { merge: true }
    );
  } catch (error) {
    throw new Error(`failed to save to ${firestorePath}: ${error}`);
  }
};

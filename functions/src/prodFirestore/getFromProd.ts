import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json";
import { DataFromApi, DataType, isDataType } from "../types";
import readline from "readline";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

console.log(`
本番環境のFirestoreからデータを取得しますか？ (y/N) 
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
    console.log("取得しませんでした。");
    rl.close();
    return;
  }
  if (!isDataType(dataType)) {
    throw new Error(`存在しないデータの種類です: ${dataType}`);
  }

  getDataFromProdFirestore(dataType);
  rl.close();
});

const getDataFromProdFirestore = async (dataType: DataType) => {
  const jsonObj = await getFromFirestore(dataType);
  console.log(jsonObj);
};

/* NOTE: npx tsx saveData.ts で実行すると、別ファイル参照時にその別ファイルでもadmin.initializeApp()が必要になる。
運用時に使用するコードにそれを含めたくなかったので、こちらに切り出している。 */
const db = admin.firestore();
const getFromFirestore = async (type: DataType): Promise<DataFromApi> => {
  const firestorePath = `jwt-actions-test/${type}`;
  const docRef = db.doc(firestorePath);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error(`No such document: ${firestorePath}`);
  } else {
    const data = doc.data();
    if (!data) throw new Error(`no data found: ${firestorePath}`);
    const dataFromApi = {
      dataType: type,
      data: sortedDictByDateKey(data as DataFromApi["data"]),
    };
    return dataFromApi;
  }
};
const sortByDateKey = (pre: string, post: string): number => {
  const [preMonth, preDate] = pre.split("-").map(Number);
  const [postMonth, postDate] = post.split("-").map(Number);

  return preMonth - postMonth || preDate - postDate;
};
const sortedDictByDateKey = (dict: {
  [key: string]: number;
}): { [key: string]: number } => {
  return Object.fromEntries(
    Object.entries(dict).sort(([preKey], [postKey]) => sortByDateKey(preKey, postKey))
  );
};

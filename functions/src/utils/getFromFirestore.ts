import admin from "firebase-admin";
import { DataFromApi, DataType } from "../types";

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

export default getFromFirestore;

import admin from "firebase-admin";
import { DataType } from "../types";

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

export default saveToFirestore;

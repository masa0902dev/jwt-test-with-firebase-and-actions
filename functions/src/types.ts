export type DataType = "forecast" | "temperature" | "estimation";

export const isDataType = (target: unknown): target is DataType => {
  const dataTypes: DataType[] = ["forecast", "temperature", "estimation"];
  if (typeof target !== "string") return false;
  return dataTypes.includes(target as DataType);
};

/* ex:
dataFromFirestore = {
  dataType: "forecast"
  data: {
    "1-13": 10.5,
    "1-14": 10.5,
    "1-15": 10.5,
    "1-16": 10.5,
    "1-17": 10.5,
    "1-18": 10.5,
    "1-19": 10.5,
  }
}
*/
export type DataFromApi = {
  dataType: DataType;
  data: { [key: string]: number };
};

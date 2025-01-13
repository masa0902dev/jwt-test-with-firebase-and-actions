export type DataType = "forecast" | "temperature" | "estimation";

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

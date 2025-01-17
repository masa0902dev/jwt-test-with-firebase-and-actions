export async function fetchEstimation() {
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
    console.log("successfully fetched data");
    return data;
  } catch (err) {
    console.error("Error fetching data:", err);
    process.exit(1);
  }
}

export async function processEstimation(data: {
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

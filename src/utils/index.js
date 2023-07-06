export function mockTableData(colNums = 20, rowNums = 10000) {
  const data = [];

  for (let rowIndex = 0; rowIndex < rowNums; rowIndex++) {
    const temp = [];
    for (let colIndex = 0; colIndex < colNums; colIndex++) {
      temp[colIndex] = `col-${colIndex}-${rowIndex}`;
    }

    data.push(temp);
  }

  return data;
}

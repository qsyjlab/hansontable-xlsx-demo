export function mockTableData(colNums = 20, rowNums = 10) {
  const data = [];

  for (let rowIndex = 0; rowIndex < rowNums; rowIndex++) {
    const temp = [];
    for (let colIndex = 0; colIndex < colNums; colIndex++) {
      temp[colIndex] = `col-${colIndex}-${rowIndex}`;
    }

    data.push(temp);
  }

  // data.push(['cover: 'https://handsontable.com/docs/img/examples/javascript-the-definitive-guide.jpg''])

  return data;
}

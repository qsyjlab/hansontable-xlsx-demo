onmessage = function (event) {
  const data = event.data;
  replaceValue(data, "数据项", "新的数据项");

  postMessage(data);
};

export function replaceValue(data, targetValue, newValue) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j].indexOf(targetValue) !== -1) {
        data[i][j] = newValue;
      }
    }
  }
}

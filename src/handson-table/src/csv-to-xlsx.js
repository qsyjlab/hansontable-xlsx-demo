import * as XLSX from "xlsx";

export function csvToXlsx(csvData, callback) {
  // 解析 CSV 数据

  // const _csvData = csvData.split("\n").map((row) => row.split(","));
  const worksheet = XLSX.utils.aoa_to_sheet(csvData);

  if (typeof callback === "function") {
    callback(worksheet);
  }

  // 创建 Workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  // 导出为 XLSX 文件
  const xlsxData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([xlsxData], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return blob;
}

// handsontable mergedCells => xlsx mergeConfig
export function mergedCellsToXlsxMergeConfig(mergedCells = []) {
  if (!mergedCells.length) return [];
  const xlsxMergeConfig = [];

  for (let i = 0; i < mergedCells.length; i++) {
    const { row, col, rowspan, colspan } = mergedCells[i];
    const mergeObj = {
      s: { r: row, c: col },
      e: { r: row + rowspan - 1, c: col + colspan - 1 },
    };
    xlsxMergeConfig.push(mergeObj);
  }

  return xlsxMergeConfig;
}

// xlsx mergeConfig => handsontable mergedCells
export function xlsxMergeConfigTomergedCells(xlsxMergeConfig = []) {
  if (!xlsxMergeConfig.length) return [];
  const mergeConfig = [];

  for (const xlsxMerge of xlsxMergeConfig) {
    const { s, e } = xlsxMerge;
    const startRow = s.r;
    const startCol = s.c;
    const endRow = e.r;
    const endCol = e.c;
    const rowspan = endRow - startRow + 1;
    const colspan = endCol - startCol + 1;
    const mergeObj = {
      endRow: endRow,
      endCol,
      row: startRow,
      col: startCol,
      rowspan,
      colspan,
    };
    mergeConfig.push(mergeObj);
  }
  return mergeConfig;
}

export function excelFilerReader(file, callback) {
  let reader = new FileReader();
  reader.onload = function (e) {
    let data = e.target.result;
    let workbook = XLSX.read(data, {
      type: "binary",
      raw: false,
      cellDates: true,
    });

    // console.log('workbook',workbook);
    if (callback) callback(workbook);
  };
  reader.readAsBinaryString(file);
}

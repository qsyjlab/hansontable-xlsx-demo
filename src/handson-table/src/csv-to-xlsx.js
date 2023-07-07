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

export function mergedCellsToXlsxMergeConfig(mergedCells = []) {
  if (!mergedCells.length) return [];
  const xlsxMergeConfig = [];

  for (let i = 0; i < mergedCells.length; i++) {
    console.log("mergedCells[i]", mergedCells[i]);
    const { row, col, rowspan, colspan } = mergedCells[i];
    const mergeObj = {
      s: { r: row, c: col },
      e: { r: row + rowspan - 1, c: col + colspan - 1 },
    };
    xlsxMergeConfig.push(mergeObj);
  }

  return xlsxMergeConfig;
}

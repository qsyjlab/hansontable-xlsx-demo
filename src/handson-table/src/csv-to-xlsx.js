import * as XLSX from "xlsx";
import { downloadFile } from "./utils";

export function csvToXlsx(csvData) {
  // 解析 CSV 数据

  const _csvData = csvData.split("\n").map((row) => row.split(","));
  const worksheet = XLSX.utils.aoa_to_sheet(_csvData);

  // 创建 Workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  // 导出为 XLSX 文件
  const xlsxData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([xlsxData], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  downloadFile("csvToXlsx.xlsx", window.URL.createObjectURL(blob));
}

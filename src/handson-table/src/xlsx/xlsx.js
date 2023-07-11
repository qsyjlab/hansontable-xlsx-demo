import * as XLSX from "xlsx";

export function useXlsx() {
  let currentSheetName = null;

  let workbook = null;

  let sheetNames = [];

  function setWorkbook(wb) {
    sheetNames = wb.SheetNames;
    workbook = wb;

    console.log("sheetNames", sheetNames);

    if (sheetNames.length) {
      currentSheetName = sheetNames[0];
    }
  }

  function getSheetNames() {
    return sheetNames;
  }

  function getCurrentSheetName() {
    return currentSheetName;
  }

  function toggleSheetName(sheetName) {
    currentSheetName = sheetName;
  }

  function getWorkSheet(sheetName) {
    return workbook.Sheets[sheetName];
  }

  function getMerges() {
    return workbook["!merges"];
  }

  function sheetToJson(options) {
    const defaultOpitons = { header: 1 };

    const csv = XLSX.utils.sheet_to_json(
      getWorkSheet(currentSheetName),
      Object.assign(defaultOpitons, options)
    );

    return csv;
  }

  return {
    getMerges,
    sheetToJson,
    setWorkbook,
    getWorkSheet,
    getSheetNames,
    toggleSheetName,
    getCurrentSheetName,
  };
}

/**
 * data[] { sheetName:"", data: [[], []] }
 *
 *  csvToXlsx(csvData, (worksheet) => {
 *  const mergedConfigs = []
 *   worksheet["!merges"] = mergedConfigs;
 * }
 */
export function resolveCsvToXlsx(data, callback) {
  let _data = [];

  if (Array.isArray(data)) {
    _data = data;
  } else {
    _data.push(data);
  }

  function resovleSheet(data, sheetName) {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    if (typeof callback === "function") {
      callback(worksheet);
    }
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  const workbook = XLSX.utils.book_new();

  _data.forEach((item) => {
    resovleSheet(item.data, item.sheetName);
  });

  const xlsxData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([xlsxData], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return blob;
}

export function xlsxFileReader(file, callback, options = {}) {
  const defualtOptions = {
    type: "binary",
    raw: false,
    cellDates: true,
  };
  const reader = new FileReader();
  reader.onload = function (e) {
    const workbook = XLSX.read(
      e.target.result,
      Object.assign(defualtOptions, options)
    );
    if (typeof callback === "function") callback(workbook);
  };
  reader.readAsBinaryString(file);
}

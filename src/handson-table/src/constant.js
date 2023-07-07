// 插件枚举
export const HANDESON_PLUGIN_NAME = {
  EXPORT_FILE: "exportFile",
  SEARCH: "search",
};

// download 默认设置
export const DEFUALT_DOWNLOAD_FILE_SETTING = {
  bom: false,
  columnDelimiter: ",",
  columnHeaders: false,
  exportHiddenColumns: true,
  exportHiddenRows: true,
  fileExtension: "csv",
  mimeType: "text/csv",
  filename: "CSV-file_[YYYY]-[MM]-[DD]",

  rowDelimiter: "\r\n",
  rowHeaders: true,
};

export const EXPORT_METHOD_NAME = {
  DOWNLOAD: "downloadFile",
  BLOB: "exportAsBlob",
  TO_STRING: "exportAsString",
};

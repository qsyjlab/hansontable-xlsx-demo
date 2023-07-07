import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
// 插件模块
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.css";
// 语言模块
import { zhCN, registerLanguageDictionary } from "handsontable/i18n";

import {
  HANDESON_PLUGIN_NAME,
  DEFUALT_DOWNLOAD_FILE_SETTING,
  EXPORT_METHOD_NAME,
} from "./constant";

registerAllModules();
registerLanguageDictionary(zhCN);

export const DEFAULT_SETTING = {
  // 开启过滤 过滤需要同时开启 dropdownMenu 属性
  filters: true,
  //   筛选下拉菜单
  dropdownMenu: true,

  colHeaders: true,
  rowHeaders: true,
  dragToScroll: true,
  // 默认不渲染全部
  renderAllRows: false,
  // 表格宽度
  width: "100%",
  // 高度
  height: 700,
  // height: "auto",
  licenseKey: "non-commercial-and-evaluation",
  // 列宽度
  colWidths: 200,
  stretchH: "all",
  // 可自定宽度
  manualColumnResize: true,
  // 可移动行位置
  manualRowMove: true,
  // 可移动列位置
  manualColumnMove: true,

  // 开启合并单元格
  mergeCells: true,
  // 是否启用菜单
  contextMenu: true,
  // 开启搜索
  search: true,
  //   search: {
  //     // add your custom CSS class
  //     searchResultClass: "my-custom-search-result-class",
  //     // add your custom query method
  //     // queryMethod: onlyExactMatch,
  //   },

  //   afterGetColHeader: this.afterGetColHeader,
  //   columns: this.createColumns(),
  language: zhCN.languageCode,
};

/**
 *  "handsontable": "^13.0.0",
 *  以下对 handsontable api 进行包装便于后续进行迭代处理
 */
export function createHandsontable($el, settings = {}) {
  const container = $el;

  const instance = creatInstance();

  function creatInstance() {
    return new Handsontable(
      container,
      Object.assign(DEFAULT_SETTING, settings)
    );
  }

  function getPlugin(pluginName) {
    return instance.getPlugin(pluginName);
  }

  function search(value) {
    const search = getPlugin(HANDESON_PLUGIN_NAME.SEARCH);
    search.query(value);

    instance.render();
  }

  function loadData(data) {
    instance.loadData(data);
  }

  function updateSettings(settings = {}) {
    instance.updateSettings(settings);
  }

  /**
   * 官方文档并未提出其他格式的导出方式
   *  以及源码中 也只提供 csv 格式
   */
  function _baseExport(invokerName, setting = {}) {
    const exportPlugin = getPlugin(HANDESON_PLUGIN_NAME.EXPORT_FILE);
    return exportPlugin[invokerName](
      "csv",
      Object.assign(DEFUALT_DOWNLOAD_FILE_SETTING, setting)
    );
  }

  function downloadCsvFile(setting = {}) {
    _baseExport(EXPORT_METHOD_NAME.DOWNLOAD, setting);
  }

  function exportCsvAsBlob(setting = {}) {
    return _baseExport(EXPORT_METHOD_NAME.BLOB, setting);
  }

  function exportCsvAsString(setting = {}) {
    return _baseExport(EXPORT_METHOD_NAME.TO_STRING, setting);
  }

  return {
    instance,
    search,
    loadData,
    updateSettings,
    downloadCsvFile,
    exportCsvAsBlob,
    exportCsvAsString,
    getPlugin,
    getSettings: () => instance.getSettings(),
  };
}

export default createHandsontable;

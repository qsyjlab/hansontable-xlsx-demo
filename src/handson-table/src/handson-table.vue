<template>
  <div>
    <div class="my-custom-search-result-class">123123</div>
    <button @click="exportCsvFile">导出 csv</button>
    <button @click="exportXlsx">导出 xlsx</button>

    <button @click="getMergeCells">获取合并列</button>

    <input id="searchField" type="search" placeholder="Search" />
    <input type="file" @change="fileChange" />

    <div ref="containerRef"></div>
    <!-- <hot-table ref="hotTableRef" :settings="settings" :data="data"> </hot-table> -->
  </div>
</template>

<script>
import CustomHeader from "./custom-header.vue";

import { createHandsontable } from "./handson-table";
import { mountComponent, mockTableData } from "./utils";
import { excelFilerReader, xlsxMergeConfigTomergedCells } from "./csv-to-xlsx";
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      colNums: 20,
      handsontableInstance: null,
    };
  },
  mounted() {
    this.createHandsontableInstance();
    document
      .querySelector("#searchField")
      .addEventListener("keyup", (event) => {
        this.handsontableInstance.search(event.target.value);
      });
    const { updateSettings } = this.handsontableInstance;

    console.log("mockTableData(this.colNums)", mockTableData(this.colNums));
    this.handsontableInstance.loadData([]);
    this.$nextTick(() => {
      updateSettings({
        afterGetColHeader: this.afterGetColHeader,
        columns: this.createColumns(),
      });
    });
  },
  methods: {
    fileChange(event) {
      const files = event.target.files;

      if (files.length) {
        excelFilerReader(files[0], (workbook) => {
          const sheetNames = workbook.SheetNames;

          const worksheet = workbook.Sheets[sheetNames[0]];
          const merges = worksheet["!merges"];

          let csv = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          console.log("csv", csv, merges);
          this.handsontableInstance.loadData(csv);
          this.handsontableInstance.mergeCells(
            xlsxMergeConfigTomergedCells(merges)
          );
        });
        // 读取本地excel文件
      }
    },
    getMergeCells() {
      const cells = this.handsontableInstance.getAllMergedCells();

      console.log("cells", cells);
    },
    // 创建表格实例
    createHandsontableInstance() {
      const container = this.$refs.containerRef;
      this.handsontableInstance = createHandsontable(container);
    },
    exportCsvFile() {
      this.handsontableInstance.downloadCsvFile();
    },
    exportXlsx() {
      this.handsontableInstance.downloadXlsxFile();
    },
    // 创建列
    createColumns() {
      return Array(this.colNums)
        .fill(0)
        .map((item, index) => {
          return {
            title: "col-" + index,
            // 配置之外的源信息
            meta: {},
          };
        });
    },
    // 动态渲染表头 （这里使用 vnode 生成真实节点）
    afterGetColHeader(col, th) {
      if (col === -1) return th;

      const targetClass = ".colHeader";
      const target = th.querySelector(targetClass);

      target.innerHTML = "";

      const { getSettings } = this.handsontableInstance;
      const { columns = [] } = getSettings();
      const { $el } = mountComponent(CustomHeader, {
        props: { colIndex: col, column: columns[col] },
      });

      target.appendChild($el);
    },
  },
};
</script>
<style>
.my-custom-search-result-class {
  color: #ff0000;
  font-weight: 900;
}
</style>

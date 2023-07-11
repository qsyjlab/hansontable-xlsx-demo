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

import {
  createHandsontable,
  xlsxMergeConfigToMergedCells,
} from "./handson-table";
import { mountComponent } from "./utils";
import { xlsxFileReader, useXlsx } from "./xlsx";

export default {
  data() {
    return {
      colNums: 20,
      handsontableInstance: null,
      xlsxInstance: null,
      sheetNames: [],
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
        xlsxFileReader(files[0], (workbook) => {
          const instance = useXlsx();
          instance.setWorkbook(workbook);

          this.sheetNames = instance.getSheetNames();
          this.xlsxInstance = instance;

          this.activeSheetChangeHandler(this.sheetNames[0]);
        });
        // 读取本地excel文件
      }
    },

    activeSheetChangeHandler(sheetName) {
      this.xlsxInstance.toggleSheetName(sheetName);
      const csv = this.xlsxInstance.sheetToJson();
      const merges = this.xlsxInstance.getMerges();

      this.handsontableInstance.loadData(csv);
      this.handsontableInstance.mergeCells(
        xlsxMergeConfigToMergedCells(merges)
      );
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

<template>
  <div>
    <div class="my-custom-search-result-class">123123</div>
    <button @click="exportCsvFile">导出 csv</button>

    <input id="searchField" type="search" placeholder="Search" />

    <div ref="containerRef"></div>
    <!-- <hot-table ref="hotTableRef" :settings="settings" :data="data"> </hot-table> -->
  </div>
</template>

<script>
import CustomHeader from "./custom-header.vue";

import { createHandsontable } from "./handson-table";
import { mountComponent, mockTableData } from "./utils";

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
    setTimeout(() => {
      const { updateSettings } = this.handsontableInstance;
      this.handsontableInstance.loadData(mockTableData(this.colNums));
      updateSettings({
        afterGetColHeader: this.afterGetColHeader,
        columns: this.createColumns(),
      });
    }, 2000);
  },
  methods: {
    // 创建表格实例
    createHandsontableInstance() {
      const container = this.$refs.containerRef;
      this.handsontableInstance = createHandsontable(container);
    },
    exportCsvFile() {
      // this.handsontableInstance.exportFile();
      this.handsontableInstance.exportAsBlob();
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
      console.log("args", arguments);
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

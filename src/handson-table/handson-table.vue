<template>
  <div>
    <button @click="exportCsvFile">导出 csv</button>

    <div id="container" ref="containerRef"></div>
    <!-- <hot-table ref="hotTableRef" :settings="settings" :data="data"> </hot-table> -->
  </div>
</template>

<script>
import Vue from "vue";
// import { HotTable } from "@handsontable/vue";
import CustomHeader from "./custom-header.vue";

import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";

// 插件模块
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.css";

// 语言模块
import { zhCN, registerLanguageDictionary } from "handsontable/i18n";

// import { ContextMenu } from "handsontable/plugins/contextMenu";

import { mockTableData } from "@/utils";

registerLanguageDictionary(zhCN);

// register Handsontable's modules
registerAllModules();

export default {
  data() {
    return {
      colNums: 20,
      settings: {},
      handsontableInstance: null,
      data: mockTableData(this.colNums),
    };
  },
  mounted() {
    this.createHandsontableInstance();
  },
  methods: {
    // 创建表格实例
    createHandsontableInstance() {
      const container = this.$refs.containerRef;
      this.settings = this.createHandesonTableSettings();
      const hot = new Handsontable(
        container,
        Object.assign(this.settings, {
          data: this.data,
        })
      );

      this.handsontableInstance = hot;
    },
    exportCsvFile() {
      const exportPlugin = this.hotTableInstance.getPlugin("exportFile");
      exportPlugin.downloadFile("csv", {
        bom: false,
        columnDelimiter: ",",
        columnHeaders: false,
        exportHiddenColumns: true,
        exportHiddenRows: true,
        fileExtension: "csv",
        filename: "Handsontable-CSV-file_[YYYY]-[MM]-[DD]",
        mimeType: "text/csv",
        rowDelimiter: "\r\n",
        rowHeaders: true,
      });
    },
    // 创建 settings 对象
    createHandesonTableSettings() {
      return {
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
        // 是否启用菜单
        contextMenu: true,
        afterGetColHeader: this.afterGetColHeader,
        columns: this.createColumns(),
        language: zhCN.languageCode,
      };
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

      const { columns = [] } = this.settings || {};

      //   console.log("columns", columns);
      const { $el } = this.createCustomHeader(CustomHeader, {
        props: { colIndex: col, column: columns[col] },
        on: {
          click: (props) => {
            console.log("props", props);
          },
        },
      });

      target.appendChild($el);
    },
    // 通过 vnode 生成动态表头
    createCustomHeader(vnode, object = {}) {
      function $mountComponent(vnode) {
        // 创建一个空的 Vue 实例
        const vm = new Vue({
          render: (h) => h(vnode, object),
        });

        vm.$mount();

        return vm;
      }
      return $mountComponent(vnode);
    },
  },
};
</script>

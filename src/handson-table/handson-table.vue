<template>
  <div>
    <button @click="exportCsvFile">导出 csv</button>

    <input id="searchField" type="search" placeholder="Search" />

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

// 注册语言模块
registerLanguageDictionary(zhCN);

// register Handsontable's modules
registerAllModules();

export default {
  data() {
    return {
      colNums: 200,
      settings: {},
      handsontableInstance: null,
      data: mockTableData(200),
    };
  },
  mounted() {
    console.log("this.data", this.data);
    this.createHandsontableInstance();
    document
      .querySelector("#searchField")
      .addEventListener("keyup", (event) => {
        // get the `Search` plugin's instance
        const search = this.handsontableInstance.getPlugin("search");

        console.log("search", search);
        // use the `Search` plugin's `query()` method
        setTimeout(() => {
          search.query(event.target.value, () => {});

          this.handsontableInstance.render();
        }, 1000);
      });
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
      const exportPlugin = this.handsontableInstance.getPlugin("exportFile");
      exportPlugin.downloadFile("xlsx", {
        bom: false,
        columnDelimiter: ",",
        columnHeaders: false,
        exportHiddenColumns: true,
        exportHiddenRows: true,
        fileExtension: "csv",
        filename: "Handsontable-CSV-file_[YYYY]-[MM]-[DD]",
        // mimeType: "text/csv",
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        rowDelimiter: "\r\n",
        rowHeaders: true,
      });
    },
    // 创建 settings 对象
    createHandesonTableSettings() {
      // // define your custom query method
      // function onlyExactMatch(queryStr, value) {
      //   return queryStr.toString() === value.toString();
      // }
      return {
        // 开启过滤 过滤需要同时开启 dropdownMenu 属性
        filters: true,
        // 筛选下拉菜单
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
        // 是否启用菜单
        contextMenu: true,
        // 开启搜索
        // search: true,
        // search: {
        //   // add your custom CSS class
        //   searchResultClass: "my-custom-search-result-class",
        //   // add your custom query method
        //   queryMethod: onlyExactMatch,
        // },

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
<style>
.my-custom-search-result-class {
  color: #ff0000;
  font-weight: 900;
}
</style>

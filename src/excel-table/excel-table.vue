<template>
  <div>
    <input type="file" @change="fileChangeHandler" />

    <div class="sheet">
      <div
        :class="['sheet__item', activeSheetName === item ? 'active' : '']"
        v-for="(item, index) in sheetNames"
        :key="index"
        @click="activeSheetChangeHandler(item)"
      >
        {{ item }}
      </div>
    </div>

    <button @click="replaceData">替换数据测试</button>

    <vxe-table
      border
      show-overflow
      ref="xTableRef"
      height="700"
      :row-config="{ isHover: true }"
      :sort-config="{ trigger: 'cell' }"
    >
      <vxe-column
        v-for="(item, index) in columns"
        :key="index"
        :field="String(index)"
        :width="250"
        :title="item"
      >
        <template #header="col">
          {{ col.column.title }}
        </template>
        <template #default="{ row }">
          {{ row[index] }}
        </template>
      </vxe-column>
    </vxe-table>

    <find-modal :columns="columns" :data="tableData"></find-modal>
  </div>
</template>

<script>
import * as XLSX from "xlsx";

import FindModal from "./find-modal/find-modal.vue";

const computedWorker = new Worker(
  new URL("./computed.worker.js", import.meta.url)
);

export default {
  components: {
    FindModal,
  },
  data() {
    return {
      sheetNames: [],
      activeSheetName: null,
      workbook: null,
      columns: [],
      tableData: [],
    };
  },
  created() {
    computedWorker.addEventListener("message", (e) => {
      this.tableData = e.data;

      this.loadData(this.tableData);
    });
  },
  methods: {
    //

    replaceData() {
      console.time("开始替换");
      computedWorker.postMessage(this.tableData);
      // this.replaceValue("数据项", "新的数据项");
      console.timeEnd("开始替换");

      console.log("替换完成");

      this.loadData(this.tableData);
    },

    replaceValue(targetValue, newValue) {
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.tableData[i].length; j++) {
          if (this.tableData[i][j].indexOf(targetValue) !== -1) {
            this.tableData[i][j] = newValue;
          }
        }
      }
    },

    activeSheetChangeHandler(sheetName) {
      if (this.activeSheetName === sheetName) return;
      this.activeSheetName = sheetName;

      const worksheet = this.workbook.Sheets[sheetName];
      let csv = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      this.columns = csv.shift();

      this.loadData(csv);
    },
    resetTableScroll() {
      const $table = this.$refs.xTableRef;
      if ($table) {
        $table.scrollTo(0, 0);
      }
    },
    async loadData(data) {
      this.tableData = data;
      const $table = this.$refs.xTableRef;
      if ($table) {
        // 通过 .then 可知 loadData 是异步 比 nextTick慢 更新滚动条会失败
        await $table.loadData(data);
        this.$nextTick(() => {
          this.resetTableScroll();

          //   setTimeout(() => {
          //     console.time("开始替换");
          //     this.replaceValue("数据项", "新的数据项");
          //     console.timeEnd("开始替换");

          //     console.log("替换完成");

          //     this.loadData(this.tableData);
          //   }, 5000);
        });
      }
    },
    fileChangeHandler(event) {
      const files = event.target.files;
      if (!files.length >= 1) return;

      this.excelReader(files[0], (workbook) => {
        this.workbook = workbook;
        this.sheetNames = workbook.SheetNames;

        if (this.sheetNames.length) {
          this.activeSheetChangeHandler(this.sheetNames[0]);
        }
      });
    },
    // 读取本地excel文件
    excelReader(file, callback) {
      let reader = new FileReader();
      reader.onload = function (e) {
        let data = e.target.result;
        let workbook = XLSX.read(data, {
          type: "binary",
          raw: false,
          cellDates: true,
        });

        // console.log('workbook',workbook);
        if (callback) callback(workbook);
      };
      reader.readAsBinaryString(file);
    },
  },
};
</script>

<style scoped>
.sheet {
  display: flex;
  align-items: center;
}

.sheet__item {
  cursor: pointer;
  min-width: 130px;
  max-height: 200px;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  align-items: center;
}
.sheet__item.active {
  background-color: aquamarine;
  color: black;
}
</style>
./computed.worker

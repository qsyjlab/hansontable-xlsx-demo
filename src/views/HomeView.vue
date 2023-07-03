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
  </div>
</template>

<script>
import * as XLSX from "xlsx";
export default {
  data() {
    return {
      sheetNames: [],
      activeSheetName: null,
      workbook: null,
      columns: [],
    };
  },
  methods: {
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
      const $table = this.$refs.xTableRef;
      if ($table) {
        // 通过 .then 可知 loadData 是异步 比 nextTick慢 更新滚动条会失败
        await $table.loadData(data);
        this.$nextTick(() => {
          this.resetTableScroll();
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

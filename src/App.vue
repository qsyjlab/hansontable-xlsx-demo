<template>
  <div id="app">
    <excel-table v-if="false"></excel-table>

    <HandsonExcelTable />
  </div>
</template>

<script>
import { ExcelTable } from "@/excel-table";
import { HandsonExcelTable } from "@/handson-table";

export default {
  components: {
    HandsonExcelTable,
    ExcelTable,
  },
};
</script>

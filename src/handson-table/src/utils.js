import Vue from "vue";

// virtual dom => real dom
export function mountComponent(vnode, object = {}) {
  function $mountComponent(vnode) {
    const vm = new Vue({
      render: (h) => h(vnode, object),
    });

    vm.$mount();

    return vm;
  }
  return $mountComponent(vnode);
}

export function mockTableData(colNums = 20, rowNums = 10) {
  const data = [];

  for (let rowIndex = 0; rowIndex < rowNums; rowIndex++) {
    const temp = [];
    for (let colIndex = 0; colIndex < colNums; colIndex++) {
      temp[colIndex] = `col-${colIndex}-${rowIndex}`;
    }

    data.push(temp);
  }
  return data;
}

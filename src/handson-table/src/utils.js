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

export function downloadFile(name, url) {
  const a = document.createElement("a");

  const rootDocument = window.document;

  if (a.download !== void 0) {
    a.style.display = "none";
    a.setAttribute("href", url);
    a.setAttribute("download", name);
    rootDocument.body.appendChild(a);
    a.dispatchEvent(new MouseEvent("click"));
    rootDocument.body.removeChild(a);

    // setTimeout(() => {
    //   URL.revokeObjectURL(url);
    // }, 100);
  } else if (navigator.msSaveOrOpenBlob) {
    // IE10+
    // navigator.msSaveOrOpenBlob(blob, name);
  }
}

export function createBlob(blob, options) {
  const { encoding = "utf8" } = options || {};
  if (typeof Blob !== "undefined") {
    return new Blob([blob], {
      type: `${options.mimeType};charset=${encoding}`,
    });
  }

  return null;
}

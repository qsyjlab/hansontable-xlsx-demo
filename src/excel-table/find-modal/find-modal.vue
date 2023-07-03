<template>
  <div v-show="visible" class="find-modal">
    <div class="find-modal__header">查找替换</div>

    <div class="find-modal__body">
      <div class="form-item">
        <div class="form-item__label">查找</div>
        <div class="form-item__content">
          <input type="text" />
        </div>
      </div>
      <div class="form-item">
        <div class="form-item__label">替换</div>
        <div class="form-item__content">
          <input type="text" />
        </div>
      </div>

      <div>
        <button>查找</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  mounted() {
    this.appendToBody();
    this.bindEvent();
    // 这里一开始直接挂到 body 上去
  },
  methods: {
    bindEvent() {
      window.addEventListener("keydown", this.handleKeyDown);
    },
    handleKeyDown(event) {
      if (event.ctrlKey && event.key === "f") {
        event.preventDefault();
        this.show();
      }
    },
    show() {
      this.visible = true;
    },
    appendToBody() {
      this.visible = false;
      document.body.append(this.$el);
    },
  },
};
</script>
<style lang="scss" scoped>
.find-modal {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  // height: 500px;
  z-index: 2000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  background-color: white;

  &__header {
    border-bottom: 1px solid black;
    padding: 10px;
  }

  &__body {
    padding: 20px;
  }
}

.form-item {
  display: flex;
  &__label {
    flex-shrink: 0;
    width: 150px;
    text-align: right;
  }

  &__content {
    flex: auto;
  }
}
</style>

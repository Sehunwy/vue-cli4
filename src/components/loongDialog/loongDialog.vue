<template>
  <div class="dialog">
    <div v-if="showDialog" class="loong-dialog">
      <div
        class="dialog-popup"
        ref="loongDialog"
        :style="{top:top,left:left,width:widthDialog!=undefined&&widthDialog!=''?widthDialog:''}"
        :class="[modalType=='min'?'min-dialog':'max-dialog']"
      >
        <div
          class="dialog-popupTop fs14"
          @mousedown.stop="mousedown($event)"
          :style="{cursor:isDrag?'move':''}"
        >
          <div class="ellip dialog-title fl" v-html="title"></div>
          <div class="fl">
            <slot name="slot-title"></slot>
            <slot name="slot-component"></slot>
          </div>
          <div class="dialog-close" @click="setShowDialog(false)" v-show="isClose">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-guanbi1" />
            </svg>
          </div>
        </div>
        <div class="dialog-body-wrap">
          <div class="body-wrap">
            <div
              class="dialog-content"
              :class="[modalType=='min'?'min-dialog-content':'max-dialog-content']"
            >
              <div v-html="content"></div>
              <slot name="slot-content"></slot>
              <!-- <slot></slot> -->
            </div>
            <div class="dialog-buttons" v-show="buttons.length>0&&note">
              <div style="margin-left: 30px" class="fl" v-show="note">
                <div
                  class="dialog-radio cursor-pointer"
                  :class="isSelectRadio?'select-radio':''"
                  @click="isSelectRadio=!isSelectRadio"
                >
                  <svg class="icon fs14 radio-icon" aria-hidden="true">
                    <use xlink:href="#icon-gou" />
                  </svg>
                </div>
                <span style="line-height: 62px" class="c3 fs12 pl5">{{noteTip}}</span>
              </div>
              <div class="buttons-wrap" v-show="buttons.length>0">
                <button
                  v-for="(button,index) in buttons"
                  :key="index"
                  :class="button.className"
                  @click="buttonClick(button.callback)"
                >{{button.txt}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-cover-layer"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loongDialog",
  data() {
    return {
      showDialog: false,
      top: "0px",
      left: "0px",
      isSelectRadio: this.noteDef
    };
  },
  methods: {
    // 显示 关闭弹窗
    setShowDialog: function(bool) {
      this.showDialog = bool;
      if (bool) {
        this.setLocation();
      }
    },
    // 鼠标按下事件 移动弹窗
    mousedown: function(event) {
      if (this.isDrag) {
        let loongDialog = this.$refs.loongDialog;
        let offsetTop = loongDialog.offsetTop;
        let offsetLeft = loongDialog.offsetLeft;
        let clientX = event.clientX;
        let clientY = event.clientY;
        let _this = this;
        document.onmousemove = e => {
          e.preventDefault();
          let windowHei = window.innerHeight;
          let windowWid = window.innerWidth;
          let wid = loongDialog.offsetWidth;
          let hei = loongDialog.offsetHeight;
          let bottom = windowHei - hei;
          let right = windowWid - wid;
          let clientXNow = e.clientX;
          let clientYNow = e.clientY;
          let top = clientYNow - clientY + offsetTop;
          let left = clientXNow - clientX + offsetLeft;
          if (top <= 0) {
            top = 0;
          }
          if (left <= 0) {
            left = 0;
          }
          if (left >= right) {
            left = right;
          }
          if (top >= bottom) {
            top = bottom;
          }
          _this.top = top + "px";
          _this.left = left + "px";
        };
        document.onmouseup = e => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    },
    // 设置弹窗居中显示
    setLocation: function() {
      this.$nextTick(function() {
        let windowHei = window.innerHeight;
        let windowWid = window.innerWidth;
        let loongDialog = this.$refs.loongDialog;
        this.top = (windowHei - loongDialog.offsetHeight) / 2 + "px";
        this.left = (windowWid - loongDialog.offsetWidth) / 2 + "px";
      });
    },
    // 点击按钮
    buttonClick: function(callback) {
      let result = callback();
      if (result != undefined) {
        this.showDialog = !result;
      }
    }
  },
  mounted() {
    window.onresize = () => {
      this.setLocation();
    };
  },
  watch: {
    isShowDialog: function(newVal, oldVal) {
      this.showDialog = newVal;
      if (newVal) {
        this.setLocation();
      }
    },
    showDialog: function(newVal, oldVal) {
      this.$emit("setShow", newVal);
      if (!newVal) {
        this.$emit("getRadio", this.isSelectRadio);
        this.isSelectRadio = this.noteDef;
      }
    }
  },
  props: {
    isShowDialog: {
      default: false // 弹窗显示状态
    },
    title: {
      default: ""
    }, // 弹窗title
    content: {
      default: ""
    }, // 弹窗内容
    buttons: {
      default: function() {
        return [];
      }
    }, // 弹窗按钮
    modalType: {
      default: "min"
    },
    widthDialog: {
      default: "580px"
    }, // 弹窗宽度
    isDrag: {
      default: true // 是否可拖拽
    },
    note: {
      default: false
    }, // 底部单选按钮
    noteDef: {
      default: false
    }, // 单选按钮初始状态
    noteTip: {
      default: ""
    }, // 单选按钮内容
    isClose: {
      default: true // 右上角是否有关闭按钮
    }
  }
};
</script>

<style scoped>
.buttons-wrap {
  position: absolute;
  bottom: 15px;
  right: 30px;
}

.dialog-buttons .button-common {
  margin-left: 15px;
}

.dialog-cover-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: rgba(3, 20, 32, 1) none repeat scroll 0 0;
  opacity: 0.3;
}

.dialog-popup {
  position: fixed;
  z-index: 10000;
}

.min-dialog {
  width: 580px;
}

.max-dialog {
  width: 860px;
}

.dialog-popupTop {
  width: 100%;
  height: 44px;
  line-height: 44px;
  background-color: #38455a;
  color: #ffffff;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

.dialog-title {
  margin-left: 20px;
  max-width: calc(100% - 80px);
}

.dialog-close {
  position: absolute;
  top: 0px;
  right: 10px;
  cursor: pointer;
}

.dialog-body-wrap {
  background: #e9ecef;
  padding: 0 5px 5px 5px;
}

.body-wrap {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-shadow: 1px 1px 8px 0px rgba(0, 0, 0, 0.19);
  border-radius: 0px 0px 2px 2px;
}

.dialog-content {
  width: 100%;
  overflow: auto;
  line-height: 25px;
  background-color: #ffffff;
}

.min-dialog-content {
  min-height: 320px;
  max-height: 496px;
}

.max-dialog-content {
  height: 496px;
}

.dialog-buttons {
  height: 62px;
  width: 100%;
  border-top: 1px solid #e9ecef;
}

.dialog-radio {
  position: relative;
  float: left;
  width: 12px;
  height: 12px;
  top: 24px;
  border-radius: 50%;
  border: 1px solid #aaaaaa;
  color: #ffffff;
}

.radio-icon {
  position: absolute;
}

.select-radio {
  width: 14px;
  height: 14px;
  border: none;
  background-color: #1188dd;
}
</style>

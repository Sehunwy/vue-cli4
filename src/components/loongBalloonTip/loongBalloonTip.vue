<template>
  <div
    v-if="tipShow"
    class="loong-balloon-tip"
    style="white-space:normal"
    :style="{top:tipTop,left:tipLeft}"
  >
    <div class="balloon-tip" :style="{width:widthTip}">
      <div :class="arrowClass" :style="{top:top,left:left,borderColor:borderStyle}"></div>
      <div class="tip-content" ref="tipContent" :style="{color:color}">
        <div
          class="tip-details"
          ref="tipDetails"
          :style="{backgroundColor:backColor}"
          v-html="tipTitle"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loongBalloonTip",
  data() {
    return {
      top: "9px",
      left: "-4px",
      arrowClass: "arrow-right",
      tipTop: "0px",
      tipLeft: "0px",
      tipShow: false,
      borderStyle: "transparent #333 transparent transparent",
      color: "",
      backColor: "",
      placement: ""
    };
  },
  props: {
    tipPlacement: {
      default: "right" // 气泡显示位置 top bottom left right
    },
    elementInfo: {}, // 产生气泡节点信息
    isShowTip: {
      default: false
    }, // 气泡是否显示 初始为false
    tipBackColor: {
      default: "#333333" // 气泡显示背景色
    },
    tipColor: {
      default: "#ffffff" // 气泡显示字体颜色
    },
    tipTitle: {
      default: "气泡"
    }, // 气泡显示内容
    widthTip: {
      default: "100px" // 气泡显示宽度
    }
  },
  methods: {
    balloonPlace: function() {
      let reallyElement = this.elementInfo[0];
      if (this.elementInfo[0] == undefined) {
        reallyElement = this.elementInfo;
      }
      let offsetWidth = reallyElement.offsetWidth;
      let offsetHeight = reallyElement.offsetHeight;
      let offsetTop = reallyElement.offsetTop;
      let offsetLeft = reallyElement.offsetLeft;
      this.color = this.tipColor;
      this.backColor = this.tipBackColor;
      this.placement = this.tipPlacement;
      if (this.placement == "top") {
        let tipContent = this.$refs.tipContent;
        this.top = tipContent.offsetHeight + "px";
        this.left = "17px";
        this.arrowClass = "arrow-top";
        this.tipTop = offsetTop - tipContent.offsetHeight - 4 + "px";
        this.tipLeft = offsetLeft + offsetWidth / 2 - 20 + "px";
        this.borderStyle = "" + this.backColor + " transparent transparent";
      } else if (this.placement == "bottom") {
        this.top = "-4px";
        this.left = "17px";
        this.arrowClass = "arrow-bottom";
        this.tipTop = offsetTop + offsetHeight + 4 + "px";
        this.tipLeft = offsetLeft + offsetWidth / 2 - 20 + "px";
        this.borderStyle = "transparent transparent " + this.backColor + "";
      } else if (this.placement == "left") {
        let tipDetails = this.$refs.tipDetails;
        this.left = tipDetails.offsetWidth + "px";
        this.top = "11px";
        this.arrowClass = "arrow-left";
        this.tipTop = offsetTop + offsetHeight / 2 - 15 + "px";
        this.tipLeft = offsetLeft - tipDetails.offsetWidth - 4 + "px";
        this.borderStyle =
          "transparent transparent transparent " + this.backColor + "";
      } else {
        this.top = "9px";
        this.left = "-4px";
        this.arrowClass = "arrow-right";
        this.tipTop = offsetTop + offsetHeight / 2 - 15 + "px";
        this.tipLeft = offsetLeft + offsetWidth + 4 + "px";
        this.borderStyle =
          "transparent " + this.backColor + " transparent transparent";
      }
    }
  },
  watch: {
    isShowTip: function(newVal, oldVal) {
      this.tipShow = newVal;
      this.$nextTick(function() {
        if (this.tipShow) {
          this.balloonPlace();
        }
      });
    }
  }
};
</script>

<style scoped>
.loong-balloon-tip {
  position: absolute;
  z-index: 10;
}

.balloon-tip {
  position: relative;
}

.arrow-bottom {
  position: absolute;
  border-width: 0 4px 4px;
  border-style: solid;
}

.arrow-top {
  position: absolute;
  border-width: 4px 4px 0;
  border-style: solid;
}

.arrow-left {
  position: absolute;
  border-width: 4px 0 4px 4px;
  border-style: solid;
}

.arrow-right {
  position: absolute;
  border-width: 4px 4px 4px 0;
  border-style: solid;
}

.tip-content {
  float: left;
  width: 100%;
  line-height: 20px;
  font-size: 12px;
}

.tip-details {
  float: left;
  max-width: 100%;
  word-wrap: break-word;
  padding: 5px 10px;
  border-radius: 3px;
}
</style>

<template>
  <div class="menus-wrap" :style="{width:foldWid}" :class="foldClass">
    <div class="logo-wrap">
      <img :src="logo" alt />
    </div>
    <div style="height: calc(100% - 97px)">
      <siderBarChild
        :menus="menus"
        :layer="-1"
        :menusLen="menusLen"
        :firstMenu="firstMenu"
        :isFold="isFold"
      ></siderBarChild>
      <loongBalloonTip
        v-show="isFold"
        :tipTitle="tipTitle"
        tipPlacement="right"
        :elementInfo="elementInfo"
        :isShowTip="isShowTip"
      ></loongBalloonTip>
    </div>
    <div class="collapse-bar" @click="isFoldClick()">
      <span class="fold-icon">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="!isFold ? '#icon-mulushouqi':'#icon-muluzhankai'" />
        </svg>
      </span>
    </div>
  </div>
</template>

<script>
import loongBalloonTip from "@/components/loongBalloonTip/loongBalloonTip";
import siderBarChild from "@/components/layout/siderBarChild";
import { allModule } from "@/views/LoongUI/frame/lib/config.js";
import { homePage } from "@/assets/js/config.js";
import bus from "@/assets/js/bus.js";
export default {
  name: "siderBar",
  data() {
    return {
      menus: [],
      menusLen: 0,
      firstMenu: "",
      isFold: false, // 侧边栏是否折叠
      foldClass: "", // 是否折叠的class 折叠'foldT'  没折叠'foldF'
      foldWid: "180px", // 菜单宽度
      tipTitle: "",
      isShowTip: false,
      elementInfo: ""
    };
  },
  created() {
    allModule.then(result => {
      this.menus.push(homePage);
      for (var i = 0; i < result.length; i++) {
        var menu = result[i].getMenu();
        if (menu != undefined) {
          if (menu instanceof Array) {
            for (var j = 0; j < menu.length; j++) {
              this.menus.push(menu[j]);
            }
          } else {
            this.menus.push(menu);
          }
        }
      }
      this.menusLen = result.length;
      if (result.length == 2) {
        this.firstMenu = this.menus[1].name;
      }
    });
  },
  mounted() {
    bus.$on("balloonTip", data => {
      this.tipTitle = data.title;
      this.isShowTip = data.isShow;
      this.elementInfo = data.elementInfo;
    });
  },
  methods: {
    isFoldClick: function() {
      this.isFold = !this.isFold;
      this.foldClass = this.isFold ? "foldT" : "foldF";
      this.foldWid = this.isFold ? "58px" : "180px";
      this.$emit("siderFold", this.isFold);
    }
    // balloonTip: function(data) {
    //   this.tipTitle = data.title;
    //   this.isShowTip = data.isShow;
    //   this.elementInfo = data.elementInfo;
    // }
  },
  components: {
    siderBarChild,
    loongBalloonTip
  },
  watch: {
    menus: function(newVal, oldVal) {
      this.menus = newVal;
    }
  },
  props: {
    logo: {}
  }
};
</script>

<style>
.logo-wrap {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 54px;
  background-color: #2a374d;
}

.collapse-bar {
  background-color: #2a374d;
  width: 100%;
  height: 44px;
  position: absolute;
  bottom: 0px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fold-icon {
  color: #aeb9c2;
}

.menus-wrap {
  height: 100%;
  position: relative;
  left: 0px;
  top: 0px;
  z-index: 999;
  background-color: #38455a;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.24), 0 0 8px 0 rgba(0, 0, 0, 0.2);
}

.foldT {
  animation: myFold2 500ms linear;
}

.foldF {
  animation: myFold1 500ms linear;
}

@keyframes myFold1 {
  from {
    width: 58px;
  }
  to {
    width: 180px;
  }
}

@keyframes myFold2 {
  from {
    width: 180px;
  }
  to {
    width: 58px;
  }
}

.logo-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <div id="main">
    <siderBar @siderFold="siderFold" :logo="logo"></siderBar>
    <div style="overflow-x: hidden;">
      <div
        class="loong-navBar"
        :style="{'width': isMainFold ? 'calc(100% - 58px)':'calc(100% - 180px)'}"
        :class="mainFoldClass"
      >
        <navBar></navBar>
      </div>
    </div>
    <div
      class="loong-main"
      :style="{'width': isMainFold ? 'calc(100% - 58px)':'calc(100% - 180px)'}"
      :class="mainFoldClass"
    >
      <div class="main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import siderBar from "@/components/layout/siderBar";
import navBar from "@/components/layout/navBar";
import imgUrl from "@/views/LoongUI/frame/image/logo.png";
export default {
  name: "layout",
  data() {
    return {
      logo: imgUrl,
      isMainFold: false,
      mainFoldClass: "",
      navFoldClass: false
    };
  },
  methods: {
    siderFold: function(data) {
      this.isMainFold = data;
      if (typeof this.isMainFold == "boolean") {
        this.mainFoldClass = this.isMainFold ? "foldMainT" : "foldMainF";
        this.navFoldClass = this.isMainFold ? "foldNavT" : "foldNavF";
      }
    }
  },
  components: {
    siderBar,
    navBar
  }
};
</script>

<style>
#main {
  width: 100%;
  height: 100%;
}

.loong-main {
  height: calc(100% - 54px);
  position: absolute;
  top: 54px;
  right: 0px;
  overflow: hidden;
}

.loong-navBar {
  position: absolute;
  top: 0px;
  right: 0px;
  height: 54px;
}

@keyframes myMain1 {
  from {
    width: calc(100% - 58px);
  }
  to {
    width: calc(100% - 180px);
  }
}

@keyframes myMain2 {
  from {
    width: calc(100% - 180px);
  }
  to {
    width: calc(100% - 58px);
  }
}

.foldMainT {
  animation: myMain2 500ms linear;
}

.foldMainF {
  animation: myMain1 500ms linear;
}

@keyframes myNav1 {
  from {
    width: calc(100% - 58px);
  }
  to {
    width: calc(100% - 180px);
  }
}

@keyframes myNav2 {
  from {
    width: calc(100% - 180px);
  }
  to {
    width: calc(100% - 58px);
  }
}

.foldNavT {
  animation: myNav1 500ms linear;
}

.foldNavF {
  animation: myNav2 500ms linear;
}

.main {
  margin: 0 25px;
  width: calc(100% - 50px);
  height: 100%;
}
</style>
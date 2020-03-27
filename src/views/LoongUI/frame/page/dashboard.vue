<template>
  <div style="width: 100%;height: 100%">
    <loongTab :tabArr="tabArr" :activeTab="activeTab" :isShow="isShow"></loongTab>
  </div>
</template>

<script>
// import cloudStorage from '@/components/homePage/cloudStorage'
// import virtualCloud from '@/components/homePage/virtualCloud'
// import cloudDisk from '@/components/homePage/cloudDisk'
import loongTab from "@/components/loongTab/loongTab";
import { allModule } from "@/views/LoongUI/frame/lib/config.js";

import cloudStorage from "@/views/DiskUI/page/dashboard";

export default {
  name: "tabTest",
  data() {
    return {
      tabArr: [],
      modules: [],
      isShow: false,
      activeTab: 1 // 初始激活的tab
    };
  },
  created() {
    allModule.then(result => {
      this.modules = result;
    });
  },
  watch: {
    modules: function(newVal, oldVal) {
      var index = 0;
      this.isShow = true;
      for (var i = 0; i < newVal.length; i++) {
        if (newVal[i].homePage) {
          this.tabArr[index] = {};
          this.tabArr[index].component = newVal[i].homePage.dst;
          this.tabArr[index].text = newVal[i].homePage.txt;
          index++;
        }
      }
    }
  },
  components: {
    loongTab
  }
};
</script>

<style scoped>
</style>

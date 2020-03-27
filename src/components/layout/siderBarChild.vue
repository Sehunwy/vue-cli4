<template>
  <div class="menus-list">
    <ul class="menus-ul" :class="[currlayer==0?'w100-17':'w100']" >
      <li v-for="(item,index) in menus" :key="index">
        <div
          class="menus-name"
          :class="[showClass(currlayer),currRoute.path==item.path?'menu-item-animation':'']"
          @click.stop="isOpen(item.name,currlayer,item.children!=undefined,item.path,item.children==undefined || item.children.length==1)"
          :ref="`tip${item.name}`"
          @mouseover="mouseOver(item.name,currlayer==0&&item.children.length==1?doI18n(item.children[0].meta.title):doI18n(item.meta.title))"
          @mouseleave="mouseLeave(item.name,currlayer==0&&item.children.length==1?doI18n(item.children[0].meta.title):doI18n(item.meta.title))"
        >
          <div style="float:left">
            <svg class="icon fs18" aria-hidden="true">
              <use
                :xlink:href="(isFirstEnter?currRoute.matched[currlayer].path==item.path:isShow[item.name]) || isShow[item.name]?item.meta.iconOpen:item.meta.iconClose"
              />
            </svg>
          </div>
          <div
            style="padding-left:10px;float:left"
            v-show="!isFold"
          >{{ currlayer==0&&item.children.length==1?doI18n(item.children[0].meta.title):doI18n(item.meta.title) }}</div>
        </div>
        <div v-if="item.children&&item.children.length!=1">
          <transition name="fade">
            <div
              v-show="(isFirstEnter?currRoute.matched[currlayer].path==item.path:isShow[item.name]) || isShow[item.name]"
              class="menus-box"
            >
              <siderBarChild
                :menus="item.children"
                :layer="currlayer"
                :menusLen="menusLen"
                :firstMenu="firstMenu"
                :unfoldArr="unfold"
                :isShowObj="isShow"
              ></siderBarChild>
            </div>
          </transition>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import bus from '@/assets/js/bus.js';  
export default {
  name: "siderBarChild",
  data() {
    return {
      currlayer: this.layer,
      isShow: this.isShowObj,
      firstShow: "",
      levelClass: ["level1", "level2", "level3", "level4"],
      unfold: this.unfoldArr,
      currRoute: "",
      isFirstEnter: true,
      elementInfo: "",
      isShowTip: {}
    };
  },
  methods: {
    // 鼠标移入事件
    mouseOver: function(name,title) {
      this.elementInfo = this.$refs[`tip${name}`];
      bus.$emit('balloonTip',{
        isShow: true,
        title: title,
        elementInfo: this.elementInfo
      })
    },
    // 鼠标移出事件
    mouseLeave: function(name,title) {
      bus.$emit('balloonTip',{
        isShow: false,
        title: title,
        elementInfo: ''
      })
    },
    isOpen: function(name, layer, hasChildren, path, jumpMenus) {
      this.isFirstEnter = false; // 判断是否第一次进入，若第一次进入则展开路由相同项；若不是，则展开点击项
      this.$set(this.isShow, name, !this.isShow[name]);
      if (this.unfold[layer] == undefined) {
        this.unfold[layer] = {};
      }
      var obj = this.unfold[layer]; // 得到第layer层的对象
      if (this.isShow[name]) {
        obj[name] = name;
        this.unfold[layer] = obj;
      } else {
        delete this.unfold[layer][name];
      }
      var copyUnfold = JSON.parse(JSON.stringify(this.unfold));
      var keys;
      for (var i = layer; i < copyUnfold.length; i++) {
        keys = Object.keys(copyUnfold[i]);
        for (var j = 0; j < keys.length; j++) {
          if (name != keys[j]) {
            this.$set(this.isShow, keys[j], false);
            delete this.unfold[i][keys[j]];
          }
        }
      }
      if (jumpMenus) {
        this.$router.push(path);
      }
    },
    showClass: function(layer) {
      return this.levelClass[layer];
    }
  },
  created() {
    this.currlayer++;
    if (this.menusLen == 2) {
      this.$set(this.isShow, this.firstMenu, true);
    }
    this.currRoute = this.$route;
  },
  watch: {
    $route(to, from) {
      this.currRoute = this.$route;
    }
  },
  props: {
    menus: {},
    layer: {},
    menusLen: {},
    firstMenu: {},
    unfoldArr: {
      default: () => {
        return [];
      }
    },
    isShowObj: {
      default: () => {
        return {};
      }
    },
    isFold: {}
  }
};
</script>

<style>
.fs18 {
  font-size: 18px;
}

.w100 {
  width: 100% !important;;
}

.w100-17 {
  width: calc(100% + 17px) !important;;
}

.menus-list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}

.menus-ul {
  height: 100%;
  /* width: calc(100% + 17px) !important; */
  overflow-y: auto;
  overflow-x: hidden;
}

.menus-name {
  height: 44px;
  line-height: 44px;
  color: #ffffff;
  padding-left: 20px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
}

.level1 {
  background: #38455a;
}

.level1:hover {
  background-color: #475369;
}

.level2 {
  background: #2a374d;
}

.level2:hover {
  background-color: #475369;
  border-left: 2px solid #1188dd;
  padding-left: 18px;
}

.level3 {
  background: red;
}

.level4 {
  background: pink;
}

.menus-box {
  max-height: 800px;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: max-height 0.8s ease;
}
.fade-enter,
.fade-leave-active {
  max-height: 0;
}

.menu-item-animation {
  background: #1188dd !important;
  animation: menu-item 400ms linear;
}

@keyframes menu-item {
  from {
    width: 0px;
  }
  to {
    width: calc(100% + 17px);
  }
}
</style>

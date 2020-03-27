<template>
  <div class="query-wrap" :style="{width: searchWid}" style="height: 32px">
    <div class="search-box fl c9 pr" style="width: calc(100% - 32px)">
      <input
        type="text"
        class="search-input fs12 border-gray"
        :placeholder="placeholderText"
        v-model="inputVal"
        style="width: 100%"
        @keyup.enter="search"
      />
      <span
        @click="close()"
        v-show="inputVal"
        class="hand fs16 color-gray-dark"
        style="position:absolute;right:5px;top:5px;"
      >
        <svg class="icon">
          <use xlink:href="#icon-shurukuangqingkong" />
        </svg>
      </span>
    </div>
    <span @click="search()" class="search-btn fl color-blue border-gray tac hand">
      <svg class="icon">
        <use xlink:href="#icon-sousu" />
      </svg>
    </span>
  </div>
</template>

<script>
export default {
  name: "loongQuery",
  data() {
    return {
      inputVal: ""
    };
  },
  created() {
    let inputVal = window.sessionStorage.getItem("inputVal");
    if (inputVal) {
      this.inputVal = inputVal;
      this.$emit("searchInput", this.inputVal);
    }
  },
  beforeDestroy() {
    window.sessionStorage.removeItem("inputVal");
  },
  methods: {
    close: function() {
      this.inputVal = "";
    },
    search: function() {
      this.$emit("searchInput", this.inputVal);
    }
  },
  watch: {
    inputVal: function(newVal, oldVal) {
      if (this.hasMemory) {
        window.sessionStorage.setItem("inputVal", newVal);
      }
    }
  },
  props: {
    placeholderText: {},
    searchWid: {
      default: "180px"
    },
    hasMemory: {
      default: false
    }
  }
};
</script>

<style>
.search-input {
  height: 32px;
  border-radius: 2px;
  border-right: none;
  padding-left: 10px;
  padding-right: 20px;
  font-family: PingFangSC-Regular;
  line-height: 32px;
  outline: none;
}

.search-btn {
  height: 32px;
  width: 32px;
  border-left: 1px solid #f1f3f5;
  line-height: 32px;
}
</style>
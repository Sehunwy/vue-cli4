<template>
  <div class="table">
    <div class="table-header c6 fs12">
      <div v-for="(title,index) in titleData" :key="index" class="header-row flex-start-center">
        <!-- <div class="checkbox ml30" v-if="chooseWay=='checkbox'&&index==0" @click="choose()"></div> -->
        <div
          class="checkbox ml30"
          :class="[isChooseAll?'checkbox-selected':'']"
          v-if="chooseWay=='checkbox'&&index==0"
          @click.stop="chooseCheckbox(-1)"
        >
          <!-- checkbox-selected -->
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gou" />
          </svg>
        </div>
        <div style="width:14px" class="ml30" v-if="chooseWay=='radio'&&index==0"></div>
        <div
          :title="title.overflowEllipsis?title.title:''"
          :class="[title.overflowEllipsis?'toe':'',chooseWay&&index==0?'pl10':'pl30']"
          :style="{width: dataWid[index]+'px'}"
        >{{title.title}}</div>
        <div v-show="index!=titleData.length-1" class="split-line bg-gray-mezzo"></div>
      </div>
    </div>
    <div class="table-body" ref="tableBody" :class="[ajaxData?'he138':'he38']">
      <div class="fs12 c3" ref="bodyInner" style="width:100%;height:100%;">
        <div v-show="tableData.length!=0">
          <div
            v-for="(data,dataInd) in tableData"
            :key="dataInd"
            class="table-body-row flex-start-center border-btm-gray"
            @click="chooseRow(dataInd)"
          >
            <div
              v-for="(title,index) in titleData"
              :key="index"
              class="flex-start-center body-item"
            >
              <div
                class="checkbox ml30"
                :class="[isChoose[dataInd]?'checkbox-selected':'']"
                v-if="chooseWay=='checkbox'&&index==0"
                @click.stop="chooseCheckbox(dataInd)"
              >
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-gou" />
                </svg>
              </div>
              <div
                class="radio ml30"
                :class="[isChoose[dataInd]?'radio-selected':'']"
                v-if="chooseWay=='radio'&&index==0"
                @click.stop="chooseRadio(dataInd)"
              >
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-gou" />
                </svg>
              </div>
              <div
                :class="[chooseWay&&index==0?'pl10':'pl30']"
                :style="{width: dataWid[index]+'px'}"
              >
                <div v-if="title.type=='button'">
                  <span
                    v-for="(button,butInd) in title.operations"
                    :key="butInd"
                    :title="(button.text)"
                    class="mr20 fs16 hand color-blue"
                    @click.stop="button.callBack(dataInd,data)"
                  >
                    <svg class="icon" aria-hidden="true">
                      <use :xlink:href="button.icon" />
                    </svg>
                  </span>
                </div>
                <div
                  v-else
                  style="position:relative;font-size:0"
                  @mouseenter="mouseover(dataInd,index)"
                  @mouseleave="mouseLeave(dataInd,index)"
                >
                  <div
                    :ref="`content${dataInd}${index}`"
                    :class="[title.overflowEllipsis || title.overflowTips?'toe':'wsw']"
                  >
                    <div
                      class="fl fs12"
                      :title="title.overflowEllipsis || title.overflowTips?$options.filters.formater(data[title.name],data,title.formater,title.pattern):''"
                      :ref="`details${dataInd}${index}`"
                      v-html="$options.filters.formater(data[title.name],data,title.formater,title.pattern)"
                    ></div>
                    <div class="fl fs12" v-if="title.isShowSlot">
                      <slot name="slot-info" :infos="data"></slot>
                      <slot name="slot-component" :infos="data"></slot>
                    </div>
                  </div>
                  <div
                    class="table-more-icon"
                    v-show="isShowIcon[dataInd][index]&&title.overflowTips"
                    @click.stop="showMoreDetails(dataInd,index)"
                  >
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-jiantouxia" />
                    </svg>
                  </div>
                  <div v-show="isShowMore[dataInd][index]" class="tips-inner">
                    <div class="close-tips-arrow" @click.stop="closeMoreDetails(dataInd,index)">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shanchu1" />
                      </svg>
                    </div>
                    <div
                      class="tips-content"
                      v-html="$options.filters.formater(data[title.name],data,title.formater,title.pattern)"
                    ></div>
                  </div>
                </div>
              </div>
              <div v-show="index!=titleData.length-1" class="split-line bg-gray-mezzo"></div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 100%;height: 100%" v-show="tableData.length==0" class="flex-center">
        <div>
          <img src="@/components/loongTable/img/noData.png" alt />
          <p class="fs12 c9 pt10 tac">暂无数据</p>
        </div>
      </div>
    </div>
    <div v-show="ajaxData" style="height: 100px" class="flex-center">
      <div v-if="pagingWay=='page'">
        <loongPagination
          :limits="limits"
          :total="totalPage"
          :pageSize="pageSizes"
          :pageNum="pageNum"
          @pageInfo="pageInfo"
        ></loongPagination>
      </div>
      <div v-if="pagingWay=='flow'&&isFlowShow">
        <div id="loading">
          <div class="loadAnimation"></div>
          <div class="loadAnimation"></div>
          <div class="loadAnimation"></div>
          <div class="loadAnimation"></div>
          <div class="loadAnimation"></div>
          <div class="loadAnimation"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/views/LoongUI/frame/js/common"; //引入时间格式化js
import axios from "axios";
import "@/assets/css/load.css";
import loongPagination from "@/components/loongPagination/loongPagination";
export default {
  name: "loongTable1",
  components: { loongPagination },
  data() {
    return {
      dataWid: [], // 单元格宽度数组
      notWid: [], // 没有设置单元格宽度
      totalWid: 0, // 设置了宽度的单元格总和
      tableData: [], // 表格内容
      reallyShow: [[]], // 单元格内容是否超过单元格
      isShowMore: [[]], // 移入单元格是否显示更多内容
      isShowIcon: [[]], // 移入单元格是否显示更多图标
      lastDetail: [-1, -1], //上一个显示的详情
      totalPage: 1,
      pageNum: 1,
      pageSizes: this.pageSize,
      isFlowShow: false, // 流加载动画是否显示
      isChoose: [], // 选框是否选中
      isChooseAll: false, // 多选框是否全部选中
      radioBefore: -1, // 上一个单选框选中的index
      selectIndex: [], // 选中的index
      selectmemoryData: {},
      selectmemoryIndex: {},
      isPageSizeChange: false,
      memoryData: "",
      isFirstEntry: true
    };
  },
  created() {
    this.getWid();
    if (this.ajaxData) {
      if (this.pagingWay == "page" && this.haveStorage) {
        var pageInfo = window.sessionStorage.getItem("page");
        pageInfo = JSON.parse(pageInfo);
        if (pageInfo) {
          this.pageSizes = pageInfo.pageSize;
          this.pageNum = pageInfo.pageNum;
        }
      }
      this.getData();
    }
  },
  mounted() {
    var self = this;
    this.$nextTick(() => {
      this.setWid();
      window.addEventListener("resize", this.resizeHandler());
    });
    if (this.pagingWay == "flow") {
      this.$refs.tableBody.onscroll = () => {
        var offsetHei = this.$refs.tableBody.offsetHeight;
        var scrTop = this.$refs.tableBody.scrollTop;
        var scrollHei = this.$refs.tableBody.scrollHeight;
        if (offsetHei + scrTop >= scrollHei) {
          console.log("到底底部");
          this.pageNum++;
          if (this.pageNum <= this.totalPage) {
            this.isFlowShow = true;
            this.getData();
          } else {
            this.pageNum = this.totalPage;
          }
        }
      };
    }
  },
  methods: {
    pageInfo: function(data) {
      this.pageNum = data.pageNum;
      this.pageSizes = data.pageSize;
    },
    getData: function() {
      this.$axios({
        type: this.method,
        url: this.url,
        data: {
          pageSize: this.pageSizes,
          pageNum: this.pageNum
        }
      })
        .then(res => {
          let data = res.data.rows;
          var total = res.data.total;
          if (this.pagingWay == "page") {
            this.tableData = data;
          } else {
            this.tableData = this.tableData.concat(data);
            this.isFlowShow = false;
          }
          if (!this.isPageSizeChange && this.hasMemory) {
            var memory = JSON.parse(window.sessionStorage.getItem("memory"));
            this.memoryData = memory;
            if (memory && memory[this.pageNum]) {
              this.selected(memory[this.pageNum]);
            }
          }
          this.totalPage = total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 初始化二维数组
    initArr: function() {
      for (let dataI in this.tableData) {
        this.isShowMore[dataI] = [];
        this.isShowIcon[dataI] = [];
      }
    },
    getWid: function() {
      var wid;
      for (var i = 0; i < this.titleData.length; i++) {
        if (
          this.titleData[i].width != "" &&
          this.titleData[i].width != undefined
        ) {
          wid = parseInt(this.titleData[i].width);
          this.dataWid[i] = wid - 1;
          this.totalWid = this.totalWid + wid;
        } else {
          this.notWid.push(i);
        }
      }
    },
    // 设置单元格的宽度
    setWid: function() {
      var tableBody = this.$refs.tableBody.offsetWidth;
      var counter = this.notWid.length;
      var checkWid = 0;
      if (this.chooseWay == "checkbox" || this.chooseWay == "radio") {
        checkWid = 44;
      }
      var remainWid =
        Math.floor((tableBody - this.totalWid - checkWid) / counter) - 1;
      var last = this.dataWid[this.dataWid.length - 1];
      for (var i = 0; i < counter; i++) {
        this.$set(this.dataWid, this.notWid[i], remainWid);
      }
      if (this.isFirstEntry) {
        this.$set(this.dataWid, this.dataWid.length - 1, last - 17);
      }
      this.isFirstEntry = false;
    },
    // 使用函数防抖监听窗口变化
    resizeHandler: function() {
      let timer;
      var self = this;
      return () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function() {
          self.setWid();
          self.isShow();
        }, 500);
      };
    },
    // 鼠标移入事件 显示更多图标
    mouseover: function(dataInd, index) {
      if (this.reallyShow[dataInd][index]) {
        this.$set(this.isShowIcon[dataInd], index, true);
        this.isShowIcon.push();
        if (this.lastDetail[0] != -1) {
          this.$set(
            this.isShowMore[this.lastDetail[0]],
            this.lastDetail[1],
            false
          );
          this.isShowIcon.push();
        }
      }
    },
    // 鼠标移出事件 隐藏更多图标
    mouseLeave: function(dataInd, index) {
      this.$set(this.isShowIcon[dataInd], index, false);
      this.isShowIcon.push();
    },
    // 点击显示内容详情
    showMoreDetails: function(dataInd, index) {
      this.$set(this.isShowMore[dataInd], index, true);
      this.isShowIcon.push();
      this.lastDetail = [dataInd, index];
    },
    // 点击关闭内容详情
    closeMoreDetails: function(dataInd, index) {
      this.$set(this.isShowMore[dataInd], index, false);
      this.isShowIcon.push();
      this.lastDetail = [-1, -1];
    },
    // 单元格内容是否超过单元格
    isShow: function() {
      let content;
      for (let dataI in this.tableData) {
        this.reallyShow[dataI] = [];
        this.isShowMore[dataI] = [];
        for (let titleI in this.titleData) {
          content = this.$refs[`content${dataI}${titleI}`];
          if (content != undefined && content.length != 0) {
            if (content[0].offsetWidth < content[0].scrollWidth) {
              this.reallyShow[dataI][titleI] = true;
            } else {
              this.reallyShow[dataI][titleI] = false;
            }
          } else {
            this.reallyShow[dataI][titleI] = false;
          }
        }
      }
    },
    // 单选框点击事件
    chooseRadio: function(index) {
      this.$set(this.isChoose, index, !this.isChoose[index]);
      if (this.radioBefore != -1) {
        this.$set(this.isChoose, this.radioBefore, false);
      }
      if (this.isChoose[index]) {
        this.radioBefore = index;
        this.selectIndex[0] = index;
      } else {
        this.radioBefore = -1;
        this.selectIndex = [];
      }
      this.$emit("selectInfo", {
        selectIndex: this.selectIndex,
        data: this.tableData
      });
      this.selectMemory();
    },
    // 多选框点击事件
    chooseCheckbox: function(index) {
      var len = this.tableData.length;
      if (index == -1) {
        this.isChooseAll = !this.isChooseAll;
        if (this.isChooseAll) {
          this.selectIndex = [];
          for (var i = 0; i < len; i++) {
            this.$set(this.isChoose, i, true);
            this.selectIndex.push(i);
          }
        } else {
          for (var i = 0; i < len; i++) {
            this.$set(this.isChoose, i, false);
            this.selectIndex = [];
          }
        }
      } else {
        this.$set(this.isChoose, index, !this.isChoose[index]);
        if (this.isChoose[index]) {
          this.selectIndex.push(index);
          if (this.selectIndex.length == len) {
            this.isChooseAll = true;
          }
        } else {
          let indexOf = this.selectIndex.indexOf(index);
          this.selectIndex.splice(indexOf, 1);
          if (this.selectIndex.length != len) {
            this.isChooseAll = false;
          }
        }
      }
      this.selectmemoryIndex[this.pageNum] = this.selectIndex;
      this.selectmemoryData[this.pageNum] = this.tableData;
      if (this.hasMemory) {
        this.$emit("selectInfo", {
          selectIndex: this.selectmemoryIndex,
          data: this.selectmemoryData
        });
      } else {
        this.$emit("selectInfo", {
          selectIndex: this.selectIndex,
          data: this.tableData
        });
      }
      this.selectMemory();
    },
    // 行点击事件
    chooseRow: function(index) {
      if (this.isChooseRow) {
        if (this.chooseWay == "checkbox") {
          this.chooseCheckbox(index);
        } else if (this.chooseWay == "radio") {
          this.chooseRadio(index);
        }
      }
    },
    // hasMemory为true时执行
    selectMemory: function() {
      if (this.hasMemory) {
        var memory = window.sessionStorage.getItem("memory");
        memory = JSON.parse(memory);
        if (!memory) {
          memory = {};
        }
        if (this.chooseWay == "radio" && this.selectIndex.length != 0) {
          for (let key in memory) {
            delete memory[key];
          }
        }
        memory[this.pageNum] = this.selectIndex;
        var memorys = JSON.stringify(memory);
        window.sessionStorage.setItem("memory", memorys);
      }
    },
    // hasMemory为true选框是否选中
    selected: function(arr) {
      this.selectIndex = arr;
      for (var i = 0; i < arr.length; i++) {
        this.$set(this.isChoose, arr[i], true);
        this.radioBefore = i;
      }
      if (arr.length == this.tableData.length) {
        this.isChooseAll = true;
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHandler);
    window.sessionStorage.removeItem("page");
    window.sessionStorage.removeItem("memory");
  },
  watch: {
    datas: function(newVal, oldVal) {
      this.tableData = newVal;
      this.initArr();
      this.$nextTick(() => {
        this.isShow();
      });
    },
    tableData: function(newVal, oldVal) {
      this.initArr();
      this.$nextTick(() => {
        this.isShow();
      });
    },
    pageNum: function(newVal, oldVal) {
      this.isPageSizeChange = false;
      if (this.pagingWay == "page") {
        this.isChooseAll = false;
        this.isChoose = [];
        this.selectIndex = [];
        this.getData();
        if (this.haveStorage) {
          var pageObj = { pageNum: this.pageNum, pageSize: this.pageSizes };
          var page = JSON.stringify(pageObj);
          window.sessionStorage.setItem("page", page);
        }
      } else {
        this.isChooseAll = false;
        if (!this.hasMemory) {
          this.isChoose = [];
          this.selectIndex = [];
        }
      }
    },
    pageSizes: function(newVal, oldVal) {
      this.isPageSizeChange = true;
      if (this.pagingWay == "page") {
        this.isChooseAll = false;
        this.isChoose = [];
        this.selectIndex = [];
        this.getData();
        this.selected([]);
        if (this.haveStorage) {
          var pageObj = { pageNum: this.pageNum, pageSize: this.pageSizes };
          var page = JSON.stringify(pageObj);
          window.sessionStorage.setItem("page", page);
        }
      }
    }
  },
  filters: {
    //格式化
    formater: (value, data, incomingType, type) => {
      let types = typeof incomingType;
      if (types == "undefined") {
        return value;
      } else if (types == "function") {
        return incomingType(value, data, type);
      } else if (types == "string" && incomingType == "dateFormat") {
        return formatDate(value, type);
      }
    }
  },
  props: {
    titleData: {}, // 表格title数据  overflowEllipsis: true超过显示省略号   overflowTips: true超过显示省略号且可查看详情
    datas: {}, // 表格内容数据
    chooseWay: {
      default: ""
    }, // checkbox 多选   radio 单选  默认不存在
    isChooseRow: {
      default: true
    }, // 是否可以通过行选中数据
    ajaxData: {
      default: false
    },
    url: {},
    pageSize: {
      default: 20
    },
    limits: {
      default: () => [10, 20, 30, 40, 50]
    },
    params: {},
    method: {
      default: "GET"
    },
    pagingWay: {
      default: "page"
    }, // flow 流加载  page 分页加载
    haveStorage: {
      default: false
    }, // 分页加载是否记住当前页
    hasMemory: {
      default: false
    } // 是否记住选中项
  }
};
</script>

<style>
.radio-selected {
  background-color: #1188dd;
  border: none !important;
}

.radio {
  cursor: pointer;
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 7px;
  border: 1px solid #aaaaaa;
}

.radio .icon {
  position: absolute;
  left: 0px;
  top: 0px;
  color: #ffffff;
}

.table {
  width: 100%;
  height: 100%;
}

.table-header {
  display: flex;
  justify-content: flex-start;
  height: 38px;
  border-bottom: 1px solid #e9ecef;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-start-center {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.split-line {
  width: 1px;
  height: 22px;
}

.table-body {
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.he138 {
  height: calc(100% - 138px);
}

.he38 {
  height: calc(100% - 38px);
}

.table-body-row {
  min-height: 41px;
}

.table-body-row:nth-child(odd) {
  background-color: #fff;
}

.table-body-row:nth-child(even) {
  background-color: #f8f9fa;
}

.table-body-row:hover {
  background-color: #f3f5f7 !important;
}

.table-more-icon {
  height: 40px;
  width: 30px;
  text-align: center;
  background-color: white;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}

.tips-inner {
  position: absolute;
  top: 0;
  right: 0;
  background-color: white;
  z-index: 100000;
  border: 1px solid #e9ecef;
  word-wrap: break-word;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
}

.tips-content {
  max-height: 100px;
  padding: 10px;
  word-break: break-all;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 12px;
}
.close-tips-arrow {
  position: absolute;
  right: -3px;
  top: -13px;
  width: 20px;
  height: 20px;
  padding: 3px;
  cursor: pointer;
  background-color: #666;
  border-radius: 50%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* .table-pagination {
  height: 100px;
} */
</style>
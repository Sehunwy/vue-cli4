<template>
  <div class="page">
    <div id="firstPage" class="usePage" :class="[pageNumNow==1?'disablePage':'']" @click="goFirstPage()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-diyiye"></use>
      </svg>
    </div>
    <div id="previousPage" class="usePage" :class="[pageNumNow==1?'disablePage':'']" @click="goPreviousPage()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-shangyiye"></use>
      </svg>
    </div>
    <div class="pageNum">
      <span id="firstJumpPage">{{pageNumNow}}</span>
      <span>/</span>
      <span id="lastJumpPage">{{totalPageNow}}</span>
    </div>
    <div id="nextPage" class="usePage" :class="[pageNumNow==totalPageNow?'disablePage':'']" @click="goNextPage()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-xiayiye"></use>
      </svg>
    </div>
    <div id="lastPage" class="usePage" :class="[pageNumNow==totalPageNow?'disablePage':'']" @click="goLastPage()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-zuihouyiye"></use>
      </svg>
    </div>
    <div class="dividerPage"></div>
    <div class="jumpPage">
      <input id="jumpPageText" type="text" ref="goPage">
    </div>
    <div class="jumpToPage" @click="jumpToPage()">跳转</div>
    <div class="pageSelect">
      <select class="selectOption" v-model="pageSizeNow">
        <option v-for="(limit,index) in limitsNow" :key="index" :value="limit">{{limit}}条/页</option>
      </select>
    </div>
  </div>
</template>

<script>

    export default {
        name: "loongPagination",
        data() {
            return {
                limitsNow: this.limits,
                pageSizeNow: this.pageSize,
                pageNumNow: this.pageNum,
                totalPageNow: Math.ceil(this.total / this.pageSize)
            }
        },
        props: {
            limits: {
                default: [10, 20, 30, 40]
            }, // 每页显示的条数 数组
            pageSize: {
                default: 20
            }, // 每页显示条数 数字
            pageNum: {
                default: 1
            }, // 当前页数
            total: {
                default: 1
            } // 总条数
        },
        methods: {
            // 首页
            goFirstPage: function () {
                if (this.pageNumNow > 1) {
                    this.pageNumNow = 1;
                    this.$emit('pageInfo', {pageNum: this.pageNumNow, pageSize: this.pageSizeNow});
                }
            },
            // 前一页
            goPreviousPage: function () {
                if (this.pageNumNow > 1) {
                    this.pageNumNow--;
                    this.$emit('pageInfo', {pageNum: this.pageNumNow, pageSize: this.pageSizeNow});
                }
            },
            // 最后一页
            goLastPage: function () {
                if (this.pageNumNow < this.totalPageNow) {
                    this.pageNumNow = this.totalPageNow;
                    this.$emit('pageInfo', {pageNum: this.pageNumNow, pageSize: this.pageSizeNow});
                }
            },
            // 后一页
            goNextPage: function () {
                if (this.pageNumNow < this.totalPageNow) {
                    this.pageNumNow++;
                    this.$emit('pageInfo', {pageNum: this.pageNumNow, pageSize: this.pageSizeNow});
                }
            },
            // 跳转页面
            jumpToPage: function () {
                let page = this.$refs.goPage.value;
                if (page < 1) {
                    page = 1;
                } else if (page > this.totalPageNow) {
                    page = this.totalPageNow;
                } else if (isNaN(page)) {
                    page = this.pageNumNow;
                }
                this.pageNumNow = page;
                this.$emit('pageInfo', {pageNum: this.pageNumNow, pageSize: this.pageSizeNow});
            }
        },
        created() {
            this.$emit('pageInfo', {pageNum: this.pageNum, pageSize: this.pageSize});
        },
        watch: {
            pageSizeNow: function (newVal, oldVal) {
                this.totalPageNow = Math.ceil(this.total / newVal)
                this.$nextTick(function () {
                    this.pageNumNow = 1;
                    this.$emit('pageInfo', {pageNum: 1, pageSize: this.pageSizeNow});
                })
            },
            total: function (newVal, oldVal) {
                this.totalPageNow = Math.ceil(newVal / this.pageSize)
                // this.totalPageNow = newVal;
            }
        }
    }
</script>

<style scoped>
  .usePage {
    float: left;
    margin-left: 5px;
    width: 30px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background-color: #EEF7FF;
    color: #1188DD;
    cursor: pointer;
  }

  .disablePage {
    background-color: #F1F3F5;
    color: #999999;
    cursor: no-drop;
  }

  .pageNum {
    float: left;
    padding: 0 10px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    font-size: 12px;
    color: #333333;
  }

  .dividerPage {
    float: left;
    width: 1px;
    height: 28px;
    margin-left: 10px;
    background-color: #E9ECEF;
  }

  .jumpPage {
    float: left;
    margin-left: 15px;
    margin-right: 2px;
  }

  .jumpPage > input {
    border: 1px solid #CED4DA;
    width: 33px;
    height: 26px;
    line-height: 26px;
    border-radius: 4px;
    padding: 0 5px 0 5px;
  }

  .jumpToPage {
    float: left;
    width: 36px;
    height: 28px;
    margin-left: 5px;
    cursor: pointer;
    border-radius: 4px;
    color: #1188DD;
    font-size: 12px;
    line-height: 28px;
    text-align: center;
    background: #EEF7FF;
    font-family: PingFangSC-Regular;
  }

  .pageSelect {
    float: left;
    margin-left: 30px;
    cursor: pointer;
  }

  .selectOption {
    height: 28px;
    width: 90px;
    border: 1px solid #e1e6eb;
    border-radius: 2px;
    font-size: 12px;
    padding-left: 10px;
  }
</style>

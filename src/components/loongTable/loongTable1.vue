<template>
  <div style="width: 100%;height: 100%">
    <div class="table">
      <div class="table-header back-f8f9fa">
        <div class="table-row header-row c9 fs12" ref="headerRow" :style="{height:tableHei,lineHeight:tableHei}">
          <div v-for="(titl,index) in titleData" :key="index" :class="[index==(titleData.length-1)?'':'boder-rig']"
               class="row-details pl20 pr10" :style="{width:dataWid[index]+'px'}">
            <div>
            <span class="fl pl10">
               <!--            多选框-->
            <div v-if="index==0&&chooseWay=='checkbox'&&selectWay=='selectBox'" class="checkbox"
                 :class="isSelect[0]?'select-checkbox':''"
                 @click.stop="setCheckbox(0)" :style="{marginTop: (parseInt(tableHei) - 14)/2 +'px'}">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-gou"></use>
              </svg>
            </div>
              <!--            单选框-->
            <div v-if="index==0&&chooseWay=='radio'&&selectWay=='selectBox'" class="table-radio"
                 style="visibility: hidden" :style="{marginTop: (parseInt(tableHei) - 14)/2 +'px'}">
              <svg class="icon fs14 radio-icon" aria-hidden="true">
                <use xlink:href="#icon-gou"></use>
              </svg>
            </div>
            </span>
              <span class="pl10">
              {{titl.title}}
            </span>
            </div>
          </div>
        </div>
      </div>
      <div class="table-body" ref="bodyRef">
        <div ref="tableBody" style="width: 100%;height: 100%">
          <div v-for="(data,ind) in datas" :key="ind" class="table-row body-row c3 fs12 border-bott"
               :class="[ind%2==0?'back-white':'back-f8f9fa',isSelect[ind+1]&&selectWay=='row'?'table-row-active':'']"
               :style="{height:tableHei,lineHeight:tableHei}" :ref="`row${ind}`"
               @click.stop="setCheckWay(chooseWay,ind+1)">
            <div v-for="(titl,index) in titleData" :key="index" :class="[index==(titleData.length-1)?'':'boder-rig']"
                 class="row-details pl20 pr10" :style="{width:dataWid[index]+'px'}" style="position: relative;"
                 @mouseenter="mouseover(ind,index)" @mouseleave="mouseLeave(ind,index)">
              <!--超过显示可点击图标-->
              <span v-show="iconShow[ind][index]" class="more-icon cursor-pointer" @click.stop="moreClick(ind,index)">
              <svg aria-hidden='true' class="icon">
                <use xlink:href="#icon-iiconfont-angle-up"></use>
              </svg>
            </span>
              <div v-show="isShowMore[ind][index]" class="show-more" :style="{top: moreTop}" @click.stop="">
                <!--超过显示内容-->
                <div v-html="$options.filters.formater(data[titl.name],titl.formater,titl.pattern)"
                     class="more-details" :ref="`showMore${ind}${index}`"></div>
                <!--关闭超过显示内容图标-->
                <span class="details-close cursor-pointer" @click.stop="closeMore(ind,index)">
              <svg aria-hidden='true' class="icon">
                  <use xlink:href="#icon-guanbi2"></use>
                </svg>
            </span>
              </div>
              <!-- 表格显示icon-->
              <span v-if="titl.type=='button'">
                <span v-for="(btn,index) in titl.operations" :key="index" class="pl10 cursor-pointer color-1188dd fs16" :title="btn.text"
                      @click.stop="btn.callBack(ind,data)">
                  <svg aria-hidden='true' class="icon">
                    <use :xlink:href="btn.icon"></use>
                  </svg>
                </span>
              </span>
              <!-- 表格显示内容-->
              <div v-else class="ellip" :ref="`content${ind}${index}`">
              <span class="pl10 fl" v-show="index==0&&selectWay=='selectBox'">
              <!--              多选框-->
              <div v-if="chooseWay=='checkbox'" class="checkbox"
                   :class="isSelect[ind+1]?'select-checkbox':''" :style="{marginTop: (parseInt(tableHei) - 14)/2 +'px'}"
                   @click.stop="setCheckbox(ind+1)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-gou"></use>
                </svg>
              </div>
                <!--            单选框-->
                <div v-if="chooseWay=='radio'" class="table-radio cursor-pointer"
                     :class="isSelect[ind+1]?'select-radio':''" @click.stop="setRadio(ind+1)"
                     :style="{marginTop: (parseInt(tableHei) - 14)/2 +'px'}">
                <svg class="icon fs14 radio-icon" aria-hidden="true">
                  <use xlink:href="#icon-gou"></use>
                </svg>
              </div>
              </span>
                <span class="pl10"
                      v-html="$options.filters.formater(data[titl.name],titl.formater,titl.pattern)"></span>
              </div>
            </div>
          </div>
          <div style="width: 100%;height: 100%" v-show="datas.length==0" class="flex-center">
            <div>
              <img src="@/components/loongTable/img/noData.png" alt="">
              <p class="nodata-txt">暂无数据</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isRequest&&isFlow=='flow'" style="margin-left: calc(50% - 14px);margin-top: 10px">
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
</template>

<script>
    import {formatDate} from '@/views/LoongUI/frame/js/common'  //引入时间格式化js
    import '@/assets/css/load.css';

    export default {
        name: "LoongTable",
        data() {
            return {
                setWid: 0,
                count: 0,
                notWid: [],
                dataWid: [],
                titleWid: 0,
                bodyWid: 0,
                isShowMore: [[]],
                iconShow: [[]],
                reallyShow: [[]],
                pageArr: [],
                dataSelected: [],
                prompt: [-1, -1, -1, -1],
                moreTop: '10px',
                isSelect: [],
                countT: 0,
                countF: 0,
                selectData: [],
                datas: this.data,
                sendData: []
            }
        },
        props: {
            titleData: {}, // 表格title数据
            data: {}, // 表格内容数据
            chooseWay: {
                default: 'checkbox'
            }, // checkbox 多选   radio 单选
            isRequest: {
                default: true
            }, // 流加载 数据是否请求完毕
            isFlow: {
                default: 'page'
            }, // flow 流加载  page 分页加载
            selectWay: {
                default: 'selectBox'
            },// row 行选中   selectBox check选框选中
            tableHei: {
                default: '42px'
            },// table行高
            pageSize: {
                default: 10
            }, // 流加载 每页显示条数
            pageNum: {
                default: 1
            }, // 流加载 当前页数
            hasMemory: {
                default: false
            }, // 分页后选中数据是否记住
            refresh: {
                default: false
            }, // 是否刷新
            minWid: {
                default: '0'
            }
        },
        methods: {
            getWid: function () {
                for (let i in this.titleData) {
                    if (this.titleData[i].width != '' && this.titleData[i].width != undefined) {
                        this.setWid = this.setWid + parseInt(this.titleData[i].width);
                        this.dataWid[i] = parseInt(this.titleData[i].width) - 31;
                    } else {
                        this.count++;
                        this.notWid.push(i)
                    }
                }
            },
            getRemainWid: function (currentWidth, difference) {
                let remainWid = (currentWidth - this.setWid) / this.count - 31;
                for (let index of this.notWid) {
                    this.$set(this.dataWid, index, remainWid);
                }
                this.$set(this.dataWid, this.notWid.length - 1, remainWid - difference);
            },
            arrayInit: function () {
                this.countT = 0;
                this.countF = 0;
                for (let dataI in this.datas) {
                    this.isShowMore[dataI] = [];
                    this.reallyShow[dataI] = [];
                    this.iconShow[dataI] = [];
                    this.isSelect[dataI] = this.isSelect[dataI] || false;
                    if (this.isSelect[dataI] && dataI != 0) {
                        this.countT++;
                    } else if (!this.isSelect[dataI] && dataI != 0) {
                        this.countF++;
                    }
                    for (let titleI in this.titleData) {
                        this.isShowMore[dataI][titleI] = false;
                        this.reallyShow[dataI][titleI] = false;
                        this.iconShow[dataI][titleI] = false;
                    }
                }
                if (this.isSelect[this.datas.length]) {
                    this.countT++;
                } else if (!this.isSelect[this.datas.length]) {
                    this.countF++;
                }
                this.isSelect[this.datas.length] = this.isSelect[this.datas.length];
            },
            isShow: function () {
                let content;
                for (let dataI in this.datas) {
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
            // 鼠标移入事件
            mouseover: function (dataI, titleI) {
                this.$set(this.iconShow[dataI], titleI, this.reallyShow[dataI][titleI]);
                this.iconShow.push();
            },
            // 鼠标移出事件
            mouseLeave: function (dataI, titleI) {
                this.$set(this.iconShow[dataI], titleI, false);
                this.iconShow.push();
            },
            // 点击查看省略信息
            moreClick: function (dataI, titleI) {
                this.prompt[2] = dataI;
                this.prompt[3] = titleI;
                if (this.prompt[0] != -1) {
                    this.$set(this.isShowMore[this.prompt[0]], this.prompt[1], false);
                }
                this.$set(this.isShowMore[dataI], titleI, true);
                this.isShowMore.push();
                this.prompt[0] = dataI;
                this.prompt[1] = titleI;
                this.$nextTick(function () {
                    this.displayPosition(dataI, titleI);
                })
            },
            // 关闭查看更多信息
            closeMore: function (dataI, titleI) {
                this.$set(this.isShowMore[dataI], titleI, false);
                this.isShowMore.push();
            },
            // 查看更多显示位置
            displayPosition: function (dataI, titleI) {
                let showOffHei;
                let offTop;
                let bodyOffHei;
                let scrTop;
                showOffHei = this.$refs[`showMore${dataI}${titleI}`][0].offsetHeight;
                offTop = this.$refs[`row${dataI}`][0].offsetTop;
                bodyOffHei = this.$refs.bodyRef.offsetHeight;
                scrTop = this.$refs.bodyRef.scrollTop;
                if (showOffHei + offTop + 10 > bodyOffHei + scrTop) {
                    this.moreTop = -(showOffHei - 36) + 'px'
                } else {
                    this.moreTop = '10px'
                }
            },
            // 多选框是否选中
            setCheckbox: function (index) {
                let isSelect = !this.isSelect[index];
                let data = [];
                if (index == 0) {
                    this.isSelectAll(isSelect);
                } else {
                    this.$set(this.isSelect, index, isSelect);
                    if (isSelect) {
                        this.countT++;
                        this.countF--;
                        this.selectData.push(this.datas[index - 1]);
                    } else {
                        this.countT--;
                        this.countF++;
                        let subscript = this.selectData.indexOf(this.selectData[index - 1]);
                        this.selectData.splice(subscript, 1);
                    }
                    if (this.countT == (this.isSelect.length - 1) || this.countF == (this.isSelect.length - 1)) {
                        this.isSelectAll(isSelect);
                    } else {
                        this.$set(this.isSelect, 0, false);
                    }
                }
                if (this.isFlow == "page") {
                    [...this.pageArr[this.pageNum]] = this.isSelect;
                    [...this.dataSelected[this.pageNum]] = this.selectData;
                    for (let i = 0; i < this.dataSelected.length; i++) {
                        if (this.dataSelected[i] != undefined) {
                            for (let j = 0; j < this.dataSelected[i].length; j++) {
                                data.push(this.dataSelected[i][j])
                            }
                        }
                    }
                    this.$emit('selectData', data);
                    this.sendData = data;
                } else {
                    this.$emit('selectData', this.selectData);
                    this.sendData = this.selectData;
                }
            },
            isSelectAll: function (isSelect) {
                if (isSelect) {
                    this.selectData = JSON.parse(JSON.stringify(this.datas));
                    this.countT = (this.isSelect.length - 1);
                    this.countF = 0;
                } else {
                    this.selectData = [];
                    this.countF = (this.isSelect.length - 1);
                    this.countT = 0;
                }
                for (let i = 0; i < this.isSelect.length; i++) {
                    this.$set(this.isSelect, i, isSelect);
                }
            },
            // 单选框是否选中
            setRadio: function (index) {
                let isSelect = !this.isSelect[index];
                if (isSelect) {
                    this.selectData = this.datas[index - 1];
                    if (this.countT != 0) {
                        this.$set(this.isSelect, this.countT, false);
                    }
                    this.countT = index;
                } else {
                    this.countT = 0;
                    this.selectData = [];
                }
                this.$set(this.isSelect, index, isSelect);
                this.$emit('selectData', this.selectData);
                this.sendData = this.selectData;
                if (this.isFlow == "page") {
                    for (let i in this.pageArr) {
                        if (this.pageArr[i] != undefined) {
                            for (let j in this.pageArr[i]) {
                                this.pageArr[i][j] = false;
                            }
                        }
                    }
                    [...this.pageArr[this.pageNum]] = this.isSelect;
                }
            },
            // 行选中
            setCheckWay: function (way, index) {
                if (way == "checkbox") {
                    this.setCheckbox(index)
                } else if (way == "radio") {
                    this.setRadio(index);
                }
            }
        },
        created() {
            this.getWid();
            this.arrayInit();
        },
        mounted() {
            let _this = this;
            let page;
            this.titleWid = this.$refs.headerRow.offsetWidth;
            this.bodyWid = this.$refs.tableBody.offsetWidth;
            window.onresize = () => {
                this.titleWid = this.$refs.headerRow.offsetWidth;
                this.bodyWid = this.$refs.tableBody.offsetWidth;
            };
            this.$refs.bodyRef.onscroll = () => {
                if (_this.prompt[0] != -1) {
                    this.displayPosition(this.prompt[0], this.prompt[1]);
                }
                if (this.isFlow == 'flow') {
                    let bodyOffHei = this.$refs.bodyRef.offsetHeight;
                    let scrTop = this.$refs.bodyRef.scrollTop;
                    let scrHei = this.$refs.bodyRef.scrollHeight;
                    if (scrHei == bodyOffHei + scrTop || scrHei + 17 == bodyOffHei + scrTop) {
                        if (this.pageNum != undefined) {
                            page = this.pageNum;
                            page = page + 1;
                            this.$emit('tablePageNum', {pageNum: page, pageSize: this.pageSize});
                        }
                    }
                }
            };
            this.$nextTick(function () {
                this.isShow();
            });
        },
        filters: {
            //时间格式化
            formater: function (value, incomingType, type) {
                let types = typeof incomingType;
                if (types == "undefined") {
                    return value;
                } else if (types == "function") {
                    return incomingType(value, type);
                } else if (types == "string" && incomingType == "dateFormat") {
                    return formatDate(value, type);
                }
            }
        },
        watch: {
            titleWid: function (newVal, oldVal) {
                let difference = newVal - this.bodyWid;
                this.getRemainWid(newVal, difference);
                this.$nextTick(function () {
                    this.isShow();
                })
            },
            data: function (newVal, oldVal) {
                this.prompt = [-1, -1, -1, -1];
                if (this.isFlow == 'flow') {
                    if (this.data.length != 0) {
                        this.isSelect[0] = false;
                        if (this.refresh || this.pageNum == 1) {
                            this.$refs.bodyRef.scrollTop = 0;
                            this.datas = this.data;
                        } else {
                            this.datas = this.datas.concat(this.data);
                        }
                    }
                } else {
                    this.selectData = [];
                    this.datas = this.data;
                    if (this.pageArr[this.pageNum] == undefined) {
                        for (let i in this.isSelect) {
                            this.isSelect[i] = false
                        }
                    } else {
                        this.isSelect = this.pageArr[this.pageNum];
                    }
                }
                if (!this.hasMemory || this.refresh) {
                    this.isSelect = [];
                    this.countT = 0;
                    this.countF = 0;
                    this.selectData = [];
                    this.pageArr = [];
                    this.dataSelected = [];
                    this.sendData = [];
                }
                this.$emit('selectData', this.sendData);
                this.arrayInit();
                this.$nextTick(function () {
                    this.titleWid = this.$refs.headerRow.offsetWidth;
                    this.bodyWid = this.$refs.tableBody.offsetWidth;
                    let difference = this.titleWid - this.bodyWid;
                    this.getRemainWid(this.titleWid, difference);
                    this.isShow();
                })
            }
        }
    }
</script>

<style scoped>
  .nodata-txt {
    font-size: 12px;
    font-weight: 400;
    color: #999;
    line-height: 17px;
    padding-top: 10px;
    text-align: center;
  }

  .back-f8f9fa {
    background-color: #f8f9fa;
  }

  .boder-rig {
    border-right: 1px solid #e9ecef;
  }

  .border-bott {
    border-bottom: 1px solid #E9ECEF;;
  }

  .table {
    width: 100%;
    height: calc(100% - 30px);
    /* overflow-x: auto; */
    overflow-y: hidden;
    /* overflow: hidden; */
  }

  .table-row:hover {
    background-color: #F3F5F7 !important;
  }

  .table-row-active {
    background-color: #EEF7FF;
    color: #1188DD;
    cursor: pointer
  }

  .table-header {
    border-bottom: 1px solid #E9ECEF;
    border-top: 1px solid #E9ECEF;
  }

  .header-row {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .table-body {
    height: calc(100% - 38px);
    overflow-y: auto;
    position: relative;
  }

  .body-row {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .more-icon {
    position: absolute;
    right: 0px;
    border-left: 1px solid #e9ecef;
    background-color: #F3F5F7
  }

  .more-details {
    position: absolute;
    left: -21px;
    width: calc(100% + 21px);
    min-height: 38px;
    max-height: 152px;
    line-height: 38px;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
    padding: 4px;
    z-index: 2;
    overflow-y: auto;
    -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, .4);
    -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, .4);
    box-shadow: 5px 5px 5px rgba(0, 0, 0, .4);
  }

  .details-close {
    position: absolute;
    font-size: 20px;
    right: -20px;
    top: -10px;
    line-height: 20px;
    z-index: 3;
  }

  .show-more {
    position: relative;
  }

  /* .table-checkbox {
    width: 12px;
    height: 12px;
    border: 1px solid #ccc;
    float: left;
    border-radius: 2px;
    line-height: 14px;
    color: #fff;
    cursor: pointer;
    text-align: center;
    font-size: 14px;
  } */

  .select-checkbox {
    width: 14px;
    height: 14px;
    border: none;
    background-color: #1188dd;
  }

  .table-radio {
    position: relative;
    float: left;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid #AAAAAA;
    color: #ffffff;
  }

  .radio-icon {
    position: absolute;
    left: -1px;
    top: -1px
  }

  .select-radio {
    width: 14px;
    height: 14px;
    border: none;
    background-color: #1188dd;
  }
</style>

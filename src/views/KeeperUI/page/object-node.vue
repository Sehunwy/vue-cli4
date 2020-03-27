<template>
  <div class="main-right">
    <div class="min-width-970 height100">
      <div class="clearfix pl20 pt10 pb10 pr20" ref="list">
        <div class="fl mr10">
          <div class="btn-opr" @click="addObject()">{{doI18n('btn_add')}}</div>
        </div>
        <div class="fl mr10">
          <div class="btn-opr" name="del-object">{{doI18n('btn_delete')}}</div>
        </div>
        <div class="fl mr10">
          <div class="btn-opr" name="start-object">{{doI18n('btn_start')}}</div>
        </div>
        <div class="fl mr10">
          <div class="btn-opr" name="stop-object">{{doI18n('btn_stop')}}</div>
        </div>
        <div class="fr">
          <loongQuery placeholderText="请搜索对象节点编号或IP" searchWid="290px" @searchInput="searchInput"></loongQuery>
        </div>
      </div>
      <div class="object-list" ref="list">
        <loongTable
          :titleData="title"
          :datas="list"
          :ajaxData="true"
          chooseWay="checkbox"
          @selectInfo="selectInfo"
          url="http://13.15.11.34:3000/getNodelist"
        >
          <span
            slot="slot-info"
            slot-scope="props"
            class="hand color-blue pr10"
            @mouseover="mouseover(props.infos.ips,`more${props.infos.number}`,props.infos.number)"
            @mouseleave="mouseLeave(props.infos.number)"
            :ref="`more${props.infos.number}`"
          >{{props.infos.ips.length>5?doI18n("keeper_view_remaining_item",props.infos.ips.length-5):''}}</span>
          <div slot="slot-component" slot-scope="props">
            <loongBalloonTip
              :tipTitle="tipTitle"
              tipPlacement="right"
              :elementInfo="elementInfo"
              :isShowTip="isShowTip[props.infos.number]"
            ></loongBalloonTip>
          </div>
        </loongTable>
      </div>
    </div>
    <loongDialog
      modalType="max"
      widthDialog="860px"
      :title="doI18n('keeper_create_node')"
      :isShowDialog="isShowDialog"
      @setShow="setShow"
    >
      <div
        slot="slot-title"
        ref="promptIinfo"
        class="hand ml10"
        @mouseover="mouseoverPrompt()"
        @mouseleave="mouseLeavePrompt()"
      >
        <svg class="icon fs14">
          <use xlink:href="#icon-wenhaobangzhu" />
        </svg>
      </div>
      <div slot="slot-component">
        <loongBalloonTip
          :tipTitle="doI18n('keeper_create_info')"
          tipPlacement="right"
          :elementInfo="elementDialog"
          :isShowTip="isShowTipDialog"
          widthTip="800px"
        ></loongBalloonTip>
      </div>
      <div slot="slot-content" style="width:100%;height:100%">
        <div class="pl20 pt10 pb10">
          <loongQuery placeholderText="请搜索对象节点编号或IP" searchWid="290px" @searchInput="searchInput"></loongQuery>
        </div>
        <div style="height: calc(100% - 52px)">
          <loongTable
            :titleData="dialogTitle"
            :ajaxData="true"
            chooseWay="checkbox"
            @selectInfo="dialogSelectInfo"
            url="http://13.15.11.34:3000/getNodelist"
          >

          </loongTable>
        </div>
      </div>
    </loongDialog>
  </div>
</template>

<script>
import axios from "axios";
import loongTable from "@/components/loongTable/loongTable";
import loongBalloonTip from "@/components/loongBalloonTip/loongBalloonTip";
import loongDialog from "@/components/loongDialog/loongDialog";
import loongQuery from "@/components/loongQuery/loongQuery";
import Vue from "vue";
export default {
  name: "object-node",
  data() {
    return {
      list: [],
      elementInfo: "",
      moreInfos: "",
      tipTitle: "",
      isShowTip: [],
      isShowTipDialog: false,
      elementDialog: "",
      isShowDialog: false,
      title: [
        {
          name: "number",
          title: this.doI18n("keeper_node_number"),
          width: "150px",
          overflowEllipsis: true
        },
        {
          name: "ips",
          title: "IP",
          isShowSlot: true,
          formater: data => {
            var $div = "";
            var dataLen = data.length;
            var len = dataLen > 5 ? 5 : dataLen;
            for (var i = 0; i < len; i++) {
              $div =
                $div +
                '<div style="width:100px" class="fl">' +
                data[i] +
                "</div>";
            }
            return $div;
          }
        },
        {
          name: "serviceStatus",
          title: this.doI18n("keeper_service_status"),
          width: "120px",
          formater: data => {
            var $span = "";
            if (data) {
              $span = `<span class="fs16 c22cc22" style="font-size:16px" title="${this.doI18n(
                "keeper_started"
              )}"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-yunhang"></use>'</svg></span>`;
            } else {
              $span = `<span class="fs16 c9" title="${this.doI18n(
                "keeper_stopped"
              )}"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-zanting"></use>'</svg></span>`;
            }
            return $span;
          }
        },
        {
          name: "operation",
          title: this.doI18n("btn_operation"),
          type: "button",
          width: "90px",
          operations: [
            {
              text: this.doI18n("btn_modify"),
              icon: "#icon-xiugai",
              callBack: function(index, data) {
                console.log(index, data);
              }
            }
          ]
        }
      ],
      dialogTitle: [
        {
          name: "number",
          title: this.doI18n("keeper_server_id"),
          width: "150px",
        },
         {
          name: "ips",
          title: this.doI18n("keeper_optional_node_ip"),
        },
         {
          name: "service",
          title: this.doI18n("keeper_running_service"),
          width: "150px",
        }
      ]
    };
  },
  created() {
    axios({
      method: "GET",
      url: "http://13.15.11.34:3000/getlist",
      params: {
        pageSize: 10,
        pageNum: 1
      }
    })
      .then(res => {
        // this.list = res.data.data;
        // console.log(this.list);
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    selectInfo: function(data) {
      console.log(data);
    },
    searchInput: function(data) {
      console.log(data);
    },
    mouseover: function(data, ref, number) {
      var str = "";
      for (var i = 5; i < data.length; i++) {
        str = str + data[i] + "</br>";
      }
      this.elementInfo = this.$refs[ref];
      this.$set(this.isShowTip, number, true);
      this.tipTitle = str;
    },
    mouseLeave: function(number) {
      this.$set(this.isShowTip, number, false);
    },
    mouseoverPrompt: function() {
      this.isShowTipDialog = true;
      this.elementDialog = this.$refs.promptIinfo;
    },
    mouseLeavePrompt: function() {
      this.isShowTipDialog = false;
    },
    addObject: function() {
      this.isShowDialog = true;
    },
    setShow: function(data) {
      this.isShowDialog = data;
    }
  },
  components: {
    loongTable,
    loongBalloonTip,
    loongDialog,
    loongQuery
  },
  watch: {
    $route(to, from) {
      console.log(to, from);
    }
  }
};
</script>

<style>
.object-list {
  height: calc(100% - 52px);
  width: 100%;
}

.c22cc22 {
  color: #22cc22;
}
</style>
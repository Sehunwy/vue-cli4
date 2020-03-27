<template>
  <div class="main-right">
    <div class="min-width-970 height100">
      <div class="clearfix pl20 pt10 pb10 pr20">
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
          <loongQuery
            :placeholderText="doI18n('keeper_search_number_ip')"
            searchWid="290px"
            @searchInput="searchInput"
          ></loongQuery>
        </div>
      </div>
      <div class="object-list">
        <loongTable
          :titleData="title"
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
  </div>
</template>

<script>
import loongTable from "@/components/loongTable/loongTable";
import loongBalloonTip from "@/components/loongBalloonTip/loongBalloonTip";
import loongQuery from "@/components/loongQuery/loongQuery";
export default {
  name: "object-node",
  data() {
    return {
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
      elementInfo: "",
      tipTitle: "",
      isShowTip: [],
    };
  },
  methods: {
    // 搜索框输入数据
    searchInput: function(data) {},
    // 表格选中数据
    selectInfo: function(data) {},
    // 鼠标移入显示气泡组件
    mouseover: function(data, ref, number) {
      var str = "";
      for (var i = 5; i < data.length; i++) {
        str = str + data[i] + "</br>";
      }
      this.elementInfo = this.$refs[ref];
      this.$set(this.isShowTip, number, true);
      this.tipTitle = str;
    },
    // 鼠标移出气泡组件消失
    mouseLeave: function(number) {
      this.$set(this.isShowTip, number, false);
    }
  },
  components: {
    loongTable,
    loongBalloonTip,
    loongQuery
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
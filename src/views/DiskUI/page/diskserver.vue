<template>
  <div>
    <div class="disk-server-right">
      <div class="main-right ohy">
        <div class="main-min-width">
          <div class="clearfix pl20 pt10 pb10" name="btn-list">
            <div class="fl mr10 btn-opr" name="addDiskServer" data-i18n-code="btn_add">{{doI18n('btn_add')}}</div>
            <div class="fl mr10 btn-opr no-click" name="delDiskServer" data-i18n-code="btn_delete">{{doI18n('btn_delete')}}</div>
            <div class="fl mr10 btn-opr no-click" name="startDiskServer" data-i18n-code="btn_start">{{doI18n('btn_start')}}</div>
            <div class="fl mr10 btn-opr no-click" name="stopDiskServer" data-i18n-code="btn_stop">{{doI18n('btn_stop')}}</div>
            <div class="fl mr10 btn-opr pr no-click" name="dbOper">
              <span data-i18n-code="disk_btn_db_oper">{{doI18n('disk_btn_db_oper')}}</span>
              <div class="more-btns">
                <div class="pl10 pr10 hand" name="addDB">
                  <span class="fs12" data-i18n-code="disk_btn_set">{{doI18n('disk_btn_set')}}</span>
                </div>
                <div class="pl10 pr10 hand" name="delDB">
                  <span class="fs12" data-i18n-code="disk_btn_del">{{doI18n('disk_btn_del')}}</span>
                </div>
              </div>
            </div>
            <div
              class="fl mr10 btn-opr no-click"
              name="updateIPMappings"
              data-i18n-code="disk_btn_update_ipmapping"
            >{{doI18n('disk_btn_update_ipmapping')}}</div>
            <div class="fl mr10 mt5 split-line"></div>
            <div class="fl mr10 btn-opr no-click" name="downloadKey" data-i18n-code="disk_btn_key">{{doI18n('disk_btn_key')}}</div>
            <div class="fl mr10 btn-opr no-click" name="setAuth" data-i18n-code="disk_btn_auth">{{doI18n('disk_btn_auth')}}</div>
          </div>
          <div class="clearfix height100">
            <div id="disk-server-list" class="height100"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="dn add-service-con">
      <form name="addServiceForm">
        <div class="pt30 clearfix">
          <div class="fl lh32">
            <label
              class="input-label-right fs12 c6 pl10 pr"
              name="ips"
              data-i18n-code="disk_server_first_server_ip"
            >{{doI18n('disk_server_first_server_ip')}}</label>
          </div>
          <div class="fl pr">
            <div class="get-ip-select"></div>
          </div>
        </div>
        <div class="pt15 clearfix">
          <div class="fl lh32">
            <label
              class="input-label-right fs12 c6 pl10 pr"
              name="hasDB"
              data-i18n-code="disk_server_has_db"
            >{{doI18n('disk_server_has_db')}}</label>
          </div>
          <div class="pr fl pr50 lh32">
            <span class="fl c6 pl10 fs12 init_has_db" name="hasDB" data-i18n-code="disk_yes">{{doI18n('disk_yes')}}</span>
          </div>
        </div>
      </form>
    </div>

    <div class="dn add-server-con">
      <form name="addServerForm">
        <div class="pt30 clearfix">
          <div class="fl lh32">
            <label
              class="input-label-right fs12 c6 pl10 pr"
              name="ips"
              data-i18n-code="disk_server_master_ip"
            >{{doI18n('disk_server_master_ip')}}</label>
          </div>
          <div class="pr fl pr50" name="input-way">
            <input
              class="input-common pr25 fl"
              name="ip"
              valids="required ipv4"
              data-msg="{'required':'disk_server_master_ip'}"
            />
          </div>
          <!-- <div class="pr fl pr50 dn" name="select-way">
               <div class="pms-select fl"></div>
          </div>-->
          <!-- <div class="fl lh32 ml10 hand in-way" name="toogle-icon">
               <svg class="icon fs18" aria-hidden="true"><use xlink:href="#icon-zhijiexuanqu" style='color:#1188dd;'></use></svg>
          </div>-->
        </div>
        <div class="pt15 clearfix">
          <div class="fl lh32">
            <label
              class="input-label-right fs12 c6 pl10 pr"
              name="mapIPs"
              data-i18n-code="disk_server_ip_map"
            >{{doI18n('disk_server_ip_map')}}</label>
          </div>
          <div class="pr fl pr50">
            <input
              class="input-common pr25 fl"
              name="mapIPs"
              valids="diskIpComma diskIpHasZero ipList ipListRepeat"
              data-msg
            />
          </div>
        </div>
        <div class="pt15 clearfix">
          <div class="fl lh32">
            <label
              class="input-label-right fs12 c6 pl10 pr"
              name="hasDB"
              data-i18n-code="disk_server_has_db"
            >{{doI18n('disk_server_has_db')}}</label>
          </div>
          <div class="fl pr">
            <div class="has-db-select"></div>
          </div>
        </div>
      </form>
    </div>

    <div class="dn upadte-ipmapping-con">
      <form name="updateIpMappingsForm">
        <div class="pt30 clearfix">
          <div class="fl lh32">
            <label
              class="input-label-right fs12 c6 pl10 pr"
              name="ips"
              data-i18n-code="disk_server_master_ip"
            >{{doI18n('disk_server_master_ip')}}</label>
          </div>
          <div class="pr fl pr50 lh32">
            <span class="fl c6 pl10 fs12 update_ipmappings_ip" name="ip"></span>
          </div>
        </div>
        <div class="pt15 clearfix">
          <div class="fl lh32">
            <label
              class="input-label-right fs12 c6 pl10 pr"
              name="mapIPs"
              data-i18n-code="disk_server_ip_map"
            >{{doI18n('disk_server_ip_map')}}</label>
          </div>
          <div class="pr fl pr50">
            <input
              class="input-common pr25 fl update_ipmappings"
              name="mapIPs"
              valids="diskIpComma diskIpHasZero ipList ipListRepeat"
              data-msg
            />
          </div>
        </div>
      </form>
    </div>

    <div class="dn set-auth-con">
      <form name="setAuthForm">
        <div class="pt30 clearfix fs12">
          <div class="fl lh32">
            <label class="input-label-right c6 pl10">
              <span data-i18n-code="disk_server_select_license_label">{{doI18n('disk_server_select_license_label')}}</span>
            </label>
          </div>
          <div class="fl pr pr50">
            <div class="license-file-edited">
              <div class="select-license-file" data-i18n-code="disk_server_select_license_file">{{doI18n('disk_server_select_license_file')}}</div>
              <div class="select-license-icon">
                <input type="file" name="licenseFile" />
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-wenjianliulan" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="no-service dn">
      <div class="no-service-icon">
        <img src="@/views/DiskUI/image/no-node.png" />
      </div>
      <div class="no-service-txt" data-i18n-code="disk_server_current_no_services">{{doI18n('disk_server_current_no_services')}}</div>
      <div class="flex">
        <div class="add-service-btn hand" data-i18n-code="disk_server_add_service">{{doI18n('disk_server_add_service')}}</div>
      </div>
    </div>

    <iframe src="about:blank" class="dn" name="blankIframe"></iframe>
  </div>
</template>

<script>
// <link rel="stylesheet" href="/DiskUI/css/diskserver.css">
import {diskserver} from '@/views/DiskUI/js/diskserver.js'
import '@/views/DiskUI/js/disk_common.js'
import '@/views/DiskUI/css/diskserver.css'
export default {
  name: "diskserver",
  mounted() {
    diskserver()
  }
};
</script>

<style>
</style>
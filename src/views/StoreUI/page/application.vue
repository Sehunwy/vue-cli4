<template>
  <div>
    <div class="main-right ohy">
      <div class="app-min-width">
        <div class="opr-list">
          <div class="fl mr10 pt10 pb10">
            <div class="btn-opr" name="add-app" data-i18n-code="btn_add">{{doI18n('btn_add')}}</div>
          </div>
          <div class="fl mr10 pt10 pb10">
            <div class="btn-opr" name="set-app" data-i18n-code="btn_set">{{doI18n('btn_set')}}</div>
          </div>
          <div class="fl mr10 pt10 pb10">
            <div class="btn-opr" name="del-app" data-i18n-code="btn_delete">{{doI18n('btn_delete')}}</div>
          </div>
          <div class="fl mr10 pt15 pb15">
            <div class="split-line"></div>
          </div>
          <div class="fl mr10 mt10 mb10 pr">
            <div class="btn-opr" name="start-app" data-i18n-code="btn_start">{{doI18n('btn_start')}}</div>
            <ul class="drop-btn-list dn" name="start-app">
              <li class="btn-item" name="one-app" data-i18n-code="store_common_client">{{doI18n('store_common_client')}}</li>
              <li class="btn-item" name="all-app" data-i18n-code="store_appmgr_all_client">{{doI18n('store_appmgr_all_client')}}</li>
            </ul>
          </div>
          <div class="fl mr10 mt10 mb10 pr">
            <div class="btn-opr" name="stop-app" data-i18n-code="btn_stop">{{doI18n('btn_stop')}}</div>
            <ul class="drop-btn-list dn" name="stop-app">
              <li class="btn-item" name="one-app" data-i18n-code="store_common_client">{{doI18n('store_common_client')}}</li>
              <li class="btn-item" name="all-app" data-i18n-code="store_appmgr_all_client">{{doI18n('store_appmgr_all_client')}}</li>
            </ul>
          </div>
          <div class="fl mr10 pt15 pb15">
            <div class="split-line"></div>
          </div>
          <div class="fl mr10 mt10 mb10 pr">
            <div class="btn-opr" name="lock-app" data-i18n-code="btn_lock">{{doI18n('btn_lock')}}</div>
            <ul class="drop-btn-list dn" name="lock-app">
              <li class="btn-item" name="one-app" data-i18n-code="store_common_client">{{doI18n('store_common_client')}}</li>
              <li class="btn-item" name="all-app" data-i18n-code="store_appmgr_all_client">{{doI18n('store_appmgr_all_client')}}</li>
            </ul>
          </div>
          <div class="fl mr10 mt10 mb10 pr">
            <div class="btn-opr" name="unlock-app" data-i18n-code="btn_unlock">{{doI18n('btn_unlock')}}</div>
            <ul class="drop-btn-list dn" name="unlock-app">
              <li class="btn-item" name="one-app" data-i18n-code="store_common_client">{{doI18n('store_common_client')}}</li>
              <li class="btn-item" name="all-app" data-i18n-code="store_appmgr_all_client">{{doI18n('store_appmgr_all_client')}}</li>
            </ul>
          </div>
          <div class="fl mr10 pt15 pb15">
            <div class="split-line"></div>
          </div>
          <div class="fl mr10 pt10 pb10">
            <div class="btn-opr" name="auto-app" data-i18n-code="btn_store_auto">{{doI18n('btn_store_auto')}}</div>
          </div>
          <div class="fl mr10 pt10 pb10">
            <div class="btn-opr" name="no-auto-app" data-i18n-code="btn_store_no_auto">{{doI18n('btn_store_no_auto')}}</div>
          </div>
          <!-- <div class="fl mr10 pt10 pb10">
                <div class="btn-opr" name="monitor-app" data-i18n-code="btn_store_monitor"></div>
          </div>-->
          <div class="fl mr10 pt10 pb10 dn">
            <div class="btn-opr" name="role-app" data-i18n-code="store_appmgr_role_app">{{doI18n('store_appmgr_role_app')}}</div>
          </div>
          <div class="fl mr10 pt15 pb15">
            <div class="split-line"></div>
          </div>
          <div class="fl mr10 mt10 mb10 pr">
            <div class="btn-opr" name="more">···</div>
            <ul class="drop-btn-list dn">
              <li class="btn-item" name="monitor-app" data-i18n-code="btn_store_monitor">{{doI18n('btn_store_monitor')}}</li>
              <li class="btn-item" name="set-dir" data-i18n-code="btn_store_real_path">{{doI18n('btn_store_real_path')}}</li>
            </ul>
          </div>
          <div class="fl mr10 pt10 pb10">
            <div class="btn-opr" name="refresh-app" data-i18n-code="btn_fresh">{{doI18n('btn_fresh')}}</div>
          </div>

          <div class="fr ip-search-box pt10 pb10"></div>
        </div>
        <div class="app-table-wrap"></div>
      </div>
    </div>
    <div class="dialog-content dn" name="add-app-con">
      <form class="add-app-form">
        <div class="pl10 pr10">
          <div class="mt30 clearfix">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="store_appmgr_ip">{{doI18n('store_appmgr_ip')}}</label>
            </div>
            <div class="fl pr">
              <input
                class="input-common"
                name="ip"
                valids="required ipList ipListRepeat"
                data-msg="{required:'store_appmgr_host_address'}"
              />
              <div
                class="text-tip pt5 ipTip toe tip-width"
                title="store_common_multi_add_ip_tip"
                data-i18n-code="store_common_multi_add_ip_tip"
              >{{doI18n('store_common_multi_add_ip_tip')}}</div>
            </div>
          </div>
          <div class="mt15 clearfix">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="store_appmgr_mount_dir">{{doI18n('store_appmgr_mount_dir')}}</label>
            </div>
            <div class="fl pr">
              <input
                class="input-common"
                name="mountdir"
                valids="required path lengthRange"
                data-msg="{required:'store_appmgr_mount_dir',lengthRange:[1,254]}"
              />
            </div>
          </div>
          <div class="mt15 clearfix add-app-path">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="store_appmgr_real_path">{{doI18n('store_appmgr_real_path')}}</label>
            </div>
            <div class="fl pr">
              <div class="set-dir-path">
                <input
                  class="input-common"
                  name="subDir"
                  valids="required sysPath lengthRange"
                  data-msg="{required:'store_appmgr_real_path',lengthRange:[1,254]}"
                />
                <div name="browse-file-icon">
                  <svg class="icon vem" aria-hidden="true">
                    <use xlink:href="#icon-wenjianliulan" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="mt15 clearfix add-app-role dn">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="store_appmgr_role">{{doI18n('store_appmgr_role')}}</label>
            </div>
            <div class="fl pr">
              <div class="role-app-select"></div>
            </div>
            <div
              class="btn-opr ml10"
              name="role-app-management"
              data-i18n-code="store_appmgr_role_app"
            >{{doI18n('store_appmgr_role_app')}}</div>
          </div>
          <div class="mt15 clearfix">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="store_appmgr_monitor_switch">{{doI18n('store_appmgr_monitor_switch')}}</label>
            </div>
            <div class="fl app-monitor-switch-box"></div>
          </div>
          <div class="mt15 clearfix">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="store_appmgr_remark">{{doI18n('store_appmgr_remark')}}</label>
            </div>
            <div class="fl pr">
              <input
                class="input-common"
                name="comment"
                valids="detail"
                data-msg="{detail:'store_appmgr_remark'}"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="dialog-content dn" name="set-app-con">
      <div class="pl20 border-bottom-gray ip-text">
        <span class="fs14 c9 mr10" data-i18n-code="store_appmgr_ip">{{doI18n('store_appmgr_ip')}}</span>
        <span class="fs14 c3 app-ip"></span>
      </div>
      <div class="pl10 pr10 pt20 pb20">
        <!--<div class="clearfix">
            <div class="fl">
                <label class="input-label-right" data-i18n-code="store_app_log_track"></label>
            </div>
            <div class="fl">
                <div class="check-tab-list clearfix">
                    <div class="fl mr10 mb10">
                        <div class="check-tab" data-i18n-code="store_app_create_dir"></div>
                    </div>
                    <div class="fl mr10 mb10">
                        <div class="check-tab" data-i18n-code="store_app_create_file"></div>
                    </div>
                    <div class="fl mr10 mb10">
                        <div class="check-tab" data-i18n-code="store_app_update_file"></div>
                    </div>
                    <div class="fl mr10 mb10">
                        <div class="check-tab" data-i18n-code="store_app_rename_file"></div>
                    </div>
                    <div class="fl mr10 mb10">
                        <div class="check-tab" data-i18n-code="store_app_delete_file"></div>
                    </div>
                    <div class="fl mr10 mb10">
                        <div class="check-tab" data-i18n-code="store_app_sym_link"></div>
                    </div>
                </div>

            </div>
        </div>-->
        <form class="set-app-form">
          <input type="hidden" name="id" />
          <div class="clearfix set-app-path">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="store_appmgr_real_path">{{doI18n('store_appmgr_real_path')}}</label>
            </div>
            <div class="fl pr">
              <div class="set-dir-path">
                <input
                  type="text"
                  name="subDir"
                  class="input-common pr20"
                  valids="required sysPath lengthRange"
                  data-msg="{required:'store_appmgr_real_path',lengthRange:[1,254]}"
                />
                <div name="browse-file-icon">
                  <svg class="icon vem" aria-hidden="true">
                    <use xlink:href="#icon-wenjianliulan" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="clearfix set-app-role dn">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="store_appmgr_role">{{doI18n('store_appmgr_role')}}</label>
            </div>
            <div class="fl pr">
              <div class="role-app-select"></div>
            </div>
          </div>
          <!--<div class="clearfix mt15">
                <div class="fl">
                    <label class="input-label-right" data-i18n-code="store_app_white_list"></label>
                </div>
                <div class="fl">
                    <div class="list-switch-box"></div>
                </div>
            </div>
            <div class="clearfix mt15">
                <div class="fl">
                    <label class="input-label-right" data-i18n-code="store_app_storage_limit"></label>
                </div>
                <div class="fl">
                    <div class="storage-switch-box"></div>
                </div>
                <div class="fl ml20 storage-limit">
                    <div class="mr10 fl pr">
                        <input class="input-common" name="size" style="width:199px" valids="required positive maxRange" data-msg="{required:'store_app_storage_limit', maxRange:[1,1024]}" />
                    </div>
                    <div class="storage-select-box fl"></div>
                </div>
          </div>-->
          <div class="mt15 clearfix" name="switch">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="store_appmgr_monitor_switch">{{doI18n('store_appmgr_monitor_switch')}}</label>
            </div>
            <div class="fl app-monitor-switch-box"></div>
          </div>
          <div class="clearfix mt15">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="store_appmgr_remark">{{doI18n('store_appmgr_remark')}}</label>
            </div>
            <div class="fl pr">
              <input
                class="input-common"
                name="comment"
                valids="detail"
                data-msg="{'detail':'store_appmgr_remark'}"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="dialog-content dn" name="monitor-app-con">
      <form class="monitor-app-form">
        <div class="clearfix mt30">
          <div class="fl">
            <label class="input-label-right" data-i18n-code="store_appmgr_monitor_switch">{{doI18n('store_appmgr_monitor_switch')}}</label>
          </div>
          <div class="fl monitor-switch-box"></div>
        </div>
        <div class="monitor-tip-wrap c6 fs12" name="tip">
          <div data-i18n-code="store_appmgr_tip_care">{{doI18n('store_appmgr_tip_care')}}</div>
          <div class="monitor-tip-box"></div>
        </div>
      </form>
    </div>
    <div class="dialog-content dn" name="set-path-con">
      <form class="set-path-form" onsubmit="return false">
        <div class="mt30 clearfix set-path">
          <div class="fl">
            <label class="input-label-right" data-i18n-code="store_appmgr_real_path">{{doI18n('store_appmgr_real_path')}}</label>
          </div>
          <div class="fl pr">
            <div class="set-dir-path">
              <input
                type="text"
                name="path"
                class="input-common pr20"
                valids="required sysPath lengthRange"
                data-msg="{required:'store_appmgr_real_path',lengthRange:[1,254]}"
              />
              <div name="browse-file-icon">
                <svg class="icon vem" aria-hidden="true">
                  <use xlink:href="#icon-wenjianliulan" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="mt30 clearfix set-role dn">
          <div class="fl">
            <label class="input-label-right" data-i18n-code="store_appmgr_role">{{doI18n('store_appmgr_role')}}</label>
          </div>
          <div class="fl pr">
            <div class="role-app-select"></div>
          </div>

          <!-- <div class="fl">
                <input class="input-common" name="path" valids="required sysPath lengthRange" data-msg="{required:'存储目录',lengthRange:[1,254]}">
          </div>-->
        </div>
      </form>
    </div>
    <div class="dialog-content dn" name="browse-file-con">
      <form class="browse-file-form" onsubmit="return false">
        <div class="clearfix pl20 pt10 pb10 pr20 pr">
          <div
            class="fl mr10 btn-opr"
            name="create-folder"
            data-i18n-code="store_file_browse_create_folder"
          >{{doI18n('store_file_browse_create_folder')}}</div>
          <div
            class="fl mr10 btn-opr dn"
            name="back-last"
            data-i18n-code="store_file_browse_back_last"
          >{{doI18n('store_file_browse_back_last')}}</div>
          <div class="pr mr10 fl">
            <input
              class="file-path input-common"
              type="text"
              valids="fileSysPathPoint"
              data-msg="{'fileSysPathPoint':'store_file_browse_path'}"
            />
          </div>
          <div class="file-search dib"></div>
        </div>
        <div class="clearfix">
          <div name="file-table"></div>
        </div>
      </form>
    </div>
    <div class="dialog-content dn" name="create-folder-con">
      <form class="create-folder-form" onsubmit="return false">
        <div class="create-folder-title dn">
          <span class="create-folder-name"></span>
        </div>
        <div class="mt30 clearfix">
          <div class="fl">
            <label class="input-label-right" data-i18n-code="store_file_browse_filename">{{doI18n('store_file_browse_filename')}}</label>
          </div>
          <div class="fl pr">
            <input
              type="text"
              name="folder-name"
              class="input-common pr20"
              valids="required lengthRange excludeComma fileSysName"
              data-msg="{required:'store_file_browse_filename', 'lengthRange':[1,80], 'excludeComma':'store_file_browse_filename', 'fileSysName':'store_file_browse_filename'}"
            />
          </div>
        </div>
      </form>
    </div>
    <div class="dialog-content dn" name="role-app-con">
      <form class="role-app-form">
        <div class="opr-list flex flex-center jcfs">
          <div class="mr10">
            <div class="btn-opr" name="createRole" data-i18n-code="btn_create">{{doI18n('btn_create')}}</div>
          </div>
          <div class="mr10">
            <div class="btn-opr" name="editRole" data-i18n-code="store_appmgr_edit">{{doI18n('store_appmgr_edit')}}</div>
          </div>
          <div class="mr10">
            <div class="btn-opr" name="deleteRole" data-i18n-code="btn_delete">{{doI18n('btn_delete')}}</div>
          </div>
          <div class="mr10">
            <div
              class="btn-opr"
              name="setDefaultRole"
              data-i18n-code="store_appmgr_set_default_role"
            >{{doI18n('store_appmgr_set_default_role')}}</div>
          </div>
        </div>
        <div class="role-app-content">
          <div class="role-app-table"></div>
        </div>
      </form>
    </div>
    <div class="dialog-content dn" name="create-role-con">
      <form class="create-role-form">
        <div class="pl10 pr10">
          <div class="mt30 clearfix">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="store_appmgr_role_name">{{doI18n('store_appmgr_role_name')}}</label>
            </div>
            <div class="fl pr">
              <input
                class="input-common"
                name="name"
                valids="required name lengthRange"
                data-msg="{required:'store_appmgr_role_name',name:'store_appmgr_role_name',lengthRange:[1,20]}"
              />
            </div>
          </div>
          <div class="mt15 clearfix">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="store_appmgr_catalogue">{{doI18n('store_appmgr_catalogue')}}</label>
            </div>
            <div class="fl pr">
              <div class="role-dir-select">
                <input
                  class="input-common"
                  name="subDir"
                  valids="required sysPath lengthRange"
                  data-msg="{required:'store_appmgr_catalogue',lengthRange:[1,254]}"
                />
                <div name="browse-file-icon">
                  <svg class="icon vem" aria-hidden="true">
                    <use xlink:href="#icon-wenjianliulan" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="mt15 clearfix">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="store_appmgr_remark">{{doI18n('store_appmgr_remark')}}</label>
            </div>
            <div class="fl pr">
              <textarea
                class="input-common"
                name="comment"
                valids="lengthRange"
                data-msg="{lengthRange:[0,255]}"
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {application} from "@/views/StoreUI/js/application.js";
import "@/views/StoreUI/js/browse-file.js";
import "@/views/StoreUI/css/application.css";
import "@/views/StoreUI/css/browse-file.css";
import "@/views/LoongUI/frame/lib/loongSwitch/loongSwitch.js";
import "@/views/LoongUI/frame/lib/loongSwitch/loongSwitch.css";
export default {
    name: 'application',
    mounted() {
        application();
        console.log("application")
    }
};
</script>

<style>
</style>
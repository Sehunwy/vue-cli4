<template>
  <div class="main-right scroll-page">
    <div class="main-min-width" style="height:100%">
      <div class="app-detail">
        <div class="app-info-wrap border-btm-gray">
          <div class="fs12 c9 pt20 pl40" data-i18n-code="store_appmgr_info_title">{{doI18n('store_appmgr_info_title')}}</div>
          <div class="app-info-list">
            <ul class="clearfix">
              <li class="app-info-item">
                <div class="app-info-icon">
                  <svg class="icon">
                    <use xlink:href="#icon-IP" />
                  </svg>
                </div>
                <div class="fl app-info-content">
                  <div class="app-item-title" data-i18n-code="store_common_host">{{doI18n('store_common_host')}}</div>
                  <div
                    class="app-item-content hand"
                    name="ip"
                    data-toggle="tooltip"
                    data-placement="top"
                  ></div>
                </div>
              </li>
              <li class="app-info-item">
                <div class="app-info-icon">
                  <svg class="icon">
                    <use xlink:href="#icon-xuniCPU" />
                  </svg>
                </div>
                <div class="fl app-info-content">
                  <div class="app-item-title" data-i18n-code="store_common_cpu">{{doI18n('store_common_cpu')}}</div>
                  <div
                    class="app-item-content hand"
                    name="cpu"
                    data-toggle="tooltip"
                    data-placement="top"
                  ></div>
                </div>
              </li>
              <li class="app-info-item">
                <div class="app-info-icon">
                  <svg class="icon">
                    <use xlink:href="#icon-neicun" />
                  </svg>
                </div>
                <div class="fl app-info-content">
                  <div class="app-item-title" data-i18n-code="store_common_mem">{{doI18n('store_common_mem')}}</div>
                  <div
                    class="app-item-content hand"
                    name="mem"
                    data-toggle="tooltip"
                    data-placement="top"
                  ></div>
                </div>
              </li>
              <li class="app-info-item">
                <div class="app-info-icon">
                  <svg class="icon">
                    <use xlink:href="#icon-caozuoxitong" />
                  </svg>
                </div>
                <div class="fl app-info-content">
                  <div class="app-item-title" data-i18n-code="store_common_sys">{{doI18n('store_common_sys')}}</div>
                  <div
                    class="app-item-content hand"
                    name="sys"
                    data-toggle="tooltip"
                    data-placement="top"
                  ></div>
                </div>
              </li>
              <li class="app-info-item">
                <div class="app-info-icon">
                  <svg class="icon">
                    <use xlink:href="#icon-qidongshijian" />
                  </svg>
                </div>
                <div class="fl app-info-content">
                  <div class="app-item-title" data-i18n-code="store_common_starttime">{{doI18n('store_common_starttime')}}</div>
                  <div
                    class="app-item-content hand"
                    name="startTime"
                    data-toggle="tooltip"
                    data-placement="top"
                  ></div>
                </div>
              </li>
              <li class="app-info-item">
                <div class="app-info-icon">
                  <svg class="icon">
                    <use xlink:href="#icon-yunhangshijian" />
                  </svg>
                </div>
                <div class="fl app-info-content">
                  <div class="app-item-title" data-i18n-code="store_common_runtime">{{doI18n('store_common_runtime')}}</div>
                  <div
                    class="app-item-content hand"
                    name="runTime"
                    data-toggle="tooltip"
                    data-placement="top"
                  ></div>
                </div>
              </li>
              <li class="app-info-item">
                <div class="app-info-icon">
                  <svg class="icon">
                    <use xlink:href="#icon-zuihouxintiao" />
                  </svg>
                </div>
                <div class="fl app-info-content">
                  <div class="app-item-title" data-i18n-code="store_common_lasttime">{{doI18n('store_common_lasttime')}}</div>
                  <div
                    class="app-item-content hand"
                    name="last"
                    data-toggle="tooltip"
                    data-placement="top"
                  ></div>
                </div>
              </li>

              <li class="app-info-item">
                <div class="app-info-icon">
                  <svg class="icon">
                    <use xlink:href="#icon-version" />
                  </svg>
                </div>
                <div class="fl app-info-content">
                  <div class="app-item-title" data-i18n-code="store_appmgr_client_version">{{doI18n('store_appmgr_client_version')}}</div>
                  <div
                    class="app-item-content hand"
                    name="version"
                    data-toggle="tooltip"
                    data-placement="top"
                  ></div>
                </div>
              </li>
              <li class="app-info-item">
                <div class="app-info-icon">
                  <svg class="icon">
                    <use xlink:href="#icon-ConstructionTime" />
                  </svg>
                </div>
                <div class="fl app-info-content">
                  <div class="app-item-title" data-i18n-code="store_appmgr_client_createTime">{{doI18n('store_appmgr_client_createTime')}}</div>
                  <div
                    class="app-item-content hand"
                    name="build"
                    data-toggle="tooltip"
                    data-placement="top"
                  ></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="app-chart-wrap">
          <div class="fs12 c9 pt20 pl40" data-i18n-code="store_appmgr_chart_title">{{doI18n('store_appmgr_chart_title')}}</div>
          <div class="app-chart-content">
            <div class="clearfix pt20">
              <div class="chart-type-select-box fl"></div>
              <div class="chart-range-select-box fl"></div>
            </div>
            <div class="fix-bottom">
              <div
                class="app-chart-box pt20"
                style="width:100%;height:400px; padding-left:59px;padding-right:50px"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-detail dn">
        <div class="result-image-box">
          <img src="@/views/StoreUI/image/noResult.png" />
          <div class="result-tip pt15"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// <script src="/StoreUI/js/application-detail.js">
import { applicationDetail } from "@/views/StoreUI/js/application-detail.js";
import "@/views/StoreUI/css/application-detail.css";
export default {
  name: "application-detail",
  mounted() {
    applicationDetail();
  }
};
</script>

<style>
</style>
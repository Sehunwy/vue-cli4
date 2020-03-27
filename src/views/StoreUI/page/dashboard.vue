<template>
  <div class="store-dashboard-wrap">
    <div class="main-min-width">
      <div class="dashboard-box-wrap clearfix">
        <div class="dashboard-box-section" name="storage" style="margin-right:14px">
          <div class="storage-box">
            <div class="pt10 pl20">
              <span class="fs13 c6" data-i18n-code="store_common_system_storage">{{doI18n('store_common_system_storage')}}</span>
              <div class="detail-icon" name="storage">
                <svg class="icon">
                  <use xlink:href="#icon-chakanxiangqing" />
                </svg>
              </div>
            </div>
            <div class="storage-box-content dn">
              <div class="storage-progress-box"></div>
              <div class="storage-des">
                <p class="c9 fs12">
                  <span data-i18n-code="store_common_useful_storage">{{doI18n('store_common_useful_storage')}}</span>/
                  <span data-i18n-code="store_common_total_storage">{{doI18n('store_common_total_storage')}}</span>
                </p>
                <p class="c3 fs16 pt5">
                  <span class="unused"></span>/
                  <span class="total"></span>
                </p>
              </div>
            </div>
            <div class="storage-no-result c6 dn">
              <img src="@/views/StoreUI/image/noResult.png" />
              <p class="c6 fs12"></p>
            </div>
          </div>
        </div>
        <div class="dashboard-box-section" style="margin-right:14px">
          <div class="card-box light-blue" name="warn">
            <div class="card-content">
              <img src="@/views/StoreUI/image/warn.png" />
              <div class="card-num">
                <p class="card-num-title" data-i18n-code="store_dashboard_abnormal_alarm">{{doI18n('store_dashboard_abnormal_alarm')}}</p>
                <p class="card-num-txt"></p>
              </div>
            </div>
            <div class="card-des">
              <ul class="des-item-list">
                <li class="des-item des-split">
                  <div class="circle-mark fl red"></div>
                  <div class="des-item-title fl" data-i18n-code="store_alarm_emergency">{{doI18n('store_alarm_emergency')}}</div>
                  <div class="des-item-txt fl" name="high-warn"></div>
                </li>
                <li class="des-item des-split">
                  <div class="circle-mark fl orange"></div>
                  <div class="des-item-title fl" data-i18n-code="store_alarm_important">{{doI18n('store_alarm_important')}}</div>
                  <div class="des-item-txt fl" name="light-warn"></div>
                </li>
                <li class="des-item">
                  <div class="circle-mark fl yellow"></div>
                  <div class="des-item-title fl" data-i18n-code="store_alarm_warning">{{doI18n('store_alarm_warning')}}</div>
                  <div class="des-item-txt fl" name="normal-warn"></div>
                </li>
              </ul>
            </div>
          </div>
          <div class="card-box mt15 normal-blue" name="app">
            <div class="card-content">
              <img src="@/views/StoreUI/image/app.png" />
              <div class="card-num">
                <p class="card-num-title" data-i18n-code="store_common_client">{{doI18n('store_common_client')}}</p>
                <p class="card-num-txt"></p>
              </div>
            </div>
            <div class="card-des">
              <ul class="des-item-list">
                <li class="des-item des-split">
                  <div class="des-item-title fl" data-i18n-code="store_dashboard_run">{{doI18n('store_dashboard_run')}}</div>
                  <div class="des-item-txt fl" name="run-app"></div>
                </li>
                <li class="des-item des-split">
                  <div class="des-item-title fl" data-i18n-code="store_dashboard_stop">{{doI18n('store_dashboard_stop')}}</div>
                  <div class="des-item-txt fl" name="stop-app"></div>
                </li>
                <li class="des-item">
                  <div class="des-item-title fl" data-i18n-code="store_dashboard_unknow">{{doI18n('store_dashboard_unknow')}}</div>
                  <div class="des-item-txt fl" name="unknown-app"></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="dashboard-box-section">
          <div class="card-box dark-blue" name="node-server">
            <div class="card-content">
              <img src="@/views/StoreUI/image/node.png" />
              <div class="card-num">
                <p class="card-num-title" data-i18n-code="store_dashboard_server">{{doI18n('store_dashboard_server')}}</p>
                <p class="card-num-txt"></p>
              </div>
            </div>
            <div class="card-des">
              <ul class="des-item-list">
                <li class="des-item des-split">
                  <div class="des-item-title fl" data-i18n-code="store_dashboard_run">{{doI18n('store_dashboard_run')}}</div>
                  <div class="des-item-txt fl" name="run-server"></div>
                </li>
                <li class="des-item des-split">
                  <div class="des-item-title fl" data-i18n-code="store_dashboard_abnormal">{{doI18n('store_dashboard_abnormal')}}</div>
                  <div class="des-item-txt fl" name="bad-server"></div>
                </li>
                <li class="des-item des-split">
                  <div class="des-item-title fl" data-i18n-code="store_dashboard_stop">{{doI18n('store_dashboard_stop')}}</div>
                  <div class="des-item-txt fl" name="stop-server"></div>
                </li>
              </ul>
            </div>
          </div>
          <div class="card-box mt15 purple-blue" name="disk">
            <div class="card-content">
              <img src="@/views/StoreUI/image/disk.png" />
              <div class="card-num">
                <p class="card-num-title" data-i18n-code="store_dashboard_abnormal_disk_num">{{doI18n('store_dashboard_abnormal_disk_num')}}</p>
                <p class="card-num-txt"></p>
              </div>
            </div>
            <div class="card-des op50"></div>
          </div>
        </div>
      </div>
      <div class="dashboard-chart-wrap">
        <div class="clearfix">
          <div class="dashboard-chart-title" data-i18n-code="store_common_store">{{doI18n('store_common_store')}}</div>
          <div class="chart-detail-icon" name="istore">
            <svg class="icon">
              <use xlink:href="#icon-chakanxiangqing" />
            </svg>
          </div>
        </div>
        <div class="dashboard-chart-box" name="istore"></div>
      </div>
      <div class="dashboard-chart-wrap">
        <div class="clearfix">
          <div class="dashboard-chart-title" data-i18n-code="store_common_client">{{doI18n('store_common_client')}}</div>
          <div class="chart-detail-icon" name="app">
            <svg class="icon">
              <use xlink:href="#icon-chakanxiangqing" />
            </svg>
          </div>
        </div>
        <div class="dashboard-chart-box" name="app"></div>
      </div>
    </div>
  </div>
</template>

<script>

import {dashboard} from '@/views/StoreUI/js/dashboard.js'
import '@/views/LoongUI/frame/lib/loongProgress/loongProgress.js'

import '@/views/StoreUI/css/dashboard.css'
import '@/views/LoongUI/frame/lib/loongProgress/loongProgress.css'
export default {
  name: "dashboard",
  mounted() {
    dashboard();
  }
};
</script>

<style>
</style>
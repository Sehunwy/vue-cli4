<template>
  <div class="disk-dashboard-wrap" name="disk-dashboard-wrap">
    <div style="min-width:960px;">
      <div class="dashboard-box-wrap clearfix">
        <div class="disk-dashboard-box-section" name="storage" style="margin-right:14px">
          <div class="storage-box">
            <div class="pt10 pl20">
              <span class="fs13 c6" data-i18n-code="disk_system_capacity">{{doI18n('disk_system_capacity')}}</span>
            </div>
            <div class="storage-box-content">
              <div class="storage-progress-box"></div>
              <div class="storage-des">
                <p class="c9 fs12">
                  <span data-i18n-code="disk_available_capacity">{{doI18n('disk_available_capacity')}}</span>/
                  <span data-i18n-code="disk_total_space">{{doI18n('disk_total_space')}}</span>
                </p>
                <p class="c3 fs16 pt5">
                  <span class="unused"></span>/
                  <span class="total"></span>
                </p>
              </div>
            </div>
            <div class="storage-no-result c6 dn" data-i18n-code="disk_member_no_data">{{doI18n('disk_member_no_data')}}</div>
          </div>
        </div>
        <div class="disk-dashboard-box-section" name="syscapacity" style="margin-right:14px">
          <div class="storage-box">
            <div class="pt10 pl20">
              <span class="fs13 c6" data-i18n-code="disk_member_num">{{doI18n('disk_member_num')}}</span>
            </div>
            <div class="storage-box-content">
              <div class="storage-progress-box"></div>
              <div class="storage-des">
                <p class="c9 fs12">
                  <span data-i18n-code="disk_create_member_num">{{doI18n('disk_create_member_num')}}</span>/
                  <span data-i18n-code="disk_total_member_num">{{doI18n('disk_total_member_num')}}</span>
                </p>
                <p class="c3 fs16 pt5">
                  <span class="unused"></span>/
                  <span class="total"></span>
                </p>
              </div>
            </div>
            <div class="storage-no-result c6 dn" data-i18n-code="disk_member_no_data">{{doI18n('disk_member_no_data')}}</div>
          </div>
        </div>
        <div class="disk-dashboard-box-section">
          <div class="storage-box pl10 pr10 pb5">
            <div class="pl10 pr20 pt10 clearfix">
              <div class="fl">
                <img src="@/views/DiskUI/image/user-dashbord.png" />
              </div>
              <div class="fr">
                <div class="tar" data-i18n-code="disk_member_online_num">{{doI18n('disk_member_online_num')}}</div>
                <div class="fs36 tar fwb" name="on-num"></div>
              </div>
            </div>
            <ul name="on-member-list" class="on-member-ul pl10 pr10 clearfix pt10 pb10"></ul>
          </div>
        </div>
      </div>
      <div class="disk-dashboard-chart-wrap" name="sys-io-wrap">
        <div class="clearfix">
          <div class="dashboard-chart-title" data-i18n-code="disk_system_io_statistics">{{doI18n('disk_system_io_statistics')}}</div>
        </div>
        <div class="mt10 clearfix pl20" name>
          <div class="start-time fl mr10" name="startTimeContainer"></div>
          <div class="end-time fl mr10" name="endTimeContainer"></div>
          <div class="fl btn-opr" name="query-io-btn" data-i18n-code="disk_btn_query">{{doI18n('disk_btn_query')}}</div>
        </div>
        <div class="disk-dashboard-chart-box" name="istore"></div>
      </div>
      <div class="disk-dashboard-chart-wrap mb20" name="member-io-wrap">
        <div class="clearfix">
          <div class="dashboard-chart-title" data-i18n-code="disk_member_io_statistics">{{doI18n('disk_member_io_statistics')}}</div>
        </div>
        <div class="clearfix pl20 mt10" name>
          <div class="start-time fl mr10" name="startTimeContainer"></div>
          <div class="end-time fl mr10" name="endTimeContainer"></div>
          <div class="fl btn-opr" name="query-io-btn" data-i18n-code="disk_btn_query">{{doI18n('disk_btn_query')}}</div>
        </div>
        <div class="mt10" name="member-list-io" style="height:301px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/views/LoongUI/frame/lib/loongDate/loongDate.js'
import '@/views/LoongUI/frame/lib/loongProgress/loongProgress.js'
import {dashboard} from '@/views/DiskUI/js/dashboard.js'

import '@/views/DiskUI/css/dashboard.css'
import '@/views/LoongUI/frame/lib/loongProgress/loongProgress.css'
import '@/views/LoongUI/frame/lib/loongDate/loongDate.css'
export default {
    name: 'dashboard',
    mounted() {
      dashboard();
    }
};
</script>

<style>
</style>
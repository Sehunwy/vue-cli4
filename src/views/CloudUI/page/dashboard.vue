<template>
  <div>
    <div class="overflow-wrap cloud-dashboard" id="cloudDashboard">
      <div class="dashboard-back main-min-width">
        <div class="flex sumBox">
          <div class="sum-item pm-num flex clearfix">
            <div class="data-icon">
              <img src="@/views/CloudUI/image/home-node.png" />
            </div>
            <div class="sumData">
              <p
                class="data-name"
                data-i18n-code="cloud_dashboard_physical_node"
              >{{doI18n('cloud_dashboard_physical_node')}}</p>
              <p class="data-num toe"></p>
            </div>
          </div>
          <div class="sum-item tenant-num flex clearfix" name="isDomain">
            <div class="data-icon"></div>
            <div class="sumData">
              <p class="data-name"></p>
              <p class="data-num toe"></p>
            </div>
          </div>
          <div class="sum-item user-num flex clearfix">
            <div class="data-icon">
              <img src="@/views/CloudUI/image/home-user.png" />
            </div>
            <div class="sumData">
              <p
                class="data-name"
                data-i18n-code="cloud_dashboard_account"
              >{{doI18n('cloud_dashboard_account')}}</p>
              <p class="data-num toe"></p>
            </div>
          </div>
          <div class="sum-item vm-num flex clearfix">
            <div class="data-icon">
              <img src="@/views/CloudUI/image/home-vm.png" />
            </div>
            <div class="sumData">
              <p
                class="data-name"
                data-i18n-code="cloud_dashboard_host"
              >{{doI18n('cloud_dashboard_host')}}</p>
              <p class="data-num toe"></p>
            </div>
          </div>
          <div class="sum-item run-vm-num flex clearfix">
            <div class="data-icon">
              <img src="@/views/CloudUI/image/home-runvm.png" />
            </div>
            <div class="sumData">
              <p
                class="data-name"
                data-i18n-code="cloud_dashboard_host_on"
              >{{doI18n('cloud_dashboard_host_on')}}</p>
              <p class="data-num toe"></p>
            </div>
          </div>
          <div class="sum-item disk-num flex clearfix">
            <div class="data-icon">
              <img src="@/views/CloudUI/image/home-disk.png" />
            </div>
            <div class="sumData">
              <p
                class="data-name"
                data-i18n-code="cloud_dashboard_virtual_disk"
              >{{doI18n('cloud_dashboard_virtual_disk')}}</p>
              <p class="data-num toe"></p>
            </div>
          </div>
        </div>
        <div class="flex statusBox">
          <div class="status-li flex">
            <div class="li-box">
              <div
                class="li-title"
                data-i18n-code="cloud_dashboard_resource_count"
              >{{doI18n('cloud_dashboard_resource_count')}}</div>
              <div class="info-box border-btm-gray">
                <div class="boxHead clearfix">
                  <span
                    class="boxName fl"
                    data-i18n-code="cloud_dashboard_cpu_count"
                  >{{doI18n('cloud_dashboard_cpu_count')}}</span>
                  <span class="link-icon fr hand fs16 color-blue">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-chakanxiangqing" />
                    </svg>
                  </span>
                </div>
                <div class="info-chart" name="cpuChart">
                  <div class="progress-chart cpu-chart"></div>
                </div>
                <div class="info-data">
                  <div
                    class="data-text"
                    data-i18n-code="cloud_dashboard_cpu_ratio"
                  >{{doI18n('cloud_dashboard_cpu_ratio')}}</div>
                  <div class="data-number">
                    <span class="cpu-free"></span>
                    <span>/</span>
                    <span class="cpu-total"></span>
                  </div>
                </div>
              </div>
              <div class="info-box">
                <div class="boxHead clearfix">
                  <span
                    class="boxName fl"
                    data-i18n-code="cloud_dashboard_memories"
                  >{{doI18n('cloud_dashboard_memories')}}</span>
                  <span class="link-icon fr hand fs16 color-blue">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-chakanxiangqing" />
                    </svg>
                  </span>
                </div>
                <div class="info-chart" name="memChart">
                  <div class="progress-chart mem-chart"></div>
                </div>
                <div class="info-data">
                  <div
                    class="data-text"
                    data-i18n-code="cloud_dashboard_mem_ratio"
                  >{{doI18n('cloud_dashboard_mem_ratio')}}</div>
                  <div class="data-number">
                    <span class="mem-free"></span>
                    <span>/</span>
                    <span class="mem-total"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="status-li flex">
            <div class="li-box">
              <div
                class="li-title"
                data-i18n-code="cloud_dashboard_network"
              >{{doI18n('cloud_dashboard_network')}}</div>
              <div class="info-box border-btm-gray">
                <div class="boxHead clearfix">
                  <span
                    class="boxName fl"
                    data-i18n-code="cloud_dashboard_network_bandwidth"
                  >{{doI18n('cloud_dashboard_network_bandwidth')}}</span>
                  <span class="link-icon fr hand fs16 color-blue">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-chakanxiangqing" />
                    </svg>
                  </span>
                </div>
                <div class="info-chart net-info-chart flex" name="netChart">
                  <div id="net-line-chart"></div>
                </div>
                <div class="info-data">
                  <ul class="data-list-ul flex">
                    <li>
                      <div class="data-text">
                        <span
                          class="pr"
                          data-i18n-code="cloud_dashboard_byte_out"
                        >{{doI18n('cloud_dashboard_byte_out')}}</span>
                      </div>
                      <div class="data-number">
                        <span class="fs16" style="color:#28C4EF;">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-zhuyeshangjiantou" />
                          </svg>
                        </span>
                        <span class="net-out"></span>
                      </div>
                    </li>
                    <li>
                      <div class="data-text">
                        <span
                          class="pr"
                          data-i18n-code="cloud_dashboard_byte_in"
                        >{{doI18n('cloud_dashboard_byte_in')}}</span>
                      </div>
                      <div class="data-number">
                        <span class="fs16" style="color:#4884FD;">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-zhuyexiajiantou" />
                          </svg>
                        </span>
                        <span class="net-in"></span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="info-box">
                <div class="boxHead clearfix">
                  <span
                    class="boxName fl"
                    data-i18n-code="cloud_dashboard_IP_address"
                  >{{doI18n('cloud_dashboard_IP_address')}}</span>
                  <span class="link-icon fr hand fs16 color-blue">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-chakanxiangqing" />
                    </svg>
                  </span>
                </div>
                <div class="info-chart" name="ipChart">
                  <div class="progress-chart ip-chart"></div>
                </div>
                <div class="info-data">
                  <div
                    class="data-text"
                    data-i18n-code="cloud_dashboard_IP_ratio"
                  >{{doI18n('cloud_dashboard_IP_ratio')}}</div>
                  <div class="data-number">
                    <span class="ip-free"></span>
                    <span>/</span>
                    <span class="ip-total"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="status-li flex">
            <div class="li-box">
              <div
                class="li-title"
                data-i18n-code="cloud_dashboard_storage"
              >{{doI18n('cloud_dashboard_storage')}}</div>
              <div class="info-box border-btm-gray">
                <div class="boxHead clearfix">
                  <span
                    class="boxName fl"
                    data-i18n-code="cloud_dashboard_performance_monitoring"
                  >{{doI18n('cloud_dashboard_performance_monitoring')}}</span>
                </div>
                <div class="info-chart storage-info-chart flex">
                  <div id="storage-line-chart"></div>
                </div>
                <div class="info-data">
                  <ul class="data-list-ul flex">
                    <li>
                      <div class="data-text">
                        <span
                          class="pr"
                          data-i18n-code="cloud_dashboard_read_rate"
                        >{{doI18n('cloud_dashboard_read_rate')}}</span>
                      </div>
                      <div class="data-number">
                        <span class="fs16" style="color:#28C4EF;">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-zhuyeshangjiantou" />
                          </svg>
                        </span>
                        <span class="read-rate"></span>
                      </div>
                    </li>
                    <li>
                      <div class="data-text">
                        <span
                          class="pr"
                          data-i18n-code="cloud_dashboard_write_rate"
                        >{{doI18n('cloud_dashboard_write_rate')}}</span>
                      </div>
                      <div class="data-number">
                        <span class="fs16" style="color:#4884FD;">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-zhuyexiajiantou" />
                          </svg>
                        </span>
                        <span class="write-rate"></span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="info-box">
                <div class="boxHead clearfix">
                  <span
                    class="boxName fl"
                    data-i18n-code="cloud_dashboard_storage"
                  >{{doI18n('cloud_dashboard_storage')}}</span>
                </div>
                <div class="info-chart">
                  <div class="progress-chart storage-chart"></div>
                </div>
                <div class="info-data">
                  <div
                    class="data-text"
                    data-i18n-code="cloud_dashboard_capacity_ratio"
                  >{{doI18n('cloud_dashboard_capacity_ratio')}}</div>
                  <div class="data-number">
                    <span class="storage-free"></span>
                    <span>/</span>
                    <span class="storage-total"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cpu-txt dn">
      <p class="rate"></p>
      <p
        class="rate-label"
        data-i18n-code="cloud_dashboard_cpu_usage"
      >{{doI18n('cloud_dashboard_cpu_usage')}}</p>
    </div>
    <div class="mem-txt dn">
      <p class="rate"></p>
      <p
        class="rate-label"
        data-i18n-code="cloud_dashboard_mem_usage"
      >{{doI18n('cloud_dashboard_mem_usage')}}</p>
    </div>
    <div class="ip-txt dn">
      <p class="rate"></p>
      <p
        class="rate-label"
        data-i18n-code="cloud_dashboard_ip_usage"
      >{{doI18n('cloud_dashboard_ip_usage')}}</p>
    </div>
    <div class="storage-txt dn">
      <p class="rate"></p>
      <p
        class="rate-label"
        data-i18n-code="cloud_dashboard_storage_usage"
      >{{doI18n('cloud_dashboard_storage_usage')}}</p>
    </div>
  </div>
</template>

<script>
import "@/views/LoongUI/frame/lib/loongProgress/loongProgress.js";
import { dashboard } from "@/views/CloudUI/js/dashboard.js";
import "@/views/LoongUI/frame/lib/loongProgress/loongProgress.css";
import "@/views/CloudUI/css/dashboard.css";
export default {
  name: "dashboard",
  mounted() {
    dashboard();
  }
};
</script>

<style>
</style>
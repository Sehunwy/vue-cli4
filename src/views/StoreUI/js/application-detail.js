
import router from '@/router'
import echarts from 'echarts'
var id;
var optionTemp = {
    title: {
        show: false
    },
    color: ["#4884FD", "#3BCAEC", "#3AE9DA", "#484BFD"],
    legend: {
        show: true,
        right: 100,
        itemHeight: 8,

    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    toolbox: {
        show: false
    },
    grid: {
        left: 70,
        right: 80,
        bottom: 15,
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLabel: {
            color: "#666666",
            fontSize: 12
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            lineStyle: {
                color: "#C4DAF7"
            }
        },
        splitLine: {
            show: false

        }, nameTextStyle: {
            color: "#555555",
            fontSize: 12,
            align: "left",
            padding: [0, 0, -25, 0]

        }, name: $.doI18n("store_common_time"),
        nameGap: 30
    },
    yAxis: {
        type: 'value',
        axisLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        splitLine: {
            lineStyle: {
                color: "#C4DAF7"
            }
        },
        nameTextStyle: {
            color: "#555555",
            fontSize: 12,
            align: "left"

        },
        axisLabel: {
            color: "#666666",
            fontSize: 12
        },
        offset: 29,

    }
};
var legendType = 'circle';
var chartInterval;
var $appChartWrap, range, metric;
export function applicationDetail() {
    id = router.currentRoute.query.appId;
    $appChartWrap = $(".app-chart-wrap");
    initAppDetail();
    initChart();
}

// window.intervals.push(window.setInterval(function(){
//    getAppDetail();
// },5000));
function initAppDetail() {
    $.$ajax({
        type: "get",
        url: "/api/store/node/clientNode/node/information/get",
        data: {
            clientNodeId: id
        },
        cache: false,
        success: function (json) {
            if (json.data.cpuNumber > 0) {
                $(".no-detail").addClass("dn");
                $(".app-detail").removeClass("dn");
                var $appInfoList = $(".app-info-list");
                $appInfoList.find(".app-item-content[name='ip']").html(json.data.ip);
                $appInfoList.find(".app-item-content[name='cpu']").html(json.data.cpuNumber + $.doI18n("store_host_stone"));
                var mem = $.formatSizeStr(json.data.totalMemory);
                $appInfoList.find(".app-item-content[name='mem']").html(mem);
                $appInfoList.find(".app-item-content[name='sys']").html(json.data.os);
                var startTime = $.dateFormat(json.data.startTime, "yyyy-MM-dd HH:mm"),
                    runTime = $.transformToHour(json.data.runTime),
                    lastHeart = $.dateFormat(json.data.lastHeart, "yyyy-MM-dd HH:mm");
                $appInfoList.find(".app-item-content[name='startTime']").html(startTime);
                $appInfoList.find(".app-item-content[name='runTime']").html(runTime);
                $appInfoList.find(".app-item-content[name='last']").html(lastHeart);
                $appInfoList.find(".app-item-content[name='version']").html(json.data.version);
                $appInfoList.find(".app-item-content[name='build']").html(json.data.build);
                $appInfoList.find(".app-item-content[name='ip']").attr("data-title", json.data.ip);
                $appInfoList.find(".app-item-content[name='cpu']").attr("data-title", json.data.cpuNumber + $.doI18n("store_host_stone"));
                $appInfoList.find(".app-item-content[name='mem']").attr("data-title", mem);
                $appInfoList.find(".app-item-content[name='sys']").attr("data-title", json.data.os);
                $appInfoList.find(".app-item-content[name='startTime']").attr("data-title", startTime);
                $appInfoList.find(".app-item-content[name='runTime']").attr("data-title", runTime);
                $appInfoList.find(".app-item-content[name='last']").attr("data-title", lastHeart);
                $appInfoList.find(".app-item-content[name='version']").attr("data-title", json.data.version);
                $appInfoList.find(".app-item-content[name='build']").attr("data-title", json.data.build);
                if (json.data.build == null || json.data.build == "") {
                    $appInfoList.find(".app-item-content[name='build']").parents(".app-info-item").addClass("dn");
                }
                if (json.data.version == null || json.data.version == "") {
                    $appInfoList.find(".app-item-content[name='version']").parents(".app-info-item").addClass("dn");
                }
                $.loongToolTip($(".app-detail"));
            } else {
                $(".app-detail").addClass("dn");
                $(".no-detail").removeClass("dn");
                $(".no-detail").find(".result-tip").html($.doI18n("store_appmgr_no_data", json.data.ip[0]));

            }

        },
        beforeSend: function (xhr) {
            $.loading();
        },
        complete: function (xhr, status) {
            $.clearLoading();
        }


    });

}

function getAppDetail() {
    $.$ajax({
        type: "get",
        url: "/api/store/node/clientNode/node/information/get",
        data: {
            clientNodeId: id
        },
        cache: false,
        success: function (json) {
            if (json.data.cpuNumber > 0) {
                $(".no-detail").addClass("dn");
                $(".app-detail").removeClass("dn");
                var $appInfoList = $(".app-info-list");
                $appInfoList.find(".app-item-content[name='ip']").html(json.data.ip);
                $appInfoList.find(".app-item-content[name='cpu']").html(json.data.cpuNumber);
                var mem = $.formatSizeStr(json.data.totalMemory);
                $appInfoList.find(".app-item-content[name='mem']").html(mem);
                $appInfoList.find(".app-item-content[name='sys']").html(json.data.os);
                $appInfoList.find(".app-item-content[name='sys']").attr("data-title", json.data.os);
                var startTime = $.dateFormat(json.data.startTime, "yyyy-MM-dd HH:mm"),
                    runTime = $.transformToHour(json.data.runTime),
                    lastHeart = $.dateFormat(json.data.lastHeart, "yyyy-MM-dd HH:mm");
                $appInfoList.find(".app-item-content[name='startTime']").html(startTime);
                $appInfoList.find(".app-item-content[name='runTime']").html(runTime);
                $appInfoList.find(".app-item-content[name='last']").html(lastHeart);
                if (json.data.build == null || json.data.build == "") {
                    $appInfoList.find(".app-item-content[name='build']").parents(".app-info-item").addClass("dn");
                }
                if (json.data.version == null || json.data.version == "") {
                    $appInfoList.find(".app-item-content[name='version']").parents(".app-info-item").addClass("dn");
                }
                $.loongToolTip($(".app-detail"));

            } else {
                $(".app-detail").addClass("dn");
                $(".no-detail").removeClass("dn");
                $(".no-detail").find(".result-tip").html($.doI18n("store_appmgr_no_data", json.data.ip[0]));

            }

        }


    });

}
function initChart() {
    var typeSelect = $appChartWrap.find(".chart-type-select-box").loongSelect({
        'width': '160',
        'name': 'metric',
        'ajaxData': false,
        'onChange': function (value) {
            metric = value;
            drawChart(true);
            chartRate();
        },
        'data': [{
            'key': $.doI18n("store_homepage_cpu_use_rate"),
            'value': 'CPU'
        }, {
            'key': $.doI18n("store_common_file_rw"),
            'value': 'FileRW'
        }/*,{
                'key': '文件读',
                'value': 'FileR'
            },{
                'key': '文件写',
                'value': 'FileW'
            },{
                'key': '文件锁定',
                'value': 'FileFlock'
            }*/, {
            'key': $.doI18n("store_common_file_rw_num"),
            'value': 'IOPS'
        }, {
            'key': $.doI18n("store_common_file_operation"),
            'value': 'FileQuery'
        },
        ]
    });
    var rangeSelect = $appChartWrap.find(".chart-range-select-box").loongSelect({
        'width': '160',
        'name': 'range',
        'ajaxData': false,
        'onChange': function (value) {
            range = value;
            drawChart(true);
            chartRate();
        },
        'data': [{
            'key': $.doI18n("store_common_tenmin"),
            'value': 'tenmin'
        }, {
            'key': $.doI18n("store_common_onehour"),
            'value': 'hour'
        }, {
            'key': $.doI18n("store_common_oneday"),
            'value': 'day'
        }, {
            'key': $.doI18n("store_common_oneweek"),
            'value': 'week'
        }, {
            'key': $.doI18n("store_common_onemonth"),
            'value': 'month'
        }, {
            'key': $.doI18n("store_common_oneyear"),
            'value': 'year'
        }
        ]
    });
    metric = typeSelect.getSelectValue();
    range = rangeSelect.getSelectValue();
    drawChart();
    chartRate();
}

function drawChart(clearChart) {
    var param = {};
    var option;
    if (metric == "FileR" || metric == "FileW") {
        param.metric = "FileRW";
    } else {
        param.metric = metric;
    }
    param.range = range;
    param.nodeId = id;
    $.$ajax({
        type: "get",
        url: "/api/store/node/monitor/single/perfs/list",
        data: param,
        cache: false,
        success: function (json) {
            switch (metric) {
                case "CPU": option = setCpuOption(json.data, getTimeTemp());
                    break;
                case "FileRW": option = setFileRWOption(json.data, getTimeTemp());
                    break;
                case "FileR": option = setFileROption(json.data, getTimeTemp());
                    break;
                case "FileW": option = setFileWOption(json.data, getTimeTemp());
                    break;
                case "FileFlock": option = setFileFlockOption(json.data, getTimeTemp());
                    break;
                case "IOPS": option = setIOPSOption(json.data, getTimeTemp());
                    break;
                case "FileQuery": option = setFileQueryOption(json.data, getTimeTemp());
                    break;



            }
            if (clearChart) {
                echarts.dispose($(".app-chart-box")[0]);
            }
            setTimeout(function () {
                var appChart = echarts.init($(".app-chart-box")[0]);
                appChart.setOption(option);
                window.onresize = appChart.resize;

            }, 200);

        }
    });

}
function setCpuOption(dataList, dateTemp) {
    var cpuOption = $.extend(true, {}, optionTemp);
    var cpuDataSet = [], xAxisDataSet = [];
    cpuOption.series = [{
        name: $.doI18n("store_homepage_cpu_use_rate"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(72,132,253,0.3)' // 0% 处的颜色
                }, {
                    offset: 0.8, color: 'rgba(72,132,253,0)' // 100% 处的颜色
                }, {
                    offset: 1, color: 'rgba(72,132,253,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        data: cpuDataSet,
        lineStyle: {
            color: "rgba(72,132,253,1)",
            shadowColor: "rgba(17,136,221,0.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    }];
    cpuOption.yAxis.name = $.doI18n("store_common_unit_percent");
    cpuOption.yAxis.max = 100;
    cpuOption.yAxis.min = 0;
    cpuOption.legend.data = [
        {
            name: $.doI18n("store_homepage_cpu_use_rate"),
            icon: legendType
        }];

    $.each(dataList, function (i, item) {
        xAxisDataSet.push($.dateFormat(item.ctime, dateTemp));
        if (item.avg) {
            cpuDataSet.push(item.avg);
        } else {
            cpuDataSet.push(0);
        }

    });
    cpuOption.xAxis.data = xAxisDataSet;
    return cpuOption;


}
function setFileRWOption(dataList, dateTemp) {
    var fileRWOption = $.extend(true, {}, optionTemp);
    var fileRDataSet = [], fileWDataSet = [], xAxisDataSet = [];
    fileRWOption.series = [{
        name: $.doI18n("store_homepage_file_read_rate"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(72,132,253,0.3)' // 0% 处的颜色
                }, {
                    offset: 0.8, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }, {
                    offset: 1, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        data: fileRDataSet,
        lineStyle: {
            color: "rgba(72,132,253,1)",
            shadowColor: "rgba(17,136,221,0.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    }, {
        name: $.doI18n("store_homepage_file_write_rate"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(59,202,236,0.3)' // 0% 处的颜色
                }, {
                    offset: 0.8, color: 'rgba(59,202,236,0)' // 100% 处的颜色
                }, {
                    offset: 1, color: 'rgba(59,202,236,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        data: fileWDataSet,
        lineStyle: {
            color: "rgba(59,202,236,1)",
            shadowColor: "rgba(17,136,221,0.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    }];
    fileRWOption.legend.data = [{
        name: $.doI18n("store_homepage_file_read_rate"),
        icon: legendType

    }, {
        name: $.doI18n("store_homepage_file_write_rate"),
        icon: legendType

    }];
    fileRWOption.yAxis.name = $.doI18n("store_homepage_unit_colon") + dataList[0].unit + "/S";
    $.each(dataList, function (i, item) {
        if (item.type == 'read') {
            fileRDataSet.push(item.avg || 0);
            xAxisDataSet.push($.dateFormat(item.ctime, dateTemp));

        } else if (item.type == "write") {
            fileWDataSet.push(item.avg || 0);
        }

    });
    fileRWOption.xAxis.data = xAxisDataSet;
    return fileRWOption;


}
function setFileROption(dataList, dateTemp) {
    var fileROption = $.extend(true, {}, optionTemp);
    var fileRMaxDataSet = [], fileRMinDataSet = [], xAxisDataSet = [];
    fileROption.series = [{
        name: $.doI18n("store_homepage_file_readMax"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(72,132,253,0.3)' // 0% 处的颜色
                }, {
                    offset: 0.8, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }, {
                    offset: 1, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        data: fileRMaxDataSet,
        lineStyle: {
            color: "rgba(72,132,253,1)",
            shadowColor: "rgba(17,136,221,0.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    }, {
        name: $.doI18n("store_homepage_file_readMin"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(59,202,236,0.3)' // 0% 处的颜色
                }, {
                    offset: 0.8, color: 'rgba(59,202,236,0)' // 100% 处的颜色
                }, {
                    offset: 1, color: 'rgba(59,202,236,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        data: fileRMinDataSet,
        lineStyle: {
            color: "rgba(59,202,236,1)",
            shadowColor: "rgba(17,136,221,0.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    }];
    fileROption.legend.data = [{
        name: $.doI18n("store_homepage_file_readMax"),
        icon: legendType

    }, {
        name: $.doI18n("store_homepage_file_readMin"),
        icon: legendType

    }];
    fileROption.yAxis.name = $.doI18n("store_homepage_unit_colon") + dataList[0].unit + "/S";
    $.each(dataList, function (i, item) {
        if (item.type == 'read') {
            xAxisDataSet.push($.dateFormat(item.ctime, dateTemp));
            fileRMaxDataSet.push(item.maxv || 0);
            fileRMinDataSet.push(item.minv || 0);
        }
    });
    fileROption.xAxis.data = xAxisDataSet;
    return fileROption;

}
function setFileWOption(dataList, dateTemp) {
    var fileWOption = $.extend(true, {}, optionTemp);
    var fileWMaxDataSet = [], fileWMinDataSet = [], xAxisDataSet = [];
    fileWOption.series = [{
        name: $.doI18n("store_homepage_file_writeMax"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(72,132,253,0.3)' // 0% 处的颜色
                }, {
                    offset: 0.8, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }, {
                    offset: 1, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        data: fileWMaxDataSet,
        lineStyle: {
            color: "rgba(72,132,253,1)",
            shadowColor: "rgba(17,136,221,0.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    }, {
        name: $.doI18n("store_homepage_file_writeMin"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(59,202,236,0.3)' // 0% 处的颜色
                }, {
                    offset: 0.8, color: 'rgba(59,202,236,0)' // 100% 处的颜色
                }, {
                    offset: 1, color: 'rgba(59,202,236,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        data: fileWMinDataSet,
        lineStyle: {
            color: "rgba(59,202,236,1)",
            shadowColor: "rgba(17,136,221,0.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    }];
    fileWOption.legend.data = [{
        name: $.doI18n("store_homepage_file_writeMax"),
        icon: legendType

    }, {
        name: $.doI18n("store_homepage_file_writeMin"),
        icon: legendType
    }];
    fileWOption.yAxis.name = $.doI18n("store_homepage_unit_colon") + dataList[0].unit + "/S";
    $.each(dataList, function (i, item) {
        if (item.type == 'write') {
            xAxisDataSet.push($.dateFormat(item.ctime, dateTemp));
            fileWMaxDataSet.push(item.maxv || 0);
            fileWMinDataSet.push(item.minv || 0);
        }



    });
    fileWOption.xAxis.data = xAxisDataSet;
    return fileWOption;


}
function setFileFlockOption(dataList, dateTemp) {
    var FileFlockOption = $.extend(true, {}, optionTemp);
    var FileFlockDataSet = [], xAxisDataSet = [];
    FileFlockOption.series = [{
        name: $.doI18n("store_homepage_file_lock"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(72,132,253,0.3)' // 0% 处的颜色
                }, {
                    offset: 0.8, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }, {
                    offset: 1, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        data: FileFlockDataSet,
        lineStyle: {
            color: "rgba(72,132,253,1)",
            shadowColor: "rgba(17,136,221,0.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    }];
    FileFlockOption.yAxis.name = $.doI18n("store_homepage_unit_num_persecond");
    FileFlockOption.legend.data = [{
        name: $.doI18n("store_homepage_file_lock"),
        icon: legendType
    }];
    $.each(dataList, function (i, item) {
        xAxisDataSet.push($.dateFormat(item.ctime, dateTemp));
        if (item.avg) {
            FileFlockDataSet.push(item.avg);
        } else {
            FileFlockDataSet.push(0);
        }

    });
    FileFlockOption.xAxis.data = xAxisDataSet;
    return FileFlockOption;


}
function setIOPSOption(dataList, dateTemp) {
    var IOPSOption = $.extend(true, {}, optionTemp);
    var IOPSRDataSet = [], IOPSWDataSet = [], xAxisDataSet = [];
    IOPSOption.series = [{
        name: $.doI18n("store_homepage_IOPS_read"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(72,132,253,0.3)' // 0% 处的颜色
                }, {
                    offset: 0.8, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }, {
                    offset: 1, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        data: IOPSRDataSet,
        lineStyle: {
            color: "rgba(72,132,253,1)",
            shadowColor: "rgba(17,136,221,0.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    }, {
        name: $.doI18n("store_homepage_IOPS_write"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(40,196,239,0.3)' // 0% 处的颜色
                }, {
                    offset: 0.8, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }, {
                    offset: 1, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        data: IOPSWDataSet,
        lineStyle: {
            color: "rgba(40,196,239,1)",
            shadowColor: "rgba(17,136,221,0.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    }];
    IOPSOption.yAxis.name = $.doI18n("store_homepage_unit_num_persecond");
    IOPSOption.legend.data = [{
        name: $.doI18n("store_homepage_IOPS_read"),
        icon: legendType
    }, {
        name: $.doI18n("store_homepage_IOPS_write"),
        icon: legendType
    }];

    $.each(dataList, function (i, item) {
        if (item.type == 'read') {
            IOPSRDataSet.push(item.avg);
            xAxisDataSet.push($.dateFormat(item.ctime, dateTemp));

        } else if (item.type == "write") {
            IOPSWDataSet.push(item.avg);
        }

    });
    IOPSOption.xAxis.data = xAxisDataSet;
    return IOPSOption;

}
function setFileQueryOption(dataList, dateTemp) {
    var FileQueryOption = $.extend(true, {}, optionTemp);
    var FileQueryDataSet = [], DirQueryDataSet = [], FileDeleteDataSet = [], FileCreateDataSet = [], xAxisDataSet = [];
    FileQueryOption.series = [{
        name: $.doI18n("store_homepage_file_query"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(72,132,253,0.3)' // 0% 处的颜色
                }, {
                    offset: 0.8, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }, {
                    offset: 1, color: 'rgba(40,196,239,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        data: FileQueryDataSet,
        lineStyle: {
            color: "rgba(72,132,253,1)",
            shadowColor: "rgba(17,136,221,0.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    },/*{
            name:'目录查询',
            type:'line',
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(59,202,236,0.3)' // 0% 处的颜色
                    }, {
                        offset: 0.8, color: 'rgba(59,202,236,0)' // 100% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(59,202,236,0)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }
            },
            data:DirQueryDataSet,
            lineStyle:{
                color:"rgba(59,202,236,1)",
                shadowColor: "rgba(17,136,221,0.5)",
                shadowOffsetX:0,
                shadowOffsetY:3,
                shadowBlur: 3,
            },
            smooth: true,
            symbol:"none"
        },*/{
        name: $.doI18n("store_homepage_file_create"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(59,202,236,0.3)' // 0% 处的颜色
                }, {
                    offset: 0.8, color: 'rgba(59,202,236,0)' // 100% 处的颜色
                }, {
                    offset: 1, color: 'rgba(59,202,236,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        data: FileCreateDataSet,
        lineStyle: {
            color: "rgba(58,233,218,1)",
            shadowColor: "rgba(17,136,221,0.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    }, {
        name: $.doI18n("store_homepage_file_delete"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(58,233,218,0.3)' // 0% 处的颜色
                }, {
                    offset: 0.8, color: 'rgba(58,233,218,0)' // 100% 处的颜色
                }, {
                    offset: 1, color: 'rgba(58,233,218,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        data: FileDeleteDataSet,
        lineStyle: {
            color: "rgba(72,75,253,1)",
            shadowColor: "rgba(17,136,221,0.5)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    }];
    FileQueryOption.yAxis.name = $.doI18n("store_homepage_unit_num_persecond");
    FileQueryOption.legend.data = [{
        name: $.doI18n("store_homepage_file_query"),
        icon: legendType
    }/*,{
            name:'目录查询',
            icon: legendType
        }*/, {
        name: $.doI18n("store_homepage_file_create"),
        icon: legendType
    }, {
        name: $.doI18n("store_homepage_file_delete"),
        icon: legendType
    }];
    $.each(dataList, function (i, item) {
        if (item.type == 'dirread') {
            xAxisDataSet.push($.dateFormat(item.ctime, dateTemp));
            DirQueryDataSet.push(item.avg || 0);
        } else if (item.type == 'filequery') {
            FileQueryDataSet.push(item.avg || 0);

        } else if (item.type == 'filecreate') {
            FileCreateDataSet.push(item.avg || 0);

        } else if (item.type == 'filedelete') {

            FileDeleteDataSet.push(item.avg || 0);

        }

    });
    FileQueryOption.xAxis.data = xAxisDataSet;
    return FileQueryOption;



}
function getTimeTemp() {
    var timeTemp;
    switch (range) {
        case "tenmin": case "hour": timeTemp = "HH:mm:ss";
            break;
        case "day": case "week": timeTemp = "MM-dd HH:mm";
            break;
        case "month": timeTemp = "MM-dd";
            break;
        case "year": timeTemp = "yyyy-MM";
            break;
    }
    return timeTemp;
}
function chartRate() {
    window.clearInterval(chartInterval);
    if (range == "tenmin" || range == "hour") {
        chartInterval = window.setInterval(drawChart, 5000);
        window.intervals.push(chartInterval);
    }

}

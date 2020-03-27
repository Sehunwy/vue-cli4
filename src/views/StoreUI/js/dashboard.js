import echarts from 'echarts'
var optionTemp = {
    title: {
        show: false
    },
    color: ["#4884FD", "#3BCAEC", "#3AE9DA", "#484BFD"],
    /*   legend :{
           show : true,
           /!* data: ['CPU'],*!/
       },*/
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
        left: 80,
        right: 50,
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
        // nameGap:26
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
            /* align:"left"*/
            padding: [0, 20, 0, 0]

        },
        axisLabel: {
            color: "#666666",
            fontSize: 12
        },
        offset: 29,

    }
};
var legendType = 'circle';
export function dashboard() {
    $.clearIntervals();
    initMonitor();
    bindEvent();
}
function initMonitor() {
    getStorageMonitor();
    getWarnMonitor();
    getCardMonitor();
    initServerChart();
    initAppChart();
    monitorRate();
}
function monitorRate() {
    var storageInterval = setInterval(getStorageMonitor, 5000);
    window.intervals.push(storageInterval);
    //    window.dashboardIntervals.push(storageInterval);
    var cardInterval = setInterval(getCardMonitor, 5000);
    window.intervals.push(cardInterval);
    //    window.dashboardIntervals.push(cardInterval);
    var warnInterval = setInterval(getWarnMonitor, 5000);
    window.intervals.push(warnInterval);
    //    window.dashboardIntervals.push(warnInterval);
    var appInterval = setInterval(initAppChart, 5000);
    var serverInterval = setInterval(initServerChart, 5000);
    window.intervals.push(appInterval);
    window.intervals.push(serverInterval);
    //    window.dashboardIntervals.push(appInterval);
    //    window.dashboardIntervals.push(serverInterval);
}
function getStorageMonitor() {
    $.$ajax({
        type: "get",
        url: "/api/store/fs/capacity/list",
        cache: false,
        data: {},
        success: function (json) {
            if (!json.error) {
                $(".storage-box .storage-no-result").addClass("dn");
                $(".storage-box .storage-box-content").removeClass("dn");
                var $section = $(".dashboard-box-section");
                var total = $.formatSizeStr(json.data.total_size),
                    free = $.formatSizeStr(json.data.free_size),
                    used = $.formatSizeStr(json.data.total_size - json.data.free_size),
                    percent;
                if (json.data.total_size == 0) {
                    percent = "0%";

                } else {
                    percent = Math.ceil((json.data.total_size - json.data.free_size) / json.data.total_size * 100) + "%";
                }
                var $label = $("<div><div class='storage-percent'>" + percent + "</div><div class='used-num'>" + $.doI18n("store_dashboard_used") + used + "</div></div>");
                $section.find(".storage-des .total").html(total);
                $section.find(".storage-des .unused").html(free);
                $section.find(".storage-progress-box").loongProgress({
                    isCircle: true,  // true:circle,false:Line
                    isColor: false,//true：默认配置 false:color
                    isGradient: true,//是否渐变
                    color: { 'per50': "#32E8FF", 'per100': "#C832FF" },//"#1188dd"
                    // color: "#1188dd", // "#1188dd",{'per50':"#C832FF",'per100':"#32E8FF"}
                    backgroundColor: "#E9ECEF",
                    background: true,
                    speed: 800,
                    slideHeight: 6,//circle:环形宽度 line：高度
                    value: percent,//当前进度
                    counterclockwise: false,//true:逆时针
                    size: 160,//circle:外直径 line：宽度
                    lineCap: "round",
                    text: false,
                    initGap: 0,//记录上次值位置
                    panRadius: 2,
                    slideRadius: 2,
                    txt: $label.html(),
                    fontSize: '12px',
                    fontColor: '',
                    fontFamily: 'PingFangSC-Regular',
                    fontWeight: '500',
                    txtPosition: 'center',  //center top bottom right
                    startAngle: 2 / 3 * Math.PI,//开始角度
                    endAngle: 7 / 3 * Math.PI,//结束角度
                    scale: true,//是否有刻度
                    scaleWidth: 2,//刻度宽度
                    scaleHeight: 5,//刻度长度

                });
                $(".storage-box .storage-box-content").removeClass("dn");

            } else {
                var $text = $(".storage-box .storage-no-result").find("p");
                var $img = $(".storage-box .storage-no-result").find("img");
                switch (json.error) {
                    case "mds_no_running": $text.html($.doI18n("store_dashboard_mds_no_running"));
                        $img.attr("src", "/StoreUI/image/no-running.png");
                        break;

                    case "no_mds_node": $text.html($.doI18n("store_dashboard_no_mds_node"));
                        $img.attr("src", "/StoreUI/image/no-server.png");
                        break;
                    case "mds_cleint_no_run_or_locked": $text.html($.doI18n("store_dashboard_mds_client_no"));
                        $img.attr("src", "/StoreUI/image/noResult.png");

                }

                $(".storage-box .storage-box-content").addClass("dn");
                $(".storage-box .storage-no-result").removeClass("dn");

            }

        }
    })

}
function getCardMonitor() {
    $.$ajax({
        type: "get",
        url: "/api/store/node/monitor/cluster/info",
        cache: false,
        data: {},
        success: function (json) {
            var $nodeCard = $(".card-box[name='node-server']"),
                $appCard = $(".card-box[name='app']"),
                $diskCard = $(".card-box[name='disk']");
            $nodeCard.find(".card-num-txt").html(json.data.serverCount);
            $appCard.find(".card-num-txt").html(json.data.clientCount);
            $diskCard.find(".card-num-txt").html(json.data.badDiskCount);
            $appCard.find(".des-item-txt[name='run-app']").html(json.data.runningClient);
            $appCard.find(".des-item-txt[name='stop-app']").html(json.data.stopClient);
            $appCard.find(".des-item-txt[name='unknown-app']").html(json.data.unknowClient);
            $nodeCard.find(".des-item-txt[name='run-server']").html(json.data.runnigServer);
            $nodeCard.find(".des-item-txt[name='bad-server']").html(json.data.badServer);
            $nodeCard.find(".des-item-txt[name='stop-server']").html(json.data.stopServer);
            $(".card-box:not([name='warn'])").find(".des-item-txt").each(function () {
                var $dom = $(this);
                if (parseInt($dom.html()) > 999) {
                    /*$(this).loongPopOver({
                        content:$dom.html(),
                        width:"",
                        position:"left",
                        bgColor:"#333",
                        fontColor:"#fff"
                    });*/
                    $dom.attr("title", $dom.html());
                    $dom.html("999+");
                };
            });
        }
    });

}
function getWarnMonitor() {
    var owner = window.sessionStorage.getItem("user");
    $.$ajax({
        type: "get",
        url: "/api/store/alarm/dashboard/info",
        data: {
            owner: owner
        },
        cache: false,
        success: function (json) {
            var $warnCard = $(".card-box[name='warn']");
            $warnCard.find(".card-num-txt").html(json.data.allAlarms);
            $warnCard.find(".des-item-txt[name='high-warn']").html(json.data.FatalAlarms);
            $warnCard.find(".des-item-txt[name='light-warn']").html(json.data.errorAlarms);
            $warnCard.find(".des-item-txt[name='normal-warn']").html(json.data.warningAlarms);
            $warnCard.find(".des-item-txt").each(function () {
                var $dom = $(this);
                if (parseInt($dom.html()) > 999) {
                    /* $dom.loongPopOver({
                         content:$dom.html(),
                         width:"",
                         position:"left",
                         bgColor:"#333",
                         fontColor:"#fff"
                     });*/
                    $dom.attr("title", $dom.html());
                    $dom.html("999+");
                }
            });


        }
    })
}
function drawAppChart(dataList, $container) {
    var config = $.extend(true, {}, optionTemp);
    var fileRDataSet = [], fileWDataSet = [], xAxisDataSet = [];
    config.series = [{
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
    config.legend = {
        itemHeight: 8,
        data: [{
            name: $.doI18n("store_homepage_file_read_rate"),
            icon: legendType,
            /*textStyle: {
                color: 'rgba(72,132,253,1)',
 
            },*/


        }, {
            name: $.doI18n("store_homepage_file_write_rate"),
            icon: legendType,
            /* textStyle: {
                 color: 'rgba(59,202,236,1)',
             }*/
        }],
        right: "100px"
    };
    config.yAxis.name = $.doI18n("store_homepage_unit_colon") + dataList[0].unit + "/S";
    var readTimeList = [], writeTimeList = [];
    $.each(dataList, function (i, item) {
        if (item.type == 'read') {
            fileRDataSet.push(item.avg || 0);
            readTimeList.push($.dateFormat(item.ctime, "HH:mm:ss"));
        } else if (item.type == "write") {
            fileWDataSet.push(item.avg || 0);
            writeTimeList.push($.dateFormat(item.ctime, "HH:mm:ss"));
        }

    });
    readTimeList.length > writeTimeList.length ? xAxisDataSet = writeTimeList : xAxisDataSet = readTimeList;
    config.xAxis.data = xAxisDataSet;
    var chart = echarts.init($container[0]);
    chart.setOption(config);
    window.addEventListener("resize", function () {
        chart.resize();
    });


}
function drawServerChart(dataList, $container) {
    var config = $.extend(true, {}, optionTemp);
    var fileRDataSet = [], fileWDataSet = [], xAxisDataSet = [];
    config.series = [{
        name: $.doI18n("store_dashboard_up"),
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
        name: $.doI18n("store_dashboard_down"),
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
    config.legend = {
        itemHeight: 8,
        data: [{
            name: $.doI18n("store_dashboard_up"),
            icon: legendType,
            /* textStyle: {
                 color: 'rgba(72,132,253,1)'
             }*/
        }, {
            name: $.doI18n("store_dashboard_down"),
            icon: legendType,
            /*textStyle: {
                color: 'rgba(59,202,236,1)'
            }*/
        }],
        right: "100px"
    },
        config.yAxis.name = $.doI18n("store_homepage_unit_colon") + dataList[0].unit + "/S";
    var outTimeList = [], inTimeList = [];
    $.each(dataList, function (i, item) {
        if (item.type == 'out') {
            fileRDataSet.push(item.avg || 0);
            outTimeList.push($.dateFormat(item.ctime, "HH:mm:ss"));
        } else if (item.type == "in") {
            fileWDataSet.push(item.avg || 0);
            inTimeList.push($.dateFormat(item.ctime, "HH:mm:ss"));
        }

    });
    outTimeList.length > inTimeList.length ? xAxisDataSet = inTimeList : xAxisDataSet = outTimeList;
    config.xAxis.data = xAxisDataSet;
    var chart = echarts.init($container[0]);
    chart.setOption(config);
    window.addEventListener("resize", function () {
        chart.resize();
    });

}
function initAppChart() {
    $.$ajax({
        type: "get",
        url: "/api/store/node/monitor/cluster/perfs/list",
        data: {
            range: "tenmin",
            metric: "FileRW",
            clusterType: "ls_client"
        },
        cache: false,
        success: function (json) {
            if (json.data.length == 0) {
                $(".chart-detail-icon[name='app']").addClass("dn");
                $(".dashboard-chart-box[name='app']").empty();
                $(".dashboard-chart-box[name='app']").append("<div style='padding-top:75px;text-align:center;color:#999;fon-size:18px;'><img src='StoreUI/image/no-server.png'><p class='mt10'>" + $.doI18n('store_no_monitor_data') + "</p></div>");
            }
            else {
                drawAppChart(json.data, $(".dashboard-chart-box[name='app']"));
            }
        }
    });
}
function initServerChart() {
    $.$ajax({
        type: "get",
        url: "/api/store/node/monitor/cluster/perfs/list",
        data: {
            range: "tenmin",
            metric: "Network",
            clusterType: "ls_istore"
        },
        cache: false,
        success: function (json) {
            if (json.data.length == 0) {
                $(".chart-detail-icon[name='istore']").addClass("dn");
                $(".dashboard-chart-box[name='istore']").empty();
                $(".dashboard-chart-box[name='istore']").append("<div style='padding-top:75px;text-align:center;color:#999;fon-size:18px;'><img src='StoreUI/image/no-server.png'><p class='mt10'>" + $.doI18n('store_no_monitor_data') + "</p></div>");
            }
            else {
                drawServerChart(json.data, $(".dashboard-chart-box[name='istore']"));
            }

        }
    })
}
function bindEvent() {
    var $section = $(".dashboard-box-section");
    $(".dashboard-chart-wrap").find(".chart-detail-icon").click(function () {
        var url;
        if ($(this).attr("name") == "app") {
            url = "/StoreUI/page/application-homepage-detail.html"
        } else if ($(this).attr("name") == "istore") {
            url = "/StoreUI/page/store-homepage-detail.html"

        }
        $.loadPage(url, {}, $("#container"));

    });
    $section.find(".detail-icon[name='storage']").click(function () {
        linkToMenu("group");
    });
    $section.find(".card-box").click(function () {
        var type = $(this).attr("name");
        switch (type) {
            case "node-server": linkToMenu("server");
                break;
            case "app": linkToMenu("client");
                break;
            case "warn": $.loadPage("/LoongUI/public/page/warn.html", {}, $("#container"));
                break;
            case "disk": linkToMenu("server");
                break;
        }

    });
}
function linkToMenu(name) {
    if ($(".second-menu[name='" + name + "']").length > 0) {
        if (hasSubMenuFlag) {
            $.menuActive($(".first-menu[name='store']"));
            $.menuActive($(".second-menu[name='" + name + "']"));
        } else {
            $.menuActive($(".second-menu[name='" + name + "']"));
        }
    }
    else {
        $.menuActive($(".single-menu[name='" + name + "']"));
    }

};

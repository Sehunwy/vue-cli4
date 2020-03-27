import echarts from 'echarts'
var option = {
    title: {
        show: false
    },
    tooltip: {
        trigger: 'axis'
    },
    toolbox: {
        show: false
    },
    grid: {
        left: '5%',
        right: '5%',
        bottom: '13%'
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
        },
        nameTextStyle: {
            color: "#555555",
            fontSize: 12,
            align: "left"

        }

    }

};
var lastStartmillions, lastStopmillions, UserTable;

export function dashboard() {
    $.clearIntervals();
    lastStartmillions = '', lastStopmillions = '', UserTable = '';
    initMonitor()
}
function initMonitor() {
    var $dashboardWrap = $("div[name='disk-dashboard-wrap']");
    initWrapIo($dashboardWrap.find("div[name=sys-io-wrap]"));
    initWrapIo($dashboardWrap.find("div[name=member-io-wrap]"));
    getStorageMonitor($(".dashboard-box-wrap").find('div[name=storage]'), "/api/info/syscapacity/list");
    getStorageMonitor($(".dashboard-box-wrap").find('div[name=syscapacity]'), "/api/info/usercount/list");
    getListOn();
    monitorRate($dashboardWrap);
}
function monitorRate($wrap) {
    var storageInterval = setInterval(function () {
        getStorageMonitor($(".dashboard-box-wrap").find('div[name=storage]'), "/api/info/syscapacity/list");
    }, 60000);
    window.intervals.push(storageInterval);
    // window.dashboardIntervals.push(storageInterval);

    var memberInterval = setInterval(function () {
        getStorageMonitor($(".dashboard-box-wrap").find('div[name=syscapacity]'), "/api/info/usercount/list");
    }, 10000);
    window.intervals.push(memberInterval);
    // window.dashboardIntervals.push(memberInterval);

    var listOnInterval = setInterval(getListOn, 120000);
    window.intervals.push(listOnInterval);
    // window.dashboardIntervals.push(listOnInterval);

}

function getStorageMonitor($section, url) {
    $.$ajax({
        type: "get",
        url: url,
        cache: false,
        data: {},
        success: function (json) {
            if (json.data) {
                if (url == "/api/info/syscapacity/list") {
                    var data = json.data[0];
                    var labelTemp = $.doI18n("disk_has_used");
                    var total = $.formatSizeStr(data.total),
                        free = $.formatSizeStr(data.remaining),
                        used = $.formatSizeStr(data.used),
                        percent;
                    if (data.total == 0) {
                        percent = "0%";
                    } else {
                        percent = Math.ceil(data.used / data.total * 100) + "%";
                    }
                }
                if (url == "/api/info/usercount/list") {
                    var data = json.data;
                    var labelTemp = $.doI18n("disk_created_number");
                    var total = data.total,
                        free = data.remaining;
                    used = data.used;
                    if (data.total == 0) {
                        percent = "0%";
                    } else {
                        percent = Math.ceil(data.used / data.total * 1000) / 10 + "%";
                    }
                }
                $(".storage-box .storage-no-result").addClass("dn");
                $(".storage-box .storage-box-content").removeClass("dn");
                var $label = $("<div><div class='storage-percent'>" + percent + "</div><div class='used-num'>" + labelTemp + used + "</div></div>");
                $section.find(".storage-des .total").html(total);
                $section.find(".storage-des .unused").html(free);
                $section.find(".storage-progress-box").loongProgress({
                    isCircle: true, // true:circle,false:Line
                    isColor: false, //true：默认配置 false:color
                    isGradient: true, //是否渐变
                    color: {
                        'per50': "#32E8FF",
                        'per100': "#C832FF"
                    }, //"#1188dd"
                    // color: "#1188dd", // "#1188dd",{'per50':"#C832FF",'per100':"#32E8FF"}
                    backgroundColor: "#E9ECEF",
                    background: true,
                    speed: 800,
                    slideHeight: 6, //circle:环形宽度 line：高度
                    value: percent, //当前进度
                    counterclockwise: false, //true:逆时针
                    size: 160, //circle:外直径 line：宽度
                    lineCap: "round",
                    text: false,
                    initGap: 0, //记录上次值位置
                    panRadius: 2,
                    slideRadius: 2,
                    txt: $label.html(),
                    fontSize: '12px',
                    fontColor: '',
                    fontFamily: 'PingFangSC-Regular',
                    fontWeight: '500',
                    txtPosition: 'center', //center top bottom right
                    startAngle: 2 / 3 * Math.PI, //开始角度
                    endAngle: 7 / 3 * Math.PI, //结束角度
                    scale: true, //是否有刻度
                    scaleWidth: 2, //刻度宽度
                    scaleHeight: 5, //刻度长度

                });

            } else {
                $(".storage-box .storage-box-content").addClass("dn");
                $(".storage-box .storage-no-result").removeClass("dn");

            }

        }
    })

}

function getListOn() {
    $.$ajax({
        type: "get",
        url: "/api/log/diskonlineuser/list",
        cache: false,
        data: {},
        success: function (json) {
            var $ul = $("ul[name='on-member-list']");
            $ul.empty();
            var arr = json.data;
            $("div[name='on-num']").html(arr.length);
            if (arr.length > 0) {
                var newArr;
                if (arr.length >= 20) {
                    newArr = arr.slice(0, 20)
                } else {
                    newArr = arr;
                }
                for (var i = 0; i < newArr.length; i++) {
                    if (i < 19) {
                        $ul.append("<li class='toe' title=" + newArr[i].user + ">" + newArr[i].user + "</li>");
                    } else {
                        $ul.append("<li class='fs16 hand' style='color: #1188DD;' name='more-member' title='" + $.doI18n("disk_view_online_user_list") + "'><span><svg class='icon fs12'><use xlink:href='#icon-gengduo'></use></svg></span></li>");

                        $ul.find("li[name=more-member]").click(function () {
                            allOnlist();
                        })
                        return;
                    }
                }
            } else {
                $ul.append("<div class='fs12 tac lh130 c9'>" + $.doI18n("disk_no_online_user") + "</div>")

            }
        }
    })
}

function initWrapIo($wrap) {
    if ($wrap.find(".datepicker").length > 0) {
        $wrap.find(".datepicker").remove();
    }
    var start = $wrap.find("[name='startTimeContainer']").loongDatepickerfull({
        name: "starttime",
        width: "170"
    });
    var end = $wrap.find("[name='endTimeContainer']").loongDatepickerfull({
        name: "stoptime",
        width: "170"
    });
    start.input.attr("placeholder", $.doI18n("disk_start_time"));
    end.input.attr("placeholder", $.doI18n("disk_stop_time"));
    var curDate = new Date();
    var preDate = new Date(curDate.getTime() - 23 * 60 * 60 * 1000);
    end.setDate(curDate);
    start.setDate(preDate);
    var startmillions = $wrap.find("input[name='starttime']").val();
    var stopmillions = $wrap.find("input[name='stoptime']").val();
    if ($wrap.attr("name") == "sys-io-wrap") {
        var data = initIoChartData("/api/log/disksystemio/draw", startmillions, stopmillions).data;
        var range = msFormat(stopmillions - startmillions);
        var chartOption = setIoOption(data, xAxisUnit(range));
        drawIOChart($wrap, chartOption);
    }
    if ($wrap.attr("name") == "member-io-wrap") {
        initMember(startmillions, stopmillions)
    }
    lastStartmillions = startmillions;
    lastStopmillions = stopmillions;
    $wrap.find('div[name=query-io-btn]').click(function () {
        startmillions = $wrap.find("input[name='starttime']").val();
        stopmillions = $wrap.find("input[name='stoptime']").val();
        if (startmillions == 0 || stopmillions == 0) {
            $.loongDialog({
                "content": $.doI18n("disk_dataTime_not_select"),
                "isModal": false,
                "msgType": "warning"
            });
            return;
        }
        if (Number(startmillions) > Number(stopmillions)) {
            $.loongDialog({
                "content": $.doI18n("disk_startTime_not_later_than_endTime"),
                "isModal": false,
                "msgType": "error"
            });
        } else {
            var range = msFormat(stopmillions - startmillions);
            if ($wrap.attr("name") == "sys-io-wrap") {
                var data = initIoChartData("/api/log/disksystemio/draw", startmillions, stopmillions).data;
                var chartOption = setIoOption(data, xAxisUnit(range))
                drawIOChart($wrap, chartOption);
            }
            if ($wrap.attr("name") == "member-io-wrap") {

                initMember(startmillions, stopmillions)


            }
        }

    })

}

//根据输入毫秒值转换
// by:liyaping
function msFormat(s) {
    if (s <= 24 * 3600000) {
        return "hour";
    } else if (s > 23 * 3600000 && s <= 30 * 24 * 3600000) {
        return "day";
    } else {
        return "month";
    }
}

function drawIOChart($wrap, chartOption) {
    var currentChart = echarts.init($wrap.find(".disk-dashboard-chart-box")[0]);
    currentChart.setOption(chartOption);
    window.addEventListener("resize", function () {
        currentChart.resize();
    });

}

function initMember(startmillions, stopmillions) {
    UserTable = $("div[name=member-list-io]").loongTable({
        height: "300px",
        fields: [{
            "name": "user",
            "overflowEllipsis": true,
            "title": $.doI18n("disk_dashboard_member_name")

        },
        {
            "name": "io",
            "title": $.doI18n("disk_member_io"),
            formater: function (value) {
                return $.formatSizeStr(value);
            }

        },
        {
            "name": "read",
            "title": $.doI18n("disk_member_read"),
            formater: function (value) {
                return $.formatSizeStr(value);
            }

        },
        {
            "name": "write",
            "title": $.doI18n("disk_member_write"),
            formater: function (value) {
                return $.formatSizeStr(value);
            }

        },
        {
            "name": "request",
            "title": $.doI18n("disk_member_request")
        },
        {
            "name": "login",
            "title": $.doI18n("disk_login")

        },
        {
            "name": "operation",
            "title": $.doI18n("disk_operation"),
            "type": "button",
            "operations": [{
                "text": $.doI18n("disk_look_member_io_detail"),
                'icon': '#icon-chakanxiangqing',
                "callBack": function (index, rowData) {
                    //    detailIo(rowData);
                    var startmillions = $("div[name=member-io-wrap]").find("input[name=starttime]").val();
                    var stopmillions = $("div[name=member-io-wrap]").find("input[name=stoptime]").val();
                    if (startmillions == 0 || stopmillions == 0) {
                        startmillions = lastStartmillions;
                        stopmillions = lastStopmillions;
                    }
                    var url = "/DiskUI/page/disk-memberio-detail.html"
                    $.loadPage(url, {
                        "user": rowData.user,
                        "startmillions": startmillions,
                        "stopmillions": stopmillions
                    }, $("#container"));


                }
            }]
        }
        ],
        hasCheckbox: false,
        ajaxData: true,
        url: "/api/log/diskuserio/list",
        dataType: "json",
        method: "get",
        pagination: true,
        overflowTips: true,
        params: {
            startmillions: startmillions,
            stopmillions: stopmillions,
            dcID: "1"
        }
    });
}


function setIoOption(data, timeFormat) {
    var IoOption = $.extend(true, {}, option);
    var xAxisDataSet = [];
    var readDataSet = [],
        writeDataSet = [],
        ioUnit;
    var requestDataSet = [],
        loginDataSet = [];
    IoOption.series = [{
        name: $.doI18n("disk_member_read"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0,
                    color: 'rgba(72,132,253,0.1)'
                }, {
                    offset: 0.8,
                    color: 'rgba(72,132,253,0)'
                }, {
                    offset: 1,
                    color: 'rgba(72,132,253,0)'
                }]
            }
        },
        data: readDataSet,
        lineStyle: {
            color: "rgba(72,132,253,1)",
            shadowColor: "rgba(52,112,233,0.3)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    },
    {
        name: $.doI18n("disk_member_write"),
        type: 'line',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0,
                    color: 'rgba(118,69,255,0.1)'
                }, {
                    offset: 0.8,
                    color: 'rgba(118,69,255,0)'
                }, {
                    offset: 1,
                    color: 'rgba(118,69,255,0)'
                }]
            }
        },
        data: writeDataSet,
        lineStyle: {
            color: "rgba(118,69,255,1)",
            shadowColor: "rgba(78,51,228,0.3)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    },
    {
        name: $.doI18n("disk_member_request"),
        type: 'line',
        yAxisIndex: 1,
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0,
                    color: 'rgba(216,39,255,0.1)' // 0% 处的颜色
                }, {
                    offset: 0.8,
                    color: 'rgba(216,39,255,0)' // 100% 处的颜色
                }, {
                    offset: 1,
                    color: 'rgba(216,39,255,0)' // 100% 处的颜色
                }],

            }
        },
        data: requestDataSet,
        lineStyle: {
            color: "rgba(216,39,255,1)",
            shadowColor: "rgba(167,41,205,0.3)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    },
    {
        name: $.doI18n("disk_member_login"),
        type: 'line',
        yAxisIndex: 1,
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0,
                    color: 'rgba(4,252,255,0.1)' // 0% 处的颜色
                }, {
                    offset: 0.8,
                    color: 'rgba(4,252,255,0)' // 100% 处的颜色
                }, {
                    offset: 1,
                    color: 'rgba(4,252,255,0)' // 100% 处的颜色
                }],
            }
        },
        data: loginDataSet,
        lineStyle: {
            color: "rgba(4,252,255,1)",
            shadowColor: "rgba(38,212,197,0.3)",
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowBlur: 3,
        },
        smooth: true,
        symbol: "none"
    }

    ];

    IoOption.color = ['rgba(72,132,253,1)', 'rgba(118,69,255,1)', 'rgba(216,39,255,1)', 'rgba(4,252,255,1)'];
    IoOption.legend = {
        itemHeight: 8,
        data: [{
            name: $.doI18n("disk_member_read"),
            icon: "circle",
            textStyle: {
                color: 'rgba(72,132,253,1)'
            }
        },
        {
            name: $.doI18n("disk_member_write"),
            icon: "circle",
            textStyle: {
                color: 'rgba(118,69,255,1)'
            }
        },
        {
            name: $.doI18n("disk_member_request"),
            icon: "circle",
            textStyle: {
                color: 'rgba(216,39,255,1)'
            }
        },
        {
            name: $.doI18n("disk_member_login"),
            icon: "circle",
            textStyle: {
                color: 'rgba(4,252,255,1)'
            }
        }
        ],
        right: "4%"
    };
    $.each(data, function (i, item) {
        if (i == 0) {
            ioUnit = item.unit;
        }
        xAxisDataSet.push($.dateFormat(item.time, timeFormat));
        readDataSet.push(item.read);
        writeDataSet.push(item.write);
        requestDataSet.push(item.request);
        loginDataSet.push(item.login);
    });

    IoOption.yAxis = [{
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
        offset: 9,
    },
    {
        type: 'value',
        position: 'right',
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
        offset: 9,
    }

    ];
    if (timeFormat == "HH") {
        IoOption.xAxis.name = $.doI18n("disk_time") + ":" + $.doI18n("disk_hour");

    }
    if (timeFormat == "dd") {
        IoOption.xAxis.name = $.doI18n("disk_time") + ":" + $.doI18n("disk_day");

    }
    if (timeFormat == "MM") {
        IoOption.xAxis.name = $.doI18n("disk_time") + ":" + $.doI18n("disk_mounth");

    }
    IoOption.xAxis.nameLocation = "center";
    IoOption.xAxis.nameGap = 25;
    IoOption.yAxis[0].name = $.doI18n("disk_unit") + ":" + ioUnit;
    IoOption.yAxis[0].unit = ioUnit;
    IoOption.yAxis[1].name = $.doI18n("disk_unit") + ":" + $.doI18n("disk_num");
    IoOption.yAxis[1].unit = $.doI18n("disk_num");
    IoOption.xAxis.data = xAxisDataSet;
    return IoOption;
}

function initIoChartData(url, startmillions, stopmillions) {
    var Iodata;
    $.$ajax({
        type: "get",
        url: url,
        data: {
            startmillions: startmillions,
            stopmillions: stopmillions,
            dcID: "1"
        },
        cache: false,
        async: false,
        success: function (data) {
            Iodata = data;
        }
    });
    return Iodata;
}




//y轴单位根据最大值转换
function getUnit(arr) {
    var max;
    if (Array.isArray(arr)) {
        max = Math.max.apply(null, arr);
    } else {
        max = arr;
    }
    var unit = "B"
    if (max >= 1024) {
        var formatMax = $.formatSizeStr(max);
        unit = formatMax.substring(formatMax.length - 2, formatMax.length);
    }
    return unit;
}

function xAxisUnit(time) {
    var xAxisFormat;
    switch (time) {
        case 'hour':
            xAxisFormat = "HH";
            break;
        case 'day':
            xAxisFormat = "dd";
            break;
        case 'month':
            xAxisFormat = "MM";
            break;
    }
    return xAxisFormat;
}

function allOnlist() {
    var modal = $.loongDialog({
        "title": $.doI18n("disk_online_user_list"),
        "isClosed": true,
        "modalType": "m",
        "fixed": false,
        "content": $("<div name='onMemberList'></div>"),
        "isModal": true

    });
    listTablel = $(".dialog-wrap").find("div[name=onMemberList]").loongTable({
        height: "444",
        fields: [{
            "name": "user",
            "title": $.doI18n("disk_tableheader_username")

        }],
        hasCheckbox: false,
        ajaxData: true,
        url: "/api/log/diskonlineuser/list",
        dataType: "json",
        method: "post"
    });

}

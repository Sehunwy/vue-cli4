//@ sourceURL=dashboard.js
import echarts from 'echarts'
import { util } from '@/views/CloudUI/js/cloud-util.js'
var isDomain = window.sessionStorage.getItem("isDomain") == "true" ? true : false;
var netChartOption = {}, rwChartOption = {}, netChart, storageChart;
var netDot = document.getElementById('net-line-chart'),
	storageDot = document.getElementById('storage-line-chart');
var netInDataSet = [], netOutDataSet = [], readDataSet = [], writeDataSet = [];
var option = {
	tooltip: {
		show: true,
		trigger: 'axis',
		axisPointer: {
			type: "none"
		}
	},
	grid: {
		top: "23%",
		bottom: 0,
		left: "5%",
		right: 0
	},
	color: ["#28C4EF", "#4884FD"],
	xAxis: {
		name: "",
		show: true,
		axisLabel: {//决定是否显示数据
			show: false,
		},
		type: 'category',
		data: (function () {
			var now = new Date();
			var res = [];
			var len = 20;
			while (len--) {
				res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
				now = new Date(now - 3000);
			}
			return res;
		})(),
		boundaryGap: false,//是否从原点开始
		splitLine: {
			show: false //去除网格线
		},
		axisLine: {
			lineStyle: {
				color: "#E9ECEF",
				width: '2'
			}
		}
	},
	yAxis: {
		name: "",
		nameTextStyle: {
			color: '#666'
		},
		type: 'value',
		splitLine: {
			show: false //去除网格线
		},
		axisLabel: {//决定是否显示数据
			show: false,
		},
		axisTick: {//不展示刻度
			show: false
		},
		axisLine: {
			lineStyle: {
				color: "#E9ECEF",
				width: '1'
			}
		}
	},
	series: [{
		name: '',
		type: 'line',
		symbol: 'none',  //去掉点的
		smooth: true,  //让曲线变平滑的,
		smoothMonotone: 'x',
		lineStyle: {
			color: "#28C4EF",
			width: 2,
			shadowOffsetX: 0,
			shadowOffsetY: 3,
			shadowColor: 'rgba(40,196,239, 0.5)',
			shadowBlur: 3

		},
		areaStyle: {
			color: {
				type: 'linear',
				x: 0,
				y: 0,
				x2: 0,
				y2: 1,
				colorStops: [{
					offset: 0, color: 'rgba(40,196,239, 0.3)' // 0% 处的颜色
				}, {
					offset: 0.8, color: 'rgba(40,196,239, 0)' // 100% 处的颜色
				}, {
					offset: 1, color: 'rgba(40,196,239, 0)' // 100% 处的颜色
				}]

			}
		},
		data: []
	},
	{
		name: "",
		type: 'line',
		symbol: 'none',
		smooth: true,
		lineStyle: {
			color: "#4884FD",
			width: 2,
			shadowOffsetX: 0,
			shadowOffsetY: 3,
			shadowColor: 'rgba(72,132,253, 0.5)',
			shadowBlur: 3
		},
		areaStyle: {
			color: {
				type: 'linear',
				x: 0,
				y: 0,
				x2: 0,
				y2: 1,
				colorStops: [{
					offset: 0, color: 'rgba(72,132,253, 0.3)' // 0% 处的颜色
				}, {
					offset: 0.8, color: 'rgba(72,132,253, 0)' // 100% 处的颜色
				}, {
					offset: 1, color: 'rgba(72,132,253, 0)' // 100% 处的颜色
				}],
			}
		},
		data: []
	}]
};
export function dashboard() {
	$.clearIntervals();
	isDomain = window.sessionStorage.getItem("isDomain") == "true" ? true : false;
	netChartOption = {}; rwChartOption = {}; netChart = ''; storageChart = ''
	netInDataSet = []; netOutDataSet = []; readDataSet = []; writeDataSet = [];
	netDot = document.getElementById('net-line-chart');
	storageDot = document.getElementById('storage-line-chart');
	var totalIntervals = window.setInterval(function () {
		totalCount();
	}, 5000);
	// window.dashboardIntervals.push(totalIntervals);
	window.intervals.push(totalIntervals);
	var progressInterVals = window.setInterval(function () {
		$.$ajax({
			url: "/api/dashboard/cloud/total",
			type: "get",
			cache: false,
			success: function (data) {
				data = data.data;
				setCircleProgress(data);
				setChartProgress(data);
			}
		});
	}, 3000);
	// window.dashboardIntervals.push(progressInterVals);
	window.intervals.push(progressInterVals);
	window.addEventListener("resize", function () {
		resizeContainer();
		netChart.resize();
		storageChart.resize();
	});
	totalCount();
	mointor();
	resizeContainer();
	byteSpeedCache();
	rwSpeedCache();
	showMointorDetail();//监控详情
}
function resizeContainer() {
	netDot.style.width = $(".info-chart.net-info-chart").width() + 'px';
	netDot.style.height = $(".info-chart.net-info-chart").height() + 'px';
	storageDot.style.width = $(".info-chart.storage-info-chart").width() + "px";
	storageDot.style.height = $(".info-chart.storage-info-chart").height() + "px";
}
function totalCount() {
	$.$ajax({
		url: "/api/dashboard/cloud/totalCount",
		type: "get",
		cache: false,
		success: function (data) {
			data = data.data;
			if (data.error) {
			} else {
				var $sumBox = $(".cloud-dashboard .sumBox"),
					$iconWrap = $sumBox.find(".sum-item[name=isDomain] .data-icon"),
					$title = $sumBox.find(".sum-item[name=isDomain] .data-name"),
					$num = $sumBox.find(".sum-item[name=isDomain] .data-num");
				if (isDomain) {
					$iconWrap.empty().append($.newDom("img", { src: require("@/views/CloudUI/image/home-tenant.png") }));
					$title.html($.doI18n("cloud_dashboard_tenant"));
					$num.html(data.domainCount).attr("title", data.domainCount);
				} else {
					$iconWrap.empty().append($.newDom("img", { src: require("@/views/CloudUI/image/home-pn.png") }));
					$title.html($.doI18n("cloud_dashboard_pn_num"));
					$num.html(data.pnCount).attr("title", data.pnCount);
				}
				$sumBox.find(".sum-item.pm-num").find("p.data-num").html(
					data.pmNum).attr("title", data.pmNum);
				$sumBox.find(".sum-item.user-num").find("p.data-num").html(
					data.userCount).attr("title", data.userCount);
				$sumBox.find(".sum-item.vm-num").find("p.data-num").html(
					data.vmNum).attr("title", data.vmNum);
				$sumBox.find(".sum-item.run-vm-num").find("p.data-num").html(
					data.startVmNum).attr("title", data.startVmNum);
				$sumBox.find(".sum-item.disk-num").find("p.data-num").html(
					data.diskCount).attr("title", data.diskCount);
			}
		}
	});
}

function mointor() {
	$.$ajax({
		url: "/api/dashboard/cloud/total",
		type: "get",
		cache: false,
		success: function (data) {
			var $circleBox = $(".cloud-dashboard .info-box[name=circleBox]");
			if (data.error) {
				var $noResult = $($.newDom("div", { className: 'home-nodata tac', "style": "height:211px;line-height:211px;" }))
					.append($.newDom("img", { "src": require("@/views/CloudUI/image/home-noData.png") }));
				$circleBox.find(".info-chart,.info-data").addClass("dn").end().append($noResult);
			} else {
				$circleBox.find(".home-nodata").remove().end().find(".info-chart,.info-data").removeClass("dn");
				data = data.data;
				setCircleProgress(data);
			}
		}
	});
}
function byteSpeedCache() {
	$.extend(true, netChartOption, option);
	$.$ajax({
		type: "get",
		url: "/api/dashboard/cloud/totalNet",
		cache: false,
		success: function (data) {
			data = data.data;
			if (data.error) {
			} else {
				netInDataSet = netInDataSet.concat(data.bytesInSpeed);
				netOutDataSet = netOutDataSet.concat(data.bytesOutSpeed);
				var bytesInSpeed = data.bytesInSpeed, bytesOutSpeed = data.bytesOutSpeed;
				var unit = util.getUnit(bytesInSpeed.concat(bytesOutSpeed));
				var netIn = util.convertToUnit(bytesInSpeed, unit);
				var netOut = util.convertToUnit(bytesOutSpeed, unit);
				var chart = echarts.getInstanceByDom(netDot);
				if (chart === undefined) {
					netChart = echarts.init(netDot);
				}
				netChartOption.series[0].data = netOut;
				netChartOption.series[1].data = netIn;
				netChartOption.series[0].name = $.doI18n("cloud_dashboard_byte_out");
				netChartOption.series[1].name = $.doI18n("cloud_dashboard_byte_in");
				netChartOption.yAxis.name = unit + "/s";
				netChartOption.yAxis.unit = unit;
				netChart.clear();
				netChart.setOption(netChartOption);
				$(".net-out").html(netOut[netOut.length - 1] + unit + "/s");
				$(".net-in").html(netIn[netIn.length - 1] + unit + "/s");
			}
		}
	});
}
function rwSpeedCache() {
	$.extend(true, rwChartOption, option);
	$.$ajax({
		type: "get",
		url: "/api/dashboard/cloud/totalBlock",
		cache: false,
		success: function (data) {
			data = data.data;
			if (data.error) {
			} else {
				readDataSet = readDataSet.concat(data.bytesOutSpeed);
				writeDataSet = writeDataSet.concat(data.bytesInSpeed);
				var bytesInSpeed = data.bytesInSpeed, bytesOutSpeed = data.bytesOutSpeed;
				var unit = util.getUnit(bytesInSpeed.concat(bytesOutSpeed));
				var diskRead = util.convertToUnit(bytesOutSpeed, unit);
				var diskWrite = util.convertToUnit(bytesInSpeed, unit);
				var chart = echarts.getInstanceByDom(storageDot);
				if (chart == undefined) {
					storageChart = echarts.init(storageDot);
				}
				rwChartOption.series[0].data = diskRead;
				rwChartOption.series[1].data = diskWrite;
				rwChartOption.series[0].name = $.doI18n("cloud_dashboard_read_rate");
				rwChartOption.series[1].name = $.doI18n("cloud_dashboard_write_rate");
				rwChartOption.yAxis.name = unit + "/s";
				rwChartOption.yAxis.unit = unit;
				storageChart.clear();
				storageChart.setOption(rwChartOption);
				$(".read-rate").html(diskRead[diskRead.length - 1] + unit + "/s");
				$(".write-rate").html(diskWrite[diskWrite.length - 1] + unit + "/s");
			}
		}
	});
}
function setCircleProgress(data) {
	var config = {
		size: 160,
		isGradient: true,
		startAngle: 0.75 * Math.PI,//开始角度
		endAngle: 2.25 * Math.PI,//结束角度
		txtPosition: 'center',
		scale: true
	};
	config.value = mathCeil(data.vcpuNum, data.cpuNum);
	$(".cpu-txt p.rate").html(config.value);
	config.txt = $(".cpu-txt").html();
	$(".cpu-chart").loongProgress(config);
	$(".cpu-total").html(data.cpuNum);
	$(".cpu-free").html(data.cpuNum - data.vcpuNum);
	config.value = mathCeil(data.memUsed, data.memTotal);
	$(".mem-txt p.rate").html(config.value);
	config.txt = $(".mem-txt").html();
	$(".mem-chart").loongProgress(config);
	$(".mem-total").html($.formatSizeStr(data.memTotal));
	$(".mem-free").html($.formatSizeStr(data.memTotal - data.memUsed));
	config.value = mathCeil(data.ipUsed, data.ipTotal);
	$(".ip-txt p.rate").html(config.value);
	config.txt = $(".ip-txt").html();
	$(".ip-chart").loongProgress(config);
	$(".ip-total").html(data.ipTotal);
	$(".ip-free").html(data.ipTotal - data.ipUsed);
	config.value = mathCeil(data.totalSize - data.freeSize, data.totalSize);
	$(".storage-txt p.rate").html(config.value);
	config.txt = $(".storage-txt").html();
	$(".storage-chart").loongProgress(config);
	$(".storage-total").html($.formatSizeStr(data.totalSize));
	$(".storage-free").html($.formatSizeStr(data.freeSize));
}
function mathCeil(x, y) {
	var tmp = Math.ceil(((x / y) * 100).toFixed(2)) <= 100 ? Math.ceil(((x / y) * 100).toFixed(2)) : 100;
	return y == 0 ? "0%" : tmp + "%";
}
function setChartProgress(data) {
	var axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');
	updateNetOption(data, axisData);
	updateRwOption(data, axisData);
}
function updateNetOption(data, axisData) {
	var netOption = netChart.getOption();
	var curmax = Math.max(data.bytesOutSpeed, data.bytesInSpeed);
	netInDataSet.shift();
	netOutDataSet.shift();
	var lastArr = netInDataSet.concat(netOutDataSet);
	var flag = isReplaceUnit(lastArr, curmax), curNetUnit = flag.unit;
	netOption.yAxis[0].unit = curNetUnit;
	netOption.yAxis[0].name = curNetUnit + "/s";
	for (var i = 0; i < netOption.series.length; i++) {
		if (i == 0) {
			netOutDataSet.push(data.bytesOutSpeed);
			var tempOutData = $.extend(true, [], netOutDataSet);
			netOption.series[i].data = util.convertToUnit(tempOutData, curNetUnit);
		} else if (i == 1) {
			netInDataSet.push(data.bytesInSpeed);
			var tempInData = $.extend(true, [], netInDataSet);
			netOption.series[i].data = util.convertToUnit(tempInData, curNetUnit);
		}
	}
	netOption.xAxis[0].data.shift();
	netOption.xAxis[0].data.push(axisData);
	netChart.setOption(netOption);
	var outData = netOption.series[0].data,
		inData = netOption.series[1].data;
	$(".net-out").html(outData[outData.length - 1] + curNetUnit + "/s");
	$(".net-in").html(inData[inData.length - 1] + curNetUnit + "/s");
}
function updateRwOption(data, axisData) {
	var storageOption = storageChart.getOption();
	readDataSet.shift();
	writeDataSet.shift();
	var rwMax = Math.max(data.bytesReadSpeed, data.bytesWriteSpeed);
	var rwLatestArr = readDataSet.concat(writeDataSet);
	var rwflag = isReplaceUnit(rwLatestArr, rwMax), curRwUnit = rwflag.unit;
	storageOption.yAxis[0].unit = curRwUnit;
	storageOption.yAxis[0].name = curRwUnit + "/s";
	for (var i = 0; i < storageOption.series.length; i++) {
		if (i == 0) {
			readDataSet.push(data.bytesReadSpeed);
			var tempReadData = $.extend(true, [], readDataSet);
			storageOption.series[i].data = util.convertToUnit(tempReadData, curRwUnit);
		} else if (i == 1) {
			writeDataSet.push(data.bytesWriteSpeed);
			var tempWriteData = $.extend(true, [], writeDataSet);
			storageOption.series[i].data = util.convertToUnit(tempWriteData, curRwUnit);
		}
	}
	storageOption.xAxis[0].data.shift();
	storageOption.xAxis[0].data.push(axisData);
	storageChart.setOption(storageOption);
	var readData = storageOption.series[0].data,
		writeData = storageOption.series[1].data;
	$(".read-rate").html(readData[readData.length - 1] + curRwUnit + "/s");
	$(".write-rate").html(writeData[writeData.length - 1] + curRwUnit + "/s");
}
function isReplaceUnit(arr, curVal) {
	var obj = {};
	var max = Math.max.apply(null, arr);
	if (curVal > arr) {
		var newUnit = "B";
		if (curVal >= 1024) {
			var formatMax = $.formatSizeStr(curVal);
			newUnit = formatMax.substring(formatMax.length - 2, formatMax.length);
		}
		obj.unit = newUnit;
	} else {
		obj.unit = util.getUnit(arr);
	}
	return obj;
}
function showMointorDetail() {
	$.each($("#cloudDashboard div.info-box"), function (index, item) {
		$(item).find(".link-icon").unbind('click').click(function (event) {
			var type = $(this).parents(".info-box").find(".info-chart").attr("name");
			switch (type) {
				case 'cpuChart':
					type = 0;
					break;
				case 'memChart':
					type = 1;
					break;
				case 'netChart':
					type = 2;
					break;
				case 'ipChart':
					type = 3;
					break;

			}
			var url = "/CloudUI/page/dashboard-detail.html";
			$.loadPage(url, { "type": type }, $("#container"));
		});
	});
}
export var util = {};
/*ip to 二进制*/
util.ipToBinary = function (ip) {
	var ip_str = "",
		ip_arr = ip.split(".");
	for (var i = 0; i < 4; i++) {
		curr_num = ip_arr[i];
		number_bin = parseInt(curr_num);
		number_bin = number_bin.toString(2);
		count = 8 - number_bin.length;
		for (var j = 0; j < count; j++) {
			number_bin = "0" + number_bin;
		}
		ip_str += number_bin;
	}
	return ip_str;
};
// ip to interger
util.ipToInt = function (ip) {
	var ret = util.ipToBinary(ip);
	return bigInt(ret, 2);
};
// mask (ip to interger)
util.maskToInt = function (mask) {
	var ret = util.ipToBinary(mask);
	var str = ret.substr(0, ret.indexOf("0"));
	return str.length;
};
// check mask
util.checkMask = function (start, end, mask) {
	var startArr = start.split("."),
		endArr = end.split(".");
	var maskBit;
	if (startArr[2] != endArr[2]) {
		var startIndex = parseInt(startArr[2]).toString(2),
			endIndex = parseInt(endArr[2]).toString(2);
		var index = checkRange(startIndex, endIndex);
		maskBit = 16 + index;
	} else if (startArr[3] != endArr[3]) {
		var startIndex = parseInt(startArr[3]).toString(2),
			endIndex = parseInt(endArr[3]).toString(2);
		var index = checkRange(startIndex, endIndex);
		maskBit = 24 + index;
	}
	mask = util.maskToInt(mask);
	var flag = true;
	if (mask > maskBit) {
		flag = false;
	}
	return flag;
};
function checkRange(startIndex, endIndex) {
	var initStartLen = startIndex.length,
		initEndLen = endIndex.length,
		index = 0;
	if (initStartLen < 8) {
		for (var i = 0; i < 8 - initStartLen; i++)
			startIndex = "0" + startIndex;
	}
	if (initEndLen < 8) {
		for (var i = 0; i < 8 - initEndLen; i++)
			endIndex = "0" + endIndex;
	}
	startIndex = startIndex.split("");
	endIndex = endIndex.split("");
	for (var i = 0; i < 8; i++) {
		if (startIndex[i] != endIndex[i]) {
			index = i;
			break;
		}
	}
	return index;
}
// get ipRange Long
util.getIPRanges = function (mask, gateway) {
	var ret = util.ipToInt(gateway);
	var left = 32 - mask;
	var start = ret.and(0xFFFFFFFF << left);
	var end = start.add(~(0xFFFFFFFF << left));
	return {
		start: start,
		end: end
	};
};
// compare startIP with endIP 
util.checkStartWithEnd = function (start, end) {
	var startLongAddr = util.ipToInt(start),
		endLongAddr = util.ipToInt(end);
	if (startLongAddr > endLongAddr) {
		var ret = start;
		start = end;
		end = ret;
	}
	return {
		start: start,
		end: end
	}
};
// 判断可用ip最少数
util.checkIpNums = function (start, end) {
	var startLongAddr = util.ipToInt(start),
		endLongAddr = util.ipToInt(end);
	if (endLongAddr - startLongAddr < 2)
		return false;
	return true;
};
// 判断ip前两段是否相等
util.limitNetRanges = function (startIp, endIp) {
	var starts = startIp.replace(/\.[0-9]{1,3}\.[0-9]{1,3}$/, ""),
		ends = endIp.replace(/\.[0-9]{1,3}\.[0-9]{1,3}$/, "");
	if ((parseInt(starts.split(".")[0]) == parseInt(ends.split(".")[0])) && (parseInt(starts.split(".")[1]) == parseInt(ends.split(".")[1])))
		return true;
	else
		return false;
};
// 判断新IPrange是否和现有table列表IPrange冲突
util.checkIPRanges = function (table, range) {
	var rowDatas = table.getRowData();
	var oldRanges = [];
	for (var i = 0; i < rowDatas.length; i++) {
		if (undefined == range.id || range.id != rowDatas[i].id) {
			var obj = {};
			obj.start = rowDatas[i].startAddr;
			obj.end = rowDatas[i].endAddr;
			oldRanges.push(obj);
		}
	}
	var flag = util.hasSameRange(range, oldRanges);
	if (!flag) {
		return util.checkOverlap(range, oldRanges);
	}
	return true;
};
util.hasSameRange = function (range, oldRanges) {
	var rangeStart = range.startAddr,
		rangeEnd = range.endAddr;
	for (var i = 0; i < oldRanges.length; i++) {
		if (rangeStart == oldRanges[i].start || rangeEnd == oldRanges[i].end ||
			rangeStart == oldRanges[i].end ||
			rangeEnd == oldRanges[i].start) {
			return true;
		}
	}
	return false;
};
util.checkOverlap = function (range, oldRanges) {
	var rangeStart = util.ipToInt(range.startAddr),
		rangeEnd = util.ipToInt(range.endAddr);
	for (var i = 0; i < oldRanges.length; i++) {
		if ((rangeStart < util.ipToInt(oldRanges[i].start) && rangeEnd > util.ipToInt(oldRanges[i].start)) ||
			(rangeStart > util.ipToInt(oldRanges[i].start) && rangeStart < util.ipToInt(oldRanges[i].end))) {
			return true;
		}
	}
	return false;
};
// formValidate
util.formValidate = function ($form) {
	var ret = $.loongValidate($form);
	if (ret.hasError) {
		var input = ret.element
		showValid($form, input, ret);
		return false;
	}
	return true;
};
// 计数
util.countNumEvent = function (type, limit) {
	$(".dialog-wrap input[name=" + type + "]").siblings(".bk-number-control").find(".bk-number-up").on("click", function () {
		var $item = $(".dialog-wrap input[name=" + type + "]"),
			count = $item.val();
		if (undefined != limit && null != limit && Number(limit) <= Number(count)) {
			$item.val(Number(limit));
			return;
		}
		$item.val(Number(count) + 1);
	});
	$(".dialog-wrap input[name=" + type + "]").siblings(".bk-number-control").find(".bk-number-down").on("click", function () {
		var $item = $(".dialog-wrap input[name=" + type + "]"),
			count = $item.val();
		if (1 == Number(count) || count == undefined || count == "") {
			return;
		}
		$item.val(Number(count) - 1);
	});
};
util.objToArr = function (object) {
	var arr = [];
	for (var i in object) {
		var obj = {};
		obj.key = object[i];
		obj.value = i.split("_")[1];
		arr.push(obj);
	}
	return arr;
};
util.osType = {
	"val_-27": "ubuntu 18.04 32 bit",
	"val_-26": "ubuntu 18.04 64 bit",
	"val_-25": "ubuntu 10.04 32 bit",
	"val_-24": "ubuntu 10.04 64 bit",
	"val_-23": "ubuntu 14.04 32 bit",
	"val_-22": "ubuntu 14.04 64 bit",
	"val_-21": "ubuntu 16.04 32 bit",
	"val_-20": "ubuntu 16.04 64 bit",
	"val_-19": "centos 6 32 bit",
	"val_-18": "centos 6 64 bit",
	"val_-17": "centos 7 32 bit",
	"val_-16": "centos 7 64 bit",
	"val_-15": "opensuse 11.0 32 bit",
	"val_-14": "opensuse 11.0 64 bit",
	"val_-13": "opensuse 13.1 32 bit",
	"val_-12": "opensuse 13.1 64 bit",
	"val_-11": "fedora 10 32 bit",
	"val_-10": "fedora 10 64 bit",
	"val_-9": "fedora 11 32 bit",
	"val_-8": "fedora 11 64 bit",
	"val_-7": "fedora 19 32 bit",
	"val_-6": "fedora 19 64 bit",
	"val_-5": "fedora 22 32 bit",
	"val_-4": "fedora 22 64 bit",
	"val_-3": "SUSE 11 SP1 32 bit",
	"val_-2": "SUSE 11 SP1 64 bit",
	"val_-1": "SUSE 11 SP4 32 bit",
	"val_0": "SUSE 11 SP4 64 bit",
	"val_1": "other linux",
	"val_2": "windows xp 32 bit",
	"val_3": "windows xp 64 bit",
	"val_4": "windows 7 32 bit",
	"val_5": "windows 7 64 bit",
	"val_6": "windows 8 32 bit",
	"val_7": "windows 8 64 bit",
	"val_8": "windows 8.1 32 bit",
	"val_9": "windows 8.1 64 bit",
	"val_10": "windows 10 32 bit",
	"val_11": "windows 10 64 bit",
	"val_12": "windows server 2003 32 bit",
	"val_13": "windows server 2003 64 bit",
	"val_14": "windows server 2008 32 bit",
	"val_15": "windows server 2008 64 bit",
	"val_16": "windows server 2008 R2 64 bit",
	"val_17": "windows server 2012 64 bit",
	"val_18": "windows server 2012 R2 64 bit",
	"val_19": "windows server 2016 64 bit"
};
util.linOsType = {
	"val_-27": "ubuntu 18.04 32 bit",
	"val_-26": "ubuntu 18.04 64 bit",
	"val_-25": "ubuntu 10.04 32 bit",
	"val_-24": "ubuntu 10.04 64 bit",
	"val_-23": "ubuntu 14.04 32 bit",
	"val_-22": "ubuntu 14.04 64 bit",
	"val_-21": "ubuntu 16.04 32 bit",
	"val_-20": "ubuntu 16.04 64 bit",
	"val_-19": "centos 6 32 bit",
	"val_-18": "centos 6 64 bit",
	"val_-17": "centos 7 32 bit",
	"val_-16": "centos 7 64 bit",
	"val_-15": "opensuse 11.0 32 bit",
	"val_-14": "opensuse 11.0 64 bit",
	"val_-13": "opensuse 13.1 32 bit",
	"val_-12": "opensuse 13.1 64 bit",
	"val_-11": "fedora 10 32 bit",
	"val_-10": "fedora 10 64 bit",
	"val_-9": "fedora 11 32 bit",
	"val_-8": "fedora 11 64 bit",
	"val_-7": "fedora 19 32 bit",
	"val_-6": "fedora 19 64 bit",
	"val_-5": "fedora 22 32 bit",
	"val_-4": "fedora 22 64 bit",
	"val_-3": "SUSE 11 SP1 32 bit",
	"val_-2": "SUSE 11 SP1 64 bit",
	"val_-1": "SUSE 11 SP4 32 bit",
	"val_0": "SUSE 11 SP4 64 bit",
	"val_1": "other linux"
};
util.winOsType = {
	"val_2": "windows xp 32 bit",
	"val_3": "windows xp 64 bit",
	"val_4": "windows 7 32 bit",
	"val_5": "windows 7 64 bit",
	"val_6": "windows 8 32 bit",
	"val_7": "windows 8 64 bit",
	"val_8": "windows 8.1 32 bit",
	"val_9": "windows 8.1 64 bit",
	"val_10": "windows 10 32 bit",
	"val_11": "windows 10 64 bit",
	"val_12": "windows server 2003 32 bit",
	"val_13": "windows server 2003 64 bit",
	"val_14": "windows server 2008 32 bit",
	"val_15": "windows server 2008 64 bit",
	"val_16": "windows server 2008 R2 64 bit",
	"val_17": "windows server 2012 64 bit",
	"val_18": "windows server 2012 R2 64 bit",
	"val_19": "windows server 2016 64 bit"
};
util.busType = {
	"val_1": "IDE",
	"val_2": "SATA",
	// "val_3":"SCSI",
	"val_4": "VIRTIO",
};
util.diskBusTypes = {
	"val_1": "IDE",
	// "val_3":"SCSI",
	"val_2": "SATA",
	"val_4": "VIRTIO",
};
util.dataDiskBusTypes = {
	// "val_1":"IDE",
	// "val_3":"SCSI",
	"val_2": "SATA",
	"val_4": "VIRTIO",
};
util.isoBusType = {
	"val_1": "IDE",
	"val_2": "SATA",
};
util.netModels = {
	"val_1": "RTL8139",
	"val_2": "E1000",
	"val_3": "VIRTIO_NET",
};

// 可视范围
/*util.isEleInView = function(obj){
	var $div = $(".scroll-page");
	var $ele = $(obj);
	var offsetTopIn = $ele.offset().top - $div.offset().top;
	var divScrollTop = $div.scrollTop();
	var divHeight = $div.get(0).clientHeight;
	if(offsetTopIn >= 0 && offsetTopIn <= divScrollTop + divHeight){
		return true;
	}else{
		return false;
	}
};*/
// mac地址是否多播
util.checkMulticast = function (macArr) {
	var flag = false;
	for (var i = 0; i < macArr.length; i++) {
		var tmp = macArr[i].split(":")[0];
		if (parseInt(tmp.charAt(tmp.length - 1), 16) % 2 == 1) {
			flag = true;
			break;
		}
	}
	return flag;
};
// mac upperCase
util.macToUpper = function (macStr) {
	var macArr = macStr.split(",");
	for (var i = 0; i < macArr.length; i++) {
		macArr[i] = macArr[i].toUpperCase();
	}
	return macArr.join(",");
};
// random mac
util.getRandomMac = function () {
	var mac = ["52", "54", "00"], num = 0xff;
	for (var i = 0; i < 3; i++) {
		var rand = Math.floor(Math.random() * num + 1).toString(16);
		if (rand.length == 1) {
			rand = "0" + rand;
		}
		mac.push(rand);
	}
	return mac.join(":").toUpperCase();
};
// 数组元素重复
util.isRepeat = function (arr) {
	var hash = {};
	for (var i in arr) {
		arr[i] = arr[i].toUpperCase();
		if (hash[arr[i]])
			return true;
		hash[arr[i]] = true;
	}
	return false;
};
// 转换为指定单位值
util.convertToUnit = function (val, unit) {
	if (Array.isArray(val)) {
		var rst = [];
		for (var i = 0; i < val.length; i++) {
			val[i] = util.computeByUnit(val[i], unit);
			rst.push(val[i]);
		}
		return rst;
	} else {
		val = util.computeByUnit(val, unit);
		return val;
	}
};
util.computeByUnit = function (value, unit) {
	if (unit == "KB") {
		value = Math.round(value * 100 / (1024)) / 100;
	} else if (unit == "MB") {
		value = Math.round(value * 100 /
			(1024 * 1024)) / 100;
	} else if (unit == "GB") {
		value = Math.round(value * 100 /
			(1024 * 1024 * 1024)) / 100;
	} else if (unit == "TB") {
		value = Math.round(value * 100 /
			(1024 * 1024 * 1024 * 1024)) / 100;
	} else if (unit == "PB") {
		value = Math.round(value * 100 /
			(1024 * 1024 * 1024 * 1024 * 1024)) / 100;
	}
	return value;
};
// 取最大数单位
util.getUnit = function (arr) {
	var max;
	if (Array.isArray(arr)) {
		max = Math.max.apply(null, arr);
	} else {
		max = arr;
	}
	var unit = "B";
	if (max >= 1024) {
		var formatMax = $.formatSizeStr(max);
		unit = formatMax.substring(formatMax.length - 2, formatMax.length);
	}
	return unit;
};

util.getSelect = function (select) {
	var $container = select.$container;
	return {
		key: $container.find(".select-box .select").html(),
		value: $container.find(".select-box .select-input").val()
	}
};
// remove validator
util.removeValidator = function ($input) {
	$input.removeClass('valid-err-input valid-none-input').parent().find(".err-logo,.err-tip").remove();
};
// add seletc-li title
util.addSelectBoxTitle = function ($box) {
	$box.off('click.setTitle').on('click.setTitle', function () {
		var $lis = $box.siblings(".list-box").find("ul.option-list li.option");
		$.each($lis, function (index, item) {
			var title = $(item).attr("vals").substring($(item).attr("vals").lastIndexOf("/") + 1);
			$(item).attr("title", formaterTitle(title));
		});
	});
};
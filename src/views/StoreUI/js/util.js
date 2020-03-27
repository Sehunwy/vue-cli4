export var util = {};

util.getSelect = function (select) {
    var $container = select.$container;
    return {
        key: $container.find(".select-box .select").text(),
        value: $container.find(".select-box .select-input").val()
    }
};

util.validateForm = function ($form, fn) {
    var ret = $.loongValidate($form);
    if (ret.hasError) {
        var input = ret.element;
        showValid($form, input, ret);
    } else {
        fn && fn();
    }
};

util.getSelectRows = function (table) {
    var result = [];
    var tableData = table.getRowData();
    var selectedIndex = table.getCheckedIndex();
    for (var i = 0; i < selectedIndex.length; i++) {
        result.push(tableData[selectedIndex[i]]);
    }
    return result;
};

util.dealAjaxError = function (data, error, success) {
    if (data && data.error) {
        var errorTip;
        if (data.error == doI18n("store_util_unknow_error")) {
            errorTip = i18n[data.error] ? doI18n(data.error, data.error_message) : data.error || data.error_message;
        } else {
            errorTip = i18n[data.error] ? doI18n(data.error, data.error_message ? data.error_message.split(",") : data.error_message) : data.error || data.error_message;
        }
        $.loongDialog({
            "content": errorTip,
            "isModal": false,
            "msgType": "error"
        });
        error && error();
    } else {
        success && success();
    }
};

util.doConfirm = function (okFn, content, opt) {
    var option;
    if (opt) {
        option = {
            note: true,
            noteTip: typeof (opt) === "string" ? opt : opt.msg,
            noteDef: typeof (opt) === "string" ? true : !!opt.init
        }
    } else {
        option = {
            note: false,
            noteTip: "",
            noteDef: false
        }
    }
    var confirmDialog = $.loongDialog({
        "title": doI18n("notice"),
        "content": content ? content : doI18n("store_util_del_confirm"),
        "isInfo": true,
        "note": option.note,
        "noteTip": option.noteTip,
        "noteDef": option.noteDef,
        "buttons": [{
            "txt": doI18n("btn_ok"),
            "callback": function () {
                var select = option.note && confirmDialog.$modal.find("input[name='isSelected']").val();
                okFn && okFn(select);
                return true;
            }
        }, {
            "txt": doI18n("btn_cancel")
        }]
    });
    return confirmDialog;
};

util.scrollToBottom = function (o) {
    o.scrollTop = o.scrollHeight;
};

util.arrayRemoveByTag = function (total, rm, tag) {
    var result = [],
        exist = false;
    for (var i = 0; i < total.length; i++) {
        exist = false;
        for (var j = 0; j < rm.length; j++) {
            if (total[i][tag] === rm[j]) {
                exist = true;
                break;
            }
        }
        if (!exist) {
            result.push(total[i]);
        }
    }
    return result;
};

util.charTipFormatter = function (params, data) {
    var tipBox = $(newDom("div", { className: "chart-content-tip-box" }))
        .append(
            newDom("div", { className: "chart-content-tip-title", innerHTML: params[0].name })
        );
    for (var i = 0; i < params.length; i++) {
        tipBox.append(
            $(newDom("div", { className: "chart-content-tip-item flex flex-center jcfs" }))
                .append(
                    $(newDom("div", { className: "chart-content-tip-icon" })).css("background", params[i].color)
                )
                .append(
                    newDom("div", { innerHTML: params[i].seriesName + ": " + params[i].value + (data.yAxis.unit ? data.yAxis.unit : '') })
                )
        )
    }
    return $(newDom("div")).append(tipBox).html();
};

util.forbidPaste = function (input) {
    $(input).on("contextmenu", function (e) {
        return false;
    }).on("keydown", function (e) {
        if ((e.ctrlKey) && (e.keyCode === 86)) {
            return false;
        }
    });
};

util.overSpan = function (msg, className) {
    var span = newDom("span", {
        style: "width: 100%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;",
        className: className
    });
    span.textContent = msg;
    span.title = msg.replace(/[^\x00-\xff]/g, "$&\x01").replace(/.{50}\x01?/g, "$&\n").replace(/\x01/g, "");
    return span;
};

util.byteWithUnitFloat = function (num) {
    if (!num) {
        return {
            quota: 0,
            rate: 0,
            unit: "B"
        }
    }
    if (num / (1024 * 1024 * 1024 * 1024 * 1024) >= 1) {
        return {
            quota: (num / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2),
            rate: 1024 * 1024 * 1024 * 1024 * 1024,
            unit: "PB"
        }
    } else if (num / (1024 * 1024 * 1024 * 1024) >= 1) {
        return {
            quota: (num / (1024 * 1024 * 1024 * 1024)).toFixed(2),
            rate: 1024 * 1024 * 1024 * 1024,
            unit: "TB"
        }
    } else if (num / (1024 * 1024 * 1024) >= 1) {
        return {
            quota: (num / (1024 * 1024 * 1024)).toFixed(2),
            rate: 1024 * 1024 * 1024,
            unit: "GB"
        }
    } else if (num / (1024 * 1024) >= 1) {
        return {
            quota: (num / (1024 * 1024)).toFixed(2),
            rate: 1024 * 1024,
            unit: "MB"
        }
    } else if (num / (1024) >= 1) {
        return {
            quota: (num / (1024)).toFixed(2),
            rate: 1024,
            unit: "KB"
        }
    } else {
        return {
            quota: num,
            rate: 1,
            unit: "B"
        }
    }
};

util.byteWitUnitInt = function (num) {
    if (!num) {
        return {
            quota: 0,
            rate: 0,
            unit: "B"
        }
    }
    if (num % (1024 * 1024 * 1024 * 1024 * 1024) === 0) {
        return {
            quota: num / (1024 * 1024 * 1024 * 1024 * 1024),
            rate: 1024 * 1024 * 1024 * 1024 * 1024,
            unit: "PB"
        }
    } else if (num % (1024 * 1024 * 1024 * 1024) === 0) {
        return {
            quota: num / (1024 * 1024 * 1024 * 1024),
            rate: 1024 * 1024 * 1024 * 1024,
            unit: "TB"
        }
    } else if (num % (1024 * 1024 * 1024) === 0) {
        return {
            quota: num / (1024 * 1024 * 1024),
            rate: 1024 * 1024 * 1024,
            unit: "GB"
        }
    } else if (num % (1024 * 1024) === 0) {
        return {
            quota: num / (1024 * 1024),
            rate: 1024 * 1024,
            unit: "MB"
        }
    } else if (num % (1024) === 0) {
        return {
            quota: num / (1024),
            rate: 1024,
            unit: "KB"
        }
    } else {
        return {
            quota: num,
            rate: 1,
            unit: "B"
        }
    }
};

util.byteUnitValue = function (unit) {
    switch (unit) {
        case 'B':
            return 1;
            break;
        case 'KB':
            return 1024;
            break;
        case 'MB':
            return 1024 * 1024;
            break;
        case 'GB':
            return 1024 * 1024 * 1024;
            break;
        case 'TB':
            return 1024 * 1024 * 1024 * 1024;
            break;
        case 'PB':
            return 1024 * 1024 * 1024 * 1024 * 1024;
            break;
        default:
            return 0;
            break;
    }
};

util.minuteToOther = function (num) {
    // if (num % (12 * 30 * 24 * 60) === 0) {
    if (num % (365 * 24 * 60) === 0) {
        return {
            time: num / (365 * 24 * 60),
            // time: num / (12 * 30 * 24 * 60),
            unit: doI18n("store_util_year"),
            value: "year"
        }
    } else if (num % (30 * 24 * 60) === 0) {
        return {
            time: num / (30 * 24 * 60),
            unit: doI18n("store_util_month"),
            value: "month"
        }
    } else if (num % (24 * 60) === 0) {
        return {
            time: num / (24 * 60),
            unit: doI18n("store_util_day"),
            value: "day"
        }
    } else if (num % 60 === 0) {
        return {
            time: num / 60,
            unit: doI18n("store_util_hour"),
            value: "hour"
        }
    } else {
        return {
            time: num,
            unit: doI18n("store_util_minute"),
            value: "minute"
        }
    }
};

util.MBToOtherInt = function (num) {
    if (!num) {
        return {
            quota: 0,
            rate: 0,
            unit: "B"
        }
    }
    if (num % (1024 * 1024 * 1024) === 0) {
        return {
            quota: num / (1024 * 1024 * 1024),
            rate: 1024 * 1024 * 1024,
            unit: "PB"
        }
    } else if (num % (1024 * 1024) === 0) {
        return {
            quota: num / (1024 * 1024),
            rate: 1024 * 1024,
            unit: "TB"
        }
    } else if (num % (1024) === 0) {
        return {
            quota: num / (1024),
            rate: 1024,
            unit: "GB"
        }
    } else {
        return {
            quota: num,
            rate: 1,
            unit: "MB"
        }
    }
};

util.MBToOtherFloat = function (num) {
    if (!num) {
        return {
            quota: 0,
            rate: 0,
            unit: "B"
        }
    }
    if (num / (1024 * 1024 * 1024) >= 1) {
        return {
            quota: (num / (1024 * 1024 * 1024)).toFixed(2),
            rate: 1024 * 1024 * 1024,
            unit: "PB"
        }
    } else if (num / (1024 * 1024) >= 1) {
        return {
            quota: (num / (1024 * 1024)).toFixed(2),
            rate: 1024 * 1024,
            unit: "TB"
        }
    } else if (num / (1024) >= 1) {
        return {
            quota: (num / (1024)).toFixed(2),
            rate: 1024,
            unit: "GB"
        }
    } else {
        return {
            quota: num,
            rate: 1,
            unit: "MB"
        }
    }
};

util.byteUnitValueMB = function (unit) {
    switch (unit) {
        case 'MB':
            return 1;
            break;
        case 'GB':
            return 1024;
            break;
        case 'TB':
            return 1024 * 1024;
            break;
        case 'PB':
            return 1024 * 1024 * 1024;
            break;
        default:
            return 0;
            break;
    }
};

util.dealGlobalTaskResult = function (str) {
    var result = "";
    if (str === "success") {
        result = doI18n("store_util_success");
    } else if (str) {
        var array = str.split("\n");
        var resultArray = array.map(function (s) {
            var noNumIndex = 0;
            var resultItem = "";
            for (var i = 0; i < s.length; i++) {
                if (s[i] !== " " && (!(parseInt(s[i]) == s[i]))) {
                    noNumIndex = i;
                    break;
                }
            }
            var num = s.slice(0, noNumIndex).replace(/ /g, "");
            var key = s.slice(noNumIndex).replace(/ |\!|\,/g, "").toLowerCase();
            var args = [num];
            if (key.indexOf(":") !== -1) {
                if (key.split(":")[0] === "err") {
                    args.push(key.split(":")[1]);
                    key = "error";
                }
                if (key.split(":")[0] === "errno") {
                    args.push(key.split(":")[1]);
                    key = "error";
                }
                if (key.split(":")[0] === "failederrno") {
                    args.push(key.split(":")[1]);
                    key = "failederrno";
                }
            }
            resultItem = key.indexOf(":") !== -1 ? key : (i18n["global_task_" + key] ? doI18n("global_task_" + key, args) : key);
            return resultItem;
        });
        result = resultArray.join("\n");
    }
    return result;
};
util.bytesToSize = function (bytes) {
    if (bytes === 0) return {
        size: 0,
        bytes: "B"
    };
    var k = 1024, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return {
        size: Math.round((bytes / Math.pow(k, i))),
        unit: sizes[i]
    }
};

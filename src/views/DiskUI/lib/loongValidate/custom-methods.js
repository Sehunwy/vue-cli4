$.addMethod("disk_dept_user_name", function ($item) {
    var disk_dept_user_name = new RegExp(/^(?! )(?!.*?\s$)(?!.*?\.$)((?! {2,})[\.\u4e00-\u9fa50-9a-zA-Z\_ ])+$/);
    return {
        disk_dept_user_name: {
            valid: disk_dept_user_name.test($item.val())
        }
    };
}, $.messageI18n("disk_dept_user_name"));
$.addMethod("disk_dept_name", function ($item) {
    var disk_dept_name = new RegExp(/^[\u4e00-\u9fa50-9a-zA-Z_]*$/);
    return {
        disk_dept_name: {
            valid: disk_dept_name.test($item.val())
        }
    };
}, $.messageI18n("disk_dept_name"));
$.addMethod("unequalToString", function ($item) {
    var value = $item.val();
    var ueqToStr = $item.attr("unequalToString");
    var ueqArr = ueqToStr.split(",");
    for (var i = 0; i < ueqArr.length; i++) {
        if (value == ueqArr[i]) {
            ueqToStr = ueqArr[i];
        }
    }
    return {unequalToString: {valid: !(value == ueqToStr)}};
}, $.messageFormat($.messageI18n("unequalToString")));
$.addMethod("ldap", function ($item) {
    var msg = $item.val(), flag = true;
    var u = msg.split(':');
    var pre = /^[lL][dD][aA][pP]:$/;
    var mid = /^\/\/([1-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([1-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/;
    if ((!pre.test(u[0] + ':')) || (!mid.test(u[1])) || (u[2] < 1 || u[2] > 65535)) {
        flag = false;
    } else {
        flag = true;
    }
    return {
        ldap: {
            valid: flag
        }
    };
}, $.messageI18n("ldap"));
$.addMethod("unequalToPort", function ($item) {
    var flag = true;
    var value = $item.val();
    var itemName = $item.attr("name");
    var ueqItems = $item.parents("form").find("input:not(input[name=" + itemName + "])");
    ueqItems.each(function (e) {
        if ($(this).val() == value && $(this).val() != "") {
            flag = false;
        }
    })
    return {
        unequalToPort: {
            valid: flag
        }
    };
}, $.messageI18n("unequalToPort"));
$.addMethod("disk_version_name", function ($item) {
    var disk_version_name = new RegExp(/^[0-9a-zA-Z_.-]*$/);
    return {
        disk_version_name: {
            valid: disk_version_name.test($item.val())
        }
    };
}, $.messageI18n("disk_version_name"));
$.addMethod("url", function ($item) {
    var url = new RegExp(/^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/);
    return {
        url: {
            valid: url.test($item.val())
        }
    };
}, $.messageI18n("url"));
$.addMethod("system_msg", function ($item) {
    var system_msg = new RegExp(/\#+/g);
    return {
        system_msg: {
            valid: !system_msg.test($item.val())
        }
    };
}, $.messageI18n("system_msg"));

$.addMethod("diskIpComma", function ($item) {
    var flag = true;
    var ipArray = $item.val().split(',');
    var str = [];
    for (var i = 0; i < ipArray.length; i++) {
        str = ipArray[i].split('.');
        for(let i=0;i<str.length;i++) {
            if (str[i].length >= 4 || str.length >= 5) {
                flag = false;
            }
        }
    }
    return {
        diskIpComma: {
            valid: ("" == $item.val()) || ((ipArray.length <= 3) && flag)
        }
    };
}, $.messageI18n('diskIpComma'));

$.addMethod("diskIpHasZero", function ($item) {
    var flag = true;
    var ipArray = $item.val().split(',');
    for (var i = 0; i < ipArray.length; i++) {
        var str = ipArray[i].split('.');
        if (str[0] != undefined && str[0][0] == '0' || str[3] != undefined && str[3][0] == '0') {
            flag = false;
            break;
        }
    }
    return {
        diskIpHasZero: {
            valid: ("" == $item.val()) || ((ipArray.length <= 3) && flag)
        }
    };
}, $.messageI18n('diskIpHasZero'));

$.addMethod("disk_number", function ($item) {
    var flag = true;
    var itemVal = $item.val();
    return {
        disk_number: {
            valid: /^[0-9]+$/.test(itemVal)
        }
    };
}, $.messageI18n('disk_number'));

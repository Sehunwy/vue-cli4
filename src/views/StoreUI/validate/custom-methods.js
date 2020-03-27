$.addMethod("targetName",function($item){
    var name = new RegExp(/^([a-z0-9])+$/);
    return {
       targetName:{
            valid: name.test($item.val())
        }
    };
},$.messageI18n("targetName"));

$.addMethod("groupName",function($item){
    var name = new RegExp(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/);
    return {
        groupName:{
            valid: name.test($item.val())
        }
    };
},$.messageI18n("groupName"));
$.addMethod("segIP",function($item){
    var ips = $item.val();
    var reg = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-4]|2[0-4]\d|((1\d{2})|([1-9][0-9]?))))$|^(((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){0,3}\*)$|^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\/(\d|[1-2]\d|3[0-2]))$|^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\/(?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/;
    // var reg2 = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))\.){3}((25[0-4]|2[0-4]\d|((1\d{2})|([1-9]\d{1}|[1-9])))(\-(25[0-4]|2[0-4]\d|((1\d{2})|([1-9]\d{1}|[1-9]))))?))+$/;
    var reg2 = new RegExp(/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/);
    var result = true;
    var positive = new RegExp(/^[1-9]\d*$/);
    var index = ips.indexOf("-");
    if (index > 0) {
        var strList = ips.split("-");
        var ip = strList[0];
        var num = strList[1];
        var ipModule = ip.split(".");
        var flag = reg2.test(ip) && positive.test(num) && (parseInt(num) > parseInt(ipModule[3])) && parseInt(num) < 256;
        if (flag == false) {
            result = flag;
        }
    } else {
        if(!reg.test(ips) && !reg2.test(ips)) {
            result =  false;
        }
    }
    return {
        segIP:{
            valid: result
        }
    };
},$.messageI18n("segIP"));
$.addMethod("segIPRepeat",function($item){
    var hasRepeat = false, ipList = $item.val().split(",", -1), normalIpList = [], starIpList = [];
    $.each(ipList, function(j, value) {
        var starIndex = value.indexOf("*");
        if(starIndex != -1){
            if (starIndex == 0 && ipList.length > 1) {
                hasRepeat = true;
                return false;
            } else {
                starIpList.push(value);
            }
        } else {
            var splitIndex = value.indexOf("-");
            if (splitIndex > 0) {
                var ip = value.slice(0, splitIndex), num = parseInt(value.slice(splitIndex + 1)), ipModule = ip.split("."), start = parseInt(ipModule[3]);
                for (var i = start; i < num + 1; i++) {
                    var ipArr = ipModule.slice(0,3);
                    ipArr.splice(3, 0, i);
                    normalIpList.push(ipArr.join("."));
                }
            } else {
                normalIpList.push(value);
            }
        }
    });
    if (!hasRepeat) {
        var hash = {};
        $.each (normalIpList, function(i, key) {
            if ( hash[key]) {
                hasRepeat = true;
                return false;
            }
            hash[key] = true;
        });
        if(!hasRepeat) {
             var compare = {};
             for(var k = 0; k < starIpList.length; k++){
                var isContain = false, index = starIpList[k].indexOf("*"), suffix = starIpList[k].slice(0, index);
                for(var j = k + 1; j < starIpList.length; j++){
                    var tmp = starIpList[j].slice(0, starIpList[j].indexOf("*"));
                    if(tmp.indexOf(suffix) == 0 || suffix.indexOf(tmp) == 0){
                        isContain = true;
                        break;
                    }
                }
                if(isContain){
                    hasRepeat = true;
                    break;
                } else {
                    if (compare[suffix]) {
                        hasRepeat = true;
                        break;
                    } else {
                        compare[suffix] = true;
                        var flag = false;
                        $.each(normalIpList, function(k, item) {
                            if (compare[item.slice(0, index)]) {
                                flag = true;
                                return false;
                            }
                        });
                        if (flag) {
                            hasRepeat = true;
                            break;
                        }
                    }
                }
            }
        }
    }
    return {
        segIPRepeat : {valid: !hasRepeat }
    };
},$.messageI18n("segIPRepeat"));
$.addMethod("sharePath", function($item) {
    var path = /^[a-zA-Z0-9_/\u4e00-\u9fa5]*$/;
    var valid = true;
    if(!path.test($item.val()) || $item.val().split("//").length > 1){
        valid = false;
    }
    return {
        sharePath: {
            valid: valid
        }
    };
}, $.messageI18n("sharePath"));

$.addMethod("cifsIp", function($item) {
    var ipValid = /^(((((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-4]|2[0-4]\d|((1\d{2})|([1-9][0-9]?))))|(((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){2,3}))\s)*((((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-4]|2[0-4]\d|((1\d{2})|([1-9][0-9]?))))|(((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){2,3}))$|^ALL$|^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))))$|^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\/(?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/;
    return {
        cifsIp: {
            valid: ipValid.test($item.val())
        }
    };
}, $.messageI18n("cifsIp"));
$.addMethod("netSegment",function($item){
  var ips = $item.val().split(",",-1);
  var result = true;
  var seg = new RegExp(/^((([1-9]?\d)|1\d{2}|2[0-4]\d|25[0-5])\.){3}(([1-9]?\d)|1\d{2}|2[0-4]\d|25[0-5])(\/)(([1-2]?\d)|3[0-1])$/);
  $.each(ips,function(index,value){
     if(!seg.test(value)){
         result = false;
        return false;
     }

  });
    return {
        netSegment: {
            valid: result
        }
    }
},$.messageI18n("netSegment"));
$.addMethod("iscsiName",function($item){
    var iscsiName = new RegExp(/^[a-zA-Z0-9]+$/);
    return {
        iscsiName:{
            valid: iscsiName.test($item.val())
        }
    }
},$.messageFormat($.messageI18n("iscsiName")));
$.addMethod("nasPassword",function($item){
    var nasPassword = new RegExp(/^(?=.*\d)(?=.*[a-zA-Z])([a-zA-Z0-9]){6,16}$/);
    return {
        nasPassword: {
            valid: nasPassword.test($item.val())
        }
    };
},$.messageI18n("nasPassword"));

$.addMethod("iscsiUserName",function($item){
    var name = new RegExp(/^[a-zA-Z0-9\-.:]+$/);
    return {
        iscsiUserName: {
            valid: name.test($item.val())
        }
    }
},$.messageFormat($.messageI18n("iscsiUserName")));
$.addMethod("shareName",function($item){
    var name = new RegExp(/^(?![0-9_\-.]+$)[\u4E00-\u9FA5A-Za-z0-9_\.]+$/);
    var suffix = new RegExp(/.*[^.]$/);
    return {
        shareName: {
            valid: name.test($item.val()) && suffix.test($item.val())
        }
    }
},$.messageFormat($.messageI18n("shareName")));
$.addMethod("snapShotName",function($item){
    var name = new RegExp(/^[a-zA-Z0-9._]+$/);
    return {
        snapShotName: {
            valid: name.test($item.val())
        }
    }
},$.messageFormat($.messageI18n("snapShotName")));
$.addMethod("excludeComma",function($item){
    var name = new RegExp(/^[^\,]+$/);
    return {
        excludeComma: {
            valid: name.test($item.val())
        }
    }
},$.messageFormat($.messageI18n("excludeComma")));
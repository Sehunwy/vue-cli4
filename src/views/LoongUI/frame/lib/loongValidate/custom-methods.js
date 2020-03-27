$.addMethod("positive", function($item) {
    var positive = new RegExp(/^[1-9]\d*$/);
    return {
        positive: {
            valid: positive.test($item.val())
        }
    };
}, $.messageI18n("positive"));

$.addMethod("nonnegative", function($item) {
var nonnegative = new RegExp(/^(0|[1-9]\d*)$/);
return {
    nonnegative: {
        valid: nonnegative.test($item.val())
    }
};
}, $.messageI18n("nonnegative"));

$.addMethod("username", function($item) {
var username = new RegExp(/^[a-zA-Z][0-9a-zA-Z]+$/);
return {
    username: {
        valid: username.test($item.val())
    }
};
}, $.messageFormat($.messageI18n("username")));

$.addMethod("password", function($item) {
var password = new RegExp(/^(?=.*\d)(?=.*[a-z|A-Z]).{6,16}$/);
return {
    password: {
        valid: password.test($item.val())
    }
};
}, $.messageI18n("password"));

$.addMethod("name", function($item) {
var name = new RegExp(/^(?![0-9_\-.]+$)[\u4E00-\u9FA5A-Za-z0-9_\.]+$/);
return {
    name: {
        valid: name.test($item.val())
    }
};
}, $.messageFormat($.messageI18n("name")));

$.addMethod("fileSysName", function($item) {
var fileSysName = new RegExp(/^[^\\\/\:\*\?\'\"\<\>\|]+$/);
var valid = true;
if (!fileSysName.test($item.val()) || $item.val() === ".." || $item.val() === ".") {
    valid = false;
}
return {
    fileSysName: {
        valid: valid
    }
};
}, $.messageFormat($.messageI18n("fileSysName")));

$.addMethod("fileSysPathPoint", function($item) {
// var fileSysPathPoint = new RegExp(/^((?!\.\.\/|\/\.\.).)*$/);
var valid = true;
/*if (!fileSysPathPoint.test($item.val()) || $item.val() === "..") {
    valid = false;
}*/
if ($item.val().split("//").length > 1) {
    valid = false;
} else {
    var dirs = $item.val().split("/");
    for (var i = 0; i < dirs.length; i++) {
        if (dirs[i] === "." || dirs[i] === "..") {
            valid = false;
            break;
        }
    }
}
return {
    fileSysPathPoint: {
        valid: valid
    }
};
}, $.messageFormat($.messageI18n("fileSysPathPoint")));


$.addMethod("detail", function($item) {
var detail = new RegExp(/^[^]{0,160}$/);
return {
    detail: {
        valid: detail.test($item.val())
    }
};
}, $.messageFormat($.messageI18n("detail")));
//cloud验证
$.addMethod("overSold",function($item){
var overSold = new RegExp(/^[1]*\.[0-2][0-9]{0,1}$/);
var value = $item.val();
if(1 == value){
    return {
        overSold:{
            valid:true
        }
    }
}
return {
    overSold:{
        valid:overSold.test($item.val())
    }
};
},$.messageFormat($.messageI18n("overSold")));

$.addMethod("overCpu",function($item){
var overCpu = new RegExp(/^([1-9]|10)$/);
var value = $item.val();
if(1 == value){
    return {
        overCpu:{
            valid:true
        }
    }
}
return {
    overCpu:{
        valid:overCpu.test($item.val())
    }
};
},$.messageFormat($.messageI18n("overCpu")));
$.addMethod("mask",function($item){
// mask范围:8-31
// var mask = new RegExp(/^((254|252|248|240|224|192)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(252|248|240|224|192|128|0))$/);
var mask = new RegExp(/^(255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0))$/);
return {
    mask:{
        valid:mask.test($item.val())
    }
};
},$.messageI18n("mask"));
$.addMethod("vlanIds", function($item) {
var flag = true;
var idArray = $item.val().split(',');
var vlanIds = new RegExp(/^([1-9]\d*)+(,([1-9]\d*)+)*$/);
// var vlanIds = new RegExp(/^(\d+,)*\d+$/);
if(idArray.length > 10){
    flag = false;
}else{
    var arr = idArray.sort();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == arr[i + 1]) {
            flag = false;
            break;
        }
        if (!vlanIds.test(arr[i]) || arr[i] < 1 || arr[i] > 4094) {
            flag = false;
            break;
        }
    }
}
return {
    vlanIds: {
        valid: flag
    }
};
}, $.messageI18n("vlanIds"));
$.addMethod("mac",function($item){
var mac = new RegExp(/^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/);
return {
    mac:{
        valid:mac.test($item.val())
    }
};
},$.messageI18n("mac"));
$.addMethod("port",function($item){
var port = new RegExp(/^([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/);
return {
    port:{
        valid:port.test($item.val())
    }
};
},$.messageI18n("port"));


$.addMethod("ipList",function($item){
var ipv4 = new RegExp(/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/);
var positive = new RegExp(/^[1-9]\d*$/);
var ipStr = $item.val();
var ipList  = ipStr.split(",",-1);
var result = true;
$.each(ipList,function(i,value){
    var index = value.indexOf("-");
    if(index>0) {
        var strList = value.split("-");
        var ip = strList[0];
        var num = strList[1];
        var ipModule = ip.split(".");
        var flag = ipv4.test(ip) && positive.test(num) && (parseInt(num) > parseInt(ipModule[3]))&& parseInt(num) <256 && ipModule[0]!=="127";
        if(flag == false){
            result = flag;
            return false;
        }
    }else{
      result = ipv4.test(value) && (value.split(".")[0] !== "127");
      if(result == false){
          return false;
      }
    }
    
});
/*  if(result){
    var allIpList = [];
    $.each(ipList,function(j,item){
        var index = item.indexOf("-");
        if(index>0){
            var ip = value.slice(0, index);
            var num = value.slice(index + 1);
            var ipModule = ip.split(".");
            for(var i = ipModule[3];i<num+1;i++){
                var ipArr = ipModule.slice(0,3);
                ipArr.splice(3,0,i);
                allIpList.push(ipArr.join("."));
            }
        }else{
            allIpList.push(item);

        }

    });
    var hash = {},hasRepeat = false;
    $.each(allIpList,function(i,key){
        if(hash[key]){
            hasRepeat = true;
            return false;
        }
        hash[key] = true;
    });
}*/
return {
    ipList:{
        valid: result
    }
};
},$.messageI18n("ipList"));

$.addMethod("ipListRepeat",function($item){
var ipv4 = new RegExp(/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/);
var positive = new RegExp(/^[1-9]\d*$/);
var ipStr = $item.val();
var ipList  = ipStr.split(",",-1);
var result = true;
$.each(ipList,function(i,value){
    var index = value.indexOf("-");
    if(index>0) {
        var ip = value.slice(0, index);
        var num = parseInt(value.slice(index + 1)) ;
        var ipModule = ip.split(".");
        var flag = ipv4.test(ip) && positive.test(num) && (num > parseInt(ipModule[3]))&& num <256 && ipModule[0]!=="127";
        if(flag == false){
            result = flag;
            return false;
        }
    }else{
        result = ipv4.test(value) && (value.split(".")[0] !== "127");
        if(result == false){
            return false;
        }
    }

});
var hasRepeat = false;
if(result){
    var allIpList = [];
    $.each(ipList,function(j,value){
        var index = value.indexOf("-");
        if(index>0){
            var ip = value.slice(0, index);
            var num = parseInt(value.slice(index + 1));
            var ipModule = ip.split(".");
            var start = parseInt(ipModule[3]);
            for(var i = start;i<num+1;i++){
                var ipArr = ipModule.slice(0,3);
                ipArr.splice(3,0,i);
                allIpList.push(ipArr.join("."));
            }
        }else{
            allIpList.push(value);

        }

    });
    var hash = {};
    $.each(allIpList,function(i,key){
        if(hash[key]){
            hasRepeat = true;
            return false;
        }
        hash[key] = true;
    });
}else{
    hasRepeat = false;
}
return {
    ipListRepeat:{
        valid: !hasRepeat
    }
};
},$.messageI18n("ipListRepeat"));

$.addMethod("path",function($item){
var  lPath = new RegExp(/(^\/([0-9a-zA-Z\-\_\\\:\/]+))+$/);
var  wPath = new RegExp(/^[a-zA-Z]:(\\([0-9a-zA-Z\-\_\\]*))*$/);
var  lPathFlag = lPath.test($item.val()) && $item.val().split("//",-1).length == 1;
var  wPathFlag = wPath.test($item.val()) && $item.val().split("\\\\",-1).length == 1;

return {
    path : {valid: lPathFlag||wPathFlag ||$item.val() == "/" }
};

},$.messageI18n("path"));

$.addMethod("sysPath",function($item){
var  lPath = new RegExp(/(^\/([^\\\:\*\'\?\"\<\>\|]+))+$/);
var  lPathFlag = lPath.test($item.val())&& $item.val().split("//",-1).length == 1&&$item.val()!=="/."&&$item.val()!=="/..";
return {
    sysPath : {valid: lPathFlag||$item.val() == "/"}
};

},$.messageI18n("sysPath"));

$.addMethod("lastNameLength",function($item){
var msgArgs = $item.data("msg");
if(msgArgs){
    msgArgs = strToJson(msgArgs);
}
var lengthLimit = msgArgs["lastNameLength"];
var url = $item.val().trim();
var length;
var valid = true;
if (url.indexOf("/") === -1) {
    length = url.length;
    if (length === 0 || length > lengthLimit) {
        valid = false;
    }
} else {
    length = url.split("/").pop().length;
    if (length > lengthLimit) {
        valid = false;
    }
}
return {
    lastNameLength : {valid: valid}
};
},$.messageFormat($.messageI18n("lastNameLength")));

$.addMethod("sysPathRelative",function($item){
var lPath = new RegExp(/^[^\\\:\*\?\'\"\<\>\|]+$/);
var valid = true;
if (!lPath.test($item.val()) || $item.val().split("//").length > 1 || $item.val() === "." || $item.val() === "..") {
    valid = false;
} else {
    var dirs = $item.val().split("/");
    for (var i = 0; i < dirs.length; i++) {
        if (dirs[i] === "." || dirs[i] === "..") {
            valid = false;
            break;
        }
    }
}
return {
    sysPathRelative : {valid: valid}
};
}, $.messageI18n("sysPathRelative"));

$.addMethod("ipmapping", function($item) {
var flag = true;
var ipArray = $item.val().split(',');
var ipmapping = new RegExp(/^([1-9]|[1-9][0-9]|1\d\d|2[0-5]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-5]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-5]\d|25[0-5])\.([1-9]|[1-9][0-9]|1\d\d|2[0-5]\d|25[0-5])$/);
for (var i = 0; i < ipArray.length; i++) {
    if (!ipmapping.test(ipArray[i])) {
        flag = false;
        break;
    }
}
return {
    ipmapping: {
        valid: ("" == $item.val()) || ((ipArray.length <= 3) && flag)
    }
};
}, $.messageI18n("ipmapping"));

$.addMethod("unequalToString",function($item){
var value = $item.val();
var ueqToStr = $item.attr("unequalToString");
var ueqArr = ueqToStr.split(",");
for(var i =0;i<ueqArr.length;i++){
    if(value == ueqArr[i]){
        ueqToStr = ueqArr[i];
    }
}
return {unequalToString:{valid:!(value == ueqToStr)}};
},$.messageFormat($.messageI18n("unequalToString")));
$.addMethod("ipArray",function($item){
var ipv4 = new RegExp(/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/);
var ipStr = $item.val();
var ipArray = ipStr.split(",",-1);
var flag;
$.each(ipArray,function(index,value){
  if(ipv4.test(value) && (value.split(".")[0] !== "127")){
      flag = true;
  }else{
      flag = false;
      return false;
  }
});
return {
    ipArray:{
        valid: flag
    }
};
},$.messageI18n("ipArray"));
$.addMethod("arrayRepeat",function($item){
var contentStr = $item.val();
var contentArray = contentStr.split(",",-1);
var hash = {},flag = true;
$.each(contentArray,function(index,value){
     if(hash[value]){
         flag = false;
         return false;
     }else{
         hash[value] = true;
     }
});

return {
    arrayRepeat:{
        valid: flag
    }
};
},$.messageI18n("arrayRepeat"));

$.addMethod("idArray",function($item){
var positive = new RegExp(/^[1-9]\d*$/);
var idStr = $item.val();
var idStrList = idStr.split(",");
var result = true;
$.each(idStrList,function(i,value){
   if(value.indexOf("-")>0){
       var valueList = value.split("-");
       if(positive.test(valueList[0])&&positive.test(valueList[1])){
           if(parseInt(valueList[0])<parseInt(valueList[1]) && parseInt(valueList[1])<=100000){

           }else{
               result = false;
               return false;
           }

       }else{
           result = false;
           return false;
       }
   }else{
     if(!positive.test(value)){
         result = false;
         return false;
     }
     if(parseInt(value)>100000){
         result = false;
         return false;
     }

   }
});

return {
    idArray: {
        valid: result
    }
}

},$.messageI18n("idArray"));

$.addMethod("idLength",function($item){
var positive = new RegExp(/^[1-9]\d*$/);
var idStr = $item.val();
var idStrList = idStr.split(",");
var result = true,lengthFlag = true,repeatFlag =true;
var msgArgs = $item.data("msg");
if(msgArgs){
    msgArgs = strToJson(msgArgs);
}
var max = parseInt(msgArgs["idLength"]);
var multiArray = [],singleArray = [];

$.each(idStrList,function(i,value){
    if(value.indexOf("-")>0){
        var valueList = value.split("-");
        if(positive.test(valueList[0])&&positive.test(valueList[1])){
            if(parseInt(valueList[0])<parseInt(valueList[1]) && parseInt(valueList[1])<=100000){
                 multiArray.push(valueList);
            }else{
                result = false;
                return false;
            }

        }else{
            result = false;
            return false;
        }
    }else{
        if(!positive.test(value)){
            result = false;
            return false;
        }
        if(parseInt(value)>100000){
            result = false;
            return false;
        }
        singleArray.push(value);
    }
});
    lengthFlag = singleArray.length <= max ;
    if(lengthFlag && result){
        var hash = {};
        $.each(singleArray,function(index,value){
            if(hash[value]){
                repeatFlag = false;
                return false;
            }else{
                hash[value] = true;
            }
        });
        for(var i=0;i<multiArray.length;i++){
            var start = parseInt(multiArray[i][0]),
                end = parseInt(multiArray[i][1]);
            $.each(singleArray,function(k,val){
                if(start<=parseInt(val) && end>= parseInt(val)){
                    repeatFlag = false;
                    return false;
                }
            });
            var tempArray = multiArray.slice();
            tempArray.splice(i,1);
            if(repeatFlag){
                $.each(tempArray,function(k,val){
                    var first = parseInt(val[0]),
                        last = parseInt(val[1]);
                    if(first>end || last<start){

                    }else{
                        repeatFlag = false;
                        return false;
                    }
                });
            }
        }

    }

if(result&&lengthFlag&&repeatFlag){
    var mount = singleArray.length;
   $.each(multiArray,function(index,value){
       var start = parseInt(value[0]),
           end = parseInt(value[1]);
       mount = mount +end - start + 1;
       if(mount > max){
           lengthFlag = false;
           return false;
       }
   });
}


return {
    idLength: {
        valid: lengthFlag
    }
}
},$.messageFormat($.messageI18n("idLength")));

$.addMethod("idArrayRepeat",function($item){
var positive = new RegExp(/^[1-9]\d*$/);
var idStr = $item.val();
var idStrList = idStr.split(",");
var result = true,lengthFlag = true,repeatFlag = true;
var msgArgs = $item.data("msg");
if(msgArgs){
    msgArgs = strToJson(msgArgs);
}
var max = parseInt(msgArgs["idLength"]);
var multiArray = [],singleArray = [];

$.each(idStrList,function(i,value){
    if(value.indexOf("-")>0){
        var valueList = value.split("-");
        if(positive.test(valueList[0])&&positive.test(valueList[1])){
            if(parseInt(valueList[0])<parseInt(valueList[1]) && parseInt(valueList[1])<=100000){
                multiArray.push(valueList);
            }else{
                result = false;
                return false;
            }

        }else{
            result = false;
            return false;
        }
    }else{
        if(!positive.test(value)){
            result = false;
            return false;
        }
        if(parseInt(value)>100000){
            result = false;
            return false;
        }
        singleArray.push(value);
    }
});

lengthFlag = singleArray.length <= max ;

if(lengthFlag && result){
    var hash = {};
    $.each(singleArray,function(index,value){
        if(hash[value]){
            repeatFlag = false;
            return false;
        }else{
            hash[value] = true;
        }
    });
    for(var i=0;i<multiArray.length;i++){
        var start = parseInt(multiArray[i][0]),
            end = parseInt(multiArray[i][1]);
        $.each(singleArray,function(k,val){
            if(start<=parseInt(val) && end>= parseInt(val)){
                repeatFlag = false;
                return false;
            }
        });
        var tempArray = multiArray.slice();
        tempArray.splice(i,1);
        if(repeatFlag){
            $.each(tempArray,function(k,val){
                var first = parseInt(val[0]),
                    last = parseInt(val[1]);
                if(first>end || last<start){

                }else{
                    repeatFlag = false;
                    return false;
                }
            });
        }
    }

}
return {
    idArrayRepeat: {
        valid: repeatFlag
    }
}
},$.messageI18n("idArrayRepeat"));


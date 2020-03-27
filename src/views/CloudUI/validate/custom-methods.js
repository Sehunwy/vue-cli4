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
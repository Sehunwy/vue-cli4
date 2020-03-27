function warningDialogForCheckedIndex(rows, operNoneTipStr, operOneTipStr){
	if (rows.length == 0) {
		openWarningDialog(operNoneTipStr);
		return false;
	}else if(rows.length > 1){
		openWarningDialog(operOneTipStr);
	    return false;
    }
	return true;
}
function warningDialogForCheckedIndexNoTip(rows, operNoneTipStr){
	if (rows.length == 0) {
		openWarningDialog(operNoneTipStr);
		return false;
	}
	return true;
}

function openWarningDialog(operTipStr){
	$.loongDialog({
		"title" : $.doI18n("notice"),
		"content" : $.doI18n(operTipStr),
		"msgType" : "warning",
		"isModal" : false
	});
}
function noticeDialog(type,message){
	$.loongDialog({
		"title" : $.doI18n("notice"),
		"content" : $.doI18n("disk_"+message),
		"msgType" : type,
		"isModal" : false
	});
}
function tabClick($form){
	$form.find(".check-tab").unbind("click");
	$form.find("div[name=purview-tab]").find(".check-tab").click(function(){
		var val;
		if($(this).hasClass("checktab-selected")){
			$(this).removeClass("checktab-selected");
			val = "false";
			$(this).attr("value",val);
		} else {
			$(this).addClass("checktab-selected");
			val = "true";
			$(this).attr("value",val);
		}
	});
	$form.find("div[name=directory-tab]").find(".check-tab").click(function(){
		var val;
		if($(this).hasClass("checktab-selected")){
			$(this).removeClass("checktab-selected");
			val = "false";
			$(this).attr("value",val);
		} else {
			$(this).addClass("checktab-selected");
			val = "true";
			$(this).attr("value",val);
		}
		if($form.find("div[name=directory-tab]").find(".checktab-selected").length == 0){
			if($(this).hasClass("checktab-selected")){
				$(this).removeClass("checktab-selected");
				val = "false";
				$(this).attr("value",val);
			} else {
				$(this).addClass("checktab-selected");
				val = "true";
				$(this).attr("value",val);
			}
		}
	});
	$form.find("div[name=directory-tab]").find(".check-tab").each(function(){
		if($(this).hasClass("dn")){
			$(this).removeClass("checktab-selected");
		}
	})	
}
function renderOrgMemberSelect(wrapStr){
	$(wrapStr + " .org-member-select").loongSelect({
		'width' : '380px',
		'ajaxData' : false,
		'name' : 'orgMember',
		'data' : [ {
			"key" : $.doI18n("disk_member_all_org_member"),
			"value" : true
		}, {
			"key" : $.doI18n("disk_member_dept_org_member"),
			"value" : false
		}]
	});
}

function renderCapacityUnitSelect(wrapStr){
	$(wrapStr + " .capacity-unit-select").loongSelect({
		'width' : '70px',
		'ajaxData' : false,
		'name' : 'diskUnit',
		'data' : [ 
			{
				"key" : "GB",
				"value" : "GB"
			},
			{
				"key" : "TB",
				"value" : "TB"
			}
		]
	});
}

function setModelPropertyForm(obj,$form, mode,selectUnit){
	var modelObj = obj;
	var queryData = JSON.parse(sessionStorage.getItem('diskDefault'));
	for(var key in modelObj){
		var value = modelObj[key];
        if(key === 'preview'){
            value = !!queryData.showPreview && value;
		}
        if ( $form.find(".check-tab[name='" + key + "']").length != 0 ) {
			var tabSpan =  $form.find(".check-tab[name='" + key + "']");
			tabSpan.attr("value",value);
			if (value == true) {
				if (!tabSpan.hasClass("checktab-selected")) {
					tabSpan.addClass("checktab-selected");
				}
			}else if (value == false) {
				if (tabSpan.hasClass("checktab-selected")) {
					tabSpan.removeClass("checktab-selected");
				}
			}
            if(key === 'preview'&& queryData.showPreview){
                tabSpan.removeClass('dn');
			}
        }
		if ($form.find("input[name='" + key + "']").length != 0 ) {
			var input = $form.find("input[name='" + key + "']");
			input.val(value);
			if (key == "orgMember") {
				var display = ((value == true || value == "true")? $.doI18n("disk_member_all_org_member"):$.doI18n("disk_member_dept_org_member"));
				input.next().html(display);
			}
			if (key == "space" && mode == "update") {
				var capacity = byteWithUnitInt(modelObj.totalSpace,"TB");
				input.val(capacity.quota);
				selectUnit.setContent(capacity.unit,capacity.unit);
			}else if(key == "space" && mode == "model"){
				var capacity = byteWithUnitInt(modelObj.space,"TB");
				input.val(capacity.quota);
				selectUnit.setContent(capacity.unit,capacity.unit);
			}
		}
	}
	$form.find("div[name=directory-tab]").find(".check-tab").each(function(){
		if($(this).hasClass("dn")){
			$(this).removeClass("checktab-selected");
		}
	})	
}
function getModelPropertyForm($form){
	var obj = {};
	var key;
	var value;
	$form.find(".check-tab").each(function(){
		key = $(this).attr("name");
		value = ($(this).attr("value") === "true");
		obj[key]=value;
	});
	$form.find(".purview-input").each(function(){
		key = $(this).attr("name");
		value = $(this).val();
		obj[key]=parseInt(value);
	});
	value = $form.find("input[name='orgMember']").val();
	obj["orgMember"]=value;
	if ($form.find("input[name=modelname]").length > 0) {
		obj["modelname"] = $form.find("input[name=modelname]").val().trim();
	}
	obj["space"] = $.getByteSize($form.find(".input-unit").val(), $form.find(".capacity-unit-select").find(".select").html());
	return obj;
}

function addEvent(wrapStr) {
	$(wrapStr + " .bk-number-up").unbind("click");
	$(wrapStr + " .bk-number-up").on("click", function() {
		coutPlus(wrapStr);
	});
	$(wrapStr + " .bk-number-down").unbind("click");
	$(wrapStr + " .bk-number-down").on("click", function() {
		countMinus(wrapStr);
	});
}
function coutPlus(wrapStr) {
	var count = $(wrapStr + " .input-number").val();
	$(wrapStr + " .input-number").val(Number(count) + 1);
}

function countMinus(wrapStr) {
	var count = $(wrapStr + " .input-number").val();
	if (0 >= Number(count)) {
		$(wrapStr + " .input-number").val(0);
		return;
	}
	$(wrapStr + " .input-number").val(Number(count) - 1);
}

function deptTree() {
	var result;
	$.$ajax({
		type : "POST",
		url : "/api/dept/diskdept/list",
		dataType : "json",
		cache : false,
		async : false,
		success : function(data) {
			var children = data.data;
			var json = [];
			var obj = {};
			obj.key = $.doI18n("disk_department_all_dept");
			obj.value = "";
			obj.children = [];
			json.push(obj);
			getChildren(json[0].children,children);
			// getChildren(json,children);
			result = json;
		}
	});
	return result;
}

function getChildren(json,children){
	for (var i = 0; i < children.length; i++) {
		var obj = {};
		obj.key = children[i].name;
		obj.value = children[i].guid;
		obj.children = getChildren(new Array(),children[i].children);
		json.push(obj);
	}
	return json;
}

function byteWithUnitInt(num,maxUnit,isFloat){
	var quota;
	if(isFloat == undefined){
		isFloat == false;
	}
	switch(maxUnit) {
		case "PB": 
			flag = 0;
			break;
		case "TB":
			flag = 1;
			break;
		case "GB":
			flag = 2;
			break;
		case "MB":
			flag = 3;
			break;
		case "KB":
			flag = 4;
			break;
		case "B":
			flag = 5;
			break;
		default: 
			flag = 0;
	}
    if (num / (1024 * 1024 * 1024 * 1024 * 1024) >= 1 && flag == 0) {
        if(isFloat){
        	quota = (num / ( 1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2);
        }else{
        	quota = Math.round(num / ( 1024 * 1024 * 1024 * 1024 * 1024));
        }
        return {
            quota: quota,
            rate: 1024 * 1024 * 1024 * 1024 * 1024,
            unit: "PB"
        }
    } else if (num / (1024 * 1024 * 1024 * 1024) >= 1 && flag <= 1) {
    	if(isFloat){
        	quota = (num / ( 1024 * 1024 * 1024 * 1024)).toFixed(2);
        }else{
        	quota = Math.round(num / ( 1024 * 1024 * 1024 * 1024));
        }
        return {
            quota: quota,
            rate: 1024 * 1024 * 1024 * 1024,
            unit: "TB"
        }
    } else if (num / (1024 * 1024 * 1024) >= 1 && flag <= 2) {
    	if(isFloat){
        	quota = (num / ( 1024 * 1024 * 1024)).toFixed(2);
        }else{
        	quota = Math.round(num / ( 1024 * 1024 * 1024));
        }
        return {
            quota: quota,
            rate: 1024 * 1024 * 1024,
            unit: "GB"
        }
    } else if (num / (1024 * 1024) >= 1 && flag <= 3) {
    	if(isFloat){
        	quota = (num / ( 1024 * 1024)).toFixed(2);
        }else{
        	quota = Math.round(num / ( 1024 * 1024));
        }
        return {
            quota: quota,
            rate: 1024 * 1024,
            unit: "MB"
        }
    } else if (num / (1024) >= 1 && flag <= 4) {
    	if(isFloat){
        	quota = (num / ( 1024 )).toFixed(2);
        }else{
        	quota = Math.round(num / ( 1024 ));
        }
        return {
            quota: quota,
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
}

function userPropQuery(){
    var queryData;
    $.$ajax({
        url:"/api/user/diskuserprop/query",
        type:'get',
        cache:false,
        async:false,
        success:function(data){
            queryData = data.data;
        },
		beforeSend:function(){
        	$.loading();
		},
		complete: function(){
        	$.clearLoading();
		}
    });
   sessionStorage.setItem('diskDefault',JSON.stringify(queryData));
}

(function($){
	userPropQuery();
})(jQuery);

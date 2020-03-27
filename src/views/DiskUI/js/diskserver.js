var nodeListData = [];
var rowData = [];
var table = {};
var delData = {};
var ipSelect;
export function diskserver() {
	nodeListData = [];
	rowData = [];
	table = {};
	delData = {};
	ipSelect = '';
	listServerTable();
	$("div[name='addDiskServer']").click(function () {
		var dialogTitle = "disk_server_add_lds";
		var dialogContent = $("div.add-server-con").html();
		var formStr = "form[name=addServerForm]";
		preAddServer(dialogTitle, dialogContent, formStr, "disk_server_host_add_success");
	});
	$("div[name='delDiskServer']").click(function () {
		if ($(this).hasClass("btn-service-disabled")) {
			return;
		}
		preDelServer("disk_server_host_del_none_tip", "disk_server_host_del_one_tip");
	});
	$("div[name='startDiskServer']").click(function () {
		if ($(this).hasClass("btn-service-disabled")) {
			return;
		}
		StartOrStopServer("/api/node/disknode/start", "disk_server_host_start_none_tip", "disk_server_host_start_one_tip", "disk_server_host_start_success", undefined);
	});
	$("div[name='stopDiskServer']").click(function () {
		if ($(this).hasClass("btn-service-disabled")) {
			return;
		}
		StartOrStopServer("/api/node/disknode/stop", "disk_server_host_stop_none_tip", "disk_server_host_stop_one_tip", "disk_server_host_stop_success", "disk_server_host_stop_confirm");
	});
	$("div[name='dbOper']").mouseover(function () {
		$(this).find("div.more-btns").css({
			"display": "block"
		});
	});
	$("div[name='dbOper']").mouseout(function () {
		$(this).find("div.more-btns").css({
			"display": "none"
		});
	});
	$("div[name='addDB']").click(function () {
		if ($(this).hasClass("hover-disabled")) {
			return;
		}
		AddOrDelDB("/api/node/diskdbserver/add", "disk_server_db_add_none_tip", "disk_server_db_add_one_tip", "disk_server_db_add_success", undefined);
	});
	$("div[name='delDB']").click(function () {
		if ($(this).hasClass("hover-disabled")) {
			return;
		}
		AddOrDelDB("/api/node/diskdbserver/delete", "disk_server_db_del_none_tip", "disk_server_db_del_one_tip", "disk_server_db_del_success", "disk_server_db_del_confirm");
	});
	$("div[name='updateIPMappings']").click(function () {
		if ($(this).hasClass("btn-service-disabled")) {
			return;
		}
		var dialogTitle = "disk_btn_update_ipmapping";
		var dialogContent = $("div.upadte-ipmapping-con").html();
		var formStr = "form[name=updateIpMappingsForm]";
		preUpdateIpMapping(dialogTitle, dialogContent, formStr, "disk_server_update_ipmappings_none_tip", "disk_server_update_ipmappings_one_tip", "/api/node/diskipmaps/update", "disk_server_ipmapping_update_success");
	});
	$("div[name='downloadKey']").click(function () {
		if ($(this).hasClass("btn-service-disabled")) {
			return;
		}
		downloadKey();
	});
	$("div[name='setAuth']").click(function () {
		if ($(this).hasClass("btn-service-disabled")) {
			return;
		}
		var dialogTitle = "disk_server_set_license_file";
		var dialogContent = $("div.set-auth-con").html();
		var formStr = "form[name=setAuthForm]";
		preSetAuth(dialogTitle, dialogContent, formStr);
	})
}
function listServerTable() {
	var dataArr;
	$.$ajax({
		"url": "/api/node/disknode/list",
		"type": "post",
		"async": false,
		success: function (data) {
			dataArr = data.data;
		}
	})
	if (dataArr == "" || dataArr[0].children == "") {
		$("#disk-server-list").html($(".no-service").clone());
		$(".no-service:eq(0)").removeClass("dn");
		$("#disk-server-list").find($(".add-service-btn")).click(function () {
			var dialogTitle = "disk_server_add_lds";
			var dialogContent = $("div.add-server-con").html();
			var formStr = "form[name=addServerForm]";
			preAddServer(dialogTitle, dialogContent, formStr, "disk_server_host_add_success");
		});
		$("div[name=btn-list]").find(".no-click").addClass("btn-service-disabled");
		$("div[name=btn-list]").find("div[name=addDB]").addClass("hover-disabled");
		$("div[name=btn-list]").find("div[name=delDB]").addClass("hover-disabled");
	} else {
		table = $("#disk-server-list").loongTable(
			{
				height: "full-126",
				hasCheckbox: true,
				ajaxData: false,
				data: dataArr[0].children,
				hasLoading: true,
				pagination: false,
				fields: [
					{
						"name": "id",
						"visible": false,
						"title": $.doI18n("disk_server_order_num")
					},
					{
						"dcip": "ip",
						"name": "ip",
						"visible": true,
						"title": $.doI18n("disk_server_ip")
					},
					{
						"name": "mapIPs",
						"title": $.doI18n("disk_server_ip_map"),
						formater: function (value) {
							if (value == "") {
								return $('<div class="line"></div>');
							} else {
								return value;
							}
						}
					}, {
						"name": "dbId",
						"title": $.doI18n("disk_server_dbid"),
						"width": "174px",
						formater: function (value) {
							if (value == "") {
								return $('<span style="color:#999;">' + $.doI18n("disk_server_db_no") + '</span>');
							} else {
								return value;
							}
						}
					},
					{
						"name": "expired",
						"visible": true,
						"width": "149px",
						"title": $.doI18n("disk_server_lds_auth_state"),
						formater: function (value) {
							if (value == undefined) {
								return $('<div class="line"></div>');
							} else {
								var year = 31536000;
								var day = 86400;
								var hour = 3600;
								var minute = 60;
								var str = value.split(" ");
								if ((str[0] + " " + str[1]) == 'License expired') {
									var usedDays = $.doI18n("disk_server_auth_expired") + $.doI18n("disk_server_ServerView_Used") + str[2] / 86400 + $.doI18n("disk_server_ServerView_days");
									return $("<span style='color:red;'>" + usedDays + "</span>");
								} else if ((str[0] + " " + str[1] + " " + str[2] + " " + str[3]) == 'Matched license not found') {
									var unauth = $.doI18n("disk_server_unauth");
									return $("<span style='color:red;'>" + unauth + "</span>")
								} else {
									if (value >= 31536000) {
										return $.doI18n("disk_server_nomal");
									} else if (value >= 86400) {
										return Math.floor(value / day) + $.doI18n("disk_server_day_expired");
									} else if (value >= 3600) {
										return Math.floor(value / hour) + $.doI18n("disk_serve_hour_expired");
									} else if (value >= 60) {
										return Math.floor(value / minute) + $.doI18n("disk_server_minute_expired");
									} else if (value > 0) {
										return value + $.doI18n("disk_server_second_expired");
									} else if (value == -1) {
										var error = $.doI18n("disk_ldsysd_error_tip");
										return $("<div title='" + error + "'><svg class='icon icon-quanjurenwushibai' aria-hidden='true'><use xlink:href='#icon-quanjurenwushibai'></use></svg><div>");
									} else {
										return '';
									}
								}
							}

						}
					},
					{
						"name": "ldsRun",
						"title": $.doI18n("disk_server_run_state"),
						"width": "118px",
						formater: function (value, row) {
							var errorCode = row.errorCode, msg = "";
							for (var i = 0; i < errorCode.length; i++) {
								msg = msg + $.doI18n("disk_" + errorCode[i].message) + "\n";
							}
							switch (value) {
								case 1:
									return $("<div title='" + $.doI18n("disk_server_start") + "'><svg class='icon icon-yunxing' aria-hidden='true' title='" + $.doI18n("disk_server_run") + "'><use xlink:href='#icon-yunhang'></use></svg><div>");
								case 0:
									return $("<div title='" + $.doI18n("disk_server_stop") + "'><svg class='icon icon-zanting' aria-hidden='true'><use xlink:href='#icon-zanting'></use></svg><div>");
								case -1:
									return $("<div title='" + msg + "'><svg class='icon icon-quanjurenwushibai' aria-hidden='true'><use xlink:href='#icon-quanjurenwushibai'></use></svg><div>");
								default:
									return value;
							}
						}
					},
				]
			});
		$(".no-service").addClass("dn");
		$("div[name=btn-list]").find(".no-click").removeClass("btn-service-disabled");
		$("div[name=btn-list]").find("div[name=addDB]").removeClass("hover-disabled");
		$("div[name=btn-list]").find("div[name=delDB]").removeClass("hover-disabled");
	}
}

function preAddServer(dialogTitle, dialogContent, formStr, successStr) {
	var addModal = $.loongDialog({
		"title": $.doI18n(dialogTitle),
		"isClosed": true,
		"modalType": "min",
		"fixed": false,
		"content": dialogContent,
		"isModal": true,
		"buttons": [{
			"txt": $.doI18n("btn_ok"),
			"callback": function () {
				addServer(addModal, formStr, successStr);
			}
		}],
	});
	var defaultConfig = JSON.parse(sessionStorage.getItem('diskDefault')) || {};
	var $form = $(".dialog-wrap").find(formStr);
	if (defaultConfig.leofsOn) {
		$(".dialog-wrap").find("[name='input-way']").empty();

		ipSelect = $(".dialog-wrap").find("[name='input-way']").loongSelect({
			'width': '380px',
			'ajaxData': true,
			'name': 'refId',
			'getData': function () {
				var ipList = getServerList();
				var result = [];
				result = ipList.map(function (item) {
					var obj = {};
					obj.key = item.ip;
					obj.value = item.refId;
					return obj
				});
				return result;
			},
		});

	}
	$(".has-db-select").loongSelect({
		'width': '380px',
		'ajaxData': false,
		'name': 'hasDB',
		'data': [{
			"key": $.doI18n("disk_yes"),
			"value": true
		}, {
			"key": $.doI18n("disk_no"),
			"value": false
		}]
	});
	$.formValid($form);
}

function getServerList() {
	var ipList = [];
	$.$ajax({
		type: 'get',
		url: " /api/store/node/clientNode/without/role/list",
		data: {
			nodeRoleCode: 5
		},
		async: false,
		cache: false,
		success: function (json) {
			ipList = json.data || [];
		}
	});
	return ipList;
}

function addServer(modal, formStr, successStr) {
	var $form = $(".dialog-wrap").find(formStr);
	var ret = $.loongValidate($form);
	if (ret.hasError) {
		var input = ret.element;
		showValid($form, input, ret);
		return false;
	}
	var formData = $form.serializeArray();
	var jsonData = $.serializeJson(formData);
	if (ipSelect) {
		jsonData.ip = $(".dialog-wrap").find("[name='input-way'] .select").html();
	} else {
		jsonData.refId = -1
	}
	var ip = jsonData.ip;
	var mapIps = jsonData.mapIPs;
	var hasDB = (jsonData.hasDB == "false" ? false : true);
	jsonData = $.extend(jsonData, {
		dcID: "1",
		hasDB: hasDB
	});
	var data = {};
	data.data = JSON.stringify(jsonData);
	sendAjaxWithModal(data, modal, "/api/node/disknode/add", successStr, ip);
}

function preDelServer(operNoneTipStr, operOneTipStr) {
	var servers = table.getCheckedIndex();
	if (!warningDialogForCheckedIndex(servers, operNoneTipStr, operOneTipStr)) {
		return;
	};
	delServer();
}

function delServer() {
	var servers = table.getCheckedIndex();
	var rowData = table.getRowData(servers[0]);
	var data = {};
	data.data = JSON.stringify(rowData);
	$.loongDialog({
		"title": $.doI18n("notice"),
		"isInfo": true,
		"isClosed": true,
		"content": $.doI18n("disk_server_host_delete_confirm"),
		"buttons": [{
			"txt": $.doI18n("btn_ok"),
			"callback": function () {
				var ip = JSON.parse(data.data).ip;
				sendAjaxWithModal(data, null, "/api/node/disknode/delete", "disk_server_host_delete_success", ip);
				return true;
			}
		}, {
			"txt": $.doI18n("btn_cancel")
		}]
	});
}

function StartOrStopServer(operateUrl, operationNoneTipStr, operationOneTipStr, successStr, confirmTipStr) {
	var servers = table.getCheckedIndex();
	if (!warningDialogForCheckedIndexNoTip(servers, operationNoneTipStr)) {
		return;
	};
	var nodes = [];
	for (var i = 0; i < servers.length; i++) {
		var rowData = table.getRowData(servers[i]);
		var node = {};
		node.dcID = rowData.dcID;
		node.id = rowData.id;
		node.ip = rowData.ip;
		node.hasDB = rowData.hasDB;
		node.dbId = rowData.dbId;
		node.success = false;
		nodes.push(node);
	}
	var nodesStr = JSON.stringify(nodes);
	var data = {};
	data.data = nodesStr;
	if (confirmTipStr != undefined) {
		$.loongDialog({
			"title": $.doI18n("notice"),
			"isInfo": true,
			"isClosed": true,
			"content": $.doI18n(confirmTipStr),
			"buttons": [{
				"txt": $.doI18n("btn_ok"),
				"callback": function () {
					sendAjaxWithModal(data, null, operateUrl, successStr, undefined);
					return true;
				}
			}, {
				"txt": $.doI18n("btn_cancel")
			}]
		});
	} else {
		sendAjaxWithModal(data, null, operateUrl, successStr, undefined);
	}
}

function AddOrDelDB(operUrl, operNoneTipStr, operOneTipStr, successStr, confirmTipStr) {
	var servers = table.getCheckedIndex();
	if (!warningDialogForCheckedIndex(servers, operNoneTipStr, operOneTipStr)) {
		return;
	};
	var rowData = table.getRowData(servers[0]);
	var node = {};
	node.dcID = rowData.dcID;
	node.id = rowData.dbId;
	node.ip = rowData.ip;
	var nodesStr = JSON.stringify(node);
	var data = {}
	data.data = nodesStr;
	if (confirmTipStr != undefined) {
		$.loongDialog({
			"title": $.doI18n("notice"),
			"isInfo": true,
			"isClosed": true,
			"content": $.doI18n(confirmTipStr),
			"buttons": [{
				"txt": $.doI18n("btn_ok"),
				"callback": function () {
					sendAjaxWithModal(data, null, operUrl, successStr, node.ip);
					return true;
				}
			}, {
				"txt": $.doI18n("btn_cancel")
			}]
		});
	} else {
		sendAjaxWithModal(data, null, operUrl, successStr, node.ip);
	}
}

function preUpdateIpMapping(dialogTitle, dialogContent, formStr, operNoneTipStr, operOneTipStr, operUrl, successStr) {
	var servers = table.getCheckedIndex();
	if (!warningDialogForCheckedIndex(servers, operNoneTipStr, operOneTipStr)) {
		return;
	};
	var rowData = table.getRowData(servers[0]);
	if (rowData.ldsRun == 1) {
		$.loongDialog({
			"content": $.doI18n("disk_servers_all_must_stop"),
			"msgType": "error",
			"isModal": false
		})
		return;
	}
	var ip = rowData.ip;
	var ipmappings = rowData.mapIPs;
	var modal = $.loongDialog({
		"title": $.doI18n(dialogTitle),
		"isClosed": true,
		"modalType": "min",
		"fixed": false,
		"content": dialogContent,
		"isModal": true,
		"buttons": [{
			"txt": $.doI18n("btn_ok"),
			"callback": function () {
				updateIpMapping(modal, formStr, rowData, operUrl, successStr);
			}
		}],
	});
	var $form = $(formStr);
	$form.find(".update_ipmappings_ip").text(ip);
	$form.find(".update_ipmappings").attr("value", ipmappings);
	$form.find(".update_ipmappings").focus();
	$.formValid($form);
}

function updateIpMapping(modal, formStr, rowData, operUrl, successStr) {
	var $form = $(".dialog-wrap").find(formStr);
	var ret = $.loongValidate($form);
	if (ret.hasError) {
		var input = ret.element
		showValid($form, input, ret);
		return false;
	}
	var ipmappings = $form.find("input[name=mapIPs]").val();
	rowData = $.extend(rowData, {
		mapIPs: ipmappings
	});
	var data = {};
	data.data = JSON.stringify(rowData);
	sendAjaxWithModal(data, modal, operUrl, successStr, undefined);
	$form.find(".update_ipmappings").focus();
}

function sendAjaxWithModal(data, modal, operUrl, successStr, errorParam) {
	$.$ajax({
		url: operUrl,
		type: "post",
		data: data,
		beforeSend: function (xhr) {
			$.loading();
		},
		success: function (data) {
			if ($.isEmptyObject(data)) {
				listServerTable();
				if (modal != null) {
					modal.hideDialog();
				}
				$.loongDialog({
					"content": $.doI18n(successStr),
					"msgType": "success",
					"isModal": false
				})
			} else {
				$.loongDialog({
					"content": $.doI18n("disk_" + data.error_message, errorParam),
					"msgType": "error",
					"isModal": false
				})
			}
		},
		complete: function (xhr, status) {
			$.clearLoading();
		}
	});
}

function downloadKey() {
	var hostsIndex = table.getCheckedIndex();
	var hosts = table.getRowData();
	if (!warningDialogForCheckedIndexNoTip(hostsIndex, "disk_server_host_operation_none_tip")) {
		return;
	};
	var dataArr = [];
	for (var i = 0; i < hostsIndex.length; i++) {
		var obj;
		obj = {
			"dcID": hosts[hostsIndex[i]].dcID,
			"ldsID": hosts[hostsIndex[i]].id,
			"ip": hosts[hostsIndex[i]].ip
		}
		dataArr.push(obj);
	}
	var data = JSON.stringify(dataArr);
	var url = "/api/license/disklicensekey/download";
	var form = $("<form target='blankIframe'></form>").attr("action", url).attr("method", "post");
	form.append($("<input></input>").attr("type", "hidden").attr("name", "data").attr("value", data));
	form.appendTo('body').submit().remove();
}

function preSetAuth(dialogTitle, dialogContent, formStr) {
	var filePath;
	var hostsIndex = table.getCheckedIndex();
	var hosts = table.getRowData();
	if (!warningDialogForCheckedIndexNoTip(hostsIndex, "disk_server_host_operation_none_tip")) {
		return;
	};
	var modal = $.loongDialog({
		"title": $.doI18n(dialogTitle),
		"isClosed": true,
		"modalType": "min",
		"fixed": false,
		"content": dialogContent,
		"isModal": true,
		"buttons": [{
			"txt": $.doI18n("btn_ok"),
			"callback": function () {
				setAuth(filePath, hostsIndex, hosts, modal, formStr);
			}
		}],
	});
	var $form = $(".dialog-wrap").find(formStr);
	$form.find(".select-license-icon").click(function () {
		$form.find('input[name=licenseFile]').on('change', function () {
			if ($form.find('input[name=licenseFile]').val() == '')
				return;
			var path = $form.find('input[name=licenseFile]').val();
			var fileType = path.substring(path.indexOf("."));
			if (fileType != ".dat") {
				$.loongDialog({
					"content": $.doI18n("disk_upload_model_file_type"),
					"msgType": "warning",
					"isModal": false
				})
				$form.find('input[name=licenseFile]').val("");
				return;
			}
			var file = this.files[0];
			var formData = new FormData();
			formData.append('fileData', file);
			$.$ajax({
				"url": '/file/uploadTotal',
				"type": 'POST',
				"cache": false,
				"dataType": "text",
				"data": formData,
				"processData": false,
				"contentType": false,
				beforeSend: function (xhr) {
					$.loading();
				},
				success: function (data) {
					filePath = data;
					var fileName = file.name;
					$form.find(".select-license-file").html(fileName);
				},
				error: function (data) {
					$.loongDialog({
						"content": $.doI18n(data.upload_error),
						"msgType": "error",
						"isModal": false
					})
				},
				complete: function (xhr, status) {
					$.clearLoading();
				}
			})
			$form.find('input[name=licenseFile]').val("");
		});
	})
}
function setAuth(filePath, hostsIndex, hosts, modal, formStr) {
	var $form = $(".dialog-wrap").find(formStr);
	var dataArr = [];
	for (var i = 0; i < hostsIndex.length; i++) {
		var obj;
		obj = {
			"dcID": hosts[hostsIndex[i]].dcID,
			"ldsID": hosts[hostsIndex[i]].id,
			"ip": hosts[hostsIndex[i]].ip
		}
		dataArr.push(obj);
	}
	var data = JSON.stringify(dataArr);
	if ($form.find('.select-license-file').html() == "" || filePath == undefined) {
		$.loongDialog({
			"content": $.doI18n("disk_server_authfile_not_upload"),
			"msgType": "error",
			"isModal": false
		})
		return false;
	}
	$.$ajax({
		"url": "/api/license/disklicense/upload",
		"type": "post",
		"data": {
			"filePath": filePath,
			"data": data
		},
		beforeSend: function (xhr) {
			$.loading();
		},
		success: function (data) {
			if ($.isEmptyObject(data)) {
				listServerTable();
				if (modal != null) {
					modal.hideDialog();
				}
				$.loongDialog({
					"content": $.doI18n("disk_server_set_license_success"),
					"msgType": "success",
					"isModal": false
				})
			} else {
				$.loongDialog({
					"content": $.doI18n("disk_" + data.error_message),
					"msgType": "error",
					"isModal": false
				})

			}
		},
		complete: function (xhr, status) {
			$.clearLoading();
		}
	});
}
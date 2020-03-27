import { configJson } from '@/views/LoongUI/frame/lib/config.js'
import { formaterTitle } from '@/views/LoongUI/frame/js/common.js'
import router from '@/router'
var appTable, roleAppTable, rolesLength = configJson.length;
var addAppDialog, setAppDialog, monitorAppDialog;
var addAppDialog, setAppDialog;
export function application() {
    appTable = ''; roleAppTable = ''; rolesLength = configJson.length;
    addAppDialog = ''; setAppDialog = ''; monitorAppDialog = '';
    addAppDialog = ''; setAppDialog = ''
    bindEvent();
    // initAppTable();
    $(".ip-search-box").loongQuery({
        isSelect: false,
        isInput: true,
        fetchSug: false,
        selectWidth: '94px',
        inputWidth: "290px",
        placeholderTxt: $.doI18n("store_common_placeholder_search_ip"),
        icon: '#icon-sousu',
        datalist: [],
        getData: undefined,
        hasMemory: true,
        doquery: function (key, value) {
            if (value.length > 15) {
                $.loongDialog({
                    "content": $.doI18n("search_tip", 15),
                    "isModal": false,
                    "msgType": 'warning'
                });
            } else {
                initAppTable(value);
            }
        }
    });
    if (rolesLength > 2) {
        $("li[name=set-dir]").html($.doI18n("store_appmgr_role_set"));
        $("div[name=role-app]").parent().removeClass("dn");
        $("form.add-app-form").find(".add-app-path").addClass("dn");
        $("form.add-app-form").find(".add-app-role").removeClass("dn");
        $("form.set-app-form").find(".set-app-path").addClass("dn");
        $("form.set-app-form").find(".set-app-role").removeClass("dn");
        $("form.set-path-form").find(".set-path").addClass("dn");
        $("form.set-path-form").find(".set-role").removeClass("dn");
    }
    window.intervals.push(setInterval(function () {
        appTable.refresh("refId", ["ip", "status", "locked", "auto"]);
    }, 5000));

}
// var appTable, roleAppTable, rolesLength = configJson.length;

function initAppTable(keyWord) {
    var calcRoleDatas = getRoleData();
    var curPageSize = $.isEmptyObject(appTable) ? 20 : parseInt(appTable.pageSize);
    var fields = [
        {
            "name": "id",
            "visible": true,
            "title": "ID",
            "visible": false
        },
        {
            "name": "ip",
            "width": "150px",
            "visible": true,
            "title": "IP",
            "hasClick": true,
            "formater": function (value, rowData) {
                var $dom = $("<div><span class='mr5 cblue ip-host'>" + value + "</span><span class='app-detail-icon cblue hand'><svg class='icon'><use xlink:href='#icon-chakanxiangqing'></use></svg></span></div>");
                $(document).off("click", ".app-detail-icon");
                $(document).on("click", '.app-detail-icon', function () {
                    if (!$(this).parent().hasClass("no-monitor-status")) {
                        var index = $(this).parents(".table-content-row").attr("data-index");
                        var id = appTable.getRowData(index).id;
                        // $.loadPage("/StoreUI/page/application-detail.html", { 'appId': id }, $("#container"));
                        router.push({
                            path: '/store/client/application-detail',
                            query: {
                                appId: id
                            }
                        })

                    }

                });
                if (rowData.monitor == "0") {
                    $dom.removeClass("error-status");
                    $dom.addClass("no-monitor-status");
                    $dom.find(".app-detail-icon").addClass("dn");
                } else if (rowData.monitor == "1") {
                    $dom.removeClass("no-monitor-status");
                    $dom.find(".app-detail-icon").removeClass("dn");
                    if (rowData.status == "-1") {
                        $dom.addClass("error-status");

                    }
                }
                return $dom[0].outerHTML;
            }
        }, {
            "name": "mountPath",
            "title": $.doI18n("store_appmgr_mount_dir"),
            "overflowEllipsis": true,
            /*"width": "300px"*/
        }, {
            "name": "subDir",
            "title": $.doI18n("store_appmgr_real_path"),
            "formater": function (value) {
                var $dom = $("<div class='toe'></div>"), str;
                if (value == "") {
                    str = "/";
                } else {
                    str = value;
                }
                $dom.html(str);

                $dom.attr("title", formaterTitle(str));
                return $dom[0].outerHTML;

            }
        },/*{
                "name" : "size",
                "width" : "130px",
                "title": $.doI18n("store_app_storage_limit"),
                "formater" : function(value){
                    var $span = $("<span></span>");
                    if(value == 0){
                        $span.addClass("light-text");
                        $span.html($.doI18n("store_app_no_limit"));
                    }else{
                        var str = $.formatSizeStr(value);
                        $span.html(str);
                    }
                    return $span;
                }

            },
            {
                "name" : "isAccess",
                "visible" : true,
                "title": $.doI18n("store_app_white_list"),
                "width": "130px",
                "formater" : function(value){
                    var $span = $("<span></span>");
                     if(value){
                         $span.html($.doI18n("store_app_is_access"));

                     }else{
                         $span.addClass("light-text");
                         $span.html($.doI18n("store_app_no_access"));
                     }
                     return $span;
                }
            }, */{
            "name": "status",
            "visible": true,
            "title": $.doI18n("store_appmgr_app_status"),
            "formater": function (value, rowData) {
                var str, icon;
                var $icon = $("<div class='fs16'><svg class='icon'><use xlink:href=''></use></svg></div>");
                if (rowData.monitor == "1") {
                    switch (value) {
                        case 0: str = $.doI18n("store_appmgr_state_run");
                            icon = "#icon-yunhang";
                            $icon.css("color", "#22CC22");
                            break;
                        case 1: str = $.doI18n("store_appmgr_state_stop");
                            icon = "#icon-zanting";
                            $icon.addClass("c9");
                            break;
                        case -1: str = $.doI18n("store_appmgr_state_unknown");
                            icon = "#icon-weizhizhuangtai";
                            $icon.css("color", "#FF2222");
                            break;
                    }
                } else if (rowData.monitor == "0") {
                    str = $.doI18n("store_appmgr_state_unmonitor");
                    icon = "#icon-weijiankong";
                    $icon.addClass("c9");

                }
                $icon.attr("title", str);
                $icon.find("use").attr('xlink:href', icon);
                return $icon[0].outerHTML;
            },
            "width": "100px"


        }, {
            "name": "locked",
            "title": $.doI18n("store_appmgr_lock_status"),
            "width": "100px",
            "formater": function (value, rowData) {
                var str, icon,
                    $dom = $("<div class='c9 fs16'><svg class='icon'><use xlink:href=''></use></svg></div>");
                if (rowData.monitor == "1") {
                    if (value == 1) {
                        str = $.doI18n("store_appmgr_state_lock");
                        icon = "#icon-suoding1";
                    } else if (value == 0) {
                        str = $.doI18n("store_appmgr_state_unlock");
                        icon = "#icon-weisuoding1";
                        /* $dom.addClass("light-text");*/
                    } else if (value == -1) {
                        str = $.doI18n("store_appmgr_state_unknown");
                        icon = "#icon-weizhizhuangtai";

                    }
                } else if (rowData.monitor == "0") {
                    str = $.doI18n("store_appmgr_state_unmonitor");
                    icon = "#icon-weijiankong";

                }

                $dom.find("use").attr("xlink:href", icon);
                $dom.attr("title", str);
                return $dom[0].outerHTML;

            },


        },
        {
            "name": "auto",
            "visible": true,
            "width": "100px",
            "title": $.doI18n("store_appmgr_auto"),
            "formater": function (value) {
                var $dom = $("<div class='c9 fs16'><svg class='icon'><use xlink:href=''></use></svg></div>");
                var icon, str;
                if (value) {
                    icon = "#icon-ziqidong1";
                    str = $.doI18n("store_appmgr_state_autostart");
                } else {
                    icon = "#icon-guanbiziqidong";
                    str = $.doI18n("store_appmgr_state_no_autostart");
                }
                $dom.find("use").attr("xlink:href", icon);
                $dom.attr("title", str);
                return $dom[0].outerHTML;
            }
        }
        , {
            "name": "comment",
            "visible": true,
            "width": "130px",
            "title": $.doI18n("store_appmgr_remark"),
            "overflowEllipsis": true



        }
    ];
    var roleParam = {
        "name": "role",
        "title": $.doI18n("store_appmgr_role"),
        "formater": function (value) {
            var $dom = $("<div class='toe'></div>");
            var roles = calculateRoles(calcRoleDatas, value);
            var roleNames = roles.map(function (v) {
                return v.name;
            }).join(",");
            $dom.html(roleNames);
            appTable.tdOverflowEvent(appTable.$container, $dom, roleNames);
            return $dom;
        }
    }
    if (rolesLength > 2) {
        fields.splice(3, 0, roleParam);
    }
    appTable = $(".app-table-wrap").loongTable({
        height: "full-126",
        fields: fields,
        hasCheckbox: true,
        ajaxData: true,
        url: "/api/store/node/clientNode/page",
        params: {
            keyword: keyWord
        },
        pagination: true,
        pageSize: curPageSize,
        hasLoading: true,
        haveStorage: true

    });
}

function checkIsLocked(index) {
    var flag = false;
    $.each(index, function (i, value) {
        if (value.locked == 1) {
            flag = true;
            return false;

        }
    });
    return flag;

}
function bindEvent() {
    var $hasDropBtn = $(".btn-opr[name='start-app'],.btn-opr[name='stop-app'],.btn-opr[name='lock-app'],.btn-opr[name='unlock-app'],.btn-opr[name='more']").parent();
    $(".btn-opr[name='add-app']").click(function () {
        var mountDir;
        $.$ajax({
            type: "get",
            url: "/api/store/node/clientNode/default/mountPath",
            cache: false,
            success: function (json) {
                if (json.data) {
                    mountDir = json.data;

                } else if (json.error) {
                    mountDir = "/datapool/";
                }
                addAppDialog = $.loongDialog({
                    "title": $.doI18n("store_appmgr_add_app"),
                    "content": $(".dialog-content[name='add-app-con']").html(),
                    "isModal": true,
                    "modalType": 'min',
                    "isClosed": true,
                    "buttons": [{
                        "txt": $.doI18n("btn_ok"),
                        "callback": function () {
                            var $form = $(".dialog-wrap").find(".add-app-form");
                            var ret = $.loongValidate($form);
                            var path = $form.find("input[name='subDir']").val();
                            var roles = $form.find(".role-app-select").find(".select").html();
                            if (ret.hasError) {
                                var input = ret.element;
                                showValid($form, input, ret);
                                return false;
                            } else {
                                if (rolesLength > 2) {
                                    if (roles == "") {
                                        $.loongDialog({
                                            "content": $.doI18n("store_appmgr_select_role_app_tip"),
                                            "isModal": false,
                                            "msgType": 'warning',
                                        });
                                        return false;
                                    }
                                    checkDirAvailable(roles, addApp);
                                } else {
                                    checkDirAvailable(path, addApp);
                                }

                            }


                        }
                    }, {
                        "txt": $.doI18n("btn_cancel")
                    }]

                });

                var roleDatas = getRoleData();
                var newRoleDatas = roleDatas.map(function (v) {
                    return {
                        "key": v.name,
                        "value": v.code
                    }
                })

                $(".dialog-wrap .role-app-select").loongSelect({
                    width: "259px",
                    name: "roles",
                    ajaxData: true,
                    getData: getSelectRoleData,
                    title: true,
                    multi: true
                });
                $(".dialog-wrap [name=role-app-management]").click(function () {
                    roleApp();
                })
                $(".dialog-wrap .app-monitor-switch-box").loongSwitch({
                    activeText: $.doI18n("store_common_switch_open"),
                    inactiveText: $.doI18n("store_common_switch_close"),
                    name: "monitor",
                    state: true,
                    change: '',
                    bgColor: "#27CA42"
                });
                var defaultRole = roleDatas.map(function (v) {
                    if (v.prior) {
                        $(".dialog-wrap .role-app-select").find(".select").html(v.name);
                        $(".dialog-wrap .role-app-select").find(".select-input").val(v.code);
                        $(".dialog-wrap .role-app-select").find(".select").addClass("toe");
                        $(".dialog-wrap .role-app-select").find(".select").attr("title", formaterTitle(v.name));
                    }
                })
                var $form = $(".dialog-wrap").find(".add-app-form");
                $form.find("input[name='mountdir']").val(mountDir);
                $form.find("input[name='subDir']").val("/");
                $form.find("div[name=browse-file-icon]").click(function () {
                    var $input = $form.find(".set-dir-path").find("input");
                    isBroseFile.init($input);
                })
                $.formValid($form);
            }

        });

    });
    $(".btn-opr[name='set-app']").click(function () {
        var index = appTable.getCheckedIndex(),
            rowData = appTable.getRowData(index);
        if (index.length == 1) {
            if (checkIsLocked(index)) {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_selected_lock"),
                    "isModal": false,
                    "msgType": 'warning',

                });
            } else if (rowData.isMds) {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_isMds_nomodify_tip"),
                    "isModal": false,
                    "msgType": 'warning',

                });
            } else {
                var id = rowData.id;
                setAppDialog = $.loongDialog({
                    "title": $.doI18n("store_appmgr_set_app"),
                    "content": $(".dialog-content[name='set-app-con']").html(),
                    "isModal": true,
                    "modalType": 'min',
                    "isClosed": true,
                    "buttons": [{
                        "txt": $.doI18n("btn_ok"),
                        "callback": function () {
                            var $form = $(".dialog-wrap").find(".set-app-form");
                            var ret = $.loongValidate($form);
                            var path = $form.find("input[name=subDir]").val();
                            var roles = $form.find(".role-app-select").find(".select").html();
                            if (ret.hasError) {
                                var input = ret.element;
                                showValid($form, input, ret);
                                return false;
                            } else {
                                if (rolesLength > 2) {
                                    if (roles == "") {
                                        $.loongDialog({
                                            "content": $.doI18n("store_appmgr_select_role_app_tip"),
                                            "isModal": false,
                                            "msgType": 'warning',
                                        });
                                        return false;
                                    }
                                    checkDirAvailable(roles, updateApp, rowData);
                                } else {
                                    checkDirAvailable(path, updateApp, rowData);
                                }

                            }
                        }
                    }, {
                        "txt": $.doI18n("btn_cancel")
                    }]
                });
                $.$ajax({
                    type: "get",
                    url: "/api/store/node/clientNode/getById",
                    data: {
                        id: id
                    },
                    success: function (json) {
                        if (json.data) {
                            var roles = calculateRoles(getRoleData(), json.data.role);
                            var $dialog = $(".dialog-wrap");
                            $dialog.find(".app-ip").html(json.data.ip);
                            $dialog.find("input[name='id']").val(json.data.id);
                            $dialog.find("input[name='comment']").val(json.data.comment);
                            $dialog.find("input[name='subDir']").val(json.data.subDir || "/");
                            $dialog.find(".list-switch-box").loongSwitch({
                                activeText: $.doI18n("store_appmgr_add_wlist"),
                                inactiveText: $.doI18n("store_appmgr_del_wlist"),
                                state: json.data.isAccess,
                                name: "isAccess"
                            });
                            $dialog.find(".storage-switch-box").loongSwitch({
                                activeText: $.doI18n("store_appmgr_open_limit"),
                                inactiveText: $.doI18n("store_appmgr_close_limit"),
                                name: "capLimit",
                                state: json.data.capLimit,
                                change: function () {
                                    if ($(".storage-switch-box").find(".loong-switch").hasClass("loong-switch-open")) {
                                        $(".storage-limit").removeClass("dn");

                                    } else {
                                        $(".storage-limit").addClass("dn");
                                    }
                                }
                            });
                            var unitSelect = $dialog.find(".storage-select-box").loongSelect({
                                'width': '70px',
                                'height': '32px',
                                'name': 'unit',
                                'ajaxData': false,
                                'data': [{
                                    'key': 'MB',
                                    'value': 'MB'
                                }, {
                                    'key': 'GB',
                                    'value': 'GB'
                                }, {
                                    'key': 'TB',
                                    'value': 'TB'
                                }, {
                                    'key': 'PB',
                                    'value': 'PB'
                                }]
                            });
                            if (json.data.capLimit) {
                                var str = $.formatSizeStr(json.data.size);
                                $dialog.find("input[name='size']").val(str.slice(0, str.length - 2));
                                var unit = str.slice(str.length - 2);
                                unitSelect.setContent(unit, unit);
                            }


                        }
                        if (rowData.isIstore) {
                            $dialog.find(".set-app-form div[name='switch']").addClass("dn");
                        }
                        var monitorSwitchFlag = true;
                        if (json.data.monitor == 1) {
                            monitorSwitchFlag = true;

                        } else {
                            monitorSwitchFlag = false;
                        }
                        var roleDatas = getRoleData();
                        var newRoleDatas = roleDatas.map(function (v) {
                            return {
                                "key": v.name,
                                "value": v.code
                            }
                        })
                        $(".dialog-wrap .role-app-select").loongSelect({
                            width: "380px",
                            name: "roles",
                            data: newRoleDatas,
                            title: true,
                            multi: true
                        });
                        var roleNames = roles.map(function (v) {
                            return v.name;
                        });
                        var roleCodes = roles.map(function (v) {
                            return v.code;
                        });
                        $(".dialog-wrap .role-app-select").find(".select").html(roleNames.join(","));
                        $(".dialog-wrap .role-app-select").find(".select-input").val(roleCodes.join(","));
                        $(".dialog-wrap .role-app-select").find(".select").addClass("toe");
                        $(".dialog-wrap .role-app-select").find(".select").attr("title", formaterTitle(roleNames.join(",")));
                        $(".dialog-wrap .app-monitor-switch-box").loongSwitch({
                            activeText: $.doI18n("store_common_switch_open"),
                            inactiveText: $.doI18n("store_common_switch_close"),
                            name: "monitor",
                            state: monitorSwitchFlag,
                            change: '',
                            bgColor: "#27CA42"
                        });
                        var $form = $(".dialog-wrap").find(".set-app-form");
                        $form.find("div[name=browse-file-icon]").click(function () {
                            var $input = $form.find(".set-dir-path").find("input");
                            isBroseFile.init($input);
                        })
                        $.formValid($form);

                    },
                    beforeSend: function (xhr) {
                        $.loading();
                    },
                    complete: function (xhr, status) {
                        $.clearLoading();
                    }
                });


            }

        } else if (index.length == 0) {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_set_app_more_warn"),
                "isModal": false,
                "msgType": 'warning',

            });
        } else if (index.length > 1) {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_set_app_one_warn"),
                "isModal": false,
                "msgType": 'warning',

            });
        }





    });
    $(".btn-opr[name='del-app']").click(function () {
        var index = appTable.getCheckedIndex();

        if (checkIsLocked(index)) {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_selected_lock"),
                "isModal": false,
                "msgType": 'warning',

            });
        } else if (checkIsMds(index)) {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_isMds_nodel_tip"),
                "isModal": false,
                "msgType": 'warning',

            });
        } else {
            if (index.length > 0) {
                $.loongDialog({
                    "title": $.doI18n("notice"),
                    "content": $.doI18n("store_appmgr_del_app_notice"),
                    "isInfo": true,
                    "buttons": [{
                        "txt": $.doI18n("btn_ok"),
                        "callback": function () {
                            delApp();
                            return true;
                        }
                    }, {
                        "txt": $.doI18n("btn_cancel")
                    }]
                });
            } else {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_del_app_more_warn"),
                    "isModal": false,
                    "msgType": 'warning',

                });
            }
        }

    });
    $(".btn-opr[name='auto-app']").click(function () {
        var index = appTable.getCheckedIndex();
        if (index.length > 0) {
            $.loongDialog({
                "title": $.doI18n("notice"),
                "content": $.doI18n("store_appmgr_auto_app_notice"),
                "isInfo": true,
                "buttons": [{
                    "txt": $.doI18n("btn_ok"),
                    "callback": function () {
                        autoApp(true);
                        return true;
                    }
                }, {
                    "txt": $.doI18n("btn_cancel")
                }]
            });
        } else {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_auto_app_more_warn"),
                "isModal": false,
                "msgType": 'warning'

            });
        }
    });
    $(".btn-opr[name='no-auto-app']").click(function () {
        var index = appTable.getCheckedIndex();
        if (index.length > 0) {
            $.loongDialog({
                "title": $.doI18n("notice"),
                "content": $.doI18n("store_appmgr_no_auto_app_notice"),
                "isInfo": true,
                "buttons": [{
                    "txt": $.doI18n("btn_ok"),
                    "callback": function () {
                        autoApp(false);
                        return true;
                    }
                }, {
                    "txt": $.doI18n("btn_cancel")
                }]
            });
        } else {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_no_auto_app_more_warn"),
                "isModal": false,
                "msgType": 'warning'
            });
        }
    });


    $hasDropBtn.mouseover(function () {
        var $btnList = $(this).find(".drop-btn-list");
        $btnList.removeClass("dn");
    });
    $hasDropBtn.mouseout(function () {
        var $btnList = $(this).find(".drop-btn-list");
        $btnList.addClass("dn");
    });
    $(".drop-btn-list[name='start-app'] .btn-item[name='one-app']").click(function () {
        var index = appTable.getCheckedIndex();
        if (checkIsLocked(index)) {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_selected_lock"),
                "isModal": false,
                "msgType": 'warning',

            });
        } else {
            if (index.length > 0) {
                $.loongDialog({
                    "title": $.doI18n("notice"),
                    "content": $.doI18n("store_appmgr_start_app_notice"),
                    "isInfo": true,
                    "buttons": [{
                        "txt": $.doI18n("btn_ok"),
                        "callback": function () {
                            startApp();
                            return true;
                        }
                    }, {
                        "txt": $.doI18n("btn_cancel")
                    }]
                });
            } else {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_start_app_more_warn"),
                    "isModal": false,
                    "msgType": 'warning'

                });
            }
        }
    });
    $(".drop-btn-list[name='start-app'] .btn-item[name='all-app']").click(function () {
        $.loongDialog({
            "title": $.doI18n("notice"),
            "content": $.doI18n("store_appmgr_start_all_app_notice"),
            "isInfo": true,
            "buttons": [{
                "txt": $.doI18n("btn_ok"),
                "callback": function () {
                    startAllApp();
                    return true;
                }
            }, {
                "txt": $.doI18n("btn_cancel")
            }]
        });
    });
    $(".drop-btn-list[name='stop-app'] .btn-item[name='one-app']").click(function () {
        var index = appTable.getCheckedIndex();
        if (checkIsLocked(index)) {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_selected_lock"),
                "isModal": false,
                "msgType": 'warning',

            });
        } else {
            if (index.length > 0) {
                $.loongDialog({
                    "title": $.doI18n("notice"),
                    "content": $.doI18n("store_appmgr_stop_app_notice"),
                    "isInfo": true,
                    "buttons": [{
                        "txt": $.doI18n("btn_ok"),
                        "callback": function () {
                            stopApp();
                            return true;
                        }
                    }, {
                        "txt": $.doI18n("btn_cancel")
                    }]
                });
            } else {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_stop_app_more_warn"),
                    "isModal": false,
                    "msgType": 'warning'
                });
            }
        }
    });
    $(".drop-btn-list[name='stop-app'] .btn-item[name='all-app']").click(function () {
        $.loongDialog({
            "title": $.doI18n("notice"),
            "content": $.doI18n("store_appmgr_stop_all_app_notice"),
            "isInfo": true,
            "buttons": [{
                "txt": $.doI18n("btn_ok"),
                "callback": function () {
                    stopAllApp();
                    return true;
                }
            }, {
                "txt": $.doI18n("btn_cancel")
            }]
        });
    });
    $(".drop-btn-list[name='lock-app'] .btn-item[name='one-app']").click(function () {
        var index = appTable.getCheckedIndex();
        if (index.length > 0) {
            $.loongDialog({
                "title": $.doI18n("notice"),
                "content": $.doI18n("store_appmgr_lock_app_notice"),
                "isInfo": true,
                "buttons": [{
                    "txt": $.doI18n("btn_ok"),
                    "callback": function () {
                        lockApp();
                        return true;
                    }
                }, {
                    "txt": $.doI18n("btn_cancel")
                }]
            });
        } else {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_lock_app_more_warn"),
                "isModal": false,
                "msgType": 'warning',

            });
        }
    });
    $(".drop-btn-list[name='lock-app'] .btn-item[name='all-app']").click(function () {
        $.loongDialog({
            "title": $.doI18n("notice"),
            "content": $.doI18n("store_appmgr_lock_all_app_notice"),
            "isInfo": true,
            "buttons": [{
                "txt": $.doI18n("btn_ok"),
                "callback": function () {
                    lockAllApp();
                    return true;
                }
            }, {
                "txt": $.doI18n("btn_cancel")
            }]
        });
    });
    $(".drop-btn-list[name='unlock-app'] .btn-item[name='one-app']").click(function () {
        var index = appTable.getCheckedIndex();
        if (index.length > 0) {
            $.loongDialog({
                "title": $.doI18n("notice"),
                "content": $.doI18n("store_appmgr_unlock_app_notice"),
                "isInfo": true,
                "buttons": [{
                    "txt": $.doI18n("btn_ok"),
                    "callback": function () {
                        unlockApp();
                        return true;
                    }
                }, {
                    "txt": $.doI18n("btn_cancel")
                }]
            });
        } else {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_unlock_app_more_warn"),
                "isModal": false,
                "msgType": 'warning',

            });
        }

    });
    $(".drop-btn-list[name='unlock-app'] .btn-item[name='all-app']").click(function () {
        $.loongDialog({
            "title": $.doI18n("notice"),
            "content": $.doI18n("store_appmgr_unlock_all_app_notice"),
            "isInfo": true,
            "buttons": [{
                "txt": $.doI18n("btn_ok"),
                "callback": function () {
                    unlockAllApp();
                    return true;
                }
            }, {
                "txt": $.doI18n("btn_cancel")
            }]
        });
    });

    $(".btn-item[name='monitor-app']").click(function () {
        var index = appTable.getCheckedIndex();
        if (index.length === 0) {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_select_app_tip"),
                "isModal": false,
                "msgType": 'warning',

            });
            return;
        } else {
            var limit = index.filter(function (v) {
                return appTable.getRowData(v).isMds === false && appTable.getRowData(v).isIstore === false;
            });
            if (limit.length > 0) {
                monitorAppDialog
            } else {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_monitor_app_nomodify_tip"),
                    "isModal": false,
                    "msgType": 'warning',

                });
                return
            }
        }
        /* var limit = index.filter(function(v){
             return  appTable.getRowData(v).isMds === true || appTable.getRowData(v).isIstore === true;
         });
         if(limit.length>0){
             $.loongDialog({
                 "content": "元数据挂载的应用服务器不支持修改！",
                 "isModal": false,
                 "msgType": 'warning',
 
             });
             return
         }*/
        monitorAppDialog = $.loongDialog({
            "title": $.doI18n("btn_store_monitor"),
            "content": $(".dialog-content[name='monitor-app-con']").html(),
            "isModal": true,
            "modalType": 'min',
            "isClosed": true,
            "buttons": [{
                "txt": $.doI18n("btn_ok"),
                "callback": function () {
                    var clientIds = index.map(function (v) {
                        return appTable.getRowData(v).id;
                    });
                    var formData = $(".dialog-wrap").find(".monitor-app-form").serializeArray();
                    var param = $.serializeJson(formData);
                    param.isMonitor = param.isMonitor === "true" ? true : false;
                    param.clientIds = clientIds.toString();
                    monitorApp(param);
                }
            }, {
                "txt": $.doI18n("btn_cancel")
            }]
        });
        var monitorSwitchFlag = true;
        if (index.length === 1) {
            if (appTable.rowData[index].monitor == false) {
                monitorSwitchFlag = false
            } else {
                monitorSwitchFlag = true
            }
        } else {
            monitorSwitchFlag = true
        }

        $(".dialog-wrap").find(".monitor-switch-box").loongSwitch({
            activeText: $.doI18n("store_common_switch_open"),
            inactiveText: $.doI18n("store_common_switch_close"),
            name: "isMonitor",
            state: monitorSwitchFlag,
        });
        var limit = index.filter(function (v) {
            return appTable.getRowData(v).isMds === true || appTable.getRowData(v).isIstore === true;
        });
        if (limit.length > 0) {
            $(".dialog-wrap").find(".monitor-tip-box").html($.doI18n("store_appmgr_monitor_inoperative_html"));
            return
        } else {
            $(".dialog-wrap").find(".monitor-app-form div[name='tip']").remove();
        }
    });
    $(".btn-item[name='set-dir']").click(function () {
        var index = appTable.getCheckedIndex();
        if (index.length === 0) {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_select_app_tip"),
                "isModal": false,
                "msgType": 'warning',

            });
            return;
        }
        var limit = index.filter(function (v) {
            return appTable.getRowData(v).isMds === true;
        });
        if (limit.length > 0) {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_isMds_nomodify_tip"),
                "isModal": false,
                "msgType": 'warning',

            });
            return
        }
        setPathAppDialog = $.loongDialog({
            "title": $.doI18n("btn_store_real_path"),
            "content": $(".dialog-content[name='set-path-con']").html(),
            "isModal": true,
            "modalType": 'min',
            "isClosed": true,
            "buttons": [{
                "txt": $.doI18n("btn_ok"),
                "callback": function () {
                    var ret = $.loongValidate($setPathForm);
                    if (ret.hasError) {
                        var input = ret.element;
                        showValid($setPathForm, input, ret);
                        return false;
                    }
                    var clientIds = index.map(function (v) {
                        return appTable.getRowData(v).id;
                    });
                    var formData = $setPathForm.serializeArray();
                    var param = $.serializeJson(formData);
                    param.clientIds = clientIds.toString();
                    if (rolesLength > 2) {
                        var path, rolesData = getRoleData(), curData = [], roles = $setPathForm.find(".select").html();
                        if (roles == "") {
                            $.loongDialog({
                                "content": $.doI18n("store_appmgr_select_role_app_tip"),
                                "isModal": false,
                                "msgType": 'warning',
                            });
                            return false;
                        }
                        if (roles.split(",").length > 1) {
                            path = "/";
                        } else {
                            curData = rolesData.filter(function (v) {
                                if (v.name == roles)
                                    return v;
                            })
                            path = curData[0].subDir;
                        }
                        param.path = path;
                    } else {
                        delete param.roles;
                    }
                    setRealPath(param);
                }
            }, {
                "txt": $.doI18n("btn_cancel")
            }]
        });
        var $setPathForm = $(".dialog-wrap").find(".set-path-form");
        var roleDatas = getRoleData();
        var newRoleDatas = roleDatas.map(function (v) {
            return {
                "key": v.name,
                "value": v.code
            }
        })
        $(".dialog-wrap .role-app-select").loongSelect({
            width: "380px",
            name: "roles",
            data: newRoleDatas,
            title: true,
            multi: true
        });
        if (index.length === 1) {
            var subDir = appTable.rowData[index].subDir;
            var roles = calculateRoles(getRoleData(), appTable.getRowData(index).role);
            var roleNames = roles.map(function (v) {
                return v.name;
            });
            var roleCodes = roles.map(function (v) {
                return v.code;
            });
            $setPathForm.find(".select").html(roleNames.join(","));
            $setPathForm.find(".select-input").val(roleCodes.join(","));
            $setPathForm.find(".select").addClass("toe");
            $setPathForm.find(".select").attr("title", formaterTitle(roleNames.join(",")));
        } else if (index.length > 1) {
            var subDir = "/"
        }
        $(".dialog-wrap").find(".set-path-form input[name='path']").val(subDir)
        $setPathForm.find("div[name=browse-file-icon]").click(function () {
            var $input = $setPathForm.find(".set-dir-path").find("input");
            isBroseFile.init($input);
        })
        $.formValid($setPathForm);

    });
    $(".btn-opr[name='role-app']").click(function () {
        roleApp();
    });
    var flag = true;
    $(".btn-opr[name=refresh-app]").click(function () {
        if (flag) {
            initAppTable(JSON.parse(window.sessionStorage.getItem("loongqueryObj")).loongQueryKey);
            flag = false;
            setTimeout(function () {
                flag = true;
            }, 500);
        }
    });

}

function roleApp() {
    var roleAppDialog = $.loongDialog({
        "title": $.doI18n("store_appmgr_role_app_management"),
        "content": $(".dialog-content[name='role-app-con']").html(),
        "isModal": true,
        "modalType": 'max',
        "isClosed": true
    });
    var $form = $(".dialog-wrap").find(".role-app-form");
    initRoleTable();
    $form.find("div[name=createRole]").click(function () {
        preCreateRole();
    })
    $form.find("div[name=editRole]").click(function () {
        preEditRole();
    })
    $form.find("div[name=deleteRole]").click(function () {
        var index = roleAppTable.getCheckedIndex();
        if (index.length === 0) {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_del_role_app_tip"),
                "isModal": false,
                "msgType": 'warning',
            });
            return;
        }
        if (roleAppTable.getRowData(index).innerRole) {
            $.loongDialog({
                "content": $.doI18n("cannot_remove_default_client_mould"),
                "isModal": false,
                "msgType": 'warning',
            });
            return;
        }
        $.loongDialog({
            "title": $.doI18n("notice"),
            "content": $.doI18n("store_appmgr_del_role_app_confirm"),
            "isInfo": true,
            "buttons": [{
                "txt": $.doI18n("btn_ok"),
                "callback": function () {
                    delRole();
                    return true;
                }
            }, {
                "txt": $.doI18n("btn_cancel")
            }]
        });
    })
    $form.find("div[name=setDefaultRole]").click(function () {
        var index = roleAppTable.getCheckedIndex();
        if (index.length === 0) {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_select_one_role"),
                "isModal": false,
                "msgType": 'warning',
            });
            return;
        }
        if (roleAppTable.getRowData(index).prior) {
            $.loongDialog({
                "content": $.doI18n("store_appmgr_already_default"),
                "isModal": false,
                "msgType": 'warning',
            });
            return;
        }
        $.loongDialog({
            "title": $.doI18n("notice"),
            "content": $.doI18n("store_appmgr_set_role_confirm"),
            "isInfo": true,
            "buttons": [{
                "txt": $.doI18n("btn_ok"),
                "callback": function () {
                    setDefaultRole();
                    return true;
                }
            }, {
                "txt": $.doI18n("btn_cancel")
            }]
        });
    })
}

function calculateRoles(datas, role) {
    var roleDatas = [];
    for (var i = 0; i < datas.length; i++) {
        var code = 1 << datas[i].code;
        if ((code & role) == code) {
            roleDatas.push(datas[i]);
        }
    }
    return roleDatas;
}

function getRoleData() {
    var roleDatas = [];
    $.$ajax({
        "type": "get",
        "url": "/api/store/client/mould/list",
        "async": false,
        success: function (data) {
            roleDatas = data;
        }
    })
    return roleDatas;
}

function getSelectRoleData() {
    var roleDatas = [];
    $.$ajax({
        "type": "get",
        "url": "/api/store/client/mould/list",
        "async": false,
        success: function (data) {
            roleDatas = data.map(function (v) {
                return {
                    "key": v.name,
                    "value": v.code
                }
            });
        }
    })
    return roleDatas;
}

function initRoleTable() {
    var $form = $(".dialog-wrap").find(".role-app-form");
    roleAppTable = $form.find(".role-app-table").loongTable({
        "height": "440",
        "fields": [
            {
                "name": "name",
                "title": $.doI18n("store_appmgr_role_name"),
                "overflowEllipsis": true,
                formater: function (value, rowData) {
                    if (rowData.prior) {
                        var $dom = $("<div class='default-role'><span class='mr5 dib toe role-name-width' title='" + value + "'>" + value + "</span><span class='default-icon dib'>" + $.doI18n('store_appmgr_default') + "</span></div>");
                    } else {
                        var $dom = $("<div><span class='mr5 dib toe role-name-width' title='" + value + "'>" + value + "</span></div>");
                    }
                    return $dom[0].outerHTML;
                }
            }, {
                "name": "subDir",
                "title": $.doI18n("store_appmgr_catalogue"),
                "overflowEllipsis": true
            }, {
                "name": "comment",
                "title": $.doI18n("store_common_remark"),
                "overflowEllipsis": true
            }
        ],
        "ajaxData": false,
        "data": getRoleData(),
        "hasRadio": true,
        "hasCheckbox": false
    })
}

function preCreateRole() {
    var createRoleDialog = $.loongDialog({
        "title": $.doI18n("store_appmgr_create_role_app"),
        "content": $(".dialog-content[name='create-role-con']").html(),
        "isModal": true,
        "modalType": 'min',
        "isClosed": true,
        "buttons": [{
            "txt": $.doI18n("btn_ok"),
            "callback": function () {
                var ret = $.loongValidate($form);
                var path = $form.find("input[name=subDir]").val();
                if (ret.hasError) {
                    var input = ret.element;
                    showValid($form, input, ret);
                    return false;
                } else {
                    var formData = $form.serializeArray();
                    var param = $.serializeJson(formData);
                    createRole(param, createRoleDialog);
                }
            }
        }]
    });
    var $form = $(".dialog-wrap").find(".create-role-form");
    $form.find("input[name='subDir']").val("/");
    $form.find("div[name=browse-file-icon]").click(function () {
        var $input = $form.find(".role-dir-select").find("input");
        isBroseFile.init($input);
    })
    $.formValid($form);
}
function createRole(param, dialog) {
    $.$ajax({
        "type": "post",
        "url": "/api/store/client/mould/add",
        "async": false,
        "data": JSON.stringify(param),
        "contentType": "application/json",
        success: function (json) {
            if ($.isEmptyObject(json)) {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_create_role_app_success"),
                    "isModal": false,
                    "msgType": "success"
                });
                dialog.hideDialog();
                initRoleTable();
            } else {
                $.loongDialog({
                    "content": $.doI18n(json.error, json.error_message),
                    "isModal": false,
                    "msgType": "error"
                });
            }
        }
    })
}

function preEditRole() {
    var index = roleAppTable.getCheckedIndex();
    if (index.length === 0) {
        $.loongDialog({
            "content": $.doI18n("store_appmgr_edit_role_app_tip"),
            "isModal": false,
            "msgType": 'warning',
        });
        return;
    }
    if (roleAppTable.getRowData(index).innerRole) {
        $.loongDialog({
            "content": $.doI18n("cannot_modify_default_client_mould"),
            "isModal": false,
            "msgType": 'warning',
        });
        return;
    }
    var editRoleDialog = $.loongDialog({
        "title": $.doI18n("store_appmgr_edit_role_app"),
        "content": $(".dialog-content[name='create-role-con']").html(),
        "isModal": true,
        "modalType": 'min',
        "isClosed": true,
        "buttons": [{
            "txt": $.doI18n("btn_ok"),
            "callback": function () {
                var ret = $.loongValidate($form);
                var path = $form.find("input[name=subDir]").val();
                if (ret.hasError) {
                    var input = ret.element;
                    showValid($form, input, ret);
                    return false;
                } else {
                    var formData = $form.serializeArray();
                    var param = $.serializeJson(formData);
                    editRole(param, editRoleDialog);
                }
            }
        }]
    });
    var $form = $(".dialog-wrap").find(".create-role-form");
    var roleData = roleAppTable.getRowData(index);
    $form.find("input[name='name']").val(roleData.name);
    $form.find("input[name='name']").addClass("toe");
    $form.find("input[name='name']").attr({ "title": roleData.name });
    $form.find("input[name='subDir']").val(roleData.subDir);
    $form.find("textarea[name='comment']").val(roleData.comment);
    $form.find("div[name=browse-file-icon]").click(function () {
        var $input = $form.find(".role-dir-select").find("input");
        isBroseFile.init($input);
    })
    $.formValid($form);
}
function editRole(param, dialog) {
    var index = roleAppTable.getCheckedIndex();
    var roleData = roleAppTable.getRowData(index);
    param.id = roleData.id;
    param.code = roleData.code;
    param.prior = roleData.prior;
    $.$ajax({
        "type": "post",
        "url": "/api/store/client/mould/update",
        "async": false,
        "data": JSON.stringify(param),
        "contentType": "application/json",
        success: function (json) {
            if ($.isEmptyObject(json)) {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_edit_role_app_success"),
                    "isModal": false,
                    "msgType": "success"
                });
                dialog.hideDialog();
                initRoleTable();
            } else {
                $.loongDialog({
                    "content": $.doI18n(json.error, json.error_message),
                    "isModal": false,
                    "msgType": "error"
                });
            }
        }
    })
}

function delRole() {
    var index = roleAppTable.getCheckedIndex();
    var roleData = roleAppTable.getRowData(index);
    $.$ajax({
        "type": "post",
        "url": "/api/store/client/mould/delete",
        "async": false,
        "data": { "name": roleData.name, "id": roleData.id },
        success: function (json) {
            if ($.isEmptyObject(json)) {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_del_role_app_success"),
                    "isModal": false,
                    "msgType": "success"
                });
                initRoleTable();
            } else {
                $.loongDialog({
                    "content": $.doI18n(json.error, json.error_message),
                    "isModal": false,
                    "msgType": "error"
                });
            }
        }
    })
}

function setDefaultRole() {
    var index = roleAppTable.getCheckedIndex();
    var roleData = roleAppTable.getRowData(index);
    $.$ajax({
        "type": "post",
        "url": "/api/store/client/mould/prior/set",
        "async": false,
        "data": { "id": roleData.id, "prior": !roleData.prior },
        success: function (json) {
            if ($.isEmptyObject(json)) {
                $.loongDialog({
                    "content": $.doI18n("success_tip"),
                    "isModal": false,
                    "msgType": "success"
                });
                initRoleTable();
            } else {
                $.loongDialog({
                    "content": $.doI18n(json.error, json.error_message),
                    "isModal": false,
                    "msgType": "error"
                });
            }
        }
    })
}

function setRealPath(param) {
    var successTip;
    successTip = rolesLength > 2 ? "store_appmgr_set_role_success" : "store_appmgr_setClientSubDir_success";
    $.$ajax({
        type: "post",
        url: "/api/store/node/clientNode/setClientSubDir",
        data: param,
        success: function (json) {
            if ($.isEmptyObject(json)) {
                $.loongDialog({
                    "content": $.doI18n(successTip),
                    "isModal": false,
                    "msgType": 'success'
                });
                setPathAppDialog.hideDialog();
                initAppTable();
            } else {
                $.loongDialog({
                    "content": $.doI18n(json.error, json.error_message),
                    "isModal": false,
                    "msgType": 'error'
                });
            }
        },
        beforeSend: function (xhr) {
            $.loading();
        },
        complete: function (xhr, status) {
            $.clearLoading();
        }
    });
}

function monitorApp(param) {
    $.$ajax({
        type: "post",
        url: "/api/store/node/clientNode/setMonitorStatus",
        data: param,
        success: function (json) {
            if ($.isEmptyObject(json)) {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_setMonitorStatus_success"),
                    "isModal": false,
                    "msgType": 'success'
                });
                monitorAppDialog.hideDialog();
                appTable.refresh();
            } else {
                $.loongDialog({
                    "content": $.doI18n(json.error, json.error_message),
                    "isModal": false,
                    "msgType": 'error'
                });
            }
        },
        beforeSend: function (xhr) {
            $.loading();
        },
        complete: function (xhr, status) {
            $.clearLoading();
        }
    });
}
function checkIsMds(index) {
    var flag;
    $.each(index, function (i, item) {
        if (appTable.getRowData(item).isMds == true) {
            flag = true;
        }
    });
    return flag;
}
function checkDirAvailable(path, fn, rowData) {
    if (rolesLength > 2) {
        var roles = path;
        var path, rolesData = getRoleData(), curData = [], deletedData = [];
        var allRoleNames = rolesData.map(function (v) {
            return v.name;
        })
        deletedData = roles.split(",").filter(function (v) {
            if (allRoleNames.indexOf(v) == -1) {
                return v;
            }
        })
        if (deletedData.length > 0) {
            $.loongDialog({
                "content": $.doI18n("add_client_error_due_to_mould_not_exist", deletedData.join(",")),
                "isModal": false,
                "msgType": 'error'
            });
            return;
        }
        if (roles.split(",").length > 1) {
            path = "/";
        } else {
            curData = rolesData.filter(function (v) {
                if (v.name == roles)
                    return v;
            })
            path = curData[0].subDir;
        }
    }
    if (path == "/" || (rowData ? path == rowData.subDir : false)) {
        fn(path);
    } else {
        $.loading();
        $.$ajax({
            type: "post",
            url: "/api/store/node/clientNode/checkDirBeforeAdd",
            dataType: "json",
            data: {
                path: path
            },
            cache: false,
            success: function (json) {
                if (json.error) {
                    $.loongDialog({
                        "content": $.doI18n(json.error, json.error_message),
                        "isModal": false,
                        "msgType": 'error'
                    });
                } else if (json.data.data) {
                    var checkDialog = $.loongDialog({
                        "title": $.doI18n("notice"),
                        "content": $.doI18n("store_appmgr_sure_setClientSubDir") + path + "？",
                        "isInfo": true,
                        "buttons": [{
                            "txt": $.doI18n("btn_ok"),
                            "callback": function () {
                                fn(path);
                                return true;
                            }
                        }, {
                            "txt": $.doI18n("btn_cancel")
                        }]
                    });
                    checkDialog.$modal.find("p").attr("title", path);
                } else if (!json.data.data) {
                    var checkDialog = $.loongDialog({
                        "title": $.doI18n("notice"),
                        "content": $.doI18n("store_appmgr_real_path") + path + $.doI18n("store_appmgr_checkDirAvailable_text"),
                        "isInfo": true,
                        "buttons": [{
                            "txt": $.doI18n("btn_ok"),
                            "callback": function () {
                                fn(path);
                                return true;
                            }
                        }, {
                            "txt": $.doI18n("btn_cancel")
                        }]
                    });
                    checkDialog.$modal.find("p").attr("title", path);
                }
            }
        }).always(function () {
            $.clearLoading();
        });
    }
}
function addApp(path) {
    var $dialog = $(".dialog-wrap");
    var mountdir = $dialog.find("input[name='mountdir']").val(),
        subDir = $dialog.find("input[name='subDir']").val(),
        ipStr = $dialog.find("input[name='ip']").val(),
        comment = $dialog.find("input[name='comment']").val();
    addAppNode(path, ipStr, mountdir, subDir, comment);
}

function addAppNode(path) {
    var $form = $(".dialog-wrap .add-app-form");
    var roles = $form.find(".role-app-select").find(".select").html();
    var formData = $form.serializeArray();
    var param = $.serializeJson(formData);
    param.roleNames = roles;
    if (param.monitor == "true") {
        param.monitor = 1;
    } else {
        param.monitor = 0;
    }

    if (rolesLength > 2) {
        param.subDir = path;
    } else {
        delete param.roles;
    }
    $.$ajax({
        type: "post",
        url: "/api/store/node/clientNode/add",
        dataType: "json",
        data: param,
        cache: false,
        success: function (json) {
            if (json.error) {
                $.loongDialog({
                    "content": $.doI18n(json.error, json.error_message),
                    "isModal": false,
                    "msgType": 'error'
                });

            } else if ($.isEmptyObject(json)) {

                $.loongDialog({
                    "content": $.doI18n("store_appmgr_add_app_success"),
                    "isModal": false,
                    "msgType": 'success',

                });
                addAppDialog.hideDialog();

            }
            initAppTable();


        },
        beforeSend: function (xhr) {
            $.loading();
        },
        complete: function (xhr, status) {
            $.clearLoading();
        }
    });

}

function delApp() {
    var index = appTable.getCheckedIndex(), appId = [];
    if (index.length > 0) {
        for (var i = 0; i < index.length; i++) {
            appId.push(appTable.getRowData(index[i]).id);
        }
        var id = appId.toString();
        $.$ajax({
            type: "get",
            url: "/api/store/node/clientNode/delete",
            dataType: "json",
            cache: false,
            data: {
                id: id
            },
            success: function (json) {
                if (json.error) {
                    $.loongDialog({
                        "content": $.doI18n(json.error, json.error_message),
                        "isModal": false,
                        "msgType": 'error'
                    });

                } else if ($.isEmptyObject(json)) {
                    $.loongDialog({
                        "content": $.doI18n("store_appmgr_del_app_success"),
                        "isModal": false,
                        "msgType": 'success',

                    });

                }
                appTable.refresh();

            },
            beforeSend: function (xhr) {
                $.loading();
            },
            complete: function (xhr, status) {
                $.clearLoading();
            }
        });
    }


}

function updateApp(path) {
    var $dialog = $(".dialog-wrap");
    var $form = $(".dialog-wrap").find(".set-app-form");
    var ret = $.loongValidate($form);
    if (ret.hasError) {
        var input = ret.element;
        showValid($form, input, ret);
        return false;
    } else {
        var formData = $form.serializeArray();
        var param = $.serializeJson(formData);
        param.size = $.getByteSize(param.size, param.unit);
        param.ip = $dialog.find(".app-ip").html();
        var index = appTable.getCheckedIndex(),
            rowData = appTable.getRowData(index);
        param.auto = rowData.auto;
        if (rolesLength > 2) {
            param.subDir = path;
            param.roles = param.roles.split(",").map(function (v) {
                return parseInt(v)
            })
        } else {
            delete param.roles;
        }
        $.$ajax({
            type: "post",
            url: "/api/store/node/clientNode/config",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(param),
            success: function (json) {
                if (json.error) {
                    $.loongDialog({
                        "content": $.doI18n(json.error, json.error_message),
                        "isModal": false,
                        "msgType": 'error'
                    });
                } else if ($.isEmptyObject(json)) {
                    $.loongDialog({
                        "content": $.doI18n("store_appmgr_update_app_success"),
                        "isModal": false,
                        "msgType": 'success'
                    });

                    setAppDialog.hideDialog();
                    initAppTable();
                }
            },
            beforeSend: function (xhr) {
                $.loading();
            },
            complete: function (xhr, status) {
                $.clearLoading();
            }
        });


    }


}

function startApp() {
    var index = appTable.getCheckedIndex(), appId = [];
    if (index.length > 0) {
        for (var i = 0; i < index.length; i++) {
            appId.push(appTable.getRowData(index[i]).id);
        }
        var id = appId.toString();
        $.$ajax({
            type: "get",
            url: "/api/store/node/clientNode/start",
            dataType: "json",
            data: {
                clientNodeId: id
            },
            success: function (json) {
                if (json.error) {
                    $.loongDialog({
                        "content": $.doI18n(json.error, json.error_message),
                        "isModal": false,
                        "msgType": 'error'
                    });

                } else if ($.isEmptyObject(json)) {
                    $.loongDialog({
                        "content": $.doI18n("store_appmgr_start_app_success"),
                        "isModal": false,
                        "msgType": 'success'

                    });
                    appTable.refresh();
                }

            },
            beforeSend: function (xhr) {
                $.loading();
            },
            complete: function (xhr, status) {
                $.clearLoading();
            }
        });
    }
}

function stopApp() {
    var index = appTable.getCheckedIndex(), appId = [];
    if (index.length > 0) {
        for (var i = 0; i < index.length; i++) {
            appId.push(appTable.getRowData(index[i]).id);
        }
        var id = appId.toString();
        $.$ajax({
            type: "get",
            url: "/api/store/node/clientNode/stop",
            dataType: "json",
            data: {
                clientNodeId: id
            },
            success: function (json) {
                if (json.error) {
                    $.loongDialog({
                        "content": $.doI18n(json.error, json.error_message),
                        "isModal": false,
                        "msgType": 'error'
                    });

                } else if ($.isEmptyObject(json)) {
                    $.loongDialog({
                        "content": $.doI18n("store_appmgr_stop_app_success"),
                        "isModal": false,
                        "msgType": 'success',

                    });
                    appTable.refresh();
                }

            },
            beforeSend: function (xhr) {
                $.loading();
            },
            complete: function (xhr, status) {
                $.clearLoading();
            }
        });
    }
}

function lockApp() {
    var index = appTable.getCheckedIndex(), appId = [];
    if (index.length > 0) {
        for (var i = 0; i < index.length; i++) {
            appId.push(appTable.getRowData(index[i]).id);
        }
        var id = appId.toString();
        $.$ajax({
            type: "get",
            url: "/api/store/node/clientNode/lock",
            dataType: "json",
            data: {
                clientNodeId: id
            },
            success: function (json) {
                if (json.error) {
                    $.loongDialog({
                        "content": $.doI18n(json.error, json.error_message),
                        "isModal": false,
                        "msgType": 'error'
                    });

                } else if ($.isEmptyObject(json)) {
                    $.loongDialog({
                        "content": $.doI18n("store_appmgr_lock_app_success"),
                        "isModal": false,
                        "msgType": 'success',

                    });
                    appTable.refresh();
                }

            },
            beforeSend: function (xhr) {
                $.loading();
            },
            complete: function (xhr, status) {
                $.clearLoading();
            }
        });
    }
}

function unlockApp() {
    var index = appTable.getCheckedIndex(), appId = [];
    if (index.length > 0) {
        for (var i = 0; i < index.length; i++) {
            appId.push(appTable.getRowData(index[i]).id);
        }
        var id = appId.toString();
        $.$ajax({
            type: "get",
            url: "/api/store/node/clientNode/unlock",
            dataType: "json",
            data: {
                clientNodeId: id
            },
            success: function (json) {
                if (json.error) {
                    $.loongDialog({
                        "content": $.doI18n(json.error, json.error_message),
                        "isModal": false,
                        "msgType": 'error'
                    });

                } else if ($.isEmptyObject(json)) {
                    $.loongDialog({
                        "content": $.doI18n("store_appmgr_unlock_app_success"),
                        "isModal": false,
                        "msgType": 'success'
                    });

                    appTable.refresh();
                }

            },
            beforeSend: function (xhr) {
                $.loading();
            },
            complete: function (xhr, status) {
                $.clearLoading();
            }
        });
    }
}

function autoApp(flag) {
    var index = appTable.getCheckedIndex(), appId = [];
    if (index.length > 0) {
        for (var i = 0; i < index.length; i++) {
            appId.push(appTable.getRowData(index[i]).id);
        }
        var id = appId.toString();
        $.$ajax({
            type: "post",
            url: "/api/store/node/clientNode/autoStartConf",
            dataType: "json",
            data: {
                ids: id,
                autoStart: flag
            },
            success: function (json) {
                if (json.error) {
                    $.loongDialog({
                        "content": $.doI18n(json.error, json.error_message),
                        "isModal": false,
                        "msgType": 'error'
                    });

                } else if (json.data) {
                    var text;
                    if (flag) {
                        text = $.doI18n("store_appmgr_auto_app_success");
                    } else {
                        text = $.doI18n("store_appmgr_no_auto_app_success")
                    }
                    $.loongDialog({
                        "content": text,
                        "isModal": false,
                        "msgType": 'success'

                    });
                    appTable.refresh();
                }

            },
            beforeSend: function (xhr) {
                $.loading();
            },
            complete: function (xhr, status) {
                $.clearLoading();
            }
        });
    }
}

function startAllApp() {
    $.$ajax({
        type: "post",
        url: "/api/store/node/clientNode/startAllClient",
        success: function (json) {
            if (json.error) {
                $.loongDialog({
                    "content": $.doI18n(json.error, json.error_message),
                    "isModal": false,
                    "msgType": 'error'
                });
                appTable.refresh();

            } else if ($.isEmptyObject(json)) {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_start_all_app_success"),
                    "isModal": false,
                    "msgType": 'success'
                });

                appTable.refresh();
            }


        },
        beforeSend: function (xhr) {
            $.loading();
        },
        complete: function (xhr, status) {
            $.clearLoading();
        }
    })
}

function stopAllApp() {
    $.$ajax({
        type: "post",
        url: "/api/store/node/clientNode/stopAllClient",
        success: function (json) {
            if (json.error) {
                $.loongDialog({
                    "content": $.doI18n(json.error, json.error_message),
                    "isModal": false,
                    "msgType": 'error'
                });
                appTable.refresh();

            } else if ($.isEmptyObject(json)) {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_stop_all_app_success"),
                    "isModal": false,
                    "msgType": 'success'
                });

                appTable.refresh();
            }


        },
        beforeSend: function (xhr) {
            $.loading();
        },
        complete: function (xhr, status) {
            $.clearLoading();
        }
    })
}
function lockAllApp() {
    $.$ajax({
        type: "post",
        url: "/api/store/node/clientNode/lockAll",
        success: function (json) {
            if (json.error) {
                $.loongDialog({
                    "content": $.doI18n(json.error, json.error_message),
                    "isModal": false,
                    "msgType": 'error'
                });
                appTable.refresh();

            } else if ($.isEmptyObject(json)) {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_lock_all_app_success"),
                    "isModal": false,
                    "msgType": 'success'
                });

                appTable.refresh();
            }


        },
        beforeSend: function (xhr) {
            $.loading();
        },
        complete: function (xhr, status) {
            $.clearLoading();
        }
    })
}

function unlockAllApp() {
    $.$ajax({
        type: "post",
        url: "/api/store/node/clientNode/unlockAll",
        success: function (json) {
            if (json.error) {
                $.loongDialog({
                    "content": $.doI18n(json.error, json.error_message),
                    "isModal": false,
                    "msgType": 'error'
                });
                appTable.refresh();

            } else if ($.isEmptyObject(json)) {
                $.loongDialog({
                    "content": $.doI18n("store_appmgr_unlock_all_app_success"),
                    "isModal": false,
                    "msgType": 'success'
                });

                appTable.refresh();
            }


        },
        beforeSend: function (xhr) {
            $.loading();
        },
        complete: function (xhr, status) {
            $.clearLoading();
        }
    })
}

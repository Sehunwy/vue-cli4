import { util } from '@/views/LoongUI/public/js/util.js'
import { interface1 } from '@/views/LoongUI/public/js/interface.js'
var userTable;
export function userMgr() {
    userTable = '';
    initUserTable();
    initPageEvent();
    $("#userMgr .user-search-box").loongQuery({
        isInput: true,
        inputWidth: "290px",
        placeholderTxt: $.doI18n("account_mgr_query_placeholder"),
        doquery: function (val, name) {
            initUserTable(name);
        }
    });
}


function initUserTable(key) {
    console.log(userTable)
    if (userTable) {
        userTable.config.url = "/api/utility/user/find";
        userTable.config.params = {
            username: key
        };
        userTable.refresh();
    } else {
        userTable = $("#userMgr .user-table-box").loongTable({
            height: "full-126",
            fields: [{
                "name": "username",
                "title": $.doI18n("public_username"),
                "overflowEllipsis": true/*,
                "width" : "500px"*/
            }, {
                "name": "internal",
                "title": $.doI18n("user_mgr_thead_user_type"),
                "width": "150px",
                "formater": function (v, all) {
                    if (v) {
                        return $.doI18n("user_mgr_user_type_1")
                    } else {
                        return $.doI18n("user_mgr_user_type_0")
                    }
                }
            }, {
                "name": "userRole",
                "title": $.doI18n("user_mgr_thead_role"),
                "width": "250px",
                "formater": function (v, all) {
                    var roles = v.split(',');
                    var roleTran = [];
                    for (var i = 0; i < roles.length; i++) {
                        roleTran.push($.i18n['user_mgr_role_' + roles[i]]);
                    }
                    return roleTran.join();
                }
            }],
            hasCheckbox: true,
            ajaxData: true,
            url: "/api/utility/user/find",
            pageSize: 10,
            limits: [10, 20, 30, 40, 50],
            params: {},
            method: "get",
            params: {
                username: key
            },
            pagination: true
        });
    }
}

function initPageEvent() {
    // 添加用户
    $("#userMgr .opr-list [name='addUser']").on("click", function () {
        $.loongDialog({
            "title": $.doI18n("btn_add_user"),
            "content": $(".dialog-content[name='addUser']").html(),
            "isModal": true,
            "modalType": 'min',
            "isClosed": true,
            "buttons": [{
                "txt": $.doI18n("btn_ok"),
                "callback": function () {
                    var ret = $.loongValidate($form);
                    var result = false
                    if (ret.hasError) {
                        var input = ret.element;
                        showValid($form, input, ret);
                    } else {
                        var formData = $.serializeJson($form.serializeArray());
                        if (formData.password !== formData.repeatPassword) {
                            $.loongDialog({
                                "content": $.doI18n("user_mgr_add_user_pwd_inconsistent_tip"),
                                "isModal": false,
                                "msgType": "error"
                            });
                            return false;
                        }
                        formData.repeatPassword = '';
                        formData.password = hex_md5(formData.password);
                        $.loading();
                        interface1.addUser({
                            data: formData,
                            async: false
                        }).done(function (data) {
                            util.dealAjaxError(data, null, function () {
                                $.loongDialog({
                                    "content": $.doI18n("user_mgr_successful_operation"),
                                    "isModal": false,
                                    "msgType": "success"
                                });
                                initUserTable();
                                // userTable.refresh();
                                result = true;
                            });
                        }).always(function () {
                            $.clearLoading();
                        });
                    }
                    return result;
                }
            }]
        });
        var $container = $(".dialog-wrap .add-user-dialog");
        var $form = $container.find("form");
        $.formValid($form);
        util.forbidPaste($container.find("[name='repeatPassword']"));
    });

    // 删除用户
    $("#userMgr .opr-list [name='deleteUser']").on("click", function () {
        var rows = util.getSelectRows(userTable);
        if (rows.length === 0) {
            $.loongDialog({
                "content": $.doI18n("user_mgr_user_selected_none_tip"),
                "isModal": false,
                "msgType": "warning"
            });
        } else if (rows.length > 1) {
            $.loongDialog({
                "content": $.doI18n("user_mgr_user_selected_one_tip"),
                "isModal": false,
                "msgType": "warning"
            });
        } else {
            var usernames = rows.map(function (v) {
                return v.username;
            });
            util.doConfirm(function () {
                $.loading();
                interface1.deleteUser({
                    data: {
                        // username: rows[0].username
                        username: usernames.join()
                    }
                }).done(function (data) {
                    util.dealAjaxError(data, null, function () {
                        $.loongDialog({
                            "content": $.doI18n("user_mgr_successful_operation"),
                            "isModal": false,
                            "msgType": "success"
                        });
                        initUserTable();
                        // userTable.refresh();
                    })
                }).always(function () {
                    $.clearLoading();
                });
                // }, "确认删除" + rows[0].username + "用户？");
            }, $.doI18n("user_mgr_delete_user_confirm", [usernames.join()]));
        }
    });

    //重置密码
    $("#userMgr .opr-list [name='resetPwd']").on("click", function () {
        var rows = util.getSelectRows(userTable);
        if (rows.length === 0) {
            $.loongDialog({
                "content": $.doI18n("user_mgr_user_selected_none_tip"),
                "isModal": false,
                "msgType": "warning"
            });
        } else if (rows.length > 1) {
            $.loongDialog({
                "content": $.doI18n("user_mgr_user_selected_one_tip"),
                "isModal": false,
                "msgType": "warning"
            });
        } else {
            var usernames = rows.map(function (v) {
                return v.username;
            });
            if (rows[0].internal) {
                $.loongDialog({
                    "content": $.doI18n("user_mgr_reset_user_pwd_admin_tip"),
                    "isModal": false,
                    "msgType": "warning"
                });
                return;
            }
            util.doConfirm(function () {
                $.loading();
                interface1.resetPwd({
                    data: {
                        username: usernames.join()
                    }
                }
                ).done(function (data) {
                    util.dealAjaxError(data, null, function () {
                        $.loongDialog({
                            "content": $.doI18n("user_mgr_successful_operation"),
                            "isModal": false,
                            "msgType": "success"
                        });
                        // initUserTable();
                        userTable.refresh();
                    })
                }).always(function () {
                    $.clearLoading();
                });
                // },"确认重置用户" + usernames.join() + "密码为默认密码？");
            }, $.doI18n("user_mgr_reset_user_pwd_confirm", [usernames.join()]));
        }
    });

    // 用户角色设置
    $("#userMgr .opr-list [name='setRole']").on("click", function () {
        // return;
        interface1.getUserRole({
            type: "POST",
            data: {
                username: window.sessionStorage.getItem('user')
            }
        }).done(function (data) {
            util.dealAjaxError(data, null, function () {
                var curRoles = [];
                for (var i = 0; i < data.data.length; i++) {
                    curRoles.push(data.data[i].roleName);
                }
                if ($.inArray('admins', curRoles) === -1) {
                    $.loongDialog({
                        "content": "只有admin用户可以设置角色",
                        "isModal": false,
                        "msgType": "error"
                    });
                } else {
                    var rows = util.getSelectRows(userTable);
                    if (rows.length === 0) {
                        $.loongDialog({
                            "content": "当前没有选中行",
                            "isModal": false,
                            "msgType": "warning"
                        });
                    } else if (rows.length > 1) {
                        $.loongDialog({
                            "content": "仅能选择一行",
                            "isModal": false,
                            "msgType": "warning"
                        });
                    } else {
                        $.loongDialog({
                            "title": "角色设置",
                            "content": $(".dialog-content[name='setUserRole']").html(),
                            "isModal": true,
                            "modalType": 'min',
                            "isClosed": true,
                            "buttons": [{
                                "txt": "提交",
                                "callback": function () {
                                    var roles = $container.find(".btn-opr.switch-open");
                                    var role = [];
                                    if (roles.length !== 0) {
                                        roles.each(function (i, v) {
                                            role.push(v.getAttribute("data-code"));
                                        })
                                    }
                                    $.loading();
                                    interface1.roleSet({
                                        data: {
                                            username: rows[0].username,
                                            roles: role.join()
                                        }
                                    }).done(function (data) {
                                        util.dealAjaxError(data, null, function () {
                                            $.loongDialog({
                                                "content": "操作成功",
                                                "isModal": false,
                                                "msgType": "success"
                                            });
                                            initUserTable();
                                        })
                                    }).always(function () {
                                        $.clearLoading();
                                    });
                                    return true;
                                }
                            }, {
                                "txt": "取消",
                                "callback": function () {
                                    return true;
                                }
                            }]
                        });
                        var $container = $(".dialog-wrap .set-role-dialog");
                        $container.find("input[name='username']").val(rows[0].username);
                        interface1.getRoles().done(function (data) {
                            util.dealAjaxError(data, null, function () {
                                for (var i = 0; i < data.data.length; i++) {
                                    var roleSelect = newDom("div", {
                                        "className": "btn-opr",
                                        "name": data.data[i].roleName,
                                        "data-code": data.data[i].roleCode,
                                        "innerHTML": $.i18n['user_mgr_role_' + data.data[i].roleName]
                                    });
                                    $container.find(".role-list").append(roleSelect);
                                }
                                var roles = rows[0].userRole.split(",");
                                for (var i = 0; i < roles.length; i++) {
                                    var openSvg = svgElement("#icon-gou", "switch-icon");
                                    $container.find(".btn-opr[name='" + roles[i] + "']").addClass("switch-open").append(openSvg);
                                }
                                $container.find(".btn-opr").on("click", function () {
                                    if ($(this).hasClass("switch-open")) {
                                        $(this).removeClass("switch-open");
                                        $(this).find(".switch-icon").remove();
                                    } else {
                                        var openSvg = svgElement("#icon-gou", "switch-icon");
                                        $(this).addClass("switch-open").append(openSvg);
                                    }
                                })
                            })
                        })
                    }
                }
            })
        });
    })
}
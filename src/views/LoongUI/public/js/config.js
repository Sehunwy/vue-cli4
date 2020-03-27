import layout from '@/views/main/main'
import { getUserRoles } from "@/views/LoongUI/frame/lib/config.js";
function publicModule() {
    this.homePage = null;
    this.pathName = "../../public";
}

publicModule.prototype.getMenu = function () {
    var user = window.sessionStorage.getItem("user");
    var role = getUserRoles(user, "publicModule");
    if (role.admin) {
        return [{
            path: '/user',
            name: 'user',
            meta: { iconClose: '#icon-yonghuguanli', iconOpen: '#icon-yonghuguanlixianxing' },
            component: layout,
            children: [        //子路由,嵌套路由
                {
                    path: '/user',
                    name: 'user-man',
                    meta: { title: $.doI18n("account_mgr") },
                    component: () => import('@/views/LoongUI/public/page/user-mgr'),
                }
            ]
        },
        {
            path: "/set",
            name: "set",
            meta: {
                iconClose: "#icon-shezhi",
                iconOpen: "#icon-shezhi"
            },
            component: layout,
            children: [
                //子路由,嵌套路由
                {
                    path: "/set",
                    name: "setting",
                    meta: { title: $.doI18n("settings") },
                    component: () => import("@/views/LoongUI/frame/page/dashboard")
                }
            ]
        }]
    }
};

publicModule.prototype.getRouter = function () {
    return [
        {
            path: "/user/test",
            name: "account",
            component: layout,
            meta: { title: $.doI18n("account_mgr") },
            children: [
                //子路由,嵌套路由
                {
                    path: "/user/test",
                    name: "userTest",
                    meta: { title: $.doI18n("test") },
                    component: () => import("@/views/LoongUI/public/page/test")
                }
            ]
        }
    ]
};

publicModule.prototype.getSetting = function () {
    var role = JSON.parse(window.sessionStorage.getItem("publicModule"));
    if (role.admin) {
        return {
            "name": doI18n("basic_settings"),
            "dst": "",
            "children": [
                {
                    "name": doI18n("user_information"),
                    "dst": "/LoongUI/public/page/set/user-set.html",
                    "default": true
                }, {
                    "name": doI18n("mail_server_settings"),
                    "dst": "/LoongUI/public/page/set/server-set.html"
                }, {
                    "name": doI18n("alarm_settings"),
                    "dst": "/LoongUI/public/page/set/alarm-set.html"
                }, {
                    "name": doI18n("authorization_management"),
                    "dst": "/StoreUI/page/set/license-set.html"
                }, {
                    "name": doI18n("server_ip_management"),
                    "dst": "/LoongUI/public/page/set/ip-set.html"
                }, {
                    "name": doI18n("ntp_server_set"),
                    "dst": "/LoongUI/public/page/set/ntp-server-set.html"
                }, {
                    "name": doI18n("snmp_trap_set"),
                    "dst": "/LoongUI/public/page/set/snmp-trap-set.html"
                }
            ],
            "default": true
        }

    } else {
        return {
            "name": doI18n("basic_settings"),
            "dst": "",
            "children": [
                {
                    "name": doI18n("user_information"),
                    "dst": "/LoongUI/public/page/set/user-set.html",
                    "default": true
                }
            ],
            "default": true
        }
    }

};

publicModule.prototype.getTopBar = function () {
    return {
        dst: "/LoongUI/public/page/topbar.html"
    }
};


publicModule.prototype.getGuide = function () {
    return {
        "stepArry": {
            "title": doI18n("public_guide"),
            "url": "/LoongUI/public/page/guide-set.html",
            "export": "/LoongUI/public/js/guide.js",
            "module": "guideGlobal.publicGuide"
        },
        "tipArry": {
            // "url" : "/LoongUI/public/page/guide-tip.html"
        }
    }
};



publicModule.prototype.getBreadcrumb = function () {
    return {
        "account": {
            "txt": "account_mgr",
            "dst": "/LoongUI/public/page/user-list.html"
        }
    }
};

publicModule.prototype.getIconfont = function () {
    return {
        "fontPath": "views/LoongUI/frame/font/iconfont.js"
    }
};


// var publicModule = new publicModule();
window.loongData = new publicModule();





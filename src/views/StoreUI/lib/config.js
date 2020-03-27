import layout from '@/views/main/main'
import storeDashboard from '@/views/StoreUI/page/dashboard'
import { getUserRoles } from "@/views/LoongUI/frame/lib/config.js";
function loongStore() {
    this.homePage = null;
}

loongStore.prototype.getMenu = function () {
    var user = window.sessionStorage.getItem("user");
    var role = getUserRoles(user, "loongStore");
    if (role.admin) {
        this.homePage = {
            "txt": $.doI18n("store_menu_store"),
            "dst": storeDashboard,
            "css": "views/StoreUI/css/dashboard.css"
        }
        return {
            path: '/store',
            name: 'store',
            meta: { title: $.doI18n("store_menu_store"), iconClose: '#icon-cunchufuwushouqi', iconOpen: '#icon-cunchufuwuzhankai' },
            component: layout,
            redirect: '/store/cluster',
            children: [
                {
                    path: '/store/cluster',
                    name: 'cluster',
                    meta: { title: $.doI18n("store_menu_cluster"), iconClose: '#icon-fuwuqijiqun', iconOpen: '#icon-fuwuqijiqun' },
                    component: () => import('@/views/DiskUI/page/diskserver'),
                },
                {
                    path: '/store/client',
                    name: 'client',
                    meta: { title: $.doI18n("store_menu_app"), iconClose: '#icon-yingyongfuwuqi', iconOpen: '#icon-yingyongfuwuqi' },
                    component: () => import('@/views/StoreUI/page/application'),
                }
            ]
        }
        // this.homePage = {
        //      "txt": doI18n("store_menu_store"),
        //      "dst": "/StoreUI/page/dashboard.html",
        //      "css": "/StoreUI/css/dashboard.css",
        //  };
        //  return {
        //      "txt": doI18n("store_menu_store"),
        //      "dst": "",
        //      "css": "",
        //      "firstIcon": "#icon-cunchufuwushouqi",
        //      "iconSelected": "#icon-cunchufuwuzhankai",
        //      "name": "store",
        //      "children": [
        //         {
        //             "dst": "/StoreUI/page/cluster.html",
        //             "css": "",
        //             "icon": "#icon-fuwuqijiqun",
        //             "txt": doI18n("store_menu_cluster"),
        //             "iconSelected": "#icon-wangluoguanli1",
        //             "name": "server"
        //         },{
        //             "dst": "/StoreUI/page/application.html",
        //             "css": "",
        //             "icon": "#icon-yingyongfuwuqi",
        //             "txt": doI18n("store_menu_app"),
        //             "iconSelected": "#icon-wangluoguanli1",
        //              "name":"client"
        //         },{
        //             "dst": "/StoreUI/page/group.html",
        //             "css": "",
        //             "icon": "#icon-shebeifenzu",
        //             "txt": doI18n("store_menu_group"),
        //             "iconSelected": "#icon-iscsiguanli",
        //              "name":"group"
        //         },{
        //             "dst": "/StoreUI/page/block-device/block-device.html",
        //             "css": "/LoongUI/frame/lib/loongTable/loongTable.css",
        //             "icon": "#icon-kuaishebeiguanli",
        //             "txt": doI18n("store_menu_block_device"),
        //             "iconSelected": "#icon-dianyuanguanli",
        //              "name":"blockDevice"
        //         },{
        //             "dst": "/StoreUI/page/file.html",
        //             "css": "",
        //             "icon": "#icon-wenjianmulu",
        //             "txt": doI18n("store_menu_file"),
        //             "iconSelected": "#icon-dianyuanguanli",
        //              "name":"file"
        //         },{
        //             "dst": "/StoreUI/page/access/access.html",
        //             "icon": "#icon-quanxianshezhi",
        //             "txt": doI18n("store_menu_access"),
        //             "iconSelected": "#icon-quanxianshezhi",
        //              "name": "access"
        //         },{
        //             "dst": "/StoreUI/page/quota.html",
        //             "icon": "#icon-peie",
        //             "txt": doI18n("store_menu_quota"),
        //             "iconSelected": "#icon-peie",
        //              "name": "quota"
        //         },
        //         {
        //             "dst": "/StoreUI/page/nas/nas-manage.html",
        //             "icon": "#icon-nasguanli",
        //             "txt": doI18n("store_menu_nas"),
        //             "iconSelected": "#icon-nasguanli",
        //              "name": "nas"
        //         },
        //         {
        //             "dst": "/StoreUI/page/senior/senior.html",
        //             "icon": "#icon-gaojishezhi",
        //             "txt": doI18n("store_menu_senior"),
        //             "iconSelected": "#icon-gaojishezhi",
        //             "name": "senior"
        //         }
        //     ]
        //  }
    }


};

loongStore.prototype.getRouter = function () {
    return [
        {
            path: "/store/client/application-detail",
            name: "application",
            component: layout,
            meta: { title: $.doI18n("store_menu_app") },
            children: [
                //子路由,嵌套路由
                {
                    path: "/store/client/application-detail",
                    name: "applicationDetail",
                    meta: { title: $.doI18n("store_menu_app_detail") },
                    component: () => import("@/views/StoreUI/page/application-detail")
                }
            ]
        }
    ]
};

loongStore.prototype.getSetting = function () {
    var role = JSON.parse(window.sessionStorage.getItem("loongStore"));
    if (role.admin) {
        return {
            "name": doI18n("store_settings_store"),
            "dst": "",
            "children": [
                {
                    "name": doI18n("store_settings_server"),
                    "dst": "/StoreUI/page/set/server-set.html"
                }, {
                    "name": doI18n("store_settings_file"),
                    "dst": "/StoreUI/page/set/file-set.html"
                }, {
                    "name": doI18n("store_settings_warn"),
                    "dst": "/StoreUI/page/set/alarm-subscribe.html"
                }, {
                    "name": doI18n("store_settings_netcard"),
                    "dst": "/StoreUI/page/set/netcard-warn-set.html"
                }
            ]
        }
    }

};

loongStore.prototype.getGuide = function () {
    return {
        "stepArry": {
            "title": doI18n("store_menu_store"),
            "url": "/StoreUI/page/guide-set.html",
            "export": "/StoreUI/js/guide.js",
            "module": "guideGlobal.storeGuide"
        },
        "tipArry": {
            "url": "/StoreUI/page/guide-tip.html"
        }
    }
};
loongStore.prototype.getIconfont = function () {
    return {
        "fontPath": "views/StoreUI/font/iconfont.js"
    }
};

loongStore.prototype.getValidate = function () {
    return {
        "name": "store",
        "path": "views/StoreUI/validate"
    }
};
loongStore.prototype.getAsyncTask = function () {
    return {
        "name": "store",
        "export": "/views/StoreUI/js/asyncTask.js",
    }
};
// var loongStore = new loongStore();
window.loongData = new loongStore();
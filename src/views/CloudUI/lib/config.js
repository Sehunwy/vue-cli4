
import layout from '@/views/main/main'
import cloudDashboard from '@/views/CloudUI/page/dashboard'
// import cloudDashboard from '@/views/DiskUI/page/dashboard'
import { getUserRoles } from "@/views/LoongUI/frame/lib/config.js";
function loongCloud() {
    this.homePage = null;
    this.pathName = "../../../CloudUI";


}
loongCloud.prototype.getMenu = function () {
    var user = window.sessionStorage.getItem("user");
    var role = getUserRoles(user, "loongCloud");
    $.$ajax({
        url: "/api/user/clouduser/get",
        type: "post",
        cache: false,
        async: false,
        data: {
            name: user
        },
        success: function (data) {
            data = data.data;
            var domainId = data.domainId,
                isDomain = data.tenant;
            window.sessionStorage.setItem("domainId", domainId);
            window.sessionStorage.setItem("isDomain", isDomain);
        }
    });
    var isDomain = window.sessionStorage.getItem("isDomain") == "true" ? true : false;
    if (role.admin) {
        this.homePage = {
            "txt": $.doI18n("cloud_menu_vm_cloud"),
            "dst": cloudDashboard,
            "css": "views/DiskUI/css/dashboard.css"
        };
        var hasTemp = {
            path: '/cloud',
            name: 'cloud',
            meta: { title: $.doI18n("cloud_menu_vm_cloud"), iconClose: '#icon-yunguanlishouqi', iconOpen: '#icon-yunguanlizhankai' },
            component: layout,
            redirect: '/cloud/physical_node',
            children: [
                {
                    path: '/cloud/physical_node',
                    name: 'physical_node',
                    meta: { title: $.doI18n("cloud_menu_physical_node"), iconClose: '#icon-jiedianguanli', iconOpen: '#icon-jiedianguanli' },
                    component: () => import('@/views/DiskUI/page/diskserver'),
                },
                {
                    path: '/cloud/network',
                    name: 'network',
                    meta: { title: $.doI18n("cloud_menu_network_mgr"), iconClose: '#icon-wangluoguanli1', iconOpen: '#icon-wangluoguanli1' },
                    component: () => import('@/views/DiskUI/page/diskserver'),
                }
            ]
        };
        // if (isDomain) {
        //     hasTemp.children.push({
        //         "dst": "/CloudUI/page/tenant.html",
        //         "icon": "#icon-zuhuguanli",
        //         "txt": doI18n("cloud_menu_tenant_mgr")
        //     });
        // } else {
        //     hasTemp.children.push(
        //         {
        //             "dst": "/CloudUI/page/disk.html",
        //             "icon": "#icon-xunicipan",
        //             "txt": doI18n("cloud_menu_virtual_disk")
        //         },
        //         {
        //             "dst": "/CloudUI/page/virtual-manage.html",
        //             "icon": "#icon-xuniyun",
        //             "txt": doI18n("cloud_menu_virtual_mgr")
        //         },
        //         {
        //             "dst": "/CloudUI/page/user.html",
        //             "icon": "#icon-yunzhanghu",
        //             "txt": doI18n("cloud_menu_account_mgr")
        //         });
        // }
        return hasTemp;
    }
    if (role.tenant && isDomain) {
        this.homePage = {
            "txt": doI18n("cloud_menu_virtual_mgr"),
            "dst": "/CloudUI/page/tenant-dashboard.html",
            "css": "/CloudUI/css/tenant-dashboard.css"
        }
        return {
            "txt": doI18n("cloud_menu_vm_cloud"),
            "dst": "",
            "css": "",
            "firstIcon": "#icon-yunguanlishouqi",
            "iconSelected": "#icon-yunguanlizhankai",
            "children": [
                {
                    "dst": "/CloudUI/page/virtual-manage.html",
                    "icon": "#icon-xuniyun",
                    "txt": doI18n("cloud_menu_virtual_mgr")
                },
                {
                    "dst": "/CloudUI/page/vxlan.html",
                    "icon": "#icon-wangluoguanli1",
                    "txt": doI18n("cloud_menu_network_mgr")
                },
                {
                    "dst": "/CloudUI/page/image.html",
                    "icon": "#icon-jingxiangku",
                    "txt": doI18n("cloud_menu_image_site")
                },
                {
                    "dst": "/CloudUI/page/file.html",
                    "icon": "#icon-wenjianguanli",
                    "txt": doI18n("cloud_menu_file_site")
                },
                {
                    "dst": "/CloudUI/page/disk.html",
                    "icon": "#icon-xunicipan",
                    "txt": doI18n("cloud_menu_virtual_disk")
                },
                {
                    "dst": "/CloudUI/page/user.html",
                    "icon": "#icon-yunzhanghu",
                    "txt": doI18n("cloud_menu_account_mgr")
                }
            ]
        }
    }
    if (role.user) {
        return {
            "txt": doI18n("cloud_menu_vm_cloud"),
            "dst": "",
            "css": "",
            "firstIcon": "#icon-yunguanlishouqi",
            "iconSelected": "#icon-yunguanlizhankai",
            "children": [
                {
                    "dst": "/CloudUI/page/virtual-manage.html",
                    "icon": "#icon-xuniyun",
                    "txt": doI18n("cloud_menu_virtual_mgr")
                },
                {
                    "dst": "/CloudUI/page/image.html",
                    "icon": "#icon-jingxiangku",
                    "txt": doI18n("cloud_menu_image_site")
                },
                {
                    "dst": "/CloudUI/page/file.html",
                    "icon": "#icon-wenjianguanli",
                    "txt": doI18n("cloud_menu_file_site")
                },
                {
                    "dst": "/CloudUI/page/disk.html",
                    "icon": "#icon-xunicipan",
                    "txt": doI18n("cloud_menu_virtual_disk")
                }
            ]
        }
    }
}
loongCloud.prototype.getSetting = function () {
    var user = window.sessionStorage.getItem("user");
    var role = getUserRoles(user, "loongCloud");
    if (role.admin) {
        return {
            "name": doI18n("cloud_config_setting_title"),
            "dst": "",
            "children": [
                {
                    "name": doI18n("cloud_set_oversold_setting"),
                    "dst": "/CloudUI/page/set/oversold.html"
                }, {
                    "name": doI18n("cloud_set_warning_setting"),
                    "dst": "/CloudUI/page/set/alarm-set.html"
                }, {
                    "name": doI18n("cloud_config_setting_qos_subtitle"),
                    "dst": "/CloudUI/page/set/qos-set.html"
                }
            ]
        }
    }
};

loongCloud.prototype.getGuide = function () {
    return {
        "stepArry": {
            "title": doI18n("cloud_menu_virtual_mgr"),
            "url": "/CloudUI/page/guide-set.html",
            "export": "/CloudUI/js/guide.js",
            "module": "guideGlobal.cloudGuide",
            "steps": 3
        },
        "tipArry": {
            "url": "/CloudUI/page/guide-tip.html",
            "steps": 4
        }
    }
};

loongCloud.prototype.getBreadcrumb = function () {
    return {

    }
};
loongCloud.prototype.getIconfont = function () {
    return {
        "fontPath": "views/CloudUI/font/iconfont.js"
    }
};
loongCloud.prototype.getValidate = function () {
    return {
        "name": "cloud",
        "path": "views/CloudUI/validate"
    }
};
loongCloud.prototype.getAsyncTask = function () {
    return {
        "name": "cloud",
        "export": "/CloudUI/js/asyncTask.js",
    }
};
// var loongCloud = new loongCloud();
window.loongData = new loongCloud();


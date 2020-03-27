import layout from '@/views/main/main'
import diskDashboard from '@/views/DiskUI/page/dashboard'
import { getUserRoles } from "@/views/LoongUI/frame/lib/config.js";
function loongDisk() {
    this.homePage = null;
    this.pathName = "../../../DiskUI";

}

loongDisk.prototype.getMenu = function() {
    var user = window.sessionStorage.getItem("user");
    var role = getUserRoles(user, "loongDisk");
    if (role.admin) {
        this.homePage = {
            "txt" : $.doI18n("disk_loongDisk"),
            "dst" : diskDashboard,
            "css" : "views/DiskUI/css/dashboard.css"
        }
        return {
            path: '/disk',
            name: 'disk',
            meta: { title: $.doI18n("disk_loongDisk"), iconClose: '#iconyunpanshouqi', iconOpen: '#iconyunpanzhankai'},
            component: layout,
            redirect: '/disk/diskserver',
            children: [  
                {
                    path: '/disk/diskserver',
                    name: 'diskserver',
                    meta: { title: $.doI18n("disk_server_management"), iconClose: '#icon-fuwuguanli', iconOpen: '#icon-fuwuguanli'},
                    component: () => import('@/views/DiskUI/page/diskserver'),
                },
                {
                    path: '/disk/department',
                    name: 'department',
                    meta: { title: $.doI18n("disk_department_management"), iconClose: '#icon-bumenguanli', iconOpen: '#icon-bumenguanli'},
                    component: () => import('@/views/DiskUI/page/diskserver'),
                }
            ]

        //     "txt" : doI18n("disk_loongDisk"),
        //     "dst" : "",
        //     "css" : "",
        //     "firstIcon" : "#iconyunpanshouqi",
        //     "iconSelected" : "#iconyunpanzhankai",
        //     "children" : [ {
        //         "dst" : "/DiskUI/page/diskserver.html",
        //         "css" : "",
        //         "icon" : "#icon-fuwuguanli",
        //         "txt" : doI18n("disk_server_management"),
        //         "iconSelected" : "#icon-fuwuguanli"
        //     }, {
        //         "dst" : "/DiskUI/page/department.html",
        //         "css" : "",
        //         "icon" : "#icon-bumenguanli",
        //         "txt" : doI18n("disk_department_management"),
        //         "iconSelected" : "#icon-bumenguanli"
        //     }, {
        //         "dst" : "/DiskUI/page/member.html",
        //         "css" : "",
        //         "icon" : "#icon-chengyuanguanli",
        //         "txt" : doI18n("disk_member_management"),
        //         "iconSelected" : "#icon-chengyuanguanli"
        //     } 
        //     ,{
        //         "dst" : "/DiskUI/page/cluster-group.html",
        //         "css" : "",
        //         "icon" : "#icon-qunzuguanli",
        //         "txt" : doI18n("disk_cluster_management"),
        //         "iconSelected" : "#icon-qunzuguanli"
        //     }
        //     ,{
        //         "dst": "/DiskUI/page/domain-control.html",
        //         "icon": "#icon-yukongguanli",
        //         "txt": doI18n("disk_domain_management"),
        //         "iconSelected": "#icon-yukongguanli",
        //         "name": "senior"
        //     }
        //     ,{
        //         "dst": "/DiskUI/page/senior/senior.html",
        //         "icon": "#icon-gaojishezhi",
        //         "txt": doI18n("disk_senior_management"),
        //         "iconSelected": "#icon-gaojishezhi",
        //         "name": "senior"
        //     }
            
        	
        // ]
        }
    }
    if (role.orgadmin) {
        // this.homePage = {
        //     "txt" : "云盘",
        //     "dst" : "/DiskUI/page/dashboard.html",
        //     "css" : "/DiskUI/css/dashboard.css"
        // }
        return {
            "txt" : $.doI18n("disk_loongDisk"),
            "dst" : "",
            "css" : "",
            "firstIcon" : "#iconyunpanshouqi",
            "iconSelected" : "#iconyunpanzhankai",
            "children" : [{
                "dst" : "/DiskUI/page/member.html",
                "css" : "",
                "icon" : "#icon-chengyuanguanli",
                "txt" : $.doI18n("disk_member_management"),
                "iconSelected" : "#icon-iscsiguanli"
            } ]
        }
    }

};

loongDisk.prototype.getSetting = function() {
     return {
        "name" : "云盘管理设置",
         "dst" : "",
         "children" : [/* {
          "name" : "日志查询",
         "dst" : "/DiskUI/page/set/query/log-query.html"
          }, {
          "name" : "文件过滤",
         "dst" : "/DiskUI/page/set/files-filter.html"
          } */]
         }
}

loongDisk.prototype.getGuide = function() {
    return {
        "stepArry" : {
            "title" : doI18n("disk_loongStore"),
            "url" : "/DiskUI/page/guide-set.html",
            "export" : "/DiskUI/js/guide.js",
            "module" : "guideGlobal.diskGuide"
        },
        "tipArry" : {
            "url" : "/DiskUI/page/guide-tip.html"
        }
    }
}

loongDisk.prototype.getIconfont = function() {
    return {
        "fontPath": "views/DiskUI/font/iconfont.js"
    }
}
loongDisk.prototype.getValidate = function() {
    return {     
        "name": "disk",
        "path": "views/DiskUI/lib/loongValidate"
    }
}
loongDisk.prototype.getAsyncTask = function(){
    return {
        "name" : "disk",
        "export" : "/DiskUI/js/asyncTask.js",
    }
}

// var loongDisk = new loongDisk();
window.loongData = new loongDisk();
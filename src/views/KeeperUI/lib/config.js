import layout from '@/views/main/main'
import keeperDashboard from '@/views/KeeperUI/page/dashboard'
import { getUserRoles } from "@/views/LoongUI/frame/lib/config.js";
function loongKeeper(){
    this.homePage = null;
}

loongKeeper.prototype.getMenu=function(){
    var user = window.sessionStorage.getItem("user");
    var role = getUserRoles(user,"loongKeeper");
    var menu = {};
     if(role.admin){
        this.homePage = {
            "txt" : $.doI18n("keeper_loongKeeper"),
            "dst" : keeperDashboard
        }
        return {
            path: '/keeper',
            name: 'keeper',
            meta: { title: $.doI18n("keeper_loongKeeper"), iconClose: '#iconduixiangcunchushouqi', iconOpen: '#iconduixiangcunchuzhankai'},
            component: layout,
            redirect: '/keeper/node-server',
            children: [  
                {
                    path: '/keeper/nodeServer',
                    name: 'nodeServer',
                    meta: { title: $.doI18n("keeper_object_node"), iconClose: '#iconjiedianfuwuguanli', iconOpen: '#iconjiedianfuwuguanli'},
                    component: () => import('@/views/KeeperUI/page/object-node/object-node'),
                },
                {
                    path: '/keeper/storagePool',
                    name: 'storagePool',
                    meta: { title: $.doI18n("keeper_storage_pool"), iconClose: '#iconcunchuchiguanli', iconOpen: '#iconcunchuchiguanli'},
                    component: () => import('@/views/KeeperUI/page/storage-pool'),
                },
                {
                    path: '/keeper/userMana',
                    name: 'userMana',
                    meta: { title: $.doI18n("keeper_user_mana"), iconClose: '#iconyonghuguanli', iconOpen: '#iconyonghuguanli'},
                    component: () => import('@/views/KeeperUI/page/user'),
                }
            ]
        }
     }
     return "oooo"
};

loongKeeper.prototype.getSetting = function(){
    var role = JSON.parse(window.sessionStorage.getItem("loongKeeper"));
    if(role.admin){
        return {
            // "name" : doI18n("store_settings_store"),
            // "dst" : "",
            // "children" : [
            //     {
            //         "name" : doI18n("store_settings_server"),
            //         "dst" : "/StoreUI/page/set/server-set.html"
            //     },{
            //         "name" : doI18n("store_settings_file"),
            //         "dst" : "/StoreUI/page/set/file-set.html"
            //     },{
            //         "name" : doI18n("store_settings_warn"),
            //         "dst" : "/StoreUI/page/set/alarm-subscribe.html"
            //     },{
            //         "name" : doI18n("store_settings_netcard"),
            //         "dst" : "/StoreUI/page/set/netcard-warn-set.html"
            //     }
            // ]
        }
    }

};

loongKeeper.prototype.getGuide = function(){
    // return {
    //     "stepArry": {
    //         "title" : doI18n("store_menu_store"),
    //         "url": "/StoreUI/page/guide-set.html",
    //         "export": "/StoreUI/js/guide.js",
    //         "module": "guideGlobal.storeGuide"
    //     },
    //     "tipArry": {
    //         "url": "/StoreUI/page/guide-tip.html"
    //     }
    // }
};
loongKeeper.prototype.getIconfont = function(){
    return {
        "fontPath":"views/KeeperUI/font/iconfont.js"
    }
};

loongKeeper.prototype.getValidate = function(){
    return {
        "name":"keeper",
        "path":"views/KeeperUI/validate"
    }
};
loongKeeper.prototype.getAsyncTask = function(){
    return {
            "name" : "store",
            "export" : "/StoreUI/js/asyncTask.js",
    }
};
window.loongData = new loongKeeper();

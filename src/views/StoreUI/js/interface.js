export var interface1 = {};

var urls = {
    // 查询某个路径下所有用户权限
    queryPermByPath: '/api/store/perm/user/list',
    // Leofs用户创建
    leofUserAdd: '/api/store/perm/leofsuser/add',
    // Leofs用户删除
    leofUserDelete: '/api/store/perm/leofsuser/delete',
    // Leofs用户列表
    leofUserList: '/api/store/perm/leofsuser/list',
    // 设置某个路径下的用户权限
    permUserSet: '/api/store/perm/user/set',
    // 权限开关查询
    permUserCheck: '/api/store/perm/user/check',
    // 设置权限开关
    permUserSwitch: '/api/store/perm/user/switch',
    // 取消某个路径下所有用户的权限
    permUserAllCancel: '/api/store/perm/user/all/cancel',
    // 查询某个用户的权限
    permUserGet: '/api/store/perm/user/user/get',
    // 取消某个路径下某个用户的权限
    permUserCancel: '/api/store/perm/user/cancel',
    // 切换元数据主从
    fsMetaChange: '/api/store/fs/meta/change',
    // 查询元数据主从
    fsMetaGet: '/api/store/fs/meta/get',
    // 获取是否已开启元数据自动切换
    fsMetaAutoChangeGet: '/api/store/fs/meta/auto/change/get',
    // 设置元数据是否自动切换
    fsMetaAutoChangeConf: '/api/store/fs/meta/auto/change/conf',
    // 集群服务查询
    queryClusterServer: '/api/store/node/storeNode/list',
    // 服务详情监控查询
    queryServerMonitor: '/api/store/node/monitor/single/perfs/list',
    // 添加告警订阅
    addAlarmSubscribe: '/api/utility/alarm/subscription/add',
    // 修改告警订阅
    modifyAlarmSubscribe: '/api/utility/alarm/subscription/update',
    // 删除告警订阅
    deleteAlarmSubscribe: '/api/utility/alarm/subscription/delete',
    // 主页存储详情监控查询
    queryHomeStoreMonitor: '/api/store/node/monitor/cluster/perfs/list',
    // 查询目录是否存在
    queryPathExist: '/api/store/node/clientNode/checkDirBeforeAdd',
    queryQuotaPathExist: '/api/store/file/quota/checkDirBeforeAdd',
    // 停止存储服务
    stopStoreServer: '/api/store/node/storeNode/stopIstore',
    // 查询某个目录的配额
    queryDirquota: '/api/store/file/quota/queryAllQuotainode',
    // 查询服务集群某台机器详情
    queryNodeInfo: '/api/store/node/storeNode/node/information/get',
    // 查询服务集群
    queryStoreNodeList: '/api/store/node/storeNode/list',
    // 配置服务集群
    nodeStoreNodeConfig: '/api/store/node/storeNode/cluster/config',
    // 删除目录
    removeFsFileDir: '/api/store/fs/file/remove',
    // 查询文件分布
    queryFsLayout: '/api/store/fs/layout/show',
    // 设置文件分布
    setFsLayout: '/api/store/fs/layout/set',
    // 设置目录自身配额
    setDirQuota: '/api/store/file/quota/addFileDirQuota',
    // 查询配额目录
    queryQuotaDir: '/api/store/file/quota/querySingleQuotaInfoByType',
    // 查询配额用户
    queryQuotaUser: '/api/store/perm/access/user',
    // 查询配额用户组
    queryQuotaUserGroup: '/api/store/perm/access/groups',
    //查询用户包含域控用户 
    queryQuotaUserContainDomain: "/api/store/file/quota/usercontaindomain",
    //查询用户组包含域控用户组
    queryQuotaGroupsContainDomain: "/api/store/file/quota/groupscontaindomain",
    // 删除目录配额
    deleteDirQuota: '/api/store/file/quota/deleteQuota',
    // 修改目录配额
    changeDirQuota: '/api/store/file/quota/changeQuota',
    // 设置目录用户配额
    setDirUserQuota: '/api/store/file/quota/addUserQuota',
    // 设置目录用户组配额
    setDirUserGroupQuota: '/api/store/file/quota/addUsergroupQuota',
    // 设置配额告警
    setGlobalAlarmRadio: '/api/store/file/quota/setGlobalAlarmRadio',
    // 获取配额告警
    getGlobalAlarmRadio: '/api/store/file/quota/getGlobalAlarmRadio',

    // 检查worm目录是否可删
    checkWormDelete: '/api/store/fs/worm/check',
    // 删除worm目录
    deleteFsWorm: '/api/store/fs/worm/delete',
    // 异步任务查询
    queryAsyncTaskGlobal: '/api/store/asytask/getGlobalTask',
    // 异步任务运行中查询
    queryAsyncTaskRun: '/api/store/asytask/getRunningTask',
    // 根据id查询任务
    queryAsyncTaskById: '/api/store/asytask/getTask',
    // 服务节点自启动设置
    setStoreNodeAutoStart: '/api/store/node/storeNode/autoStartConf',
    unbindQuota: "/api/store/domain/mapper/unbind",
    //查询文件分片信息
    queryFileSliceInfo: '/api/store/fs/layout/file/slice/info',
    //创建配额判断是否异步
    checkDirBeforeAddQuota: '/api/store/file/quota/checkDirBeforeAddQuota',
    //创建子目录容量统计判断是否异步
    checkDirBeforeAddRecordStub: '/api/store/file/quota/checkDirBeforeAddRecordStub'
}

interface1 = {
    /*data: {
        path: ''
    }*/
    queryPermByPath: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryPermByPath
            }, param)
        )
    },
    //取消配额绑定用户
    unbindQuota: function (param) {
        return $.ajax(
            $.extend({
                url: urls.unbindQuota
            }, param)
        )
    },

    /*data: {
        username: '',
        passwd: ''
    }*/
    leofUserAdd: function (param) {
        return $.ajax(
            $.extend({
                url: urls.leofUserAdd,
                type: "POST"
            }, param)
        )
    },

    /*data: {
        username: ''
    }*/
    leofUserDelete: function (param) {
        return $.ajax(
            $.extend({
                url: urls.leofUserDelete,
                type: "POST"
            }, param)
        )
    },

    leofUserList: function (param) {
        return $.ajax(
            $.extend({
                url: urls.leofUserList
            }, param)
        )
    },

    /*data: {
        path: '',
        username: [],
        perm: []
    }*/
    permUserSet: function (param) {
        return $.ajax(
            $.extend({
                url: urls.permUserSet,
                type: "POST"
            }, param)
        )
    },

    permUserCheck: function (param) {
        return $.ajax(
            $.extend({
                url: urls.permUserCheck
            }, param)
        )
    },

    /*data: {
        enable: true||false
    }*/
    permUserSwitch: function (param) {
        return $.ajax(
            $.extend({
                url: urls.permUserSwitch,
                type: "POST"
            }, param)
        )
    },

    /*data: {
        path: ''
    }*/
    permUserAllCancel: function (param) {
        return $.ajax(
            $.extend({
                url: urls.permUserAllCancel,
                type: "POST"
            }, param)
        )
    },

    /*data: {
        id: ''
    }*/
    permUserGet: function (param) {
        return $.ajax(
            $.extend({
                url: urls.permUserGet,
                type: "POST"
            }, param)
        )
    },

    /*data: {
        path: '',
        username: ''
    }*/
    permUserCancel: function (param) {
        return $.ajax(
            $.extend({
                url: urls.permUserCancel,
                type: "POST"
            }, param)
        )
    },

    /*data: {
        metaid: '',
        oldmasterid: '',
        newmasterid: ''
    }*/
    fsMetaChange: function (param) {
        return $.ajax(
            $.extend({
                url: urls.fsMetaChange,
                type: "POST"
            }, param)
        )
    },

    fsMetaGet: function (param) {
        return $.ajax(
            $.extend({
                url: urls.fsMetaGet
            }, param)
        )
    },

    fsMetaAutoChangeGet: function (param) {
        return $.ajax(
            $.extend({
                url: urls.fsMetaAutoChangeGet
            }, param)
        )
    },

    fsMetaAutoChangeConf: function (param) {
        return $.ajax(
            $.extend({
                url: urls.fsMetaAutoChangeConf,
                type: "POST"
            }, param)
        )
    },


    queryClusterServer: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryClusterServer
            }, param)
        )
    },

    /*{
       nodeId: '',
       metric: 'Network CPU Loadavg',
       range: 'onemin fivemin tenmin fifteenmin hour day week month year'
    }*/
    queryServerMonitor: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryServerMonitor,
                type: "POST"
            }, param)
        )
    },

    /*{
        type: '',
        userName: '',
        addresses: 'xx,ss',
        lang: 'zh|en|de'
    }*/
    addAlarmSubscribe: function (param) {
        return $.ajax(
            $.extend({
                url: urls.addAlarmSubscribe,
                type: "POST"
            }, param)
        )
    },

    /*{
        type: '',
        userName: '',
        addresses: 'xx,ss',
        lang: 'zh|en|de',
        id: ''
    }*/
    modifyAlarmSubscribe: function (param) {
        return $.ajax(
            $.extend({
                url: urls.modifyAlarmSubscribe,
                type: "POST"
            }, param)
        )
    },

    /*{
        id: ''
    }*/
    deleteAlarmSubscribe: function (param) {
        return $.ajax(
            $.extend({
                url: urls.deleteAlarmSubscribe,
                type: "POST"
            }, param)
        )
    },

    /*{
        clusterType: 'ls_mds|ls_istore|ls_client',
        metric: 'Network CPU Loadavg',
        range: 'onemin fivemin tenmin fifteenmin hour day week month year'
    }*/
    queryHomeStoreMonitor: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryHomeStoreMonitor,
                type: "POST"
            }, param)
        )
    },

    /*{
        path: ''
    }*/
    queryPathExist: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryPathExist,
                type: "POST"
            }, param)
        )
    },
    queryQuotaPathExist: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryQuotaPathExist,
                type: "POST"
            }, param)
        )
    },

    /*{
        storeNodeId: ''
    }*/
    stopStoreServer: function (param) {
        return $.ajax(
            $.extend({
                url: urls.stopStoreServer,
                type: "POST"
            }, param)
        )
    },

    /*{
        path: ''
    }*/
    queryDirquota: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryDirquota,
                type: "POST"
            }, param)
        )
    },

    /*{
        storeNodeId: ''
    }*/
    queryNodeInfo: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryNodeInfo,
                type: "POST"
            }, param)
        )
    },

    queryStoreNodeList: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryStoreNodeList
            }, param)
        )
    },

    /*{
        "storeNodes" : [],
        isConfig: true | false
    }*/
    nodeStoreNodeConfig: function (param) {
        return $.ajax(
            $.extend({
                url: urls.nodeStoreNodeConfig,
                type: "POST"
            }, param)
        )
    },

    removeFsFileDir: function (param) {
        return $.ajax(
            $.extend({
                url: urls.removeFsFileDir,
                type: "POST"
            }, param)
        )
    },

    /*{
        path: ""
    }*/
    queryFsLayout: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryFsLayout,
                type: "POST"
            }, param)
        )
    },

    /*{
        layout: rep|xd|leoraid|xd2
        diskspan: 2|4|8|16
        repnum: 1|2|3|4
        path: /
    }*/
    setFsLayout: function (param) {
        return $.ajax(
            $.extend({
                url: urls.setFsLayout,
                type: "POST"
            }, param)
        )
    },

    /*{
        path: /
        maxsize: 1024
        maxfilenum: 100
    }*/
    setDirQuota: function (param) {
        return $.ajax(
            $.extend({
                url: urls.setDirQuota,
                type: "POST"
            }, param)
        )
    },

    /*{
        type: Dir|User|UserGroup
        path
        pageNum
        pageSize
    }*/
    queryQuotaDir: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryQuotaDir,
                type: "POST"
            }, param)
        )
    },

    /*{
        path
    }*/
    checkWormDelete: function (param) {
        return $.ajax(
            $.extend({
                url: urls.checkWormDelete,
                type: "POST"
            }, param)
        )
    },

    /*{
        path
    }*/
    deleteFsWorm: function (param) {
        return $.ajax(
            $.extend({
                url: urls.deleteFsWorm,
                type: "POST"
            }, param)
        )
    },

    /*{
        type: 0文件迁移|1快照|2克隆|3快照恢复
    }*/
    queryAsyncTaskGlobal: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryAsyncTaskGlobal,
                type: "POST"
            }, param)
        )
    },

    /*{
        type: 0文件迁移|1快照|2克隆
    }*/
    queryAsyncTaskRun: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryAsyncTaskRun,
                type: "POST"
            }, param)
        )
    },

    /*{
        id: 
    }*/
    queryAsyncTaskById: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryAsyncTaskById,
                type: "POST"
            }, param)
        )
    },

    /*{
        id: '',
        nodeType: 0|1|2,
        autoStart: true|false
    }*/
    setStoreNodeAutoStart: function (param) {
        return $.ajax(
            $.extend({
                url: urls.setStoreNodeAutoStart,
                type: "POST"
            }, param)
        )
    },

    queryQuotaUser: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryQuotaUser
            }, param)
        )
    },

    queryQuotaUserGroup: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryQuotaUserGroup
            }, param)
        )
    },

    queryQuotaUserContainDomain: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryQuotaUserContainDomain
            }, param)
        )
    },

    queryQuotaGroupsContainDomain: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryQuotaGroupsContainDomain
            }, param)
        )
    },
    /*[{
        mid: '',
        ids: []
    }]*/
    deleteDirQuota: function (param) {
        return $.ajax(
            $.extend({
                url: urls.deleteDirQuota,
                type: "POST"
            }, param)
        )
    },

    /*[{
        "mid":"1",
        "qid":"1",
        "maxsize":5120000000,
        "maxfilenum":50
    }]*/
    changeDirQuota: function (param) {
        return $.ajax(
            $.extend({
                url: urls.changeDirQuota,
                type: "POST"
            }, param)
        )
    },

    /*[{
        path;
        name;
        maxsize;
        maxfilenum;
        id;
    }]*/
    setDirUserQuota: function (param) {
        return $.ajax(
            $.extend({
                url: urls.setDirUserQuota,
                type: "POST"
            }, param)
        )
    },

    /*[{
        path;
        name;
        maxsize;
        maxfilenum;
        id;
    }]*/
    setDirUserGroupQuota: function (param) {
        return $.ajax(
            $.extend({
                url: urls.setDirUserGroupQuota,
                type: "POST"
            }, param)
        )
    },

    /*
        {
            alarmFilenumRadio,
            alarmSizeRadio
        }
    */
    setGlobalAlarmRadio: function (param) {
        return $.ajax(
            $.extend({
                url: urls.setGlobalAlarmRadio,
                type: "POST"
            }, param)
        )
    },

    getGlobalAlarmRadio: function (param) {
        return $.ajax(
            $.extend({
                url: urls.getGlobalAlarmRadio,
                type: "POST"
            }, param)
        )
    },

    queryFileSliceInfo: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryFileSliceInfo,
            }, param)
        )
    },

    checkDirBeforeAddQuota: function (param) {
        return $.ajax(
            $.extend({
                url: urls.checkDirBeforeAddQuota,
            }, param)
        )
    },

    checkDirBeforeAddRecordStub: function (param) {
        return $.ajax(
            $.extend({
                url: urls.checkDirBeforeAddRecordStub,
            }, param)
        )
    }

}
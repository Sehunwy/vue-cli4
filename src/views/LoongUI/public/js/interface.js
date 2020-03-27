export var interface1 = {};

var urls = {
    // 用户列表
    queryUserList: '/api/utility/user/find',
    // 新增用户
    addUser: '/api/utility/user/add',
    // 删除用户
    deleteUser: '/api/utility/user/remove',
    // 重置密码
    resetPwd: '/api/utility/user/reset/password',

    // 角色设置
    roleSet: '/api/utility/user/bindRoles',
    // 角色列表
    getRoles: '/api/core/role/list',
    // 获取用户角色
    getUserRole: '/api/utility/user/getRoles',
    // 用户详情
    getUserDetail: '/api/utility/user/get',
    // 异步任务运行中查询
    queryAsyncTaskRun: '/api/store/asytask/getRunningTask',
    // 根据id查询任务
    queryAsyncTaskById: '/api/store/asytask/getTask'
};

interface1 = {

    queryUserList: function (param) {
        return $.ajax(
            $.extend({
                url: urls.queryUserList
            }, param)
        )
    },

    /*
        data: {
            username: '',
            nickname: '',
            password: '',
            email: ''
        }
    */
    addUser: function (param) {
        return $.ajax(
            $.extend({
                url: urls.addUser,
                type: "POST"
            }, param)
        )
    },

    /*
        data: {
            username: ''
        }
    */
    deleteUser: function (param) {
        return $.ajax(
            $.extend({
                url: urls.deleteUser,
                type: "POST"
            }, param)
        )
    },

    /*
        data: {
            username: '',

        }
    */
    resetPwd: function (param) {
        return $.ajax(
            $.extend({
                url: urls.resetPwd,
                type: "POST"
            }, param)
        )
    },

    /*
        data: {
            username: '',
            roles: ''
        }
    */
    roleSet: function (param) {
        return $.ajax(
            $.extend({
                url: urls.roleSet,
                type: "POST"
            }, param)
        )
    },

    getRoles: function (param) {
        return $.ajax(
            $.extend({
                url: urls.getRoles
            }, param)
        )
    },

    /*
        data: {
            username: ''
        }
    */
    getUserRole: function (param) {
        return $.ajax(
            $.extend({
                url: urls.getUserRole
            }, param)
        )
    },

    /*
        data: {
            username: ''
        }
    */
    getUserDetail: function (param) {
        return $.ajax(
            $.extend({
                url: urls.getUserDetail
            }, param)
        )
    },

    /*{
        type: 0文件迁移|1快照|2克隆|3快照恢复
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
    }

};
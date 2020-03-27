import layout from '@/views/main/main'
import axios from 'axios'
import router from '@/router'
var apiHost = "13.15.23.11";
// var apiHost = "13.15.35.2";
var apiPort = "8558";
const API_TOKEN = '/oauth/token'
const timeout = 3000
$.extend({
    $ajax: function (options) {
        let url = 'http://' + apiHost + ':' + apiPort + options.url;
        if (options.url.startsWith(API_TOKEN)) {
            var data = options.data;
            data.grant_type = 'password';
            data.client_id = 'manager';
            data.client_secret = 'MCLdoqbydByzAbOC';
            $.ajax({
                url: url,
                type: options.type,
                async: options.async ? options.async : true,
                data: data,
                success: function (data) {
                    window.sessionStorage.setItem("token", data.value);
                    if (options.success) {
                        options.success(data);
                    }
                },
                error: function (data) {
                    if (options.error) {
                        options.error(data);
                    }
                }
            });
        }
        else {
            var data = options.data ? options.data : {};
            var token = window.sessionStorage.getItem("token");
            if (token && token != 'undefined') {
                data.access_token = token;
            }
            $.ajax({
                url: url,
                type: options.type,
                async: options.async != undefined ? options.async : true,
                cache: options.cache != undefined ? options.cache : true,
                data: data,
                //请求前的处理
                beforeSend: function (data) {
                    if (options.beforeSend) {
                        options.beforeSend();
                    }
                },
                //请求成功时处理
                success: function (data) {
                    if (options.success) {
                        options.success(data);
                    }
                },
                //请求完成的处理
                complete: function (data, xhr) {
                    if (options.complete) {
                        options.complete();
                    }
                },
                //请求出错处理
                error: function (data, status, xhr) {
                    if (data.statusText.indexOf('NetworkError') != -1 || data.statusText.indexOf('error') != -1) {
                        router.push("/");
                        // window.sessionStorage.removeItem('token');
                        window.sessionStorage.clear()
                        $.clearIntervals();
                    }
                    if (options.error) {
                        options.error(data);
                    }
                }
            });
        }
    }
})

export function $axios(options) {
    let url = '';
    if (options.url.indexOf('http') > -1) {
        url = options.url;
    }
    else {
        url = 'http://' + apiHost + ':' + apiPort + options.url;
    }
    console.log(url)
    // let url = 'http://' + apiHost + ':' + apiPort + options.url;
    if (options.url.startsWith(API_TOKEN)) {
        var data = options.data;
        data.grant_type = 'password';
        data.client_id = 'manager';
        data.client_secret = 'MCLdoqbydByzAbOC';
        return new Promise((resolve, reject) => {
            axios({
                method: options.type,
                url: url,
                params: data,
                timeout: timeout
            }).then(res => {
                window.sessionStorage.setItem("token", res.data.value);
                resolve(res.data);
            }).catch(err => {
                reject(err);
            });
        })
    }
    else {
        var data = options.data ? options.data : {};
        var token = window.sessionStorage.getItem("token");
        if (token && token != 'undefined') {
            data.access_token = token;
        }
        return new Promise((resolve, reject) => {
            axios({
                method: options.type,
                url: url,
                params: data,
                timeout: timeout
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                if (err.request.status == 0) {
                    router.push("/");
                    // window.sessionStorage.removeItem('token');
                    window.sessionStorage.clear();
                    $.clearIntervals();
                }
                reject(err);
            });
        })
    }
}

export var homePage = {
    path: "/home",
    name: "home",
    meta: {
        iconClose: "#icon-zhuyexianxing",
        iconOpen: "#icon-zhuyexianxing"
    },
    component: layout,
    children: [
        //子路由,嵌套路由
        {
            path: "/home",
            name: "homePage",
            meta: { title: $.doI18n("dashboard") },
            component: () => import("@/views/LoongUI/frame/page/dashboard")
        }
    ]
};

export var notFind = {
    path: '*',
    redirect: '/',
}

export function login() {
    return {
        path: "/",
        name: "login",
        component: () => import("@/views/login")
    }
}



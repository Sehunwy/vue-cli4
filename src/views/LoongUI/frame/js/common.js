window.intervals = [];
$.extend({
    loadPageNoHistory: function (url, params, $dom, fn) {
        if (fn) {
            $.loadPage(url, params, $dom, fn, { router: false });
        } else {
            $.loadPage(url, params, $dom, { router: false });
        }
    },
    loadPage: function (url, params, $dom, fn, state) {
        $("body").find(".loongui-tip-move").remove();
        $("body").find(".dialog-container").remove();
        $("body").find(".dialog-wrap").remove();
        var options = {
            router: true,
            page: url,
            replace: false,
            pageParam: params
        };
        if (history.state) {
            options.menuOrder = history.state.menuOrder;
        }
        if (!fn) {
            state = options;
        } else {
            if (typeof fn === "function") {
                if (state === undefined) {
                    state = options;
                } else {
                    state = $.extend(options, state);
                }
            } else {
                state = $.extend(options, fn);
                fn = undefined;
            }
        }
        if (state.router === true) {
            if (history.state && url === history.state.page) {
                state.replace = true;
            }
            if (state.replace === true) {
                window.history.replaceState(state, null, null);
            } else {
                window.history.pushState(state, null, null);
            }
        }
        var selector,
            off = url.indexOf(" ");
        if (off >= 0) {
            selector = $.trim(url.slice(off, url.length));
            url = url.slice(0, off);
        }
        $.ajax({
            url: url,
            type: "get",
            dataType: "html",
            data: {}
        }).done(function (responseText) {
            var linkArray = [];
            var html = $.parseHTML(responseText, null, true);
            if (selector) {
                html = $(html).find(selector).children();
            }
            for (var i = 0; i < html.length; i++) {
                if (html[i].nodeName === "LINK") {
                    linkArray.push(html[i].getAttribute("href"));
                    $.arrayRemove(html, html[i]);
                }
            }
            if (linkArray.length !== 0) {
                $.loadCSS(linkArray.join());
            }
            var $fragment = $("<div>");
            var $hideDom = $("<div class='dataset-box'></div>");
            if (!$.isEmptyObject(params)) {
                for (var k in params) {
                    var $input = $("<input type ='hidden' name='" + k + "' />");
                    $input.val(params[k]);
                    $hideDom.append($input);
                }
                $fragment.append($hideDom)
            }
            $fragment.append(html);
            $.i18n($fragment);
            $dom.html($fragment.html());
            fn && fn($dom);
        }).fail(function (data, status, xhr) {
            if (410 == data.status) {
                window.sessionStorage.clear();
                $.clearIntervals();
                window.location.href = "login.html?errorCode=login_error_410";
            }
        })
    },
    loadCSS: function (path) {
        var links = document.getElementsByTagName("link");
        var head = document.getElementsByTagName('head')[0];
        var link = {};
        links = head.getElementsByTagName("link");
        var paths = path.split(",");
        for (var i = 0; i < paths.length; i++) {
            var flag = false;
            var p = paths[i];
            for (var j = 0; j < links.length; j++) {
                link = links[j];
                if ($(link).attr("href") === p) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                link = document.createElement('link');
                link.href = p;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                head.appendChild(link);
            }
        }
    },
    loadJS: function (path, fn) {
        var $script = $("<script src='" + path + "'></script>");
        $("body").append($script);
        if (fn) {
            fn();
        }


    },
    i18n: function (doms) {
        var $i18nItems = $(doms).find("[data-i18n-code]");
        var $validI18nItems = $(doms).find("[data-msg]");
        $.each($validI18nItems, function (index, item) {
            var msgArgs = $(item).data("msg");
            if (msgArgs) {
                try {
                    msgArgs = JSON.parse(msgArgs);
                } catch (e) {
                    msgArgs = eval('(' + msgArgs + ')');
                }

                var valids = $(item).attr("valids");
                valids = valids.split(" ");
                for (var val in valids) {
                    var validKey = valids[val];
                    if (msgArgs[validKey]) {
                        if ("equalTo" == validKey || "unequalToString" == validKey || "unequalTo" == validKey) {
                            msgArgs[validKey][0] = $.doI18n(msgArgs[validKey][0]);
                            msgArgs[validKey][1] = $.doI18n(msgArgs[validKey][1]);
                        } else {
                            msgArgs[validKey] = $.doI18n(msgArgs[validKey]);
                        }
                    }
                }
                $(item).attr("data-msg", JSON.stringify(msgArgs));
            }
        });
        $.each($i18nItems, function (index, item) {
            if (!$(item).is("input")) {
                $(item).html($.doI18n($(item).data("i18n-code")));
                if (undefined != $(item).attr("title")) {
                    $(item).attr("title", $.doI18n($(item).attr("title")));
                }
            } else {
                $(item).attr("placeholder",
                    $.doI18n($(item).data("i18n-code")));
            }
        });
    },
    arrayRemove: function (array, item) {
        var index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
    },
    arrayHasRepeat: function (array1, array2) {
        var totalArray = array1.concat(array2);
        var lengthOri = array1.length + array2.length;
        var lengthUniq = $.unique(totalArray.sort()).length;
        if (lengthOri !== lengthUniq) {
            return true;
        } else {
            return false;
        }
    },
    menuActiveClear: function () {
        var _con = $(".menus").find(".focus");
        _con.parent().find(".sub-menu").slideUp(function () {
            _con.removeClass("focus");
        });
        _con.find(".icon-selected").css({ "display": "none" });
        _con.find(".icon-unselected").css({ "display": "inline" });
        $(".menus .selected").removeClass("selected");
    },
    menuActive: function ($menu, noDst) {
        if ($menu.hasClass("first-menu")) {
            var _con = $(".menus").find(".focus");
            _con.parent().find(".sub-menu").slideUp(function () {
                _con.removeClass("focus");
            });
            _con.find(".icon-selected").css({ "display": "none" });
            _con.find(".icon-unselected").css({ "display": "inline" });
            if (!_con.is($menu || noDst)) {
                $menu.addClass("focus");
                $menu.find(".icon-selected").css({ "display": "inline" });
                $menu.find(".icon-unselected").css({ "display": "none" });
                $menu.parent().find(".sub-menu").slideDown();
            }
        }
        if ($menu.hasClass("second-menu")) {
            $(".menus").find(".selected").removeClass("selected");
            $menu.addClass("selected");
            var firstMenu = $menu.closest(".sub-menu").prev();
            if (!firstMenu.hasClass("focus")) {
                $.menuActive(firstMenu, true);
            }
        }
        if ($menu.hasClass("single-menu")) {
            $(".menus").find(".selected").removeClass("selected");
            $menu.addClass("selected");
            var _con = $(".menus").find(".focus");
            _con.parent().find(".sub-menu").slideUp(function () {
                _con.removeClass("focus");
            });
            _con.find(".icon-selected").css({ "display": "none" });
            _con.find(".icon-unselected").css({ "display": "inline" });
        }
        var dst = $menu.attr("dst");
        if (dst) {
            $.setBreadCrumb([{
                dst: $menu.attr("dst"),
                param: {},
                txt: $menu.find(".item-text").html()
            }]);
            if (noDst && noDst === true) {
                return;
            }
            if ($menu.attr("css")) {
                $.loadCSS($menu.attr("css"));
            }
            $.loadPage(dst, {}, $("#container"), { menuOrder: $.getActiveMenu() });
        }
    },
    getActiveMenu: function () {
        var menuOrder,
            menus = $(".menus").find(".single-menu,.first-menu,.second-menu");
        for (var i = 0; i < menus.length; i++) {
            if ($(menus[i]).hasClass("selected")) {
                menuOrder = i;
            }
        }
        return menuOrder;
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
    },
    setBreadCrumb: function (titles, isBack) {
        $.clearIntervals();
        $(".breadcrumb-list").empty();
        if (!isBack) {
            var len = titles.length;
            for (var i = 0; i < len; i++) {
                var $li = $("<li class='fl title fs15'></li>");
                var $a = $("<a></a>")
                var $i = $('<svg class="icon fs18" aria-hidden="true"><use xlink:href="#icon-mianbaoxiejiantou"></use></svg>');
                var $iconBox = $("<div class='fl pl10 pr10 crumb-icon'></div>");
                var $titleBox = $("<div class='fl'></div>");
                if (i == len - 1) {
                    $titleBox.html($.doI18n(titles[i].txt));
                    $li.append($titleBox);
                } else {
                    $a.html($.doI18n(titles[i].txt));
                    $a.attr("url", titles[i].dst);
                    $a.attr("param", JSON.stringify(titles[i].param));
                    $a.on('click', function () {
                        $.loadPage($(this).attr("url"), JSON.parse($(this).attr(
                            "param")), $("#container"));
                        $.setBreadCrumb([{
                            dst: $(this).attr("url"),
                            param: $(this).attr("param"),
                            txt: $(this).html()
                        }])
                    });
                    $titleBox.append($a);
                    $li.append($titleBox);
                    $iconBox.append($i);
                    $li.append($iconBox);
                }
                $(".breadcrumb-list").append($li);
            }
        }
        else {
            var $backDom = $("<li><span class='color-blue pr10 hand' name='back'><svg class='icon fs18' aria-hidden='true'><use xlink:href='#icon-fanhui'></use></svg></span><span class='pl10' style='border-left: 1px solid #E9ECEF;'>" + titles[1].txt + "</span><li>");
            $(".breadcrumb-list").append($backDom);
            var lastIndex = parseInt(isBack) - 1;
            $backDom.find('span[name=back]').on("click", function () {
                $.loadPage(titles[lastIndex].dst, titles[lastIndex].param, $("#container"));
                $.setBreadCrumb([{
                    dst: titles[lastIndex].dst,
                    param: titles[lastIndex].param,
                    txt: titles[lastIndex].txt
                }])
            })

        }
    },
    clearIntervals: function () {
        $.each(window.intervals, function (index, interval) {
            window.clearInterval(interval);
        });
        window.intervals.length = 0;
    },
    setCookie: function (c_name, value, expiredays, path) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value)
            + ((expiredays == null) ? "" : "; expires="
                + exdate.toGMTString());
    },
    getCookie: function (name) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (arr[0] == name) {
                return arr[1];
            }
        }
        return "";
    },
    serializeJson: function (formData) {
        var param = {};
        $.each(formData, function (i, field) {
            if (undefined != param[field.name]) {
                param[field.name] = param[field.name] + "," + field.value;
            } else {
                param[field.name] = field.value;
            }
        });
        return param;
    },
    getByteSize: function (value, unit) {
        if (unit == "KB") {
            value = value * 1024;
        } else if (unit == "MB") {
            value = value * 1024 * 1024;
        } else if (unit == "GB") {
            value = value * 1024 * 1024 * 1024;
        } else if (unit == "TB") {
            value = value * 1024 * 1024 * 1024 * 1024;
        } else if (unit == "PB") {
            value = value * 1024 * 1024 * 1024 * 1024 * 1024;
        }
        return value;
    },
    formatSizeStr: function (value) {
        var size = 0;
        if (value >= 1024 * 1024 * 1024 * 1024 * 1024) {
            size = (Math.round(value * 100 /
                (1024 * 1024 * 1024 * 1024 * 1024)) / 100)
                .toString() +
                'PB';
        } else if (value >= 1024 * 1024 * 1024 * 1024) {
            size = (Math.round(value * 100 /
                (1024 * 1024 * 1024 * 1024)) / 100)
                .toString() +
                'TB';
        } else if (value >= 1024 * 1024 * 1024) {
            size = (Math.round(value * 100 /
                (1024 * 1024 * 1024)) / 100).toString() +
                'GB';
        } else if (value >= 1024 * 1024) {
            size = (Math.round(value * 100 /
                (1024 * 1024)) / 100).toString() +
                'MB';
        } else if (value >= 1024) {
            size = (Math.round(value * 100 /
                (1024)) / 100).toString() +
                'KB';
        } else {
            size = (Math.round(value * 100) / 100).toString() +
                'B';
        }
        return size;
    },
    dateFormat: function (timestamp, mask) {
        var d = new Date(parseInt(timestamp));
        var zeroize = function (value, length) {
            if (!length)
                length = 2;
            value = String(value);
            for (var i = 0, zeros = ''; i < (length - value.length); i++) {
                zeros += '0';
            }
            return zeros + value;
        };

        return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0) {
            switch ($0) {
                case 'd':
                    return d.getDate();
                case 'dd':
                    return zeroize(d.getDate());
                case 'ddd':
                    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr',
                        'Fri', 'Sat'][d.getDay()];
                case 'dddd':
                    return ['Sunday', 'Monday', 'Tuesday',
                        'Wednesday', 'Thursday', 'Friday',
                        'Saturday'][d.getDay()];
                case 'M':
                    return d.getMonth() + 1;
                case 'MM':
                    return zeroize(d.getMonth() + 1);
                case 'MMM':
                    return ['Jan', 'Feb', 'Mar', 'Apr', 'May',
                        'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
                        'Nov', 'Dec'][d.getMonth()];
                case 'MMMM':
                    return ['January', 'February', 'March',
                        'April', 'May', 'June', 'July',
                        'August', 'September', 'October',
                        'November', 'December'][d
                            .getMonth()];
                case 'yy':
                    return String(d.getFullYear()).substr(2);
                case 'yyyy':
                    return d.getFullYear();
                case 'h':
                    return d.getHours() % 12 || 12;
                case 'hh':
                    return zeroize(d.getHours() % 12 || 12);
                case 'H':
                    return d.getHours();
                case 'HH':
                    return zeroize(d.getHours());
                case 'm':
                    return d.getMinutes();
                case 'mm':
                    return zeroize(d.getMinutes());
                case 's':
                    return d.getSeconds();
                case 'ss':
                    return zeroize(d.getSeconds());
                case 'l':
                    return zeroize(d.getMilliseconds(), 3);
                case 'L':
                    var m = d.getMilliseconds();
                    if (m > 99)
                        m = Math.round(m / 10);
                    return zeroize(m);
                case 'tt':
                    return d.getHours() < 12 ? 'am' : 'pm';
                case 'TT':
                    return d.getHours() < 12 ? 'AM' : 'PM';
                case 'Z':
                    return d.toUTCString().match(/[A-Z]+$/);
                default:
                    return $0.substr(1, $0.length - 2);
            }
        });
    },
    loading: function () {
        var loadContainer = $("<div class='loading-container'><div style='display:table-cell;vertical-align:middle;'><div class='m0a tac pt10' style='width:100px;height:100px;background-color: #000;border-radius:8px;'><img src='" + require("@/views/LoongUI/frame/image/loading.gif") + "'><div class='tac fs14 cf'>" + $.doI18n("loading") + "</div></div></div></div>");
        $(".loading-body").append(loadContainer);
    },
    clearLoading: function () {
        setTimeout(function () {
            $(".loading-body").empty();
        }, 100);
    },
    transformToHour: function (time) {
        var hModel = 1000 * 60 * 60,
            mModel = 1000 * 60;
        var hour = parseInt(time / hModel),
            minute = parseInt((time % hModel) / mModel),
            timeStr = hour + $.doI18n("public_hour") + minute + $.doI18n("public_minute");
        return timeStr;

    },
    getUtil: function (url) {
        var util;
        $.ajax({
            url: url,
            async: false
        }).done(function (data) {
            util = data;
        }).fail(function () {
            console.error('get util fail:' + url);
        });
        return eval(util);
    },
    uniqueArray: function (array) {
        var temp = [];
        for (var i = 0; i < array.length; i++) {
            if (array.indexOf(array[i]) == i) {
                temp.push(array[i])
            }
        }
        return temp;
    },
    /*formDownload: function(opt){
        if (opt.action) {
            var downDom = $(newDom("div"))
            .append(
                $("<form target='blankIframe'></form>")
                .attr("action", opt.action)
                .attr("method", opt.method || 'post')
            ).append(
                newDom("iframe", {className: "dn", name: "blankIframe", src: "about:blank"})
            );
            for (var key in opt.data) {
                var input = newDom("input", {name: key, value: opt.data[key]});
                downDom.find("form").append(input);
            }
            downDom.appendTo('body');
            downDom.find("form").submit();
            downDom.remove();
        }
    },*/
    isObjectValueEqual: function (a, b) {
        if (typeof a == 'number' && typeof b == 'number') {
            return a == b
        }
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            if (Object.prototype.toString.call(a[propName]) == '[object Object]'
                || Object.prototype.toString.call(b[propName]) == '[object Object]') {
                var flag = isObjectValueEqual(a[propName], b[propName]);
                if (!flag) {
                    return flag;
                }
            } else if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    },
    formValid: function ($form) {
        $form.find("input,textarea").focus(function () {
            var input = $(this);
            var ret = $.loongValidateSingle(this);
            showValid($form, input, ret);
        });
        $form.find("input,textarea").keyup(function () {
            var input = $(this);
            var ret = $.loongValidateSingle(this);
            showValid($form, input, ret);
        });
        $form.find("input,textarea").blur(function () {
            var input = $(this);
            var ret = $.loongValidateSingle(this);
            showValid($form, input, ret);
            input.parent().find(".err-tip").remove();
        });
        $(window).off('scroll.rmTip resize.rmTip').on("scroll.rmTip resize.rmTip", function () {
            $('body').find(".err-tip").remove();
        });
        $(".scroll-page").off('scroll').on('scroll', function () {
            $('body').find(".err-tip").remove();
        });
    },
    newDom: function (type, attr) {
        var e = document.createElement(type);
        if (attr) {
            for (var p in attr) {
                var startStr = p.indexOf("data-");
                if (startStr === 0 || p === "name" || p === "style") {
                    e.setAttribute(p, attr[p]);
                } else {
                    e[p] = attr[p];
                }
            }
        }
        return e;
    }
});

function newDom(type, attr) {
    var e = document.createElement(type);
    if (attr) {
        for (var p in attr) {
            var startStr = p.indexOf("data-");
            if (startStr === 0 || p === "name" || p === "style") {
                e.setAttribute(p, attr[p]);
            } else {
                e[p] = attr[p];
            }
        }
    }
    return e;
}

function svgElement(href, className) {
    var $svg = $("<svg class='icon " + className + "'><use xlink:href=''></use></svg>");
    $svg.find("use").attr("xlink:href", href);
    return $svg;
}

//深度克隆
function deepClone(obj) {
    var result, oClass = isClass(obj);
    if (oClass === "Object") {
        result = {};
    } else if (oClass === "Array") {
        result = [];
    } else {
        return obj;
    }
    for (key in obj) {
        var copy = obj[key];
        if (isClass(copy) == "Object") {
            result[key] = arguments.callee(copy);//递归调用
        } else if (isClass(copy) == "Array") {
            result[key] = arguments.callee(copy);
        } else {
            result[key] = obj[key];
        }
    }
    return result;
}

//返回传递给他的任意对象的类
function isClass(o) {
    if (o === null) return "Null";
    if (o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8, -1);
}

function checkIsIP(ip) {
    var ipv4 = new RegExp(/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/);
    var r = ip.match(ipv4);
    if (r != null) {
        return true;
    } else {
        return false;
    }

}
function checkIsPath(path) {
    // var  flag = false;
    // var  lPath = new RegExp(/(^\/([^\\\:\*\?\"\<\>\|]+))+$/);
    // var  lPathFlag = lPath.test(path)&& path.split("//",-1).length == 1&&path!=="/."&&path!=="/..";
    // if(lPathFlag||path == "/"){
    //     flag = true;
    // }
    // return flag;
    var flag = true;
    var lPath = new RegExp(/^[^\\\:\*\?\'\"\<\>\|]+$/);
    if (!lPath.test(path) || path.split("//").length > 1 || path === "." || path === "..") {
        flag = false;
    } else {
        var dirs = path.split("/");
        for (var i = 0; i < dirs.length; i++) {
            if (dirs[i] === "." || dirs[i] === "..") {
                flag = false;
                break;
            }
        }
    }
    return flag;
}

function singleValid($form, input) {
    var ret = $.loongValidateSingle(input);
    showValid($form, input, ret);
    return ret.hasError;
}
function showValid($form, input, ret) {
    var result = ret.result,
        errlogo = $("<span class='err-logo cblue'><svg class='icon' aria-hidden='true'><use xlink:href='#icon-xinxi'></use></svg></span>");
    if (ret.hasError) {
        if (undefined != result) {
            var flag = createErrTip(input, result);
            if (!flag) {
                input.parent().find(".err-logo").remove();
                input.after(errlogo);
                if (undefined == input.val() || "" == input.val()) {
                    errlogo.removeClass('cred').addClass('cblue');
                } else {
                    errlogo.removeClass('cblue').addClass('cred');
                }
                var padLeft = parseInt(input.parent().css('padding-left')),
                    padTop = parseInt(input.parent().css('padding-top'));
                var logoTop = (input.outerHeight() - errlogo.outerHeight()) / 2 + padTop,
                    logoLeft = input.outerWidth() - errlogo.outerWidth() + padLeft;
                if (input.get(0).scrollHeight > input.outerHeight()) {
                    logoLeft -= 12;
                }
                input.parent().find(".err-logo").css({
                    "top": logoTop + 'px',
                    "left": logoLeft + 'px'
                });
                setTipPosition(input);
            }
        }
    } else {
        input.removeClass("valid-err-input valid-none-input");
        input.parent().find(".err-logo").remove();
        input.parent().find(".err-tip").remove();
    }
    input.parent().find(".err-logo").mouseover(function (event) {
        createErrTip(input, result);
        setTipPosition(input);
    });
    input.parent().find(".err-logo").mouseout(function (event) {
        input.parent().find(".err-tip").remove();
    });
}
function createErrTip(input, result) {
    input.parent().find(".err-tip").remove();
    var flag = true, errtip = $("<div class='err-tip'><em class='em'></em><span class='span'></span><ul></ul></div>");
    $.each(result, function (key, value) {
        if (result[key].valid === false) {
            flag = false;
            var errli = $("<li>" + value.message + "</li>");
            errtip.find("ul").append(errli);
            if (undefined == input.val() || "" == input.val()) {
                errtip.removeClass('cred').addClass('c6');
                input.removeClass("valid-err-input").addClass('valid-none-input');
            } else {
                errtip.removeClass('c6').addClass('cred');
                input.removeClass("valid-none-input").addClass("valid-err-input");
            }
            input.parent().append(errtip);
        }
    });
    return flag;
}
function setTipPosition(input) {
    var tipH = input.parent().find(".err-tip").outerHeight(),
        tipW = input.parent().find(".err-tip").outerWidth(),
        inputH = input.height(),
        inputW = input.outerWidth();
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft,
        scrollY = document.documentElement.scrollTop || document.body.scrollTop,
        x = input.parent().offset().left + scrollX,
        y = input.offset().top + scrollY;
    var padLeft = parseInt(input.parent().css('padding-left'));
    var top = y + (inputH - tipH) / 2,
        left = x + inputW + padLeft + 10;
    input.parent().find(".err-tip").css({ "top": top, "left": left });
}
/* scroll-page valid */
function scrollValid($form) {
    var ret = $.loongValidate($form);
    if (ret.hasError) {
        var div = ret.element;
        var isIn = isEleInView(div);
        if (!isIn) {
            $(div).get(0).scrollIntoView();
            setTimeout(function () {
                showValid($form, div, ret);
            }, 100);
        } else {
            showValid($form, div, ret);
        }
        return false;
    }
    return true;
}
function isEleInView(dom) {
    var $scrollPage = $(dom).closest(".scroll-page");
    var $ele = $(dom);
    var offsetTopIn = $ele.offset().top - $scrollPage.offset().top;
    var divScrollTop = $scrollPage.scrollTop();
    var divHeight = $scrollPage.get(0).clientHeight;
    if (offsetTopIn >= 0 && offsetTopIn <= divScrollTop + divHeight) {
        return true;
    } else {
        return false;
    }
}
export function formaterTitle(title) {
    var newStr = "";
    if (title) {
        newStr = title.replace(/[^\x00-\xff]/g, "$&\x01").replace(/.{50}\x01?/g, "$&\n").replace(/\x01/g, "");
    }
    return newStr;
}

Number.prototype.toFixedClear = function (num) {
    var numStr = this + "";
    var numResult = "";
    if (numStr.indexOf(".") !== -1) {
        var potIndex = numStr.indexOf(".");
        if (num !== 0) {
            numResult = numStr.substring(0, potIndex + num + 1);
        } else {
            numResult = numStr.substring(0, potIndex);
        }
    } else {
        numResult = numStr;
        if (num !== 0) {
            numStr = numStr + ".";
            for (var i = 0; i < num; i++) {
                numStr = numStr + "0";
            }
        }
    }
    return parseFloat(numResult);
}

export function formatDate(timestamp, mask) {
    var d = new Date(parseInt(timestamp));
    var zeroize = function (value, length) {
        if (!length)
            length = 2;
        value = String(value);
        for (var i = 0, zeros = ''; i < (length - value.length); i++) {
            zeros += '0';
        }
        return zeros + value;
    };

    return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0) {
        switch ($0) {
            case 'd':
                return d.getDate();
            case 'dd':
                return zeroize(d.getDate());
            case 'ddd':
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr',
                    'Fri', 'Sat'][d.getDay()];
            case 'dddd':
                return ['Sunday', 'Monday', 'Tuesday',
                    'Wednesday', 'Thursday', 'Friday',
                    'Saturday'][d.getDay()];
            case 'M':
                return d.getMonth() + 1;
            case 'MM':
                return zeroize(d.getMonth() + 1);
            case 'MMM':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May',
                    'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
                    'Nov', 'Dec'][d.getMonth()];
            case 'MMMM':
                return ['January', 'February', 'March',
                    'April', 'May', 'June', 'July',
                    'August', 'September', 'October',
                    'November', 'December'][d
                        .getMonth()];
            case 'yy':
                return String(d.getFullYear()).substr(2);
            case 'yyyy':
                return d.getFullYear();
            case 'h':
                return d.getHours() % 12 || 12;
            case 'hh':
                return zeroize(d.getHours() % 12 || 12);
            case 'H':
                return d.getHours();
            case 'HH':
                return zeroize(d.getHours());
            case 'm':
                return d.getMinutes();
            case 'mm':
                return zeroize(d.getMinutes());
            case 's':
                return d.getSeconds();
            case 'ss':
                return zeroize(d.getSeconds());
            case 'l':
                return zeroize(d.getMilliseconds(), 3);
            case 'L':
                var m = d.getMilliseconds();
                if (m > 99)
                    m = Math.round(m / 10);
                return zeroize(m);
            case 'tt':
                return d.getHours() < 12 ? 'am' : 'pm';
            case 'TT':
                return d.getHours() < 12 ? 'AM' : 'PM';
            case 'Z':
                return d.toUTCString().match(/[A-Z]+$/);
            default:
                return $0.substr(1, $0.length - 2);
        }
    });
}
/*
function createMission(json){
    var arrRig = "/LoongUI/public/image/arrow-rig.png",
        arrBot = "/LoongUI/public/image/arrow-bot.png";
    var INIT_PER = "0%", INIT_VAL = "0", INIT_FIN = $.doI18n("global_finish");
    if($(".global-mission").hasClass("dn")){
        $(".global-mission").removeClass("dn");
    }
    var $item;
    var lis = $(".global-mission .mission-panel").find(".mission-li");
    for(var i = 0; i < lis.length; i++){
        if(($(lis[i]).data("type") == json.type)){
            if($(lis[i]).data("status") != 2){
                 $(lis[i]).remove();
            }else{
                $item = $(lis[i]);
            }
            break;
        }
    }
    if($item == undefined){
        $item = $(newDom("div",{className:'mission-li'}));
        var $missionHeader = $(newDom("div",{className:'global-header-wrap clearfix'}))
                             .append($(newDom("img",{src:arrRig})))
                             .append($(newDom("span",{className:'mission-title ml5'})))
                             .append($(newDom("span",{className:'mission-percent ml5',innerHTML:'(<span></span>)'})))
                             .append($(newDom("span",{name:'missonDetail',className:'fs16 fr mr10'})).append(svgElement("#icon-chakanxiangqing"))),
            $missionBody = $(newDom("div",{className:'global-body-con clearfix'}))
                            .append($(newDom("div",{className:'global-left'})).append($(newDom("div",{className:'global-left-percent'}))))
                            .append($(newDom("div",{className:'global-mid'})).append($(newDom('div',{className:'global-mid-title'}))).append($(newDom('div',{className:'global-mid-num'}))))
                            .append($(newDom('div',{className:'global-right'})).append($(newDom('div',{className:'global-right-title'}))).append($(newDom('div',{className:'global-right-num'}))));
        $item.append($missionHeader).append($missionBody);
        $item.data("type",json.type);
        $item.find(".mission-title").html(json.txt);
        $item.find(".mission-percent span").html(INIT_PER);
        $item.find(".global-mid-title").html(json.subTxt);
        $item.find(".global-right-title").html(INIT_FIN);
        $item.find(".global-mid-num,.global-right-num").html(INIT_VAL);
        $item.find(".global-left-percent").loongProgress({
            isColor:false,
            color:"#1188dd",
            slideHeight:4,
            value: INIT_PER,
            size:68,
            fontSize:'18px',
            txtPosition:'center',
            fontFamily:'PingFangSC-Medium',
            txt: INIT_PER
        });
        $(".global-mission").find(".mission-panel").append($item);
    }
    $item.find(".global-body-con").show();
    $item.addClass('expand');
    $item.find("img").attr("src",arrBot);
    $item.siblings('.mission-li').find('.global-body-con').css('display', 'none');
    $item.siblings('.mission-li').removeClass('expand');
    $item.siblings('.mission-li').find('img').attr("src",arrRig);
    $item.find(".global-header-wrap").unbind("click").on("click","img", function(event){
        if ($item.hasClass("expand")) {//展开状态
            $item.removeClass("expand");
            $(this).attr("src",arrRig);
            $item.find(".global-body-con").stop(true,true).slideUp(400);
        }else{
            $item.addClass("expand");
            $(this).attr("src",arrBot);
            $item.find(".global-body-con").stop(true,true).slideDown(400);
            $item.siblings().removeClass("expand");
            $item.siblings().find(".global-body-con").stop(true,true).slideUp();
            $item.siblings().find("img").attr("src",arrRig);
        }
        event.stopPropagation();
    });
    return $item;
}
function countMission(){
    //0:error,1:success 2:doing 3: cancle
    var CLOSE = $.doI18n("global_close"), FLOD = $.doI18n("global_flod"), FAIL = $.doI18n("global_fail"), FINISH = $.doI18n("global_finish"), MISSION = $.doI18n("global_mission");
    var tabErr = "/LoongUI/public/image/tab-error.gif",
        tabFin = "/LoongUI/public/image/tab-finished.png",
        tabDo = "/LoongUI/public/image/tab.gif";
    if(!$(".global-mission").hasClass("dn")){
        var $lis = $(".global-mission .mission-li"),
            errorNum = 0,
            rightNum = 0,
            $tab = $(".global-mission .mission-total"),
            $btn = $(".global-mission .collapse-btn");
        $.each($lis, function(index,item){
            if($(item).data("status") == "0"){
                errorNum = errorNum + 1;
            }
            if($(item).data("status") == "1" || $(item).data("status") == "3"){
                rightNum = rightNum + 1;
            }
        });
        if(errorNum != 0){
            $btn.html(FLOD);
            $tab.find("img").attr("src",tabErr);
            $tab.find(".mission-num").removeClass('color-blue').addClass("color-red").html(errorNum);
            $tab.find(".mission-desc div").last().removeClass('color-green').addClass('color-red').html(FAIL);
        }else{
            if($lis.length == rightNum){
                $btn.html(CLOSE);
                $tab.find("img").attr("src",tabFin);
                $tab.find(".mission-num").html("");
                $tab.find(".mission-desc div").last().addClass('color-green').html(FINISH);
            }else{
                $btn.html(FLOD);
                $tab.find("img").attr("src",tabDo);
                var cur = $lis.length - errorNum - rightNum;
                $tab.find(".mission-num").removeClass('color-red').addClass("color-blue").html(cur);
                $tab.find(".mission-desc div").last().removeClass('color-red color-green').html(MISSION);
            }
        }
    }
}
*/

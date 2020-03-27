export var configJson = [
    {
        "name": "loongStore",
        "path": "views/StoreUI/lib/config.js",
        "i18n": "views/StoreUI/i18n/storeUI"
    },
    {
        "name": "loongCloud",
        "path": "views/CloudUI/lib/config.js",
        "i18n": "views/CloudUI/i18n/cloudUI"
    },
    {
        "name": "loongDisk",
        "path": "views/DiskUI/lib/config.js",
        "i18n": "views/DiskUI/i18n/diskUI"
    },
    {
        "name": "loongKeeper",
        "path": "views/KeeperUI/lib/config.js",
        "i18n": "views/KeeperUI/i18n/keeperUI"
    },
    {
        "name": "publicModule",
        "path": "views/LoongUI/public/js/config.js",
        "i18n": "views/LoongUI/public/i18n/public"
    }
];

var guideJson = {
    // "tipShow" : ["main","wrap"]
    "tipShow": ["wrap"]
};
var modalJson = {
    "loongStore": [{ role: "admin", code: 0 }, { role: "guest", code: 3 }],
    "loongCloud": [{ role: "admin", code: 0 }, { role: "guest", code: 3 }, { role: "tenant", code: 11 }, { role: "user", code: 10 }],
    "loongDisk": [{ role: "admin", code: 0 }, { role: "guest", code: 3 }, { role: "orgadmin", code: 16 }, { role: "ad_user", code: 18 }],
    "loongKeeper": [{ role: "admin", code: 0 }, { role: "guest", code: 3 }],
    "publicModule": [{ role: "admin", code: 0 }, { role: "guest", code: 3 }]
};
export var allModule = initConfig();

setLanguage();

export function setLanguage() {
    var language = navigator.language ? navigator.language : navigator.browserLanguage,
        str;
    if (language.indexOf("zh") > -1) {
        str = "zh";
    } else {
        str = "en";
    }
    window.sessionStorage.setItem('language', str);
    return str;
}

async function initConfig() {
    var allModules = [];
    for (var i = 0; i < configJson.length; i++) {
        var path = configJson[i].path;
        await import(`@/${path}`);
        allModules.push(window.loongData);
    }
    return allModules;
}

export function getUserRoles(user, modal) {
    var userType = {};
    $.$ajax({
        url: "/api/utility/user/get",
        type: "post",
        cache: false,
        async: false,
        data: {
            username: user
        },
        success: function (data) {
            data = data.data;
            var roles = data.roles.toString(2).split("").reverse().join("");
            var obj = modalJson[modal];
            for (var i = 0; i < obj.length; i++) {
                var bits = obj[i].code;
                var keys = obj[i].role;
                if (roles[bits] == "1") {
                    userType[keys] = true;
                } else {
                    userType[keys] = false;
                }
            }
            if (userType.guest) {
                userType.admin = true;
            }
            window.sessionStorage.setItem(modal, JSON.stringify(userType));
        }
    });
    return userType;
}

var loongTable_i18n = {
    "zh":{
        operation:"操作",
        no_data:"暂无数据",
        page_first:"首页",
        page_pre:"上一页",
        page_next:"下一页",
        page_last:"末页",
        page_jump:"跳转",
        loading:"加载中",
        pics_page:"条/页",
        total_data:"共",
        article_data:"条"
    },
    "en": {
        operation:"Operation",
        no_data:"No Data",
        page_first:"first",
        page_pre:"prev",
        page_next:"next",
        page_last:"last",
        page_jump:"jump",
        loading:"loading",
        pics_page:"items/page",
        total_data:"A total of ",
        article_data:" articles"
    }
}

export var tableI18n = function(code) {
    var lang = window.sessionStorage.language;
    if(lang){
        return loongTable_i18n[lang][code];
    }
}


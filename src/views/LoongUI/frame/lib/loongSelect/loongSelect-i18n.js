var loongSelect_i18n = {
    "zh":{
         noResult: "无匹配数据",
         search: "过滤搜索",
         noData: "暂无数据"
    },
    "en": {
        noResult: "No Result",
        search: "Search",
        noData: "No Data"
    }
}

var selectI18n = function(code) {
    var lang = window.sessionStorage.language || "zh";
    if(lang){
        return loongSelect_i18n[lang][code];
    }
};

export var select_text = {};

 (function($){
    select_text.noResult = selectI18n("noResult");
    select_text.search = selectI18n("search");
    select_text.noData =  selectI18n("noData");

 })(jQuery);
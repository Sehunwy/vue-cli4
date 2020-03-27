//@ sourceURL= loongTable.js
import {tableI18n} from "@/views/LoongUI/frame/lib/loongTable/loongTable-i18n.js";
(function($) {
    $.fn.loongTable = function (options) {
        var config = $.extend({
            height: "auto",
            fields: [],
            hasCheckbox: true,
            hasRadio: false,
            ajaxData: false,
            url: "",
            pageSize: 20,
            limits: [10, 20, 30, 40, 50],
            params: {},
            method: "post",
            async: true,
            data: [],
            pagination: false,
            callBack: "",
            key:"",
            hasMemory: false,
            hasLoading:false,
            overflowTips: false,
            haveStorage:false
        }, options);
        var $container = $(this);
        var loongTable = new LoongTable();
        loongTable.init($container, config);
        return loongTable;
    };

    function LoongTable() {
        this.checkedIndex = [];
        this.rowData = [];
        this.totalNum = 0;
        this.curPage = 1;
        this.totalPage = 0;
        this.pageSize = 0;
        this.memoryData = [];
        this.memoryKey = [];

    }

    var formatData = function (str) {
        return parseInt(str);
    };
    var dateFormat = function (timestamp, mask) {
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
    };

    LoongTable.prototype = {
        init: function ($container, config) {
            this.$container = $container;
            this.config = config;
            var self = this;
            $("body").find(".loongui-tip-move").remove();
            if ($container.find(".loong-table").length > 0){
                $container.find(".loong-table").remove();
            }
            var $table = $("<div class='loong-table'><div class='table-content-wrap'><table class='loongUI-table'><tbody></tbody></div></div>");
            $container.append($table);
            $(window).on("resize",{self:self},function () {
                if ($("body").find(".loong-table").length > 0) {
                    self.resize($container.find(".table-content-wrap"), config);
                }
            });
            this.setHeader($container, config);
            this.setTableHeight($container.find(".table-content-wrap"), config);
            if (config.ajaxData) {
                self.pageSize = config.pageSize;
                if(config.haveStorage&&window.sessionStorage.getItem("loongTablePageNum")){
                    this.getData($container, config, this.pageSize, window.sessionStorage.getItem("loongTablePageNum"));   
                }
                else{
                    this.getData($container, config, this.pageSize, 1);
                }
            } else {
                this.rowData = config.data.slice(0);
                // this.setTableHeight($container.find(".table-content-wrap"), config);
                this.listData($container, config, this.rowData);
                if(typeof this.config.callBack == 'function'){
                   this.config.callBack(this.rowData);
                }

            }
        },
        setHeader: function ($container, config) {
            var $tableHead = $("<div class='table-header-wrap'><table class='loongUI-table'><thead></thead></table></div>");
            var $tr = $("<tr class='table-header'></tr>");
            var tableCols = config.fields;
            if (config.hasCheckbox) {
                $tr.append("<th class='checkbox-col'></th>");
                this.initCheckbox($tr);
                $container.find(".loong-table").addClass("checkbox-table");
            }
            if(config.hasRadio){
                $tr.append("<th class='radio-col'></th>");
                $container.find(".loong-table").addClass("single-table");
            }
            for (var i = 0; i < tableCols.length; i++) {
                var $th = $("<th class='has-split'></th>");
                if('function' == typeof config.fields[i].headFormater){
                    $th.append(config.fields[i].headFormater());
                }else{
                    $th.html(config.fields[i].title);
                }
                $th.attr("data-key", config.fields[i].name);
                if (undefined !== tableCols[i].width) {
                    $th.css("width", formatData(tableCols[i].width) + 'px');
                }
                if (false == tableCols[i].visible) {
                    $th.attr("data-visible", false);
                }
                $tr.append($th);
            }
            var firstTh = $tr.find("th:not( .checkbox-col,.radio-col,[data-visible])").eq(0);
            firstTh.removeClass("has-split");
            if (config.hasCheckbox || config.hasRadio) {
                firstTh.css('padding-left', '10px');
            }else{
                firstTh.css('padding-left', '30px');
            }
            $tableHead.find("thead").append($tr);
            $container.find(".loong-table").prepend($tableHead);
        },
        listData: function ($container, config, data) {
            var self = this,trsArr = [];
            $container.find(".table-header-wrap .checkbox").removeClass("checkbox-selected");
            $container.find(".table-content-wrap tbody").empty();
            this.checkedIndex.length = 0;
            var tableCols = config.fields;
            if ( data == undefined || data.length == 0) {
                var len = tableCols.length;
                var noData = new Image();
                noData.src = require("@/views/LoongUI/frame/lib/loongTable/img/noData.png");
                $container.find("tbody").append(
                    $("<div class='loongUI-table-nodata'><img src=" + noData.src +"><p class='nodata-txt'>"+tableI18n('no_data')+"</p></div>"));
                return;
            }
            for (var i = 0; i < data.length; i++) {
                var $tr = $("<tr class='table-content-row'></tr>");
                $tr.attr("data-index", i);
                if (config.hasCheckbox) {
                    $tr.append($("<td class='checkbox-col'></td>"));
                    this.initCheckbox($tr);
                    if(config.hasMemory){
                       if ($.inArray(data[i][config.key],this.memoryKey)>-1){
                           this.checkedIndex.push(i);
                           $tr.addClass("row-selected");
                       }

                    }
                }else if(config.hasRadio){
                    $tr.append($("<td class='radio-col'></td>"));
                    this.initRadio($tr);
                }
                for (var j = 0; j < tableCols.length; j++) {
                    var $td = $("<td class='has-split'></td>"),
                        colsName = tableCols[j].name;
                    if (false == tableCols[j].visible) {
                        $td.attr("data-visible", false);
                    }
                    if(true == tableCols[j].hasClick){
                        $td.addClass("has-click");
                    }
                    if (undefined !== tableCols[j].width) {
                        $td.css("width", formatData(tableCols[j].width) + 'px');
                    }
                    if (tableCols[j].type == 'data' || tableCols[j].type == undefined) {
                        if ('function' == typeof tableCols[j].formater) {
                            $td.append(tableCols[j].formater(data[i][colsName], data[i],i));
                        } else if ('dateFormat' == tableCols[j].formater && tableCols[j].pattern) {
                            $td.append(dateFormat(data[i][colsName], tableCols[j].pattern));
                        } else {
                            if (true == tableCols[j].overflowEllipsis) {
                                $td.addClass("toe");
                                var title =  data[i][colsName];
                                var newStr = "";
                                if(title && title !== ""){
                                   title = title.toString();
                                   newStr = title.replace(/[^\x00-\xff]/g,"$&\x01").replace(/.{50}\x01?/g,"$&\n").replace(/\x01/g,"");
                                }
                                $td.attr("title",newStr);
                            }else if(true == tableCols[j].overflowTips){
                                $td.addClass("toe");
                                this.tdOverflowEvent($container,$td,data[i][colsName]);
                            }
                            $td.html(data[i][colsName]);

                        }
                    } else if (tableCols[j].type == 'button') {
                        var buttons = [];
                        if ('function' == typeof tableCols[j].formater) {
                            buttons = tableCols[j].formater(i,data[i]);
                        } else {
                            buttons = tableCols[j].operations
                        }
                        for (var k = 0; k < buttons.length; k++) {
                            var style =  buttons[k].style ? buttons[k].style : "";
                            var $btn = $("<div class='loongTable-btn' title='"+buttons[k].text +"' style='" + buttons[k].style +"'><svg class='icon icon-btn fs16' aria-hidden='true'><use xlink:href="+buttons[k].icon+"></use></svg></div>");
                            $td.addClass("table-operation");
                            $td.append($btn);
                            $btn.on("click", {"callBack": buttons[k].callBack, "index": i}, function (e) {
                                e.data.callBack(e.data.index,self.rowData[e.data.index]);
                            });
                        }
                    }
                    $tr.append($td);

                }
                var firstTd = $tr.find("td:not( .checkbox-col,.radio-col,[data-visible])").eq(0);
                firstTd.removeClass("has-split");
                if (config.hasCheckbox || config.hasRadio) {
                    firstTd.css('padding-left', '10px');
                }else{
                    firstTd.css('padding-left', '30px');
                }
                // $container.find(".table-content-wrap tbody").append($tr);
                trsArr.push($tr[0]);
            }
            $container.find(".table-content-wrap tbody").append(trsArr);
            if(config.hasMemory){
                if($container.find(".loongUI-table .row-selected").length == this.pageSize){
                    $container.find(".table-header .checkbox").addClass("checkbox-selected");
                }
            }
            this.initScrollBar();
            this.rowClick($container, config);


        },
        tdOverflowEvent: function($container,$td,title) {
            var iconExpand = function(hide){
                var othis = $(this);
                if(hide){
                    othis.find(".loong-table-down-icon").remove();
                }else if(othis.prop("scrollWidth") > othis.outerWidth()){
                    if(othis.find(".loong-table-down-icon")[0]) return;
                    othis.append("<div class='loong-table-down-icon'><svg class='icon' aria-hidden='true'><use xlink:href='#icon-jiantouxia'></use></svg></div");
                    othis.find(".loong-table-down-icon").on("click",function(event){
                        $(".loongui-tip-move").remove();
                        var $tipsContainer = $("<div class='loongui-tip-move'></div>");
                        var $tipsInner = $("<div class='down-tips-inner'>"+title+"</div>");
                        var $tipsArrow = $("<div class='down-tips-arrow'><svg class='icon' aria-hidden='true'><use xlink:href='#icon-shanchu1'></use></svg></div>");
                        $tipsInner.css("max-width",$td.outerWidth());
                        $tipsContainer.append($tipsArrow);
                        $tipsContainer.append($tipsInner);
                        $("body").append($tipsContainer);
                        var tipH = $(".loongui-tip-move").outerHeight(),
                            tipW =  $(".loongui-tip-move").outerWidth(),
                            domH = othis.outerHeight(),
                            domW = othis.outerWidth();
                        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft,
                            scrollY = document.documentElement.scrollTop || document.body.scrollTop,
                            x = othis.offset().left+scrollX, y = othis.offset().top+scrollY,
                            top = y, left = x - tipW + domW;
                        event.stopPropagation();
                        $(".loongui-tip-move").css({"top":top,"left":left}); 
                        $tipsArrow.click(function(){
                            $tipsContainer.remove();
                        })
                    })
                }
            }
            $td.on("mouseenter", function(){
                iconExpand.call(this);
            }).on("mouseleave", function(){
                iconExpand.call(this, "hide");
            })
        },
        getData: function ($container, config, pageSize, num,fn) {
            $container.find(".table-content-wrap").scrollTop(0);
            var self = this;
            this.curPage = num;
            var param = config.params;
            if (config.pagination) {
                param.pageSize = pageSize;
                param.pageNum = num;
                if(config.haveStorage){
                    window.sessionStorage.setItem("loongTablePageNum",num);
                }
            }
            $.$ajax({
                type: config.method,
                url: config.url,
                data: param,
                cache: false,
                async: config.async,
                beforeSend:function(){
                    if(config.async == true && config.hasLoading == true){
                         self.addLoading($container);
                    }
                },
                success: function (json) {
                    if(json.error){
                        self.rowData = [];
                    }else{
                        if (config.pagination) {
                            self.totalNum = json.data.total;
                            self.rowData = json.data.rows;
                            self.curPage = json.data.pageNum;
                            if (self.rowData.length > 0) {
                                self.initPagination($container, config, pageSize,self.curPage);
                            } else if(self.rowData.length == 0 && self.curPage != 1){
                                self.getData($container, config, pageSize, self.curPage - 1, fn);
                            }

                        } else {
                            self.rowData = json.data || [];
                        }
                    }
                    self.setTableHeight($container.find(".table-content-wrap"), config);
                    self.listData($container, config, self.rowData);
                    if(typeof self.config.callBack == 'function'){
                        self.config.callBack(self.rowData);
                    }
                    if(typeof fn == 'function'){
                        fn();
                    }

                },
                complete: function(xhr, status) {
                    if(config.async == true && config.hasLoading == true){
                         self.removeLoading($container);
                    }
                }
            })
        },
        initCheckbox: function ($wrap) {
            var self = this;
            var $checkBox = $("<div class='checkbox'><svg class='icon' aria-hidden='true'><use xlink:href='#icon-gou'></use></svg><input type='checkbox' class='checkbox-input'></div>");
            $wrap.find(".checkbox-col").append($checkBox);
            $checkBox.on("click", function () {
                self.checkboxClick(self,$(this));

            });
        },
        checkboxClick: function(self,$dom){
            var checkedIndex = self.checkedIndex;
            var $table = $dom.parents(".loong-table");
            var _self = this;
            if ($dom.parents(".table-header").length > 0) {
                if ($dom.hasClass("checkbox-selected")) {
                    $dom.removeClass("checkbox-selected");
                    $table.find(".table-content-row").removeClass("row-selected");
                    checkedIndex.length = 0;
                    if(this.config.hasMemory){
                        for(var i=0;i<this.pageSize;i++){
                            this.setMemory(i,0);
                        }
                    }

                } else {
                    $dom.addClass("checkbox-selected");
                    $table.find(".table-content-row").each(function () {
                        $(this).addClass("row-selected");
                        var index = $(this).attr("data-index");
                        if($.inArray(index,checkedIndex) == -1){
                            checkedIndex.push(index);
                            if(self.config.hasMemory){
                                self.setMemory(index,1);
                            }
                        }
                    });

                }

            } else if ($dom.parents(".table-content-row").length > 0) {
                var $curRow = $dom.parents(".table-content-row");
                if ($curRow.hasClass("row-selected")) {
                    $curRow.removeClass("row-selected");
                    checkedIndex.splice($.inArray($curRow.attr("data-index"), checkedIndex), 1);
                    if(this.config.hasMemory){
                        setMemory($curRow.attr("data-index"),0);
                    }
                    if ($table.find(".table-header .checkbox").hasClass("checkbox-selected")) {
                        $table.find(".table-header .checkbox").removeClass("checkbox-selected");
                    }
                } else {
                    $curRow.addClass("row-selected");
                    checkedIndex.push($curRow.attr("data-index"));
                    if(this.config.hasMemory){
                        this.setMemory($curRow.attr("data-index"),1);
                    }
                    if (checkedIndex.length == $table.find(".table-content-row").length) {
                        $table.find(".table-header .checkbox").addClass("checkbox-selected");
                    }
                }

            }
        },
        initRadio: function($wrap){
            var self = this;
            var $radio = $("<div class='radio'><svg class='icon' aria-hidden='true'><use xlink:href='#icon-danxuanxuanzhong1'></use></svg><input type='radio' class='radio-input'></div>");
            $wrap.find(".radio-col").append($radio);
        },
        initPagination: function ($container, config, pageSize, num) {
            $container.find(".pager-box").remove();
            var $pagerBox = $("<div class='pager-box'><div class='pager-content clearfix'></div></div>");
            var $btnList = $("<div class='first-page-btn'><svg class='icon'><use xlink:href='#icon-diyiye'></use></svg></div><div class='pre-page-btn'><svg class='icon'><use xlink:href='#icon-shangyiye'></use></svg></div><div class='page-num'>" +
                "<span class='current-page'></span><span>/</span><span class='total-page'></span></div><div class='next-page-btn'><svg class='icon'><use xlink:href='#icon-xiayiye'></use></svg></div><div class='last-page-btn'><svg class='icon'><use xlink:href='#icon-zuihouyiye'></use></svg></div>");
            var $jumpBox = $("<div class='btn-split'></div><div class='jump-input'><input type='text' class='pl5' name='enter-jump'></div><div class='jump-btn'>"+tableI18n('page_jump')+"</div>");
            var $select = $("<div class='page-select-box'><select class='page-select'></select></div>");
            var $totalNum = $("<div class='total-num-box'>"+tableI18n('total_data')+this.totalNum+tableI18n('article_data')+"</div>");
             $jumpBox.find("input[name='enter-jump']").on('input',function(){
                this.value=this.value.replace(/\s|\D/g, '');
              
           })
           if(config.haveStorage&&window.sessionStorage.getItem("loongTablePageSize")){
            pageSize=window.sessionStorage.getItem("loongTablePageSize");
           }
            $.each(config.limits, function (i, val) {            
                var $option = $("<option value='" + val + "'>" + val + tableI18n('pics_page')+"</option>");
                if (pageSize == val) {
                    $option.attr("selected", "selected");
                }
                $select.find(".page-select").append($option);
            });
            var totalPageNum = Math.ceil(this.totalNum / pageSize);
            this.totalPage = totalPageNum;
            $pagerBox.find(".pager-content").append($btnList);
            $pagerBox.find(".page-num .current-page").html(num);
            $pagerBox.find(".page-num .total-page").html(totalPageNum);
            $pagerBox.find(".pager-content").append($jumpBox);
            $pagerBox.find(".pager-content").append($select);
            $pagerBox.find(".pager-content").append($totalNum);
            $container.find(".loong-table").append($pagerBox);
            this.setBtnDisabled($container);
            this.addPaginationEvent($container, config);

        },
        addPaginationEvent: function ($container, config) {
            var self = this;
            var jumpBtnClick = function () {
                var jumpPage = formatData($container.find(".jump-input input").val());
                if (jumpPage > 0) {
                    if (jumpPage < self.totalPage) {
                        self.curPage = jumpPage;
                    } else {
                        self.curPage = self.totalPage
                    }
                }
                self.getData($container, config, self.pageSize, self.curPage);

            };
            $container.find(".first-page-btn").on("click", function () {
                if ($(this).hasClass("btn-disabled")) {
                    return;
                } else {
                    self.curPage = 1;
                    self.getData($container, config, self.pageSize, self.curPage);
                }

            });

            $container.find(".last-page-btn").on("click", function () {
                if ($(this).hasClass("btn-disabled")) {
                    return;
                } else {
                    self.curPage = self.totalPage;
                    self.getData($container, config, self.pageSize, self.curPage);

                }
            });

            $container.find(".pre-page-btn").on("click", function () {
                if ($(this).hasClass("btn-disabled")) {
                    return;
                } else if (self.curPage > 1) {
                    self.curPage--;
                    self.getData($container, config, self.pageSize, self.curPage);
                }
            });

            $container.find(".next-page-btn").on("click", function () {
                if ($(this).hasClass("btn-disabled")) {
                    return;
                } else if (self.curPage < self.totalPage) {
                    self.curPage++;
                    self.getData($container, config, self.pageSize, self.curPage);
                }

            });

            $container.find(".jump-btn").on("click",jumpBtnClick);
            $container.find(".jump-input input").keydown(function(event) {
                if (event.keyCode == "13") {
                    jumpBtnClick();
                }
            });
            $container.find(".page-select").on('change', function () {
                self.pageSize = this.value;
                if(config.haveStorage){
                 window.sessionStorage.setItem("loongTablePageSize",self.pageSize);
                }
                self.curPage = 1;
                self.getData($container, config, self.pageSize, self.curPage);

            });


        },
        setBtnDisabled: function ($container) {
            $container.find(".btn-disabled").removeClass("btn-disabled");
            if (this.curPage == 1) {
                $container.find(".first-page-btn").addClass("btn-disabled");
                $container.find(".pre-page-btn").addClass("btn-disabled");
            }
            if (this.curPage == this.totalPage) {
                $container.find(".last-page-btn").addClass("btn-disabled");
                $container.find(".next-page-btn").addClass("btn-disabled");
            }

        },
        setTableHeight: function ($tableContent, config) {
            var height = config.height,
                ht;
            if (isNaN(parseInt(height))) {
                if ("auto" == height) {
                    $tableContent.css("height", "auto");
                } else {
                    var wh =  $(window).height() || document.documentElement.clientHeight || document.body.clientHeight;
                    var mh = height.split("-")[1];
                    ht = wh - mh - 39;
                }
            } else {
                ht = parseInt(height) - 39;
            }
            if (config.pagination && this.rowData.length > 0) {
                ht = ht - 70;
            }
            $tableContent.css("height", ht + "px");
        },
        resize: function ($tableWrap, config) {
            this.setTableHeight($tableWrap, config);
            this.initScrollBar();
        },
        initScrollBar: function () {
            if(this.$container.find(".loong-table").length > 0){
                var tableContent = this.$container.find(".table-content-wrap")[0];
                var flag = tableContent.scrollHeight > tableContent.clientHeight;
                if (flag) {
                    this.$container.find(".table-header-wrap").addClass("has-scroll");
                } else {
                    this.$container.find(".table-header-wrap").removeClass("has-scroll");
                }
            }
        },
        rowClick: function ($container, config) {
            var self = this;
            $container.find("td").not(".checkbox-col,.table-operation,.has-click").unbind("click");
            $container.find("td").not(".checkbox-col,.table-operation,.has-click").on("click", function () {
               /* var $curRow = $(this).parents(".table-content-row");
                var checkedIndex = self.checkedIndex;
                if (config.hasCheckbox) {
                    if ($curRow.hasClass("row-selected")) {
                        $curRow.removeClass("row-selected");
                        checkedIndex.splice($.inArray($curRow.attr("data-index"), checkedIndex), 1);
                        if ($container.find(".table-header .checkbox").hasClass("checkbox-selected")) {
                            $container.find(".table-header .checkbox").removeClass("checkbox-selected");
                        }
                    } else {
                        $curRow.addClass("row-selected");
                        checkedIndex.push($curRow.attr("data-index"));
                        if (checkedIndex.length == $container.find(".table-content-row").length) {
                            $container.find(".table-header .checkbox").addClass("checkbox-selected");
                        }
                    }
                } else if(config.hasRadio){
                    if ($curRow.hasClass("row-selected")) {
                        $curRow.removeClass("row-selected");
                        checkedIndex.length = 0;
                    } else {
                        $container.find(".row-selected").removeClass("row-selected");
                        $curRow.addClass("row-selected");
                        checkedIndex.length = 0;
                        checkedIndex.push($curRow.attr("data-index"));
                    }
                }*/
               var $dom = $(this);
               self.rowClickFn($container,config,$dom);
            });
        },
        rowClickFn: function($container,config,$dom){
            var self = this;
            var $curRow = $dom.parents(".table-content-row");
            var checkedIndex = self.checkedIndex;
            if (config.hasCheckbox) {
                if ($curRow.hasClass("row-selected")) {
                    $curRow.removeClass("row-selected");
                    checkedIndex.splice($.inArray($curRow.attr("data-index"), checkedIndex), 1);
                    if ($container.find(".table-header .checkbox").hasClass("checkbox-selected")) {
                        $container.find(".table-header .checkbox").removeClass("checkbox-selected");
                    }
                } else {
                    $curRow.addClass("row-selected");
                    checkedIndex.push($curRow.attr("data-index"));
                    if (checkedIndex.length == $container.find(".table-content-row").length) {
                        $container.find(".table-header .checkbox").addClass("checkbox-selected");
                    }
                }
            } else if(config.hasRadio){
                if ($curRow.hasClass("row-selected")) {
                    $curRow.removeClass("row-selected");
                    checkedIndex.length = 0;
                } else {
                    $container.find(".row-selected").removeClass("row-selected");
                    $curRow.addClass("row-selected");
                    checkedIndex.length = 0;
                    checkedIndex.push($curRow.attr("data-index"));
                }
            }
        },
        setMemory: function(index,flag){
            var key = this.config.key;
            if(flag){
               this.memoryKey.push(this.rowData[index][key]);
               this.memoryData.push(this.rowData[index]);
           }else{
               var ind = $.inArray(this.rowData[index][key],this.memoryKey);
               if(ind>0){
                   this.memoryKey.splice(ind,1);
                   this.memoryData.splice(ind,1);
               }


            }
        },
        initMemory: function(){

        },
        addLoading:function($container,img){
            var img = new Image();
            img.src = require("@/views/LoongUI/frame/lib/loongTable/img/loading.gif") ;
            $container.find(".table-content-wrap .loongUI-table tbody").children().remove();
            var $loading = $("<div class='loongUI-table-loading'><img src=" + img.src +"><p class='loading-txt'>"+tableI18n("loading")+"</p></div>") 
            $container.find(".table-content-wrap").append($loading);
        },
        removeLoading:function($container){
            $container.find(".table-content-wrap .loongUI-table-loading").remove();
        }
    };

    LoongTable.prototype.getCheckedIndex = function () {

        return this.checkedIndex.sort();
    };
    LoongTable.prototype.getRowData = function (index) {
        if (undefined == index) {

            return this.rowData;
        } else {
            return this.rowData[index];
        }

    };
    LoongTable.prototype.getCurrentPage = function () {

        return this.curPage;
    };

    LoongTable.prototype.refresh = function (id, arr) {
        var self = this;
        var $container = this.$container,
            config = this.config,
            rowData = this.rowData;
        $("body").find(".loongui-tip-move").remove();
        if (arguments.length == 0) {
            this.memoryKey.length = 0;
            this.memoryData.length = 0;
            this.getData($container, config, this.pageSize, this.curPage);
        } else {
            var param = config.params;
            if (config.pagination) {
                param.pageSize = this.pageSize;
                param.pageNum = this.curPage;
            }
            $.$ajax({
                type: config.method,
                url: config.url,
                data: param,
                success: function (json) {
                    var data = [], cols = [];
                    if(config.pagination){
                        data = json.data.rows;
                    }else{
                        data = json.data;
                    }
                    $container.find("th").each(function (k, ele) {
                            for(var i=0;i<arr.length;i++){
                                if ($(ele).attr("data-key") == arr[i]) {
                                var col = {};
                                col.index = k;
                                col.key = arr[i];
                                cols.push(col);
                            }
                        }
                    });
                    for (var i = 0; i < rowData.length; i++) {
                        for (var j = 0; j < data.length; j++) {
                            if (rowData[i][id] == data[j][id]) {
                                $.extend(self.rowData[i], data[j]);
                                break;
                            }

                        }
                    }
                        $container.find(".table-content-row").each(function (i,item) {
                            var index, fields = config.fields;
                            for (var k = 0; k < cols.length; k++) {
                                var $td = $(item).find("td:eq(" + cols[k].index + ")");
                                if (config.hasCheckbox||config.hasRadio) {
                                    index = cols[k].index - 1;
                                } else {
                                    index = cols[k].index;
                                }
                                var key = cols[k].key,
                                    formater = fields[index].formater;
                                if ('function' == typeof formater) {
                                    $td.html(formater(rowData[i][key], rowData[i],i));
                                } else {
                                    $td.html(rowData[i][key]);
                                }

                            }
                        });


                    }


            });
        }


    };
    LoongTable.prototype.remianFresh = function(key){
        var checkIndex = this.getCheckedIndex();
        var self = this;
        var keyList = [],checkIndexFlag;
        for(var i = 0;i<checkIndex.length;i++){
            keyList.push(this.getRowData(checkIndex[i])[key]);
        }
        this.getData(this.$container,this.config, this.pageSize, this.curPage,function(){
            var fieldsNum;
            self.$container.find(".table-content-row").each(function(index,$dom){
                checkIndexFlag = false;
                var fields = self.config.fields;
                for(var i = 0;i<fields.length;i++){
                    if(fields[i].name == key){
                        fieldsNum = i;
                        break;
                    }
                }
                var trKey = self.getRowData(index)[key];
                $.each(keyList,function(index,value){
                    if(value == trKey){
                        checkIndexFlag = true;
                    }
                });
                if(checkIndexFlag){
                    if(self.config.hasCheckbox){
                        self.checkboxClick(self,$(this).find(".checkbox-col .checkbox"));
                    }else if(self.config.hasRadio){
                        self.rowClickFn(self.$container,self.config,$(this));
                    }
                }
            });
        });




    }
})(jQuery);

(function($) {
    $.fn.loongTableTree = function (options) {
        var config = $.extend({
            height: "auto",
            fields: [],
            hasCheckbox: false,
            isSpread: true,
            ajaxData: false,
            url: "",
            pageSize: 20,
            limits: [10, 20, 30, 40, 50],
            params: {},
            method: "get",
            async: true,
            data: [],
            pagination: false,
            iconColor: 'rgb(153,153,153)',
            isTree: true,
            clickFn:""
        }, options);
        var $container = $(this);
        var loongTableTree = new LoongTableTree();
        loongTableTree._init($container, config);
        return loongTableTree;
    };

    function LoongTableTree() {
        this.checkedIndex = [];
        this.rowData = [];
        this.totalNum = 0;
        this.curPage = 1;
        this.totalPage = 0;
        this.pageSize = 0;
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

    LoongTableTree.prototype = {
        _init: function ($container, config) {
            this.$container = $container;
            this.config = config;
            var self = this;
            if ($container.find(".loong-tableTree").length > 0){
                $container.find(".loong-tableTree").remove();
            }
            var $table = $("<div class='loong-tableTree'><div class='tableTree-content-wrap'><table class='loongUI-tableTree'><tbody></tbody></div></div>");
            $container.append($table);
            window.onresize = function () {
                if($("body").find(".loong-tableTree").length > 0){
                    self._resize($container.find(".tableTree-content-wrap"), config);
                }
            };
            this._setHeader($container, config);
            if (config.ajaxData) {
                self.pageSize = config.pageSize;
                this._getData($container, config, this.pageSize, 1);
            } else {
                this.rowData = config.data;
                this._setTableHeight($container.find(".tableTree-content-wrap"), config);
                this._listData($container, config, this.rowData);
            }
            // if(config.isTree) {
                // $container.find(".tableTree-content-row").css("border-bottom","none");
            // }
        },
        _setHeader: function ($container, config) {
            var $tableHead = $("<div class='tableTree-header-wrap'><table class='loongUI-tableTree'><thead></thead></table></div>");
            var $tr = $("<tr class='tableTree-header'></tr>");
            var tableCols = config.fields;
            if(!config.isTree) {
                if (config.hasCheckbox) {
                    $tr.append("<th class='checkbox-col'></th>");
                    this._initCheckbox($tr,$container,config);
                    $container.find(".loong-tableTree").addClass("checkbox-tableTree");
                }
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
            if(config.isTree) {
                var firstTh = $tr.find("th:not( .checkbox-col1,[data-visible])").eq(0);
            }else {
                var firstTh = $tr.find("th:not( .checkbox-col,[data-visible])").eq(0);
            }
            
            firstTh.removeClass("has-split");
            if(config.isTree) {
                firstTh.css('padding-left', '30px');
            }else {
                if (config.hasCheckbox) {
                    firstTh.css('padding-left', '10px');
                }else{
                    firstTh.css('padding-left', '30px');
                }
            }
            $tableHead.find("thead").append($tr);
            $container.find(".loong-tableTree").prepend($tableHead);
        },
        _addIndex: function(config,data) {
            var dataArray = [];
            var floor = 0;
            this._addData(dataArray,data,floor);
            for(var i = 0;i<dataArray.length;i++) {
                dataArray[i].dataIndex = i;
            }
        },
        _listData: function ($container, config,data) {
            if(config.isTree) {
                data = this._createRowData(data,config);
            }
            if(!config.isTree) {
                $container.find(".tableTree-header-wrap .checkbox").removeClass("checkbox-selected");
            }
            $container.find(".tableTree-content-wrap tbody").empty();
            this.checkedIndex.length = 0;
            var tableCols = config.fields;
            if ( data == undefined || data.length == 0) {
                var len = tableCols.length;
                $container.find("tbody").append(
                    "<tr><td colspan= '" + len + "' class='message'>" +
                    "暂无数据" + "</td></tr>");
                return;
            }
            for (var i = 0; i < data.length; i++) {
                var $tr = $("<tr class='tableTree-content-row'></tr>");
                $tr.attr("data-index", i);
                if(config.isTree) {
                    if(data[i].collapable) {
                        $tr.addClass("collapable");
                    }
                    var $div = $("<div class='insert-icon' style='color:"+config.iconColor+";'></div>");   
                    $tr.attr("floor", data[i].floor);
                    $tr.attr("parent",data[i].parent);
                    for (var j = 0; j <= data[i].floor; j++) {
                        $div.css("padding-left",(j+1)*30+"px");
                    }
                    if(!config.isSpread) {
                        if (data[i].collapable) {
                            $div.append($("<svg class='icon collapable-icon' aria-hidden='true'><use xlink:href='#icon-jiantouxia'></use></svg>"));
                            $tr.addClass("son-hide");
                        }
                        else {
                            $div.append($("<div class='dib w19block'></div>"));
                        }
                        if ($tr.attr("floor") > 0) {
                            $tr.hide();
                        }
                    }
                    if (config.hasCheckbox) {
                        $div.append($("<div class='checkbox-col1'></div>"));
                        this._initCheckbox($div,$container,config);
                    }
                }else {
                    if (config.hasCheckbox) {
                        $tr.append($("<td class='checkbox-col'></td>"));
                        this._initCheckbox($tr,$container,config);
                    }
                }
                for (var j = 0; j < tableCols.length; j++) {
                    var $td = $("<td class='has-split'></td>"),
                        colsName = tableCols[j].name;
                    if (false == tableCols[j].visible) {
                        $td.attr("data-visible", false);
                    }
                    if (true == tableCols[j].hasClick){
                        $td.addClass("has-click");
                    }
                    if (undefined !== tableCols[j].width) {
                        $td.css("width", formatData(tableCols[j].width) + 'px');
                    }
                    if (tableCols[j].type == 'data' || tableCols[j].type == undefined) {
                        if ('function' == typeof tableCols[j].formater) {
                            $td.append(tableCols[j].formater(data[i][colsName], data[i]));
                        } else if ('dateFormat' == tableCols[j].formater && tableCols[j].pattern) {
                            $td.append(dateFormat(data[i][colsName], tableCols[j].pattern));
                        } else {
                            if (true == tableCols[j].overflowEllipsis) {
                                $td.addClass("toe");
                                $td.attr("title", data[i][colsName]);
                            }
                            $td.html(data[i][colsName]);

                        }
                    } else if (tableCols[j].type == 'button') {
                        var buttons = [];
                        if ('function' == typeof tableCols[j].formater) {
                            buttons = tableCols[j].formater();
                        } else {
                            buttons = tableCols[j].operations
                        }
                        for (var k = 0; k < buttons.length; k++) {
                            var $btn = $("<div class='loongTableTree-btn' title='"+buttons[k].text +"'><svg class='icon icon-btn fs16' aria-hidden='true'><use xlink:href="+buttons[k].icon+"></use></svg></div>");
                            $td.addClass("table-operation");
                            $td.append($btn);
                            $btn.on("click", {"callBack": buttons[k].callBack, "index": i}, function (e) {
                                e.data.callBack(e.data.index);
                            });
                        }
                    }
                    $tr.append($td);
                }
                if(config.isTree) {
                    var firstTd = $tr.find("td:not( .checkbox-col1,[data-visible])").eq(0);
                }else {
                    var firstTd = $tr.find("td:not( .checkbox-col,[data-visible])").eq(0);
                }
                firstTd.removeClass("has-split");
                if(config.isTree) {
                    firstTd.addClass("has-click");
                    firstTd.prepend($div);
                }else {
                    if (config.hasCheckbox) {
                        firstTd.css('padding-left', '10px');
                    }else{
                        firstTd.css('padding-left', '30px');
                    }
                }
                $container.find(".tableTree-content-wrap tbody").append($tr);

            }
            this._initScrollBar();
            this._rowClick($container, config);
            if(config.isTree){
                this._arrowClick($container, config);
            }

        },
        _getData: function ($container, config, pageSize, num) {
            var self = this;
            this.curPage = num;
            var param = config.params;
            if (config.pagination) {
                param.pageSize = pageSize;
                param.pageNum = num;
            }
            $.ajax({
                type: config.method,
                url: config.url,
                data: param,
                cache: false,
                async: config.async,
                success: function (json) {
                    if (config.pagination) {
                        self.totalNum = json.data.total;
                        self.rowData = json.data.rows;
                        if (self.rowData.length > 0) {
                            self._initPagination($container, config, pageSize, num);
                        }
                    } else {
                        self.rowData = json.data || [];
                    }
                    self._setTableHeight($container.find(".tableTree-content-wrap"), config);
                    self._listData($container, config, self.rowData);

                }
            })
        },
        _initCheckbox: function ($wrap,$container,config) {
            var self = this;
            var $checkBox = $("<div class='checkbox'><svg class='icon' aria-hidden='true'><use xlink:href='#icon-gou'></use></svg><input type='checkbox' class='checkbox-input'></div>");
            if(config.isTree) {
                $wrap.find(".checkbox-col1").append($checkBox);
            }else {
                $wrap.find(".checkbox-col").append($checkBox);
            }
            $checkBox.on("click", function () {
                var checkedIndex = self.checkedIndex;
                var $table = $(this).parents(".loong-tableTree");
                if ($(this).parents(".tableTree-header").length > 0) {
                    if ($(this).hasClass("checkbox-selected")) {
                        $(this).removeClass("checkbox-selected");
                        $table.find(".tableTree-content-row").removeClass("row-selected");
                        checkedIndex.length = 0;
                    } else {
                        $(this).addClass("checkbox-selected");
                        $table.find(".tableTree-content-row").each(function () {
                            $(this).addClass("row-selected");
                            var index = $(this).attr("data-index");
                            if($.inArray(index,checkedIndex) == -1){
                                checkedIndex.push(index);
                            }
                        });

                    }
                } else if ($(this).parents(".tableTree-content-row").length > 0) {
                    var $curRow = $(this).parents(".tableTree-content-row");
                    if ($curRow.hasClass("row-selected")) {
                        $curRow.removeClass("row-selected");
                        if(!config.isTree){
                            checkedIndex.splice($.inArray($curRow.attr("data-index"), checkedIndex), 1);
                            if ($table.find(".tableTree-header .checkbox").hasClass("checkbox-selected")) {
                                $table.find(".tableTree-header .checkbox").removeClass("checkbox-selected");
                            }
                        }else {
                            for(var i=0;i<$curRow.nextAll().length;i++) {
                                if($($curRow.nextAll()[i]).attr("floor")>$curRow.attr("floor")) {
                                    $($curRow.nextAll()[i]).removeClass("row-selected");
                                }else {
                                    break;
                                }
                            }
                            self._removeBefore($curRow); 
                        }
                    }else {
                        $curRow.addClass("row-selected");
                        if(!config.isTree){
                            checkedIndex.push($curRow.attr("data-index"));
                            if (checkedIndex.length == $table.find(".tableTree-content-row").length) {
                                $table.find(".tableTree-header .checkbox").addClass("checkbox-selected");
                            }
                        }else{
                            for(var i =0;i<$curRow.nextAll().length;i++) {
                                if($($curRow.nextAll()[i]).attr("floor")>$curRow.attr("floor")) {
                                    $($curRow.nextAll()[i]).addClass("row-selected");
                                }else {
                                    break;
                                }
                            }
                            self._addBefore($container,$curRow);
                        }
                    }
                    if(config.isTree) {
                        checkedIndex.length = 0;
                        for(var i=0;i<$container.find(".row-selected").length;i++) {
                            checkedIndex.push($($container.find(".row-selected")[i]).attr("data-index"));
                        }
                    }
                    if("function" == typeof self.config.clickFn){
                        self.config.clickFn(checkedIndex);
                    }
                }
            });
        },
        _removeBefore: function ($curRow) {
            for(var i = 0;i<$curRow.prevAll().length;i++){
                if($($curRow.prevAll()[i]).attr("floor")<$curRow.attr("floor")) {
                    $($curRow.prevAll()[i]).removeClass("row-selected");
                    this._removeBefore($($curRow.prevAll()[i]));
                    break;
                }
            }
        },
        _addBefore: function($container,$curRow) {
            var num = 0,other = 0;
            for(var i=0;i<$container.find(".tableTree-content-row").length;i++) {
                if($($container.find(".tableTree-content-row")[i]).attr("parent") == $curRow.attr("parent")) {
                    num++;
                }
            }
            for(var i=0;i<$container.find(".row-selected").length;i++) {
                if($($container.find(".row-selected")[i]).attr("parent") == $curRow.attr("parent")) {
                    other++;
                }
            }
            if(num == other) {
                for(var i=0;i<$container.find(".tableTree-content-row").length;i++) {
                    if($($container.find(".tableTree-content-row")[i]).attr("data-index") == $curRow.attr("parent")) {
                        $($container.find(".tableTree-content-row")[i]).addClass("row-selected");
                        this._addBefore($container,$($container.find(".tableTree-content-row")[i]));
                    }
                }
            }
            num = 0;
            other = 0;
        },
        _initPagination: function ($container, config, pageSize, num) {
            $container.find(".pager-box").remove();
            var $pagerBox = $("<div class='pager-box'><div class='pager-content clearfix'></div></div>");
            var $btnList = $("<div class='first-page-btn'><svg class='icon'><use xlink:href='#icon-diyiye'></use></svg></div><div class='pre-page-btn'><svg class='icon'><use xlink:href='#icon-shangyiye'></use></svg></div><div class='page-num'>" +
                "<span class='current-page'></span><span>/</span><span class='total-page'></span></div><div class='next-page-btn'><svg class='icon'><use xlink:href='#icon-xiayiye'></use></svg></div><div class='last-page-btn'><svg class='icon'><use xlink:href='#icon-zuihouyiye'></use></svg></div>");
            var $jumpBox = $("<div class='btn-split'></div><div class='jump-input'><input type='text'></div><div class='jump-btn'>跳转</div>");
            var $select = $("<div class='page-select-box'><select class='page-select'></select></div>");
            $.each(config.limits, function (i, val) {
                var $option = $("<option value='" + val + "'>" + val + "条/页</option>");
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
            $container.find(".loong-tableTree").append($pagerBox);
            this._setBtnDisabled($container);
            this._addPaginationEvent($container, config);

        },
        _addPaginationEvent: function ($container, config) {
            var self = this;
            $container.find(".first-page-btn").on("click", function () {
                if ($(this).hasClass("btn-disabled")) {
                    return;
                } else {
                    self.curPage = 1;
                    self._getData($container, config, self.pageSize, self.curPage);
                }

            });

            $container.find(".last-page-btn").on("click", function () {
                if ($(this).hasClass("btn-disabled")) {
                    return;
                } else {
                    self.curPage = self.totalPage;
                    self._getData($container, config, self.pageSize, self.curPage);

                }
            });

            $container.find(".pre-page-btn").on("click", function () {
                if ($(this).hasClass("btn-disabled")) {
                    return;
                } else if (self.curPage > 1) {
                    self.curPage--;
                    self._getData($container, config, self.pageSize, self.curPage);
                }
            });

            $container.find(".next-page-btn").on("click", function () {
                if ($(this).hasClass("btn-disabled")) {
                    return;
                } else if (self.curPage < self.totalPage) {
                    self.curPage++;
                    self._getData($container, config, self.pageSize, self.curPage);
                }

            });

            $container.find(".jump-btn").on("click", function () {
                var jumpPage = formatData($container.find(".jump-input input").val());
                if (jumpPage > 0) {
                    if (jumpPage < self.totalPage) {
                        self.curPage = jumpPage;
                    } else {
                        self.curPage = self.totalPage;
                    }
                }
                self._getData($container, config, self.pageSize, self.curPage);

            });

            $container.find(".page-select").on('change', function () {
                self.pageSize = this.value;
                self.curPage = 1;
                self._getData($container, config, self.pageSize, self.curPage);

            })

        },
        _setBtnDisabled: function ($container) {
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
        _setTableHeight: function ($tableContent, config) {
            var height = config.height,
                ht;
            if (isNaN(parseInt(height))) {
                if ("auto" == height) {
                    $tableContent.css("height", "auto");
                } else {
                    var wh =  $(window).height() || document.documentElement.clientHeight || document.body.clientHeight;
                    var mh = height.split("-")[1];
                    ht = wh - mh - 38;
                }
            } else {
                ht = parseInt(height) - 38;
            }
            if (config.pagination && this.rowData.length > 0) {
                ht = ht - 70;
            }
            $tableContent.css("height", ht + "px");
        },
        _resize: function ($tableWrap, config) {
            this._setTableHeight($tableWrap, config);
            this._initScrollBar();
        },
        _initScrollBar: function () {
            if(this.$container.find(".loong-tableTree").length > 0){
                var tableContent = this.$container.find(".tableTree-content-wrap")[0];
                var flag = tableContent.scrollHeight > tableContent.clientHeight;
                if (flag) {
                    this.$container.find(".tableTree-header-wrap").addClass("has-scroll");
                } else {
                    this.$container.find(".tableTree-header-wrap").removeClass("has-scroll");
                }
            }
        },
        _rowClick: function ($container, config) {
            var self = this;
            if(config.isTree) {
                if (config.hasCheckbox) {
                    $container.find("td").not(".table-operation,.has-click").on("click", function () {
                        var checkedIndex = self.checkedIndex;
                        checkedIndex.length = 0;
                        var $table = $(this).parents(".loong-tableTree");
                        var $curRow = $(this).parents(".tableTree-content-row");
                        if ($curRow.hasClass("row-selected")) {
                            $curRow.removeClass("row-selected");
                            for(var i=0;i<$curRow.nextAll().length;i++) {
                                if($($curRow.nextAll()[i]).attr("floor")>$curRow.attr("floor")) {
                                    $($curRow.nextAll()[i]).removeClass("row-selected");
                                }else {
                                    break;
                                }
                            }
                            self._removeBefore($curRow);  
                        } else {
                            $curRow.addClass("row-selected");
                            for(var i =0;i<$curRow.nextAll().length;i++) {
                                if($($curRow.nextAll()[i]).attr("floor")>$curRow.attr("floor")) {
                                    $($curRow.nextAll()[i]).addClass("row-selected");
                                }else {
                                    break;
                                }
                            }
                            self._addBefore($container,$curRow);
                        }
                        for(var i=0;i<$container.find(".row-selected").length;i++) {
                            checkedIndex.push($($container.find(".row-selected")[i]).attr("data-index"));
                        }
                    });
                } 
                else {
                    $container.find("td").not(".table-operation").on("click", function () {
                        var checkedIndex = self.checkedIndex;
                        var checkedNum = self.checkedNum;
                        var num = 0;
                        var $curRow = $(this).parents(".tableTree-content-row");
                        var checkedIndex = self.checkedIndex;
                        if ($curRow.hasClass("row-selected")) {
                            if($curRow.hasClass("collapable")){
                                $curRow.find("svg:eq(0)").css("color","rgba(51,51,51,1)");
                                $curRow.find("svg:eq(1)").css("color",config.iconColor);
                            }else{
                                $curRow.find("svg:eq(0)").css("color",config.iconColor);
                            }
                            if(($curRow.attr("show-index"))%2 == 0) {
                                $curRow.css({"background":"#fff","color":"rgba(51,51,51,1)"});
                            }
                            else{
                                $curRow.css({"background":"rgba(248,249,250,1)","color":"rgba(51,51,51,1)"});
                            }
                            $curRow.removeClass("row-selected");
                            checkedIndex.length = 0;
                        } else {
                            if($('.row-selected').hasClass("collapable")){
                                $('.row-selected').find("svg:eq(0)").css("color","rgba(51,51,51,1)");
                                $('.row-selected').find("svg:eq(1)").css("color",config.iconColor);
                            }else{
                                $('.row-selected').find("svg:eq(0)").css("color",config.iconColor);
                            }
                            $curRow.css({"background":"rgba(238,247,255,1)","color":"rgba(17,136,221,1)"});
                            $curRow.find("svg").css("color","rgba(17,136,221,1)");
                            if(($container.find(".row-selected").attr("show-index"))%2 == 0) {
                                $container.find(".row-selected").css({"background":"#fff","color":"rgba(51,51,51,1)"});
                            }
                            else{
                                $container.find(".row-selected").css({"background":"rgba(248,249,250,1)","color":"rgba(51,51,51,1)"});
                            }
                            $container.find(".row-selected").removeClass("row-selected");
                            $curRow.addClass("row-selected");
                            checkedIndex.length = 0;
                            checkedIndex.push($curRow.attr("data-index"));
                        }
                    });
                }
            }else {
                $container.find("td").not(".checkbox-col,.table-operation,.has-click").on("click", function () {
                    var $curRow = $(this).parents(".tableTree-content-row");
                    var checkedIndex = self.checkedIndex;
                    if (config.hasCheckbox) {
                        if ($curRow.hasClass("row-selected")) {
                            $curRow.removeClass("row-selected");
                            checkedIndex.splice($.inArray($curRow.attr("data-index"), checkedIndex), 1);
                            if ($container.find(".tableTree-header .checkbox").hasClass("checkbox-selected")) {
                                $container.find(".tableTree-header .checkbox").removeClass("checkbox-selected");
                            }
                        } else {
                            $curRow.addClass("row-selected");
                            checkedIndex.push($curRow.attr("data-index"));
                            if (checkedIndex.length == $container.find(".tableTree-content-row").length) {
                                $container.find(".tableTree-header .checkbox").addClass("checkbox-selected");
                            }
                        }
                    } else {
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
                });
            }
        },

        _addParent: function(data,config) {
            var dataIndex = 0;
            for(var i = 0;i<config.data.length;i++) {
                config.data[i].parent = -1;
            }
            for(var i = 0;i<data.length;i++) {
                dataIndex = data[i].dataIndex;
                if(data[i].children.length > 0) {
                    for(var j = 0;j < data[i].children.length;j++) {
                        data[i].children[j].parent = dataIndex;
                    }
                }
                this._addParent(data[i].children,config);
            }
        },
        _createRowData : function(data,config) {
            this._addIndex(config,data);
            var dataArray = [];
            var floor = 0;// 记录目录的深度，0表示一级目录，1表示二级子目录，以此类推 
            this._addParent(data,config);
            this._addData(dataArray, data, floor);
            this.rowData = dataArray;
            return dataArray;
        },

        _addData : function(dataArray, data, floor) {
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                if (data[i].children.length > 0) {
                    obj.collapable = true;// 如果目录有子目录，就给这个目录设置collapable属性，表明该目录可下拉展开
                }
                obj.floor = floor;
                dataArray.push(obj);
                floor++;
                this._addData(dataArray, data[i].children, floor);
                floor--;
            }
        },
        _arrowClick : function($container, config) {
            var i = 0;
            $container.find('.tableTree-content-row').each(function(n){
                if($($container.find('.tableTree-content-row')[n]).css("display")!="none"){
                    $($container.find('.tableTree-content-row')[n]).attr('show-index',''+i+'');
                    i++;
                    if(($($container.find('.tableTree-content-row')[n]).attr("show-index"))%2 == 0) {
                        $($container.find('.tableTree-content-row')[n]).css("background","#fff");
                    }
                    else{
                        $($container.find('.tableTree-content-row')[n]).css("background","rgba(248,249,250,1)");
                    }
                }
                
            })
            i = 0;
            var self = this;
            $container.find(".collapable-icon").click(function(event) {
                var theEvent = window.event || event;
                theEvent.stopPropagation();
                var $selectedTr = $(this).parents(".tableTree-content-row");
                if ($selectedTr.hasClass("son-hide")) {
                    self._showSon($selectedTr);
                    $selectedTr.removeClass("son-hide");
                } else {
                    self._hideSon($selectedTr);
                    $selectedTr.addClass("son-hide");
                }
                var j = 0;

                $container.find('.tableTree-content-row').each(function(n){ 
                    if($($container.find('.tableTree-content-row')[n]).css("display")!="none"){
                        $($container.find('.tableTree-content-row')[n]).attr('show-index',''+j+'');
                        j++;
                        if(($($container.find('.tableTree-content-row')[n]).attr("show-index"))%2 == 0) {
                            $($container.find('.tableTree-content-row')[n]).css("background","#fff");
                        }
                        else{
                            $($container.find('.tableTree-content-row')[n]).css("background","rgba(248,249,250,1)");
                        }
                    }
                    if(!config.hasCheckbox) {
                        if($($container.find('.tableTree-content-row')[n]).hasClass("row-selected")) {
                            if($($container.find('.tableTree-content-row')[n]).css("display") != "none") {
                                $($container.find('.tableTree-content-row')[n]).css({"background":"rgba(238,247,255,1)","color":"rgba(17,136,221,1)"});
                            }else {
                                $($container.find('.tableTree-content-row')[n]).removeClass("row-selected");
                                $($container.find('.tableTree-content-row')[n]).css('color','rgb(51,51,51)')
                                if($($container.find('.tableTree-content-row')[n]).hasClass("collapable")){
                                    $($container.find('.tableTree-content-row')[n]).find("svg:eq(0)").css("color","rgba(51,51,51,1)");
                                    $($container.find('.tableTree-content-row')[n]).find("svg:eq(1)").css("color",config.iconColor);
                                }else{
                                    $($container.find('.tableTree-content-row')[n]).find("svg:eq(0)").css("color",config.iconColor);
                                }
                            }
                        }
                    }  
                })
            });
        },
        _showSon : function($selectedTr) {
            // debugger;
            var selectedTrFloor = $selectedTr.attr("floor");
            var $ggTr = $selectedTr;// 哥哥Tr
            var $ddTr = $ggTr.next();// 弟弟Tr
            for (; parseInt($ddTr.attr("floor")) > parseInt(selectedTrFloor); $ggTr = $ddTr, $ddTr = $ggTr
                    .next()) {
                if ($ddTr.find(".collapable-icon").length > 0
                        && !$ddTr.hasClass("son-hide")) {
                    $ddTr.addClass("son-hide")
                }
                if (parseInt($ddTr.attr("floor")) == (parseInt(selectedTrFloor) + 1)) {
                    $ddTr.show();
                } else {
                    $ddTr.hide();
                }
            }
        },
        _hideSon : function($selectedTr) {
            var selectedTrFloor = $selectedTr.attr("floor");
            var $ggTr = $selectedTr;// 哥哥Tr
            var $ddTr = $ggTr.next();// 弟弟Tr
            for (; parseInt($ddTr.attr("floor")) > parseInt(selectedTrFloor); $ggTr = $ddTr, $ddTr = $ggTr
                    .next()) {
                $ddTr.hide();
            }
        }
    };



    LoongTableTree.prototype.getCheckedIndex = function () {

        return this.checkedIndex.sort();
    };

    LoongTableTree.prototype.getRowData = function (index) {
        if (undefined == index) {

            return this.rowData;

        } else {
            return this.rowData[index];
        }

    };
    LoongTableTree.prototype.getCurrentPage = function () {

        return this.curPage;
    };

    LoongTableTree.prototype.refresh = function (id, arr) {
        var self = this;
        var $container = this.$container,
            config = this.config,
            rowData = this.rowData;
        if (arguments.length == 0) {
            this._init($container, config)
        } else {
            var param = config.params;
            if (config.pagination) {
                param.pageSize = this.pageSize;
                param.pageNum = this.curPage;
            }
            $.ajax({
                type: config.method,
                url: config.url,
                data: param,
                success: function (json) {
                    var data = json.data, cols = [];
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
                                $.extend(self.rowData[i], data[i]);
                                break;
                            }

                        }
                        $container.find(".tableTree-content-row").each(function (item) {
                            var index, fields = config.fields;
                            for (var k = 0; k < cols.length; k++) {
                                var $td = $(item).find("td:eq(" + k + ")");
                                if (config.pagination) {
                                    index = cols[k].index - 1;
                                } else {
                                    index = cols[k].index;
                                }
                                var key = cols[k].key,
                                    formater = fields[index].formater;
                                if ('function' == typeof formater) {
                                    formater(key, rowData[i]);
                                } else {
                                    $td.html(rowData[i][key]);
                                }

                            }
                        });


                    }

                }
            });
        }


    }
})(jQuery);
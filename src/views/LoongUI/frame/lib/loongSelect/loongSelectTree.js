(function($) {
	$.fn.loongSelectTree = function(options) {
		var config = $.extend({
			'width' : '',
			'height' : '32px',
			'name' : '',
			'onChange' : '',
			'getData' : "",
			'ajaxData' : "",
			'allowSearch' : false,
			'data' : [ {
				'key' : '1',
				'value' : '1'
			} ]
		}, options);
		this.each(function() {
			var $container = $(this);
			var loongSelectTree = new LoongSelectTree($container, config);
			return loongSelectTree;
		});
	};
	var formatData = function(str) {
		return parseInt(str);
	};
	function LoongSelectTree($container, config) {
		this._init($container, config);
		this.rowDatas = [];
	}
	;
	LoongSelectTree.prototype = {
		_init : function($container, config) {
			this.$container = $container;
			this.config = config;
			if ($container.find(".select-wrap").length) {
				$container.find(".select-wrap").remove();
			}
			this._selectBox($container, config);
		},
		_selectBox : function($container, config) {
			var $dom = $("<div class='select-wrap'></div>"), $selectBox = $("<div class='select-box'><input class='select-input' ><div class='select'></div></div>"), $icon = $("<div class='select-icon'><svg class='icon'><use xlink:href='#icon-xiajiantou'></use></svg></div>"), $listBox = $("<div class='list-box' style='max-height: 185px;overflow-x:hidden;overflow-y:auto;''><table class='option-list'></table></div>"), selectWidth = formatData(config.width);
            $selectBox.find("input").attr('name',config.name);
            $dom.css({'width':selectWidth+'px' });
            $dom.css({'height':formatData(config.height)+'px','line-height':formatData(config.height)+'px'});
            $selectBox.css({'height':formatData(config.height)+'px','line-height':formatData(config.height)+'px'});
            $selectBox.append($icon);
            $dom.append($selectBox);
            $dom.append($listBox);
            $container.append($dom);
            var optionData;
            if(config.ajaxData){
                optionData = config.getData();
            }else{
                optionData = config.data;
            }
            this._selectList($container,config,optionData);
            var self = this;
            $container.find(".select-box").on('click',function(){
                var flag =  self.$container.find(".select-input").attr("disabled");
                if(flag == 'disabled'){
                    return;
                }else{
                    if(self.$container.find(".select-wrap").hasClass("select-wrap-selected")){
                        self._hideList(self.$container);
                    }else{
                        if(self.config.ajaxData){
                            optionData = self.config.getData();
                        }else{
                            optionData = self.config.data;
                        }
                        self._selectList(self.$container,self.config,optionData);
                        if(optionData.length>0){
                            self._showList(self.$container,self.config);
                        }
                    }
                }
            });
            if(config.allowSearch){
                this._setSearchBox($container,config,optionData);
            }
        },
        _selectList: function($container,config,optionData){
            if(optionData.length>0){
                if( ! $container.find(".select-input").val()){
                    $container.find(".select").html(optionData[0].key);
                    $container.find(".select-input").val(optionData[0].value);
                }
                this._setList($container,config,optionData,$container.find(".select").html());
             
            }else{
                $container.find(".select").html(select_text['noData']);
                $container.find(".select-input").val("");
            }
        },
        _setList: function($container,config,data,select){
            var self = this;
            var $ul = $container.find(".option-list");
            $ul.empty();
            var presymb="";
            this._createSelectTree($container,config,data,select,self,$ul,presymb);
        },
        _createSelectTree: function($container,config,data,select,self,$ul,presymb){
            for(var i=0;i<data.length;i++){
                if (data[i].children.length > 0) {
                    this.rowDatas = this._createRowData(data);
                    this._createSelectLi($container,config,this.rowDatas);
                } else {
                    this.rowDatas = data;
                    this._createSelectLi($container,config,this.rowDatas);
                }
            }
        },
        _createSelectLi : function($container, config, rowDatas) {
            $container.find("table.option-list").empty();
            for (var i = 0; i < rowDatas.length; i++) {
                var $tr = $("<tr class='table-content-row-sub'></tr>");
                $tr.attr("data-index", i);
                $tr.attr("floor", rowDatas[i].floor);
                var $td = $("<td></td>");
                var $div = $("<div></div>");
                var $span = $("<span></span>");
                $span.text(rowDatas[i].key);
                    for (var j = 0; j < rowDatas[i].floor; j++) {
                        $div.append($("<div class='dib w15block'></div>"));
                    }
                    if (rowDatas[i].collapable) {
                        $div.append($("<svg class='icon collapable-icon' aria-hidden='true'><use xlink:href='#icon-jiantouxia'></use></svg>"));
                        $tr.addClass("son-hide");
                    } else {
                        $div.append($("<div class='dib w12block'></div>"));
                    }
                    $div.append($("<svg class='icon mr5' aria-hidden='true'><use xlink:href='#icon-bumen'></use></svg>"))
                $div.append($span);
                $td.append($div);
                $tr.append($td);
                $container.find("table.option-list").append($tr);
                    if ($tr.attr("floor") > 0) {
                        $tr.hide();
                    }
            }
            this._arrowClick($container, config);
            this._rowClick($container, config,rowDatas);
        },
        _setContent: function(key,value){
            this.$container.find(".select").html(key);
            this.$container.find(".select-input").val(value);
            this._hideList(this.$container);
            console.log(value)
        },
        _hideList: function($container){
            var self = this;
            $container.find(".select-wrap").removeClass("select-wrap-selected");
            $(document).off('click',self.hide);
        },
        _showList: function($container,config){
            var self = this;
            this._setPosition($container,config);
            $container.find(".select-wrap").addClass("select-wrap-selected");
            $(document).on('click',{self:self},self.hide);
        },
        hide: function(event){
            var self = event.data.self;
            var e=event||window.event,
                con = self.$container.find(".select-wrap");
            if(!con.is(e.target) && con.has(e.target).length === 0){
                self._hideList(self.$container);
            }
        },
        _setPosition: function($container,config){
            // debugger
            var windowHeight;
            windowHeight =  $(window).height();
            var selectTop = $container.offset().top,
                selectBottom = windowHeight - selectTop -formatData(config.height),
                $selectList = $container.find(".list-box"),
                listHeight =$selectList .outerHeight();
            if(selectBottom>=listHeight||selectTop<listHeight){
                $selectList.css({top:formatData(config.height)+'px'});
            }else{
                $selectList.css({top:-(listHeight+1)+'px'});
            }
        },
        _setSearchBox: function($container,config,optionData){
            var $search=$("<div class='select-search-box'><input class='select-search-input' autocomplete='off' placeholder='"+select_text['search']+"'><div class='search-icon'><svg class='icon'><use xlink:href='#icon-sousu'></use></svg></div></div></div>");
            $search.css({'height':formatData(config.height)+'px','line-height':formatData(config.height)+'px'});
            $container.find(".option-list").before($search);
            var self = this;
            $search.find(".select-search-input").on("input",function(){
               self._doSearch($container,config,optionData);
            });
        },
        _doSearch: function($container,config,optionData){
            var str = $container.find(".select-search-input").val(),
                $list = $container.find(".option-list"),
                arr=[];
            var select = $container.find(".select").html();
            if(str ==""){
                $list.empty();
                this._setList($container,config,optionData,select);
            }else{
                for(var i=0;i<optionData.length;i++){
                    if(optionData[i].key.indexOf(str)>=0){
                        arr.push(optionData[i]);
                    }
                }
                if(arr.length>0){
                    this._setList($container,config,arr,select);
                }else{
                    $list.empty();
                    var $dom = $("<li class='select-no-result'>"+select_text['noResult']+"</li>");
                    $list.append($dom);
                }
            }
        },
        _createRowData : function(optionData) {
            var dataArray = [];
            var floor = 0;
            this._addData(dataArray, optionData, floor)

            return dataArray;
        },
        _addData : function(dataArray, optionData, floor) {
            for (var i = 0; i < optionData.length; i++) {
                var obj = optionData[i];
                if (optionData[i].children.length > 0) {
                    obj.collapable = true;
                }
                obj.floor = floor;
                dataArray.push(obj);
                floor++;
                this._addData(dataArray, optionData[i].children, floor);
                floor--;
            }
        },
        _arrowClick : function($container, config) {
            var self = this;
            this._showSon($container.find('.table-content-row-sub:eq(0)'));
            $container.find('.son-hide:eq(0) .collapable-icon').html('');
            $container.find(".collapable-icon").on("click", function() {
                event.stopPropagation();
                var $selectedTr = $(this).parents(".table-content-row-sub");
                $container.find('.table-content-row-sub:eq(0)').addClass('son-hide');
                if ($selectedTr.hasClass("son-hide")) {
                    self._showSon($selectedTr);
                    $selectedTr.removeClass("son-hide");
                } else {
                    self._hideSon($selectedTr);
                    $selectedTr.addClass("son-hide");
                }
            });
        },
        _rowClick : function($container, config,rowDatas){
            var self = this;
            console.log( $container.find(".row-selected td:eq(1)").text())
            $container.find("td").on("click", function(){
                self.checkedIndex = [];
                self._removeAllRowSelectedCSS($container);
                var selectedTr = $(this).parents(".table-content-row-sub");
                selectedTr.addClass("tree-row-selected");
                var index = parseInt(selectedTr.attr("data-index"));
                self.checkedIndex.push(index);
                self._setContent(selectedTr.find('span').html(),rowDatas[index].value);
            });
        },
        _showSon : function($selectedTr) {
            var selectedTrFloor = $selectedTr.attr("floor");
            var $ggTr = $selectedTr;// 哥哥Tr
            var $ddTr = $ggTr.next();// 弟弟Tr
            for (; $ddTr.attr("floor") > selectedTrFloor; $ggTr = $ddTr, $ddTr = $ggTr
                    .next()) {
                if ($ddTr.find(".collapable-icon").length > 0 && !$ddTr.hasClass("son-hide")) {
                    $ddTr.addClass("son-hide")
                }
                if ($ddTr.attr("floor") == (parseInt(selectedTrFloor) + 1)){
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
            for (; $ddTr.attr("floor") > selectedTrFloor; $ggTr = $ddTr, $ddTr = $ggTr
                    .next()) {
                $ddTr.hide();
            }
        },
        _removeAllRowSelectedCSS : function($container){
            $container.find("tr").each(function(){
                $(this).removeClass("tree-row-selected");
            });
		}
	}
})(jQuery);

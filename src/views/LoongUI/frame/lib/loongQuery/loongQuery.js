(function($) {
    "use strict";
    $.fn.loongQuery = function(options) {
        var config = $.extend({
            isSelect: false,
            isInput: true,
            fetchSug: false,
            selectWidth: '94px',
            inputWidth: "290px",
            placeholderTxt: '',
            icon:'#icon-sousu',
            datalist: [],
            initQuery:false,
            getData: undefined,
            doquery: function(){
            },
            emptyDoQuery:false,
            hasMemory:false
        }, options);
        var $modal = $(this);
        var modal = new loongQuery($modal, config);
        return modal;
    }

    function loongQuery($modal, config) {
        this._init($modal, config);
    }
     var formatData=function(str){
        return parseInt(str);
    }

    loongQuery.prototype = {
        _init: function($modal, config) {
            this.$modal = $modal;
            this.config = config;
            if($modal.find(".loongquery-wrap").length > 0) {
                $modal.find(".loongquery-wrap").remove();
            }
            var loongquery = $("<div class='loongquery-wrap'></div>");
            if (config.isSelect) {
                var selectContainer = $("<div class='loong-select-container'></div>")
                selectContainer.css('width', formatData(config.selectWidth)+'px');
                var selectPan = $("<div class='loong-select-pan hand'><span class= 'loong-select-content toe' value=" + config.datalist[0].value + ">" + config.datalist[0].name + "</span><span class='loong-select-down-icon fs14'><svg class='icon'><use xlink:href='#icon-xiajiantou'></use></svg></span></div>");
                selectPan.css('width', formatData(config.selectWidth)+'px');
                selectContainer.append(selectPan);
                var selectUl = $("<ul class='loong-select-ul'></ul>");
                selectUl.css('width', formatData(config.selectWidth)+'px');
                selectContainer.append(selectUl);
                loongquery.append(selectContainer);
                $modal.append(loongquery);
                this._conditionList($modal,selectUl, config);
            }
            if (config.isInput) {
                var searchbox = $("<div class='loong-search-box'><input type='text' class='loong-search-input' /></div>");
                var optBtn = $("<span class='loong-search-btn'><svg class='icon'><use xlink:href='"+ config.icon + "'></use></svg></span>");
                if(config.isSelect) {
                    searchbox.find(".loong-search-input").css('borderLeft', '1px solid #f1f3f5');
                }
                searchbox.find(".loong-search-input").css('width', formatData(config.inputWidth) - 52 +'px');
                if (config.placeholderTxt != '') {
                    searchbox.find(".loong-search-input").attr('placeHolder', config.placeholderTxt);
                }
                loongquery.append(searchbox);
                loongquery.append(optBtn);
                $modal.append(loongquery);
            }
            var modalWidth = (config.isSelect && config.isInput) ? formatData(config.selectWidth) + formatData(config.inputWidth) : (config.isSelect ? formatData(config.selectWidth) : formatData(config.inputWidth));
            $modal.css('width', formatData(modalWidth) + "px");
            if(config.fetchSug && config.getData != undefined && typeof config.getData === 'function'){
                this._setFetchPanel($modal, config);
            }
            this._bind($modal, config);
            if(config.hasMemory){
                var searchInput = $modal.find(".loong-search-input");
                if(window.sessionStorage.getItem("loongqueryObj")){
                    var loongqueryObj=JSON.parse(window.sessionStorage.getItem("loongqueryObj"));
                    if(config.isSelect){
                        if(loongqueryObj.loongQuerySelectKey){
                         $modal.find(".loong-select-content").attr("value",loongqueryObj.loongQuerySelectValue);
                         $modal.find(".loong-select-content").html(loongqueryObj.loongQuerySelectKey);
                        }
                    }
                    if(loongqueryObj.loongQueryKey){
                        $modal.find(".loong-search-input").val(loongqueryObj.loongQueryKey);    
                    }
                }
                         
                $modal.find(".loong-search-btn").trigger("click","-1");
                this._bindempty($modal, config);        
            }          
        },
        _bindempty:function($modal, config){
            var that=this;
            var searchInput = $modal.find(".loong-search-input");
            if(searchInput.val()!=""){
                searchInput.after("<span  class='hand fs16' name='del-empty' style='position:absolute;right:5px;top:5px;color:#CED4DA'><svg class='icon'><use xlink:href='#icon-shurukuangqingkong'></use></svg></span>");
                $modal.find("span[name=del-empty]").click(function(){
                    searchInput.val("");
                    $modal.find("span[name=del-empty]").remove();
                    if(config.emptyDoQuery){
                        config.doquery($modal.find(".loong-select-content").attr('value'), $(this).val());
                    }
                }) 
            }
            if(searchInput.val()==""&&$modal.find("span[name=del-empty]").length!=0){
                $modal.find("span[name=del-empty]").remove();
            }
        }
        ,
        _conditionList:function($modal,selectUl, config) {
            var selectedItem = $modal.find(".loong-select-content").attr("value");
            for (var i = 0; i < config.datalist.length; i++) {
                    var $option = $("<li class='loong-select-option toe'></li>").attr({"value":config.datalist[i].value,"title":config.datalist[i].name}).html(config.datalist[i].name);
                    selectUl.append($option);
                    if(selectedItem == config.datalist[i].value) {
                        selectUl.find("li.loong-select-option:last").addClass('option-selected');
                    }
                }
            config.placeholderTxt = config.datalist[0].name;
        },
         _setFetchPanel:function($modal, config){
            var _self = this;
            var $listBox = $("<div class='loongquery-list-box'><ul class='loongquery-option-list'></ul></div>");
            $modal.find('.loongquery-wrap').append($listBox);
            $modal.find('.loongquery-list-box, ul.loongquery-option-list').css('width',$modal.find(".loong-search-input").outerWidth());
            $modal.find(".loong-search-box input.loong-search-input").on('focus input propertychange',function(){
                if($(this).val() != ""){
                     var data = config.getData($(this).val());
                    _self._setOptionList($modal, config, data);
                }else{
                    _self._hideList($modal);
                }
            });
        },
        _bind: function($modal, config) {
            var that=this;
            if(window.sessionStorage.getItem("loongqueryObj")){
                var loongqueryObj= JSON.parse(window.sessionStorage.getItem("loongqueryObj"));
            }
            else{
                var loongqueryObj={
                 
                };
            }
            var searchInput = $modal.find(".loong-search-input");
            if(!config.fetchSug || (config.fetchSug && config.icon=='#icon-sousu')){
            // if(!config.fetchSug){
                searchInput.keyup(function(event) {
                    if(searchInput.val()!=""&&$modal.find("span[name=del-empty]").length==0){
                        that._bindempty($modal, config);
                        
                    }
                    
                    if (event.keyCode == "13") {
                        window.sessionStorage.setItem("loongTablePageNum","1");
                       config.doquery($modal.find(".loong-select-content").attr('value'), $(this).val());
                       if(config.hasMemory){
                            if(config.isSelect){
                                loongqueryObj['loongQuerySelectKey']=$modal.find(".loong-select-content").html();
                                loongqueryObj['loongQuerySelectValue']=$modal.find(".loong-select-content").attr('value');
                           }
                           loongqueryObj['loongQueryKey']= $(this).val();                     
                           window.sessionStorage.setItem("loongqueryObj",JSON.stringify(loongqueryObj));
                       }
                       
                    }
                });
            }
            $modal.find(".loong-search-btn").click(function(event,t) {
                if(t!="-1"){
                    window.sessionStorage.setItem("loongTablePageNum","1");
                }
                config.doquery($modal.find(".loong-select-content").attr('value'), $(searchInput).val());
                if(config.hasMemory){
                    if(config.isSelect&&loongqueryObj['loongQuerySelectKey']){
                        loongqueryObj['loongQuerySelectKey']=$modal.find(".loong-select-content").html();
                        loongqueryObj['loongQuerySelectValue']=$modal.find(".loong-select-content").attr('value');
                    } 
                   loongqueryObj['loongQueryKey']= $modal.find(".loong-search-input").val();                
                   window.sessionStorage.setItem("loongqueryObj",JSON.stringify(loongqueryObj));
                }
                
            });

            //下拉选择
            $modal.find(".loong-select-pan").click(function() {
                if ($modal.find(".loong-select-ul").css('display') == 'none') {
                    $modal.find(".loong-select-ul").css('display', 'block');
                    $modal.find('.loong-select-down-icon svg').css('transform', 'rotate(180deg)');
                } else {
                    $modal.find(".loong-select-ul").css('display', 'none');
                    $modal.find('.loong-select-down-icon svg').css('transform', 'rotate(0deg)');
                }
            });

            $modal.find(".loong-select-option").click(function() {
                $modal.find(".loong-select-content").attr('value', $(this).attr("value").trim()).html($(this).html());
                $modal.find(".loong-search-input").attr('placeHolder', $(this).html()).val("");
                $(this).siblings("li.loong-select-option").removeClass('option-selected');
                $(this).addClass('option-selected');
                $modal.find('.loong-select-down-icon svg').css('transform', 'rotate(0deg)');
                $(this).parent().css('display', 'none');
                if(config.initQuery){
                    window.sessionStorage.setItem('loongTablePageNum',1);
                    loongqueryObj['loongQuerySelectValue']=$modal.find(".loong-select-content").attr('value');
                    loongqueryObj['loongQuerySelectKey']=$modal.find(".loong-select-content").html();
                    loongqueryObj['loongQueryKey']="";
                    window.sessionStorage.setItem("loongqueryObj",JSON.stringify(loongqueryObj));
                   config.doquery($modal.find(".loong-select-content").attr('value'), $modal.find(".loong-search-input").val()); 
                 
                }     
            });
            $('body').not(".loong-select-container").click(function(e) {
                var e = e || window.event;
                var elem = e.target || e.srcElement;
                while (elem) { //循环判断至跟节点，防止点击的是div子元素
                    if (elem.className && elem.className == 'loong-select-container') {
                        return;
                    }
                    elem = elem.parentNode;
                }
                if ($modal.find(".loong-select-ul").css('display') == 'block') {
                    $modal.find(".loong-select-ul").css('display', 'none'); //点击的不是div或其子元素
                    $modal.find('.loong-select-down-icon svg').css('transform', 'rotate(0deg)');
                }

            });
        },
        _setPosition: function($modal){
            var windowHeight =  $(window).height();
            var searchHeight = $modal.find(".loong-search-box").height();
            var selectTop = $modal.offset().top,
                selectBottom = windowHeight - selectTop - formatData(searchHeight),
                $selectList = $modal.find(".loongquery-list-box"),
                listHeight = $selectList .outerHeight();
            if(selectBottom >= listHeight || selectTop < listHeight){
                $selectList.css({top:formatData(searchHeight)+'px'});
            }else{
                $selectList.css({top:-(listHeight+1)+'px'});
            }
        },
        _setOptionList:function($modal, config, data){
            var _self = this;
            var $ul = $modal.find("ul.loongquery-option-list");
            $ul.empty();
            for(var i = 0; i < data.length; i++){
                var $li = $("<li class='option lh32'>"+data[i]+"</li>");
                $li.on('click', function(){
                    var select = $(this);
                    $modal.find("input.loong-search-input").val(select.html());
                    _self._hideList($modal);
                    if(_self.config.icon == '#icon-sousu'){
                        _self.config.doquery($modal.find(".loong-select-content").attr('value'), $modal.find("input.loong-search-input").val());
                    }
                });
                $ul.append($li);
            }
            _self._addKeyEvent($modal);
            _self._showList($modal);
        },
        _addKeyEvent:function($modal){
            var _self = this,
                searchInput = $modal.find('.loong-search-input');
                // $lis = $modal.find("ul.loongquery-option-list li.option");
            var index = _self._getSelected($modal);
            $(document).on('keydown','.loong-search-input',function(e){
                e = e || window.event;
                var $lis = $modal.find("ul.loongquery-option-list li.option");
                switch(e.keyCode){
                    case 38: 
                       index--;
                       (index < 0) && (index = $lis.length - 1);
                       e.preventDefault();     //阻止默认光标移动
                       _self._setSelected($modal,index);
                       break;
                    case 40:    //down
                        index ++;
                        (index >= $lis.length) && (index = 0);
                        _self._setSelected($modal,index);
                        break;
                    case 13:
                        _self._enter($modal);
                        break;
                    default:
                        break;
                }
            });
        },
        _setSelected:function($modal,index){
            var _self = this,
                $lis = $modal.find("ul.loongquery-option-list li.option");
            if(index >= 0 && index <= $lis.length - 1){
                $lis.removeClass('bg-gray-light').eq(index).addClass('bg-gray-light');
                _self._fixScroll($modal,index);
            }
        },
        _enter:function($modal){
            var _self = this,
                searchInput = $modal.find('.loong-search-input'),
                $lis = $modal.find("ul.loongquery-option-list li.option");
            var enterIndex = _self._getSelected($modal);
            if(enterIndex >= 0 && enterIndex <= $lis.length - 1){
                searchInput.val($lis.eq(enterIndex).html());
            }
            _self._hideList($modal);
            // if(_self.config.icon == '#icon-sousu'){
            //     _self.config.doquery($modal.find(".loong-select-content").attr('value'), searchInput.val()); 
            // } 
        },
        _getSelected:function($modal){
             var $lis = $modal.find("ul.loongquery-option-list li.option"),
                 selected;
             if($lis.length > 0){
                selected = $lis.filter(".bg-gray-light");
                return  selected.length == 1 ?  selected.prevAll('li.option').length : -1;
             }
             return -1;
        },
        _fixScroll:function($modal,index){
            var _self = this,
                $lis = $modal.find("ul.loongquery-option-list li.option");
            if($lis.length > 0){
                var item = $modal.find("ul.loongquery-option-list li.option").eq(index);
                var $dropdown = $modal.find("ul.loongquery-option-list");
                var offsetTop = item[0].offsetTop,
                    upperBound = $dropdown.scrollTop(),
                    lowerBound,
                    heightDelta = item.outerHeight();
                var maxHeight = formatData($modal.find("ul.loongquery-option-list").css('maxHeight'));
                lowerBound = upperBound + maxHeight - heightDelta;
                if (offsetTop < upperBound) {
                    $dropdown.scrollTop(offsetTop);
                } else if (offsetTop > lowerBound) {
                    $dropdown.scrollTop(offsetTop - maxHeight + heightDelta);
                }
            }
        },
        _hideList:function($modal){
            var _self = this;
            $modal.find(".loongquery-list-box").css('display', 'none');
            $(document).off('click',function(event){
                _self._documentEvent($modal,event);
            });
            $(document).off('keydown','.loong-search-input');
        },
        _showList:function($modal){
            var _self = this;
            _self._setPosition($modal);
            $modal.find(".loongquery-list-box").css('display', 'block');
            $(document).on('click',function(event){
                _self._documentEvent($modal,event);
            });
        },
        _documentEvent:function($modal,event){
            var _self = this;
            var e = event || window.event,
                con = $modal.find(".loongquery-wrap .loong-search-box");
            if(!con.is(e.target) && con.has(e.target).length == 0){
                _self._hideList($modal);
            }
        }
    }

}(jQuery));
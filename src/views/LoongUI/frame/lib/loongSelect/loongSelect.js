import { select_text } from '@/views/LoongUI/frame/lib/loongSelect/loongSelect-i18n.js'
(function($){
    $.fn.loongSelect=function(options){
        var config= $.extend({
            'width': '',
            'height':'32px',
            'name': '',
            'outer':"",
            'ajaxData': false,
            "title":false,
            'onChange': '',
            'getData': "",
            'allowSearch': false,
            'data': [{
                'key': '1',
                'value': '1'
            }],
            'multi': false,
            'callback': undefined

        },options);
            var $container=$(this);
            var loongselect = new LoongSelect();
            loongselect.init($container,config);
            return loongselect;
    };
    var formatData=function(str){
        return parseInt(str);
    };

    function LoongSelect(){
        this.keyArr = [];
        this.valueArr = [];

    }

    LoongSelect.prototype ={
        init: function($container,config){
            this.$container = $container;
            this.config = config;
            if($container.find(".select-wrap").length){
                $container.find(".select-wrap").remove();
            }
            this.selectBox($container,config);
        },
        selectBox:function($container,config){
            var $dom = $("<div class='select-wrap'></div>"),
                $selectBox = $("<div class='select-box'><input class='select-input' ><div class='select'></div></div>"),
                $icon = $("<div class='select-icon'><svg class='icon'><use xlink:href='#icon-xiajiantou'></use></svg></div>"),
                $listBox = $("<div class='list-box'><ul class='option-list'></ul></div>"),
                selectWidth = formatData(config.width);
            $selectBox.find("input").attr('name',config.name);
            $dom.css({'width':selectWidth+'px' });
            $dom.css({'height':formatData(config.height)+'px','line-height':formatData(config.height)+'px'});
            $selectBox.css({'height':formatData(config.height)+'px','line-height':formatData(config.height)+'px'});
            $selectBox.append($icon);
            $dom.append($selectBox);
            $dom.append($listBox);
            $container.append($dom);
            if(config.outer){
                var self=this;
                $container.find(".select-box").on('click',function(){
                    if(self.$container.find(".select-wrap").hasClass("select-wrap-selected")){
                        self.hideList(self.$container)
                    }
                    else{
                        $container.find(".option-list").empty();
                        self.config.outer();                  
                        self.showList(self.$container,self.config);
                    }
                  

                })

            }
            else{
                var optionData;
            if(config.ajaxData){
                optionData = config.getData();
            }else{
                optionData = config.data;

            }
            this.dataList = optionData;
            if(!config.multi){
                this.selectList($container,config,optionData);
            }
            var self = this;
            $container.find(".select-box").on('click',function(){
                if(typeof self.config.callback == 'function'){
                   self.config.callback();
                }
                var flag =  self.$container.find(".select-input").attr("disabled");
                if(flag == 'disabled'){
                    return
                }else{
                    if(self.$container.find(".select-wrap").hasClass("select-wrap-selected")){
                        self.hideList(self.$container)
                    }else{
                        $(".select-wrap-selected").removeClass("select-wrap-selected");
                        $(document).off('click',self.hide);
                        if(self.config.ajaxData){
                            optionData = self.config.getData();
                        }else{
                            optionData = self.config.data;
                        }
                        self.dataList = optionData;
                       self.selectList(self.$container,self.config,optionData);
                        if(optionData.length>0){
                            self.showList(self.$container,self.config);
                        }
                    }
                }

            });
            if(config.allowSearch){
                this.setSearchBox($container,config,optionData);
            }
            }
          
           
        },
        selectList: function($container,config,optionData){
            if(optionData.length>0){
                if(!config.multi){
                    if( ! $container.find(".select-input").val()){
                         $container.find(".select").html(optionData[0].key);
                         $container.find(".select-input").val(optionData[0].value);
                         if(config.title){  
                            $container.find(".select").attr("title",optionData[0].key);
                         }

                     }

                }
                this.setList($container,config,optionData,$container.find(".select").html());


            }else{
                $container.find(".select").html(select_text['noData']);
                $container.find(".select-input").val("");

            }

        },
        setList: function($container,config,data,select){
            var self = this;
            var $ul = $container.find(".option-list");
            $ul.empty();
            if(config.multi && select){
                this.keyArr = select.split(",");
                this.valueArr = $container.find(".select-input").val().split(",");
            }
            for(var i=0;i<data.length;i++){
                if(config.multi){
                    var $check = $("<div class='check'><svg class='icon' aria-hidden='true'><use xlink:href='#icon-gou'></use></svg></div>");
                    var $li= $("<li class='option'><span>"+data[i].key+"</span></li>");
                    $li.css("padding","0 20px 0 10px");
                    $li.append($check);
                    var selects = select.split(",");
                    for(var j = 0;j < selects.length;j++){
                        if(data[i].key == selects[j]){
                            $li.addClass("option-selected");
                            $li.find(".check .icon").addClass("check-selected");
                        }
                    }
                }else{
                    var $li= $("<li class='option'>"+data[i].key+"</li>");
                    if(data[i].key == select){
                       $li.addClass("option-selected");
                    }
                }      
                if(config.title){
                  $li.addClass("toe");
                  $li.attr("title",formaterTitle(data[i].key));
                }   
                $li.css({'height':formatData(config.height)+'px','line-height':formatData(config.height)+'px'});
                $li.attr("vals",data[i].value);
                $li.on('click',function(){
                    var select=$(this),
                    config = self.config;
                    if(config.multi){
                        self.setContent(select.find("span").html(),select.attr('vals'),$(this));
                    }else{
                        self.setContent(select.html(),select.attr('vals'),$(this));
                    }
                    

                });
                $ul.append($li);
            }

        },
        setContent: function(key,value,select){
            var selectKey,selectValue;
            if(arguments.length == 1){
                var dataList = this.dataList;
                var text;
                var arg = arguments[0];
                $.each(dataList,function(i,data){
                    if(data.value == arg){
                        text = data.key
                    }
                });
                if(text){
                    selectKey = text;
                    selectValue = arg;
                }
            }else{
                selectKey = key;
                selectValue = value;
            }
            if(selectKey!=undefined&&selectValue!=undefined){

            }else{
                selectKey = this.dataList[0].key;
                selectValue = this.dataList[0].value;
            }
            if(this.config.multi){
                if(select.hasClass("option-selected")){
                    this.keyArr.splice($.inArray(selectKey,this.keyArr),1);
                    this.valueArr.splice($.inArray(selectValue,this.valueArr),1);
                    select.removeClass("option-selected");
                    select.find(".check .icon").removeClass("check-selected");
                }else{
                    this.keyArr.push(selectKey);
                    this.valueArr.push(selectValue);
                    select.addClass("option-selected");
                    select.find(".check .icon").addClass("check-selected");
                }
                this.$container.find(".select").html(this.keyArr.join(","));
                this.$container.find(".select-input").val(this.valueArr.join(","));
                if(this.config.title){
                    this.$container.find(".select").addClass("toe");
                    this.$container.find(".select").attr("title",formaterTitle(this.keyArr.join(",")));
                }
            }else{
                this.$container.find(".select").html(selectKey);
                this.$container.find(".select-input").val(selectValue);
                if(this.config.title){
                    this.$container.find(".select").attr("title",selectKey);
                }
                this.hideList(this.$container);
            }
            if(this.config.onChange){
                var obj = {};
                var data = this.dataList;
                for(var i = 0; i < data.length; i++){
                    if(data[i].value == selectValue){
                        obj = data[i];
                    }
                }
                this.config.onChange(selectValue,selectKey,obj);
            }
        },
        hideList: function($container){
            var self = this;
            $container.find(".select-wrap").removeClass("select-wrap-selected");
            $(document).off('click',self.hide);
        },
        showList: function($container,config){
            if(config.allowSearch){
                $container.find(".select-search-input").val("");
            }
            var self = this;
            this.setPosition($container,config);
            $container.find(".select-wrap").addClass("select-wrap-selected");
            $(document).on('click',{self:self},self.hide);
        },
        hide: function(event){
            var self = event.data.self;
            var e=event||window.event,
                con = self.$container.find(".select-wrap");

            if(!con.is(e.target) && con.has(e.target).length === 0){
                self.hideList(self.$container);
            }
        },
        setPosition: function($container,config){
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
        setSearchBox: function($container,config,optionData){
            var $search=$("<div class='select-search-box'><input class='select-search-input' autocomplete='off' placeholder='"+select_text['search']+"'><div class='search-icon'></div></div></div>");
            $search.css({'height':formatData(config.height)+'px','line-height':formatData(config.height)+'px'});
            $container.find(".option-list").before($search);
            var self = this;
            $search.find(".select-search-input").on("input",function(){
               self.doSearch($container,config,optionData);
            });
        },
        doSearch: function($container,config,optionData){
            var self=this;
            if(typeof self.config.callback == 'function'){
                self.config.callback();
                optionData=config.data;
             }         
            var str = $container.find(".select-search-input").val(),
                $list = $container.find(".option-list"),
                arr=[];
            var select = $container.find(".select").html();
            if(str ==""){
                $list.empty();
                this.setList($container,config,optionData,select);
            }else{

                for(var i=0;i<optionData.length;i++){
                    if(optionData[i].key.indexOf(str)>=0){
                        arr.push(optionData[i]);
                    }
                }
                if(arr.length>0){
                    this.setList($container,config,arr,select);
                }else{
                    $list.empty();
                    var $dom = $("<li class='select-no-result'>"+select_text['noResult']+"</li>");
                    $list.append($dom);


                }
        }
    },
        setDisabled: function(){
            this.$container.find(".select-input").attr("disabled","disabled");
            this.$container.find(".select-box").addClass("disabled");
        },
        setEnable : function(){
            this.$container.find(".select-input").removeAttr("disabled");
            this.$container.find(".select-box").removeClass("disabled");
        },
        getSelectValue: function(){
           return  this.$container.find(".select-input").val();
        }

}

})(jQuery);

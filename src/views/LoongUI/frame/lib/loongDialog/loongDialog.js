//@ sourceURL= loongDialog.js
(function($) {
    "use strict";
    $.extend({
        loongDialog: function(options) {
            var config = $.extend({
                "width": "580px",
                "content": "",
                "isModal": true,
                "isInfo":false,
                "modalType": "min",
                "msgType": "error",
                "fixed": true,
                "isDrag": true,
                "buttons": [],
                "note":false,
                "noteDef":false,
                "noteTip":"",
                "tipClose":false,
                "tipTime":undefined,
                "onClose": undefined
            }, options);
            var $modal = $("<div class='dialog-wrap'>");
            var modal = new LoongDialog($modal, config);
            return modal;
        }
    });
    var modalButtonClick = function(e) {
        var flag = true;
        var btn = e.data[0];
        var $modal = e.data[1];
        var onClose = e.data[2];
        var callback = btn.callback;
        if (typeof callback === 'function') {
            flag = callback.call(this, e);
        }
        if (flag) {
            hide($modal,onClose);
        }
    };
    var hide = function($modal,onClose) {
        if (undefined != onClose && typeof onClose === 'function') {
            onClose.call(this);
        }
        $modal.empty();
        var index = $modal.attr("index")
        $('body').find(".dialog-container[index=" + index + "]").remove();
        $('body').find(".dialog-wrap[index=" + index + "]").remove();
    }

    function LoongDialog($modal, config) {
        this._init($modal, config);
    }
    LoongDialog.prototype = {
        _init: function($modal, config) {
            this.$modal = $modal;
            this.config = config;
            var that = this;
            if (config.isModal == true) {
                $modal.appendTo($('body'));
                if (undefined == $('body').find(".dialog-container")[0]) {
                    $modal.attr("index", "1");
                    $('<div class="dialog-container" index=1>').appendTo($('body'));
                } else {
                    var index = parseInt($('body').find(".dialog-container").length) + 1;
                    $modal.attr("index", index);
                    var zIndex = 10000 + index;
                    $("<div class='dialog-container' style='z-index:" + zIndex + "'  index=" + index + ">").appendTo($('body'));
                    var modalIndex = zIndex + 1;
                    $modal.css("z-index", modalIndex);
                }
                this._modelWrap($modal, config);
                this._addButton($modal, config.buttons, config);
                this._setTitle($modal, config.title);
                this._setContent($modal, config, config.content);
                this._autoCenter($modal, config);
                window.addEventListener("resize", function() {
                    that._autoCenter($modal, config);
                });
                $modal.find(".mb-body").scroll(function() {
                    $("body").find(".err-tip").remove();
                });
            } else {
                var $hasNotice=$(".loong-notice-dialog");
               
                var index, code;
                if (undefined == $('body').find(".loong-notice-dialog")[0]) {
                    index = 1;
                } else {
                    index = parseInt($('body').find(".loong-notice-dialog").last().attr("index")) + 1;
                }
                // $('body').find(".loong-notice-dialog").remove();
                var notice = $("<div class='loong-notice-dialog'" + "index=" + index + ">").appendTo($('body'));
                if (config.msgType == "warning") {
                    code = "#icon-tipwarning";
                }
                if (config.msgType == "error") {
                    code = "#icon-tiperror";
                }
                if (config.msgType == "success") {
                    code = "#icon-tipsuccess";
                }
                var icon = "<span class='cf'><svg class='icon fs18' aria-hidden='true'><use xlink:href='"+code+"'></use></svg></span>";
                var appendContent = "<div class='loong-notice-content-pan clearfix'><div class='fl loong-notice-type" + " dialog-" + config.msgType + "'>" + icon + "</div><div class='fl loong-notice-mes-wrap'>" + config.content + "</div></div>";
                notice.html(appendContent);
                notice.fadeIn();
                var lineHeight = $(".loong-notice-dialog").last().find(".loong-notice-mes-wrap").height() + 20;
                if(lineHeight>36){
                    notice.find(".loong-notice-mes-wrap").css({"text-align":"left"});  
                }
                if(config.tipClose){
                    notice.find(".loong-notice-mes-wrap").css({width:"376px","padding-right":"2px"})
                    var $tipClose=$("<span  class='hand loong-notice-tip' name='loong-notice-close'><svg class='icon fs16 color-blue' aria-hidden='true'><use xlink:href='#icon-gaojingguanbi'></use></svg></span>");
                    notice.find(".loong-notice-content-pan").append($tipClose);
                }
                $(".loong-notice-dialog").last().find(".loong-notice-type").css({
                    "line-height": lineHeight + 'px',
                    "height": lineHeight + 'px'
                }); 
                $("span[name=loong-notice-close]").click(function(){
                 
                 $(this).parents(".loong-notice-dialog").remove();
                
                })
                $.each($hasNotice, function(k,hasWrap){
                    var hastop=parseInt($(hasWrap).css("top"))+lineHeight+15;
                    $(hasWrap).css("top",hastop+"px")     
                });
                this._fadeOut(index,config);
            }
            if (config.isDrag) {
                $($modal).find('.mb-title').css("cursor", 'move');
                this._dragDialog($modal, config);
            }
            if (config.isResize) {
                $($modal.find(".mb")).append($("<div class='loong-resize'></div>"));
                this._resizeDialog($($modal).find('.mb'), config);
            }
        },
        _modelWrap: function($modal, config) {
           var _that=this;
            if ("max" == config.modalType) { //大弹窗
                config.width = '860px';
                config.height = '545px';
            }else if("min" == config.modalType) {
                config.width = "580px";
            }
            $modal.css("width", parseFloat(config.width) + 'px');
            var $dialogBox = $('<div class="mb-box">').appendTo($modal);
            var $msgBox = $("<div class='mb' style='width:" + parseFloat(config.width) + 'px' + "'>").appendTo($dialogBox);
            if (config.title != undefined) {
                var $title = $('<div class="mb-title">').appendTo($msgBox);
            }
            var $closeBtn = $('<div class="mb-close">')
                .html('<svg class="icon" aria-hidden="true"><use xlink:href="#icon-guanbi1"></use></svg>')
                .appendTo($msgBox);
            var $content = $('<div class="mb-body-wrap" style="width:'+parseFloat(config.width)+'px"><div class="mb-container"><div class="mb-body"></div></div></div>').appendTo($msgBox);
            if (config.buttons.length != 0) {
                var $buttons = $('<div class="mb-buttons"><div class="btns-wrap"></div></div>').appendTo($modal.find(".mb-container"));
                if ("min" == config.modalType) {
                    config.minHeight = "257px" ;
                } else {
                    config.height = "433px";
                }
            } else {
                if ("min" == config.modalType) {
                    config.minHeight = "320px";
                } else {
                    config.height = "496px";
                }
            }
            if (undefined != config.minHeight) {
                $content.find(".mb-body").css('min-height', parseFloat(config.minHeight) + 'px');
            }
            if (undefined != config.maxHeight) {
                $content.find(".mb-body").css('max-height', parseFloat(config.maxHeight) + 'px');
            }
            if (undefined != config.height) {
                $content.find(".mb-body").css('height', parseFloat(config.height) + 'px');
            }
            $closeBtn.on("click", function() {   
                var flag=true;
                var onClose=config.onClose;
                if (undefined != onClose && typeof onClose === 'function') {
                    var returnFlag=config.onClose.call(this);
                    if(returnFlag!=undefined){
                        flag=returnFlag;
                    }           
                }
                if(flag){
                    _that.hideDialog()
                }
            });
            if (config.title != "") {
                $title.css("text-align", "left");
            }
        },
        _setTitle: function($modal, title) {
            $modal.find("div.mb-title").html(title);
        },
        _setContent: function($modal, config, content) {
            if(config.isInfo){
                var $imgBox = $("<div class='info-wrap'><img src='"+require('@/views/LoongUI/frame/lib/loongDialog/img/info.png')+"'><p></p></div>");
                $imgBox.find("p").html(content);
                $modal.find("div.mb-body").html($imgBox);
            }else{
                $modal.find("div.mb-body").html(content);
            }
            // $modal.find('.form-input').css("width", inputWidth);
        },
        _addButton: function($modal, buttons, config) {
            var _self = this;
            if (config.buttons.length != 0) {
                var $bContent = $modal.find("div.btns-wrap");
                $.each(buttons, function(i, btn) {
                    var $btn = $('<div>').html(btn.txt).appendTo($bContent);
                    if (undefined == btn.className) {
                        if (buttons.length == 2) {
                            $btn.addClass("mb-button");
                        } else if (buttons.length == 1) {
                            $btn.addClass('custom-button')
                            $btn.css("cursor", "pointer");
                        }
                    } else {
                        $.each(btn.className, function(j, classn) {
                            $btn.addClass(classn);
                        });
                    }
                    $btn.on("click", [btn, $modal, config.onClose],
                        modalButtonClick);
                });
                if(config.note){
                    var $noteInfo = $("<div class='btn-note'><span class='check-pan'><input type='hidden' name='isSelected' value='"+(config.noteDef == '' ? false : config.noteDef)+"'><svg class='icon fs14 cf' aria-hidden='true'><use xlink:href='#icon-danxuanxuanzhong1'></use></svg></span><span class='c3 fs12 pl5' name='noteTip'><span></div>").appendTo($modal.find(".mb-buttons"));
                    if(config.noteDef == true){
                        $noteInfo.find('.check-pan').addClass('check-selected');
                    }else{
                        $noteInfo.find('.check-pan').removeClass('check-selected');
                    }
                    $noteInfo.find("span[name=noteTip]").html(config.noteTip);
                    _self._toogleNode($modal);
                }
            }
        },
        _toogleNode:function($modal){
            $modal.find(".btn-note .check-pan").click(function(event) {
                if($(this).find("input[name=isSelected]").val() == "false"){
                    $(this).addClass('check-selected');
                    $(this).find("input[name=isSelected]").val("true");
                } else{
                    $(this).find("input[name=isSelected]").val("false");
                    $(this).removeClass('check-selected');
                }
          });
        },
        _fadeOut: function(index,config) {
            var time;
            if(config.tipTime!=undefined){
                time=config.tipTime;
            }
            else{
                if(config.msgType=="warning"){
                    time=5000
                 }
                 if(config.msgType=="error"){
                    time=5000
                 }
                 if(config.msgType=="success"){
                    time=3000;
                 }
            }           
            setTimeout(function() {
                var notice = $("body").find(".loong-notice-dialog");
                $.each(notice, function(j,item){
                    if ($(item).attr("index") == index){
                        $(item).fadeOut(function(){
                            $(item).remove();
                        })                    
                    }
                });
               
            }, time)
        },
        _autoCenter: function($dialog, config) {
            var bodyW = $(window).width();
            var bodyH = $(window).height();
            var elW = $dialog.width();
            var elH = $dialog.height();
            var position = config.fixed ? "fixed" : "absolute";
            var left = Math.max(0, (bodyW - elW) / 2);
            var height = Math.max(0, (bodyH - elH) / 2);
            $dialog.css({
                "position": position,
                "left": left + 'px',
                "top": height + 'px'
            });
        },
        _dragDialog: function($dialog, config) {
            var isDraging = false; // 不可拖动
            var startResize;
            var _Doc = $(document);
            var moveElem = $dialog.find('.mb-title');
            var dicts = {};
            // 鼠标按下
            moveElem.mousedown(function(e) {
                var formEnter = $(".dialog-wrap").find('input,textarea');
                formEnter.each(function(i, j) {
                    if ($(j).is(':focus')) {
                        $(j).blur()
                    }
                })
                e = e || window.event;
                dicts.offset = [e.clientX - parseFloat($dialog.css('left')),
                    e.clientY - parseFloat($dialog.css('top'))
                ]
                isDraging = true; // 鼠标按下后标记对话框可拖动
                e.preventDefault();
                $("body").find(".err-tip").remove();
                // if (undefined != config.removeValids && typeof config.removeValids === 'function') {
                //     config.removeValids.call(this);
                // }
            })
            // 鼠标在文档移动移动更新弹窗位置
            _Doc.mousemove(
                function(e) {
                    if (isDraging) {
                        // $(".dialog-wrap").find('input').blur();
                        var X = e.clientX - dicts.offset[0]; // 移动后对话框新的left值
                        // var x1=e.clientX;
                        var Y = e.clientY - dicts.offset[1] // 移动后对话框新的top值
                        e.preventDefault();
                        // 设置拖动范围
                        dicts.stX = config.fixed ? 0 : $(window)
                            .scrollLeft();
                        dicts.stY = config.fixed ? 0 : $(window)
                            .scrollTop();
                        var maxX = $(window).width() - $dialog.width() +
                            dicts.stX;
                        var maxY = $(window).height() - $dialog.height() +
                            dicts.stY;
                        // 控制元素不被拖出窗口外
                        X < dicts.stX && (X = dicts.stX);
                        X > maxX && (X = Math.max(0, maxX));
                        Y < dicts.stY && (Y = dicts.stY);
                        Y > maxY && (Y = Math.max(0, maxY));
                        // X = Math.min(Math.max(0, X), maxX);
                        // Y = Math.min(Math.max(0, Y), maxY);
                        // console.log(X+"AAA"+Y)
                        // 重新定位+"AAA"+Y
                        $dialog.css({
                            "left": X + 'px',
                            "top": Y + 'px'
                        });
                    };
                }).mouseup(function() {
                isDraging = false;
            });
            moveElem.mouseup(function() {
                isDraging = false;
            });
        },
        _resizeDialog: function($dialog, config) {
            var layero = $dialog.find(".mb-content")
            var dict = {};
            var resizeElem = $dialog.find(".loong-resize");
            var _Doc = $(document);
            var btnHeight = parseFloat($dialog.find('.mb-buttons')
                .outerHeight());
            var headerHeight = parseFloat($dialog.find('.mb-title')
                .outerHeight());
            resizeElem.mousedown(function(e) {
                dict.resizeStart = true;
                dict.offset = [e.clientX, e.clientY];
                dict.area = [$dialog.outerWidth(), $dialog.outerHeight()];
            });
            _Doc.on(
                "mousemove",
                function(e) {
                    if (dict.resizeStart) {
                        if (/firefox/.test(navigator.userAgent
                                .toLowerCase())) {
                            $dialog.css('-moz-user-select', 'none');
                        }
                        if (/chrome/
                            .test(navigator.userAgent.toLowerCase())) {
                            $dialog.css('-webkit-user-select', 'none');
                        }
                        var X = Math.min(e.clientX, $(window).outerWidth()) -
                            dict.offset[0],
                            Y = Math.min(e.clientY,
                                $(window).outerHeight()) -
                            dict.offset[1];
                        e.preventDefault();
                        var Width = dict.area[0] + X;
                        var Height = dict.area[1] + Y;
                        if (Width < 346) {
                            Width = 346
                            // 弹窗最小宽度
                        }
                        if (Height < 150) {
                            Height = 150
                        }
                        $dialog.css({
                            "width": Width,
                            "height": Height
                        })
                        $dialog.find(".mb-content").css({
                            "width": Width,
                            "height": Height - btnHeight - headerHeight
                        })
                        dict.isResize = true;
                    }
                    // config.resizing && config.resizing(layero);
                }).on("mouseup", function(e) {
                if (dict.isResize) {
                    $dialog.css('-moz-user-select', 'text');
                    $dialog.css('-webkit-user-select', 'text');
                    delete dict.resizeStart;

                }
            })
        }
    };
    LoongDialog.prototype.hideDialog = function(onClose){
        var $modal = this.$modal;
        hide($modal, onClose);
    },
    LoongDialog.prototype.autoCenter = function(){
        var $modal = this.$modal;
        var config = this.config;
        this._autoCenter($modal,config);
    }
}(jQuery));
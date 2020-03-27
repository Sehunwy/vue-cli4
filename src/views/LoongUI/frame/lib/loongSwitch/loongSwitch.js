(function ($) {
    $.fn.loongSwitch = function (options) {
        var config = $.extend({
            disabled: false,
            activeText:"开关打开",
            inactiveText: "开关关闭",
            name: "",
            state: true,
            change:'',
            bgColor:"#27CA42"
        }, options);
        this.each(function () {
            var $container = $(this);
            var loongSwitch = new LoongSwitch();
            loongSwitch.init($container,config);
            return loongSwitch
        });

    };

    function LoongSwitch() {

    }

    LoongSwitch.prototype.init = function ($container, config) {

        var $dom = $("<div class='loong-switch clearfix'><input type='text' class='loong-switch-input' name='"+config.name+"' /><div class='loong-switch-btn'></div><span class='loong-switch-text'></span></div>");
        if (config.state) {
            $dom.addClass("loong-switch-open");
            $dom.find(".loong-switch-text").html(config.activeText);
            $dom.find(".loong-switch-input").val(true);
            $dom.find(".loong-switch-btn").css('background-color',config.bgColor);
        }else{
            $dom.find(".loong-switch-text").html(config.inactiveText);
            $dom.find(".loong-switch-input").val(false);
        }
        if(config.disabled){
            $dom.addClass("loong-switch-disabled");
        }
        this.$container = $container;
        this.config = config;
        $container.append($dom);
        $container.find(".loong-switch-btn").bind("click",config,function(){
            var flag;
            var $switch = $(this).parents(".loong-switch");
            if(!$switch.hasClass("loong-switch-disabled")){
                if($switch.hasClass("loong-switch-open")){
                    $switch.removeClass("loong-switch-open");
                    $switch.find(".loong-switch-text").html(config.inactiveText);
                    $switch.find(".loong-switch-input").val(false);
                    $dom.find(".loong-switch-btn").css('background-color','#CED4DA');
                    flag = false;

                }else{
                    $switch.addClass("loong-switch-open");
                    $switch.find(".loong-switch-text").html(config.activeText);
                    $switch.find(".loong-switch-input").val(true);
                    $dom.find(".loong-switch-btn").css('background-color',config.bgColor);
                    flag = true;
                }
                if($.isFunction(config.change)){
                    config.change(flag);
                }

            }

        });
        if(config.change){
            config.change(config.state);
        }

    };

    LoongSwitch.prototype.setDisabled = function () {

        this.$container.find(".loong-switch").addClass("loong-switch-disabled");
    };

    LoongSwitch.prototype.setEnabled = function () {

        var $switch = this.$container.find(".loong-switch");
        if($switch.hasClass("loong-switch-disabled")){
            $switch.removeClass("loong-switch-disabled");
        }

    };


})(jQuery);
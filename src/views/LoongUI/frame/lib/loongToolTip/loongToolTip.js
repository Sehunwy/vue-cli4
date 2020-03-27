(function($){
    $.extend({
        loongToolTip : function($dom){
            var $tips = $dom.find("[data-toggle='tooltip']");
            $tips.each(function(){
              LoongToolTip.prototype.self  = new LoongToolTip($(this));
            });
            $(".scroll-page").off("scroll");
            $(".scroll-page").on("scroll",function() {
                $(".tooltip").remove();
            });
        }
    });


  function LoongToolTip($dom){
     this._init($dom);
  }

  LoongToolTip.prototype ={
      _init: function($dom){
         $dom.on("mouseover",function(e){
           var event = window.event||e;
           var _self  = LoongToolTip.prototype.self;
           var config={};
             config.position =  $(this).attr("data-placement");
             config.content = $(this).attr("data-title");
             config.visible = $(this).attr("data-tooltip-visible");
            _self._createDom(config,$(this));
            _self._setPosition(config,$(this));

          });
         $dom.on("mouseout",function(e){
             $(".tooltip").remove();
          })
      },
      _createDom:function(config){
          if($("body").find(".tooltip")){
              $(".tooltip").remove();
          }
        var $tipContainer = $("<div class='tooltip'></div>"),
            $tipInner = $("<div class='lg-tip-inner'></div>"),
            $tipArrow = $("<div class='lg-tip-arrow'></div>");
            $tipInner.html(config.content);
            $tipContainer.append($tipArrow);
            $tipContainer.append($tipInner);
          switch(config.position){

              case "left":
                    $tipContainer.addClass("left");

                break;

              case "right":
                  $tipContainer.addClass("right");

                  break;

              case "top":
                  $tipContainer.addClass("top");

                  break;

              case "bottom":
                  $tipContainer.addClass("bottom");

                  break;
          }

         if(config.visible == "false" || false){
              $tipContainer.css({"display":"none"});
         }

         $("body").append($tipContainer);




      },
      _setPosition: function(config,$dom){
          var tipH = $(".tooltip").outerHeight(),
              tipW =  $(".tooltip").outerWidth(),
              domH = $dom.outerHeight(),
              domW = $dom.outerWidth();
          var top,left;
          var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft,
               scrollY = document.documentElement.scrollTop || document.body.scrollTop,
               x = $dom.offset().left+scrollX ,
               y = $dom.offset().top+scrollY;
          switch(config.position){
              case "top":
                    top = y-tipH-5;
                    left = x+domW/2-21;
                   break;
              case "bottom":
                   top = y+domH+5;
                   left = x+domW/2-21;
                    break;
              case "left":
                   top = y-15+domH/2;
                   left = x-tipW-5;
                   break;
              case "right":
                   top = y-15+domH/2;
                   left = x+domW+5;
                  break;
          }


          $(".tooltip").css({"top":top,"left":left});
      }
  }
}(jQuery));




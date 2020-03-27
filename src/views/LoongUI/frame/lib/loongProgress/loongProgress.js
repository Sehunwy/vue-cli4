(function($) {
  "use strict";
  var slideColor = {
        "blue": "#1188DD",
        "red": "#ff2222"
    };
   $.extend({
        percentFormat: function(percent) {
            percent = "" + percent;
            var percents = {};
            if (percent.indexOf("%") == -1) {
                percents.percentf = percent;
                percents.percent = Math.round(10000 * percent) / 100 + '%';
                percents.percentRad = Math.round(10000 * percent) / 100 / 100 * (Math.PI * 2);
            } else {
                percents.percentf = percent.substring(0, percent.length - 1) / 100;
                percents.percent = percent;
                percents.percentRad = percent.substring(0, percent.length - 1) / 100 * (Math.PI * 2);
            }

            if (parseFloat(percents.percentf) > 1) {
                percents.percent = "100%";
                percents.percenf = 1;
                percents.percentRad = Math.PI * 2;
            }
            return percents;
        },
        easeInOutCubic:function(a,b,c,d) {
            a /= d / 2;
            if (a < 1)
              return c / 2 * a * a * a + b;
            a -= 2;
              return c / 2 * (a * a * a + 2) + b;
        }
    });
   var getColor = function(config,val){
        var percents = $.percentFormat(val);
        var bgColor = "";
        if (config.isColor) {
              if (0 <= percents.percentf && 0.7 >= percents.percentf) {
                bgColor = slideColor.blue;
              } else {
                bgColor = slideColor.red;
              }
        } else {
            var delfault = config.color;
            bgColor = delfault;
            if (typeof delfault == 'object') {
                var colorRange = Object.keys(config.color);
                for (var i = 1; i < colorRange.length; i++) {
                    var bottomVal = colorRange[i - 1],
                        topVal = colorRange[i],
                        bottomColor = delfault[bottomVal],
                        topColor = delfault[topVal];
                    if(config.isGradient && config.isCircle){
                        var colorArray = [];
                        colorArray.push(bottomColor);
                        colorArray.push(topColor);
                        bgColor = colorArray;
                    } else {
                      if (0 <=  percents.percentf * 100 && bottomVal.substring(3) >= percents.percentf * 100) {
                          bgColor = bottomColor
                          break;
                      } else if (bottomVal.substring(3) < percents.percentf * 100 && topVal.substring(3) >= percents.percentf *100) {
                          bgColor = topColor
                          break;
                      }
                    }
                }
            }
        }
        return bgColor;
   }
   window.animateFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();
  $.fn.loongProgress = function(options) {
    var config = $.extend({
      isCircle:true,  // true:circle,false:Line
      isColor:false,//true：默认配置 false:color
      isGradient:false,//是否渐变
      color:{'per50':"#32E8FF",'per100':"#C832FF"},//"#1188dd"
      // color: "#1188dd", // "#1188dd",{'per50':"#C832FF",'per100':"#32E8FF"}
      backgroundColor: "#E9ECEF",
      background: true,
      speed: 800,
      slideHeight:5,//circle:环形宽度 line：高度
      value: 0.66,//当前进度
      counterclockwise: false,//true:逆时针
      size: 110,//circle:外直径 line：宽度
      lineCap: "round",
      text: false,
      initGap: 0,//记录上次值位置
      panRadius:2,
      slideRadius:2,
      txt:'',
      fontSize:'12px',
      fontColor:'',
      fontFamily:'PingFangSC-Regular',
      fontWeight:'500',
      txtPosition:'right',  //center top bottom right
      startAngle: 1.5 * Math.PI,//开始角度
      endAngle: 3.5 * Math.PI,//结束角度
      scale:false,//是否有刻度
      scaleWidth:2,//刻度宽度
      scaleHeight:5,//刻度长度
      shadowBlur:true
    },options);
    var dom;
    this.each(function(){
       var container = this;
       var data = $(container).data();
       config = $.extend(config,  data);
       dom = new LoongProgress(container, config);
    });
    return dom;
}
   var LoongProgress = function(container, config){
      return this.init(container,config);
    };
    LoongProgress.prototype = {
      init:function(container,config){
            this.container = container;
            this.config = config;
            $(container).css("position","relative");
            if(config.isCircle){
                if (!$(container).find('canvas').length) {
                   $(container).append($("<canvas class='loongprogress'></canvas>"));
                   $(container).find('canvas').attr({width:config.size,height:config.size});
                }
                  config.initGap = config.init ? config.init : config.initGap;
                  config.startAngle = config.start ? config.start : config.startAngle;
                  var canvas = $(container).find("canvas.loongprogress").get(0);
                  if(canvas){
                      this.ctx = canvas.getContext("2d");
                      this.start = config.startAngle;
                      this.value = $.percentFormat(config.value).percentRad;
                      this.initGap = config.initGap;
                      this.center = config.size / 2;
                      this.radius = this.center - config.slideHeight;
                      this.lineWidth = config.slideHeight;
                      this.sAngle = this.initGap;
                      this.endAngle = config.endAngle;
                      $(container).data("size", config.size);
                      this.progress(container, config, this.ctx);
                  }
            }else{
                if(!$(container).find('.panWrap').length){
                    $(container).append("<div class='panWrap loongprogress'></div>");
                    var size = (-1 == config.size.toString().indexOf("%"))? config.size+"px": config.size;
                    $(container).find('.panWrap').css({
                        "background-color": config.backgroundColor,
                        "border-radius": config.panRadius,
                        "width": size,
                        'height': parseInt(config.slideHeight) + "px",
                    });
                    var percentSlide = $("<div class='percentSlide'></div>");
                     $(percentSlide).css({
                            'height': parseInt(config.slideHeight) + "px",
                            'border-radius': config.slideRadius,
                        });
                     $(container).find('.panWrap').append(percentSlide);
                }
                this.progress(container, config);
            }
            return container;
      },
      progressTxt:function(container,config){
        if(!$(container).find(".percentText").length){
            var position = config.txtPosition;
            var $txt = $("<div class='percentText'></div>");
            $txt.css({
              "color": config.fontColor,
              "font-size": config.fontSize,
              "font-family":config.fontFamily,
              "font-weight":config.fontWeight
            });
            $txt.html(config.txt);
            switch(position){
                case 'top':
                    $(container).find('.loongprogress').before($txt);
                    break;
                case 'bottom':
                    $(container).append($txt);
                    break;
                case 'center':
                    $(container).append($txt);
                    if(config.isCircle){
                      $(container).css('text-align', 'center');
                      $(container).find('.percentText').css({
                          "position": 'absolute',
                          "width": config.size+"px",
                          "top":"50%",
                          "left":"50%",
                          "transform": "translate(-50%,-50%)",
                          "text-align":"center"
                      });
                    }
                    break;
                case 'right':
                    $(container).append($txt);
                    $(container).find('.percentText').css({
                      "position": 'absolute',
                      "left": config.size +"px",
                      "padding-left":"10px",
                    });
                    if(config.isCircle){
                       $(container).find('.percentText').css({
                          "top":"0",
                          "line-height": config.size+"px",
                        });
                    }else{
                        $(container).find('.percentText').css({
                           "top":"-8px",
                        });
                    }
                    break;
            }
        } else {
              var $txt =$(container).find('.percentText');
              $txt.css({
                  "color": config.fontColor,
                  "font-size": config.fontSize,
                  "font-family":config.fontFamily,
                  "font-weight":config.fontWeight
              });
              $txt.html(config.txt);
        }

      },
      progress:function(container,config,ctx){
        if(config.isCircle){
            if ($.percentFormat(config.value).percentf !== 0) {
               this.animate(container, ctx, new Date().getTime(), new Date().getTime(), this.initGap > this.value);
             } else {
              var _self = this;
              animateFrame(function(){
                ctx.clearRect(0, 0, _self.config.size, _self.config.size);
                if (_self.config.background) {
                   _self.drawBackground(ctx);
                }
              });
            }
        }else{
            animateFrame(function(){
                $(container).find('.percentSlide').css({
                    "backgroundColor":getColor(config, config.value),
                    "width": $.percentFormat(config.value).percent
                   });
            });
        }
        if(config.txt != "" || config.txt != undefined){
                this.progressTxt(container,config);
          }
      },
      drawBackground:function(ctx) {
        ctx.beginPath();
        ctx.arc(this.center, this.center, this.radius, this.start, this.endAngle);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.config.backgroundColor;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.shadowColor = '#fff';
        ctx.stroke();
        if(this.config.scale){
          this.drawScale(ctx);
        }
      },
      drawScale:function(ctx){
        var startPos = this.config.startAngle,
             endPos = this.config.endAngle - 2 * Math.PI;
        var startPoint = this.radius - 10 - this.config.scaleHeight;
        var startPointX = startPoint * Math.cos(startPos),
            startPointY = startPoint * Math.sin(startPos);
        var endPoint =  this.radius - 10;
        var endPointX = endPoint * Math.cos(startPos),
            endPointY = endPoint * Math.sin(startPos);
        var scalePos = (this.config.endAngle - this.config.startAngle) * (180/Math.PI) / 10;
        for(var i = 0; i < 11; i++){
            ctx.save();
            ctx.beginPath();
            ctx.translate(this.center,this.center);
            var rotPos = i * scalePos * Math.PI/180;
            ctx.rotate(rotPos);
            ctx.strokeStyle = this.config.backgroundColor;
            ctx.lineWidth = 2;
            ctx.moveTo(startPointX,startPointY);
            ctx.lineTo(endPointX,endPointY);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();//恢复之前保存的状态
        }
      },
      draw:function(ctx) {
        ctx.beginPath();
        var circ = 2 * Math.PI;
        if (this.config.counterclockwise) {
          ctx.arc(this.center, this.center, this.radius, circ - this.start, circ - (this.start + (this.initGap/ circ) * (this.endAngle - this.start)), this.config.counterclockwise);
        } else {
          ctx.arc(this.center, this.center, this.radius, this.start, this.start + (this.initGap / circ)  * (this.endAngle - this.start), this.config.counterclockwise);
        }
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = this.config.lineCap;
        var strokeColor = getColor(this.config,this.initGap/ circ);
        if(!this.config.isGradient || this.config.isColor){
           ctx.strokeStyle = strokeColor;
        }else{
            var startX = this.center + this.radius * Math.cos(this.start),
                startY = this.center + this.radius * Math.sin(this.start),
                endX = this.center - this.radius * Math.cos(this.start),
                endY = this.center - this.radius * Math.sin(this.start);
            var grd = ctx.createLinearGradient(startX,startY,endX,endY);//渐变开始点和渐变结束点
            grd.addColorStop(0, strokeColor[0]);
            grd.addColorStop(1, strokeColor[1]);
            ctx.strokeStyle = grd;
        }
        if(this.config.shadowBlur){
           ctx.shadowOffsetY = 4;
           ctx.shadowBlur = 4;
           ctx.shadowColor = 'rgba(11,106,173,0.3)';
        }
        ctx.stroke();
      },
      animate:function(container, ctx, time, startTime, move) {
        // move:true,old > new false:old <= new
        var mspf = (new Date().getTime() - time) < 1 ? 1 : (new Date().getTime() - time);
        if ((time - startTime < this.config.speed * 1.05)&& (!move && (this.initGap) * 1000 <= Math.floor((this.value) * 1000) || move && (this.initGap) * 1000 >= Math.floor((this.value) * 1000))) {
          this.initGap =  $.easeInOutCubic((time - startTime) / mspf, this.sAngle, this.value - this.sAngle, this.config.speed / mspf);
          ctx.clearRect(0, 0, this.config.size, this.config.size);
          if (this.config.background) {
            this.drawBackground(ctx);
          }
          this.draw(ctx);
          time = new Date().getTime();
          var _self = this;
          animateFrame(function(){
            _self.animate(container, ctx, time, startTime, move);
          });
        } else {
          this.initGap = this.value;
          ctx.clearRect(0, 0, this.config.size, this.config.size);
          if (this.config.background) {
            this.drawBackground(ctx);
          }
          this.draw(ctx);
          this.save(container);
        }
      },
      save:function(container) {
        $(container).data("initGap", this.initGap);
        $(container).data("start", this.start);
      }
    };
}(jQuery));

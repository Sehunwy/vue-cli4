(function($){
	Date.prototype.getDays = function() { 
		return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate(); 
	};

    var  loongDateI18n={
		  "en":{
			  January:"Jan",
			  February:"Feb",
			  March:"Mar",
			  April:"Apr",
			  May:"May",
			  June:"Jun",
			  July:"Jul",
			  August:"Aug",
			  September:"Sept",
			  October:"Oct",
			  November:"Nov",
			  December:"Dec",
			  Sunday:"Sun",
			  Monday:"Mon",
			  Tuesday:"Tue",
			  Wednesday:"Wed",
			  Thursday:"Thu",
			  Friday:"Fri",
              Saturday:"Sat"
		  },
		  "zh":{
			January:"1月",
			February:"2月",
			March:"3月",
			April:"4月",
			May:"5月",
			June:"6月",
			July:"7月",
			August:"8月",
			September:"9月",
			October:"10月",
			November:"11月",
			December:"12月",
			Sunday:"星期日",
			Monday:"星期一",
			Tuesday:"星期二",
			Wednesday:"星期三",
			Thursday:"星期四",
			Friday:"星期五",
			Saturday:"星期六"
		  }

	}
	var dateI18n = function(code) {
		var lang = window.sessionStorage.language;
		if(lang){
			return  loongDateI18n[lang][code];
		}
	}
	var months = [dateI18n("January"),dateI18n("February"),dateI18n("March"),dateI18n("April"),dateI18n("May"),dateI18n("June"),dateI18n("July"),dateI18n("August"),dateI18n("September"),dateI18n("October"),dateI18n("November"),dateI18n("December")],
	short_months = [dateI18n("January"),dateI18n("February"),dateI18n("March"),dateI18n("April"),dateI18n("May"),dateI18n("June"),dateI18n("July"),dateI18n("August"),dateI18n("September"),dateI18n("October"),dateI18n("November"),dateI18n("December")];
	daysofweek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	$.fn.loongDatepicker = function(opts){
		var that = this;
		return initDate(that, "date", opts);
	}

	$.fn.loongTimepicker = function(opts){
		var that = this;
		return initDate(that, "time", opts);
	}

	$.fn.loongDatepickerfull = function(opts){
		var that = this;
		return initDate(that, "full", opts);
	}

	function initDate(that, type, opts){
		var input = $("<input class='loong-date-input' type='text'/>");
		var inputHidden = $("<input style='display: none' type='text'/>");
		if (opts && opts.name) {
			inputHidden.attr("name", opts.name);
		}
		if (opts && opts.width) {
			input.css("width", opts.width);
		}
		if(opts.readonly){
			input.attr("readonly", true);
		}
		$(that).append(input).append(inputHidden);
		var hovered = false, selectedDate = false;
		var calendar = new DCalendar(input, type, inputHidden);
		$(input).wrap($('<div class="datepicker" style="display:inline-block;position:relative;"></div>'));
		$(input).parent().append(
			$(newDom("span", {className: "clear-date-icon-span vh"}))
			.append(
				svgElement("#icon-guanbi2", "clear-date-icon")
			)
		);
		calendar.calendar.appendTo($(input).parent());
		calendar.calendar.add($(input)).add($(input).parent().find(".clear-date-icon-span")).hover(function(){
			calendar.hovered = true;
		}, function(){
			calendar.hovered = false;
		}).on('selectdate', function(e){
			$(input).val(e.date);
			$(this).hide();
			$(input).parent().find(".clear-date-icon-span").addClass("vh");
		});
		$(input).on('keydown', function(e){ if(e.which) return false; })
				.on('mousedown', function(e){
					if (e.which !== 1) {
						return false;
					}
					$(".loong-date-tablec").hide();
					// $(".loong-date-tablec").addClass("dn");
					$(".clear-date-icon-span").addClass("vh");
					if (!hovered && calendar.calendar.is(":hidden")) {
						var today = new Date();
						calendar.sysTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
						calendar.date = calendar.selected;
						calendar.create("days");
						$(this).parent().find(".clear-date-icon-span").removeClass("vh");
					}
				}).on("contextmenu",function(e){
					return false;
				});
		$(input).parent().find(".clear-date-icon").click(function(){
			$(input).parent().find(".clear-date-icon-span").addClass("vh");
			calendar.calendar.hide();
			$(input).val("");
			$(inputHidden).val(0);
			calendar.selected = new Date();
		})
		return calendar;
	}

	function DCalendar(input ,type, inputHidden){
		var that = this;
		this.input = $(input);
		this.inputHidden = $(inputHidden).val(0);
		this.type = type;
		this.calendar = $('<div class="loong-date-tablec"></div>');
		this.table = $('<table class="calendar"></table>');
		this.confirmBtn = $(newDom("div", {className: "confirm-btn flex flex-center"})).append(svgElement('#icon-rizhijieguodui','confirm-icon'));
		this.hovered = true;
		this.today = new Date();
		this.sysTime = (new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + (new Date()).getSeconds();
		if(this.input.val() === '') {
			this.date = new Date();
			this.selected = new Date();
		} else {
			var dateObj = this.reformatDate(this.input.val());
			this.date = new Date(dateObj.y, dateObj.m - 1, dateObj.d);
			this.selected = new Date(dateObj.y, dateObj.m - 1, dateObj.d);
			if (this.input.val().split(" ").length > 1) {
				this.sysTime = this.input.val().split(" ")[1];
			}
		}
		this.viewMode = 'days';
		this.calendar.on('click', '#next', function() { initCreate('next'); })
			.on('click', '#prev', function() { initCreate('prev'); })
			.on('click', '#today', function() {
				that.viewMode = 'days';
				var curr = new Date(that.date),
					sys = new Date(that.today);
				if(curr.toString() != sys.toString()) { that.date = sys; }
				that.create('days');
			}).on('click', '.date, .pMDate, .nMDate', function() {
				var isPrev = $(this).hasClass('pMDate'),
					isNext = $(this).hasClass('nMDate'),
					sdate = $(this).text(),
					cmonth = that.date.getMonth(),
					cyear = that.date.getFullYear();
				if(isPrev) { cyear = (cmonth === 0 ? cyear - 1 : cyear); }
				else if(isNext) { cyear = (cmonth + 2 === 13 ? cyear + 1 : cyear); }
				if(isPrev) { cmonth = (cmonth === 0 ? '12' : cmonth); }
				else if (isNext) { cmonth = (cmonth + 2 === 13 ? '1' : cmonth + 2); }
				else { cmonth = cmonth + 1; }
				var selected = new Date(cyear, cmonth - 1, sdate);
				// if ((that.minDate && selected < min) || (that.maxDate && selected > max)) return;
				// that.selected = cmonth + '/' + sdate + '/' + cyear;
				that.selected = selected;
				that.calendar.find('td').find("span").removeClass('selected');
				$(this).find("span").addClass('selected');
				that.selectDate();
				return true;
			}).on('click', '#currM', function(){
				if (that.calendar.hasClass("month-calendar")) {
					that.viewMode = 'days';
					that.create(that.viewMode);
				} else {
					that.viewMode = 'months';
					that.create(that.viewMode);
				}
			}).on('click', '.month', function(e){
				that.viewMode = 'days';
				var curr = new Date(that.date), y = that.calendar.find('#currM').text();
				curr.setMonth($(e.currentTarget).attr('num'));
				that.date = curr;
				that.create(that.viewMode);
			});
		function initCreate(o){
			var curr = new Date(that.date),
				currMonth = curr.getMonth(),
				currYear = curr.getFullYear();
			curr.setDate(1);
			if(that.viewMode === 'days') {
				curr.setMonth(currMonth + (o === 'next' ? 1 : -1));
			} else {
				curr.setFullYear(currYear + (o === 'next' ? 1 : - 1));
			}
			that.date = curr;
			that.create(that.viewMode);
		}
		// this.create(this.viewMode);
	}

	DCalendar.prototype = {

		constructor : DCalendar, 

		/*setDate : function() {
			var that = this,
				dateObj = that.reformatDate(that.calendar.prev().val()),
				value = isNaN(parseInt(dateObj.m)) ? new Date(dateObj.m + " " + dateObj.d + ", " + dateObj.y) : new Date(dateObj.y, dateObj.m - 1, dateObj.d);
			that.selected = (value.getMonth() + 1) + "/" + value.getDate() + "/" + value.getFullYear();
			that.selectDate();
			that.date = value;
			that.create(that.viewMode);
		},*/

		selectDate : function () {
			var that = this,
				newDate = that.formatDate("yyyy-mm-dd"),
				e = $.Event('selectdate', {date: newDate});
			if (that.type == "date") {
				that.calendar.trigger(e);
				that.inputHidden.val(that.getDate());
			}
		},

		setDate : function(date) {
			var that = this;
			if (date instanceof Date) {
				var dateObj = {
					Y : date.getFullYear(),
					M : (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
					D : date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
					h : date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
					m : date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
					s : date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
				}
			}
			switch (that.type) {
				case "time" :
					$(that.input).val(dateObj.h + ":" + dateObj.m + ":" + dateObj.s);
					break;
				case "date" :
					$(that.input).val(dateObj.Y + "-" + dateObj.M + "-" + dateObj.D);
					break;
				case "full" :
					$(that.input).val(dateObj.Y + "-" + dateObj.M + "-" + dateObj.D + " " + dateObj.h + ":" + dateObj.m + ":" + dateObj.s);
					break;
			}
			that.inputHidden.val(that.getDate());
		},

		getDate : function() {
			var that = this,
			    dateString = $(that.input).val(),
			    time = 0;
			if (dateString) {
				switch (that.type) {
					case "time" :
						var date = new Date();
						date.setHours(dateString.split(":")[0]);
						date.setMinutes(dateString.split(":")[1]);
						date.setSeconds(dateString.split(":")[2]);
						date.setMilliseconds(0);
						time = date.getTime();
						break;
					case "date" :
						var date = new Date();
						date.setFullYear(dateString.split("-")[0]);
						date.setMonth(dateString.split("-")[1] - 1);
						date.setDate(dateString.split("-")[2]);
						date.setHours(0);
						date.setMinutes(0);
						date.setSeconds(0);
						date.setMilliseconds(0);
						time = date.getTime();
						break;
					case "full" :
						var date = new Date();
						var stringDate = dateString.split(" ")[0];
						var stringTime = dateString.split(" ")[1];
						date.setFullYear(stringDate.split("-")[0]);
						date.setMonth(stringDate.split("-")[1] - 1);
						date.setDate(stringDate.split("-")[2]);
						date.setHours(stringTime.split(":")[0]);
						date.setMinutes(stringTime.split(":")[1]);
						date.setSeconds(stringTime.split(":")[2]);
						date.setMilliseconds(0);
						time = date.getTime();
						break;
				}
			}
			return time;
		},

		reformatDate : function (date) {
			var that = this,
				format = "yyyy-mm-dd";
			return {
				m: date.substring(format.indexOf('m'), format.lastIndexOf('m') + 1),
				d: date.substring(format.indexOf('d'), format.lastIndexOf('d') + 1),
				y: date.substring(format.indexOf('y'), format.lastIndexOf('y') + 1)
			};
		},

		formatDate : function (format) {
			var that = this;
			var d = new Date(that.selected), day = d.getDate(), m = d.getMonth(), y = d.getFullYear();
			
			return format.replace(/(yyyy|yy|mmmm|mmm|mm|m|dd|d)/gi, function (e) {
				switch(e.toLowerCase()){
					case 'd': return day;
					case 'dd': return (day < 10 ? "0"+day: day);
					case 'm': return m+1;
					case 'mm': return (m+1 < 10 ? "0"+(m+1): (m+1));
					case 'mmm': return short_months[m];
					case 'mmmm': return months[m];
					case 'yy': return y.toString().substr(2,2);
					case 'yyyy': return y;
				}
			});
		},

		bindClick : function(){
			var that = this;
			$(document).off("click.loongDate").on("click.loongDate", function(){
				if ( !that.hovered ) {
					that.calendar.hide();
					that.input.parent().find(".clear-date-icon-span").addClass("vh");
					$(document).off("click.loongDate");
				}
			});
			$(that.confirmBtn).on("click", function(){
				switch (that.type) {
					case "time" : 
						var time = that.getTime();
						that.input.val(time);
						break;
					case "full" : 
						var time = that.getTime();
						var date = that.formatDate("yyyy-mm-dd");
						that.input.val(date + " " + time);
						break;
				}
				that.calendar.hide();
				that.input.parent().find(".clear-date-icon-span").addClass("vh");
				that.inputHidden.val(that.getDate());
			})
		},

		getTime : function(){
			var that = this;
			var h = that.calendar.find(".sel-container[name='hour'] .sel-select").html();
			var m = that.calendar.find(".sel-container[name='minute'] .sel-select").html();
			var s = that.calendar.find(".sel-container[name='second'] .sel-select").html();
			h = h < 10 ? "0" + h : h;
			m = m < 10 ? "0" + m : m;
			s = s < 10 ? "0" + s : s;
			return h + ":" + m + ":" + s; 
		},

		getInitTime : function(){
			var that = this,
				time = {
					h : (new Date()).getHours(),
					m : (new Date()).getMinutes(),
					s : (new Date()).getSeconds()
				};
			if(this.input.val() !== '' && that.type !== "date") {
				if (that.type === "time") {
					var timeWith0 = this.input.val();
				} else if (that.type === "full") {
					var timeWith0 = this.input.val().split(" ")[1];
				}
				var h = timeWith0.split(":")[0];
				var m = timeWith0.split(":")[1];
				var s = timeWith0.split(":")[2];
				time = {
					h : h < 10 ? parseInt(h) + "" : h,
					m : m < 10 ? parseInt(m) + "" : m,
					s : s < 10 ? parseInt(s) + "" : s
				}
			}
			return time;
		},

		create : function(mode){
			var that = this, cal = [],
				tBody = $('<tbody></tbody>'),
				d = new Date(that.date.getFullYear(), that.date.getMonth(), that.date.getDate()),
				days = that.date.getDays(),
				day = 1, nStartDate = 1,
				selected = new Date(that.selected.getFullYear(), that.selected.getMonth(), that.selected.getDate()),
				today = new Date(that.today.getFullYear(), that.today.getMonth(), that.today.getDate());

			that.calendar.empty();
			that.table.empty();
			if(mode === "days") {
				that.calendar.removeClass("month-calendar");
				// that.tHead = $('<thead><tr><th id="prev">&lsaquo;</th><th colspan="5" id="currM"></th><th id="next">&rsaquo;</th></tr><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead>');
				that.tHead = $('<thead><tr>'+
					'<th id="prev">'+
						'<div class="step-btn"><svg class="icon"><use xlink:href="#icon-rilizuo"></use></svg></div>'+
					'</th>'+
					'<th colspan="5"><div id="currM" class="header-month-year btn-active"></div></th>'+
					'<th id="next">'+
						'<div class="step-btn"><svg class="icon"><use xlink:href="#icon-riliyou"></use></svg></div>'+
					'</th>'+
					'</tr><tr><th>'+dateI18n('Sunday')+'</th><th>'+dateI18n('Monday')+'</th><th>'+dateI18n('Tuesday')+'</th><th>'+dateI18n('Wednesday')+'</th><th>'+dateI18n('Thursday')+'</th><th>'+dateI18n('Friday')+'</th><th>'+dateI18n('Saturday')+'</th></tr></thead>');
				that.tHead.find('#currM').html(months[that.date.getMonth()] +"&nbsp;&nbsp;&nbsp;" + that.date.getFullYear());
				// that.table.append(that.tHead);

				for(var i = 1; i <= 6; i++){
					var temp = [$('<td></td>'),$('<td></td>'),$('<td></td>'),$('<td></td>'),$('<td></td>'),$('<td></td>'),$('<td></td>')];
					while(day <= days){
						d.setDate(day);
						var dayOfWeek = d.getDay();

						if(d.getTime() == today.getTime()) temp[dayOfWeek].attr('id', 'currDay');

						// if ((that.minDate && d < min) || (that.maxDate && d > max)) temp[dayOfWeek].addClass('disabled');

						// if(d.getTime() == selected.getTime()) temp[dayOfWeek].find("span").addClass('selected');

						if(i === 1 && dayOfWeek === 0) break;
						else {
							temp[dayOfWeek].html('<span>'+(day++)+'</span>').addClass('date');
							if(d.getTime() == selected.getTime()) temp[dayOfWeek].find("span").addClass('selected');
							if (dayOfWeek === 6) {
								break;
							}
						}
					}
					/* For days of previous and next month */
					if (i === 1 || i > 4) {
						// First week
						if (i === 1) {
							var p = new Date(that.date.getFullYear(), that.date.getMonth() - 1, 1),
								pMonth = p.getMonth(), pDays = p.getDays();

							for (var a = 6; a >= 0; a--) {
								if (temp[a].text() === ''){
									
									p.setDate(pDays);

									temp[a].html('<span>' + (pDays--) + '</span>').addClass('pMDate');
									
									if (p.getTime() == selected.getTime()) temp[a].find("span").addClass('selected');
								}
							}
						} 
						// Last week
						else if (i > 4) {
							var nextMonth = new Date(that.date.getFullYear(), that.date.getMonth() + 1, 1);
							for (var a = 0; a <= 6; a++) {
								if (temp[a].text() === ''){

									nextMonth.setDate(nStartDate);

									temp[a].html('<span>' + (nStartDate++) + '</span>').addClass('nMDate');
									
									if ((that.minDate && nextMonth < min) || (that.maxDate && nextMonth > max)) temp[a].addClass('disabled');
									if (nextMonth.getTime() == selected.getTime()) temp[a].find("span").addClass('selected');
								}
							}
						}
					}
					cal.push(temp);
				}

				$.each(cal, function(i, v){
					var row = $('<tr></tr>'), l = v.length;
					for(var i = 0; i < l; i++) { row.append(v[i]); }
					tBody.append(row);
				});
				var tTime = $('<div class="date-time-container"></div>')
					.append(selectDom(24, "hour", that.getInitTime().h))
					.append(
						newDom("div", {
							innerHTML: ":",
							className: "split-hour-minute"
						})
					)
					.append(selectDom(60, "minute", that.getInitTime().m))
					.append(
						newDom("div", {
							innerHTML: ":",
							className: "split-hour-minute"
						})
					)
					.append(selectDom(60, "second", that.getInitTime().s));
				
				/*var sysDate = "Today: " + daysofweek[that.today.getDay()] + ", " + months[that.today.getMonth()] + " " + that.today.getDate() + ", " + that.today.getFullYear();
				tBody.append('<tr><td colspan="7" id="today">' + sysDate + '</td></tr>');*/
				switch (that.type) {
					case "date" :
						that.table.append(that.tHead).append(tBody);
						that.calendar.append(that.table);
						break;
					case "time" :
						// that.table.after(tTime);
						that.calendar.append(tTime.append(that.confirmBtn));
						break;
					case "full" :
						that.table.append(that.tHead).append(tBody);
						that.calendar.append(that.table).append($("<hr class='date-time-split'></hr>")).append(tTime.append(that.confirmBtn));
						break;
				}
				// that.inputContainer.after(that.calendar);
				that.input.after(that.calendar);
			} else {
				// that.tHead = $('<thead><tr><th id="prev">&lsaquo;</th><th colspan="2" id="currM"></th><th id="next">&rsaquo;</th></tr>');
				that.calendar.addClass("month-calendar");
				that.tHead = $('<thead><tr>'+
					'<th id="prev">'+
						'<div class="step-btn"><svg class="icon"><use xlink:href="#icon-rilizuo"></use></svg></div>'+
					'</th>'+
					'<th colspan="2"><div id="currM" class="btn-active"></div></th>'+
					'<th id="next">'+
						'<div class="step-btn"><svg class="icon"><use xlink:href="#icon-riliyou"></use></svg></div></thead>');
				that.tHead.find('#currM').text(that.date.getFullYear());
				that.tHead.appendTo(that.table);
				var currI = 0;
				for (var i = 0; i < 3; i++) {
					var row = $('<tr></tr>');
					for (var x = 0; x < 4; x++) {
						var col = $('<td align="center" class="month-td"></td>');
						var m = $('<span class="month" num="' + currI + '">' + short_months[currI] + '</span>');
						col.append(m).appendTo(row);
						currI++;
					}
					tBody.append(row);
				}
				/*var sysDate = "Today: " + daysofweek[that.today.getDay()] + ", "+ months[that.today.getMonth()] + " " + that.today.getDate() + ", " + that.today.getFullYear();
				tBody.append('<tr><td colspan="4" id="today">' + sysDate + '</td></tr>');*/
				that.calendar.append(that.table.append(tBody));
				// that.inputContainer.after(that.calendar);
				that.input.after(that.calendar);
			}
			that.calendar.show();
			// that.calendar.removeClass("dn");
			that.bindClick();
		}
	}

	function selectDom(num, name, value) {
		var container = $("<div class='sel-container'></div>");
		container.attr("name", name);
		var select = $("<div class='sel-select'></div>");
		var option = $("<div class='sel-option dn'></div>");
		for (var i = 0; i < num; i++) {
			var ops = $("<div class='sel-option-item'></div>");
			ops.html(i);
			option.append(ops);
		}
		select.html(value ? value : 0);
		container.append(select).append(option);
		select.on("click", function(){
			$(".sel-select").removeClass("sel-select-active");
			select.addClass("sel-select-active");
			$(".datepicker .sel-option").addClass("dn");
			option.removeClass("dn");
		});
		option.on("click", function(e){
			select.html(e.target.innerHTML).removeClass("sel-select-active");
			$(this).addClass("dn");
		});
		return container;
	}

	function newDom(type, attr){
	    var e = document.createElement(type);
	    if (attr) {
	        for (var p in attr) {
	            var startStr = p.indexOf("data-");
	            if (startStr === 0) {
	                e.setAttribute(p, attr[p]);
	            }else{
	                e[p] = attr[p];
	            }
	        }
	    }
	    return e;
	}

	function svgElement(href, className){
	    var $svg = $("<svg class='icon " + className + "'><use xlink:href=''></use></svg>");
	    $svg.find("use").attr("xlink:href", href);
	    return $svg;
	}
})(jQuery);
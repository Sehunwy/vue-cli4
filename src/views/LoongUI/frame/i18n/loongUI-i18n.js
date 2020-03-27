import { configJson } from "@/views/LoongUI/frame/lib/config.js";
var i18n = {};
export function doI18n(code, params) {
	if(code == ""){
		return;
	}
	var txt = i18n[code];
    if (undefined == txt) {
    	var errorAdjust = {
            "access denied.": "access_denied",
		};
		if(typeof(code) == 'string'){
			for (var errorMsg in errorAdjust) {
	            if (code.indexOf(errorMsg) != -1) {
	            	code = errorAdjust[errorMsg];
	            	txt = i18n[code];
	            	break;
	            }
	        }
		}
        if (undefined == txt) {
        	return code;
        }
    }
	if(undefined == params){
		return txt;
	}
	return stringFormat(txt, params);
}
$.extend({
	doI18n: function(code, params) {
		if(code == ""){
			return;
		}
		var txt = i18n[code];
		if (undefined == txt) {
			var errorAdjust = {
				"access denied.": "access_denied",
			};
			if(typeof(code) == 'string'){
				for (var errorMsg in errorAdjust) {
					if (code.indexOf(errorMsg) != -1) {
						code = errorAdjust[errorMsg];
						txt = i18n[code];
						break;
					}
				}
			}
			if (undefined == txt) {
				return code;
			}
		}
		if(undefined == params){
			return txt;
		}
		return stringFormat(txt, params);
	},
	i18n: i18n
})

function stringFormat(source, params) {
	if (arguments.length === 1) {
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.messageFormat.apply(this, args);
		};
	}
	if (params === undefined) {
		return source;
	}
	if (arguments.length > 2 && params.constructor !== Array) {
		params = $.makeArray(arguments).slice(1);
	}
	if (params.constructor !== Array) {
		params = [ params ];
	}
	$.each(params, function(i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"),
				function() {
					return n;
				});
	});
	return source;
}


function  getI18nJS(){
	var language = window.sessionStorage.language;
	import(`@/views/LoongUI/frame/i18n/loongUI-i18n-${language}.js`).then(item => {
		Object.assign(i18n, item.i18n)
	})
	for (var i = 0; i < configJson.length; i++) {
		var i18ns = configJson[i].i18n;
		import(`@/${i18ns}-i18n-${language}.js`).then(item => {
			Object.assign(i18n, item.i18n);
		})
	}
	
}


(function($){
    getI18nJS();
})(jQuery);
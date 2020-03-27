import { loongValidate_i18n } from '@/views/LoongUI/frame/lib/loongValidate/loongValidate-i18n.js'
import { allModule,setLanguage } from "@/views/LoongUI/frame/lib/config.js";
var validateI18n = function (code) {
	var lang = setLanguage();
	if (lang) {
		return loongValidate_i18n[lang][code];
	}
};
$.extend({
	loongValidate: function ($form) {
		var result = {};
		$form.find("input:visible, textarea:visible").each(function () {
			$(this).parent().addClass('pr');
			$(this).addClass('pr20');
			result = validCore(this);
			if (true === result.hasError) {
				return false;
			}
		});
		return result;
	},
	loongValidateSingle: function ($input) {
		$($input).parent().addClass('pr');
		$($input).addClass('pr20');
		return validCore($input);
	},
	addMethod: function (name, method, message) {
		methods[name] = method;
		messages[name] = message !== undefined ? message : messages[name];
	},
	messageFormat: function (source, params) {
		if (arguments.length === 1) {
			return function () {
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
			params = [params];
		}
		$.each(params, function (i, n) {
			source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
				return $.doI18n(n);
			});
		});
		return source;
	},
	messageI18n: function (code) { 
		return validateI18n(code);
	}
});
var methods = {
	required: function ($item) {
		// if ("" == $.trim($item.val())) {
		if ("" == $item.val()) {
			return {
				required: {
					valid: false
				}
			};
		}
		return {
			required: {
				valid: true
			}
		};
	},
	ipv4: function ($item) {
		var ipv4 = new RegExp(/^(25[0-5]|2[0-4]\d|1\d{0,2}|[1-9]\d{0,1}|0)\.(25[0-5]|2[0-4]\d|1\d{0,2}|[1-9]\d{0,1}|0)\.(25[0-5]|2[0-4]\d|1\d{0,2}|[1-9]\d{0,1}|0)\.(25[0-5]|2[0-4]\d|1\d{0,2}|[1-9]\d{0,1}|0)$/);
		// var ipv4 = new RegExp(/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/);
		var flag = $item.val().split(".")[0] !== "127";
		return {
			ipv4: {
				valid: ipv4.test($item.val()) && flag
			}
		};
	},
	email: function ($item) {
		var email = new RegExp(/^([0-9A-Za-z])([0-9A-Za-z\-_\\.]+)@([0-9a-zA-Z\-]+(\.[a-zA-Z0-9\-]+)+(\.[a-zA-Z]{2})?)$/g);
		return {
			email: {
				// valid: email.test($item.val()) && $item.val().split("@")[0].length <= 64 && $item.val().length <= 180
				valid: email.test($item.val()) && $item.val().length <= 64
			}
		};
	},
	ipv4Oremail: function ($item) {
		var email = new RegExp(/^([0-9A-Za-z\-]+)(\.[0-9A-Za-z\-]+)+$/g);
		var ipv4 = new RegExp(/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/);
		var flag = false;
		if (ipv4.test($item.val())) {
			flag = $item.val().split(".")[0] !== "127";
		}
		return {
			ipv4Oremail: {
				valid: (email.test($item.val()) && $item.val().length <= 64) || flag
			}
		};
	},
	equalTo: function ($item) {
		var value = $item.val();
		var eqTo = $item.attr("equalTo");
		var eqValue = $item.parents("form").find("input[name=" + eqTo + "]").val();
		return {
			equalTo: {
				valid: (value == eqValue)
			}
		};
	},
	unequalTo: function ($item) {
		var value = $item.val();
		var ueqTo = $item.attr("unequalTo");
		var ueqValue = $item.parents("form").find("input[name=" + ueqTo + "]").val();
		return {
			unequalTo: {
				valid: !(value == ueqValue)
			}
		};
	},
	lengthRange: function ($item) {
		var msgArgs = $item.data("msg");
		if (msgArgs) {
			msgArgs = strToJson(msgArgs);
		}
		var ranges = msgArgs["lengthRange"];
		var length = 0;
		if (undefined != $item.val()) {
			length = $item.val().length;
		}
		return {
			lengthRange: {
				valid: length >= ranges[0] && length <= ranges[1]
			}
		};
	},
	maxRange: function ($item) {
		var msgArgs = $item.data("msg");
		if (msgArgs) {
			msgArgs = strToJson(msgArgs);
		}
		var ranges = msgArgs["maxRange"];
		if (undefined != $item.val()) {
			var val = $item.val();
		}
		val = parseFloat(val);
		return {
			maxRange: {
				valid: val >= ranges[0] && val <= ranges[1]
			}
		};

	},
	domainName: function ($item) {
		// var domainName = new RegExp(/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/);
		// var domainName = new RegExp(/^[0-9a-zA-Z]+([_\.\-]?[0-9a-zA-Z]+)*\.[a-zA-Z]+$/);
		var domainName = new RegExp(/^[0-9a-zA-Z]+((_[0-9a-zA-Z]+)|(\.[0-9a-zA-Z]+)|(\-[0-9a-zA-Z]+))*\.[a-zA-Z]+$/);
		return {
			domainName: {
				valid: domainName.test($item.val())
			}
		};
	},
	formalName: function ($item) {
		var formalName = new RegExp(/^[A-Za-z0-9_]+$/);
		return {
			formalName: {
				valid: formalName.test($item.val())
			}
		};

	},
	commonUser: function ($item) {
		// var commonUser=new RegExp(/^(?! )((?! {2,})[a-zA-Z0-9\s_])+(?<! )$/i);
		var commonUser = new RegExp(/^(?! )((?! {2,})[a-zA-Z0-9\s_])+([a-zA-Z0-9_])$/i);
		return {
			commonUser: {
				valid: commonUser.test($item.val())
			}
		};

	}
};
var messages = {
	required: $.messageFormat($.messageI18n("required")),
	email: $.messageI18n("email"),
	ipv4: $.messageI18n("ipv4"),
	equalTo: $.messageFormat($.messageI18n("equalTo")),
	unequalTo: $.messageFormat($.messageI18n("unequalTo")),
	lengthRange: $.messageFormat($.messageI18n("lengthRange")),
	maxRange: $.messageFormat($.messageI18n("maxRange")),
	ipv4Oremail: $.messageI18n("ipv4Oremail"),
	domainName: $.messageI18n("domainName"),
	formalName: $.messageI18n("formalName"),
	commonUser: $.messageI18n("commonUser")
};

allModule.then(result => {
	for (var i = 0; i < result.length; i++) {
		if (typeof (result[i].getValidate) == "function") {
			var validateModule = result[i].getValidate();
			(function (validateModule) {
				import(`@/${validateModule.path}/loongValidate-i18n.js`).then(item => {
					var tmpCode = item[validateModule.name + '_loongValidate_i18n'];
					$.extend(loongValidate_i18n["en"], tmpCode['en']);
					$.extend(loongValidate_i18n["zh"], tmpCode['zh']);
				})
			})(validateModule);
			import(`@/${validateModule.path}/custom-methods.js`)
		}
	}
});

function validCore(validElement) {
	var result = {};
	var hasError = false;
	var $item = $(validElement);
	var valids = $item.attr("valids");
	var msgArgs = $item.data("msg") || {};
	if (msgArgs) {
		msgArgs = strToJson(msgArgs);
	}
	if (valids) {
		valids = valids.split(" ");
		if ($.inArray('required', valids) != '-1' || $item.val() != '') {
			for (var val in valids) {
				if (!valids.hasOwnProperty(val)) break;
				var validKey = valids[val];
				var validResult = (methods[validKey])($item);
				// debugger;
				if (msgArgs[validKey]) {
					validResult[validKey].message = messages[validKey].call(this, msgArgs[validKey]);
				} else {
					validResult[validKey].message = messages[validKey];
				}
				$.extend(result, validResult);
				if (!hasError && !validResult[validKey].valid) {
					hasError = true;
				}
			}
		}
		var ret = {};
		ret.result = result;
		return $.extend(ret, {
			hasError: hasError,
			element: $item
		});
	} else {
		return {
			hasError: false
		};
	}
}

function strToJson(str) {
	var json = JSON.parse(JSON.stringify(str));
	if (typeof (json) == "string") {
		json = eval('(' + json + ')');
	}
	return json;
}

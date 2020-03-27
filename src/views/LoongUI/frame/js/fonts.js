import { allModule } from "@/views/LoongUI/frame/lib/config.js";
(function ($) {
	getIconFonts();
	function getIconFonts() {
		allModule.then(result => {
			for (var i = 0; i < result.length; i++) {
				if (result[i].getIconfont !== undefined && typeof result[i].getIconfont == "function") {
					var iconModule = result[i].getIconfont();
					if (iconModule && iconModule !== null) {
						import(`@/${iconModule.fontPath}`)
					}
				}
			}
		});
	}
})(jQuery);
<template>
  <div id="app">
    <router-view
      v-wechat-title="$route.name=='login'?doI18n('login_top_title'):doI18n('home_top_title')"
    />
  </div>
</template>

<script>
import "@/views/LoongUI/frame/i18n/loongUI-i18n.js";
import "@/views/LoongUI/frame/js/fonts.js";
import "@/views/LoongUI/frame/lib/loongValidate/loongValidate.js";
import "@/views/LoongUI/frame/lib/loongValidate/loongValidate.css";
import "@/views/LoongUI/frame/lib/loongValidate/loongValidate-i18n.js";
import "@/views/LoongUI/frame/lib/loongValidate/custom-methods.js";
import "@/views/LoongUI/frame/css/public.css";
import "@/views/LoongUI/frame/css/normalize.css";
import { allModule } from "@/views/LoongUI/frame/lib/config.js";
import { homePage, notFind, login } from "@/assets/js/config.js";

import "@/views/LoongUI/frame/lib/loongTable/loongTable.js";
import "@/views/LoongUI/frame/lib/loongTable/loongTable.css";
import "@/views/LoongUI/frame/lib/loongQuery/loongQuery.js";
import "@/views/LoongUI/frame/lib/loongQuery/loongQuery.css";
import "@/views/LoongUI/frame/lib/loongDialog/loongDialog.js";
import "@/views/LoongUI/frame/lib/loongDialog/loongDialog.css";
import "@/views/LoongUI/frame/lib/loongSelect/loongSelect.js";
import "@/views/LoongUI/frame/lib/loongSelect/loongSelect.css";
import "@/views/LoongUI/frame/lib/loongToolTip/loongToolTip.js";
import "@/views/LoongUI/frame/lib/loongToolTip/loongToolTip.css";

export default {
  name: "App",
  data() {
    return {
      modules: [],
      token: null,
      routeChange: false
    };
  },
  created() {
    this.token = window.sessionStorage.getItem("token");
    if (this.token && !this.routeChange) {
      // 刷新时加入路由
      this.getMenus();
    }
  },
  watch: {
    $route(to, from) {
      $.clearIntervals();
      if (to.name == "login") {
        window.sessionStorage.clear();
        var logins = [];
        logins.push(login());
        this.$router.options.routes = logins;
        this.$router.addRoutes(logins);
      }
      this.token = window.sessionStorage.getItem("token");
      if (from.name == "login" && this.token) {
        // 第一次进入时加入路由
        this.getMenus();
        this.routeChange = true;
      }
    }
  },
  methods: {
    getMenus: function() {
      allModule.then(result => {
        this.$router.options.routes.push(notFind);
        this.$router.options.routes.unshift(homePage);
        for (var i = 0; i < result.length; i++) {
          if (typeof result[i].getMenu === "function") {
            var menu = result[i].getMenu();
            if (menu instanceof Array) {
              this.$router.options.routes = menu.concat(
                this.$router.options.routes
              );
            } else {
              this.$router.options.routes.unshift(menu);
            }
          }
          if (typeof result[i].getRouter === "function") {
            var routers = result[i].getRouter();
            if (routers instanceof Array) {
              this.$router.options.routes = routers.concat(
                this.$router.options.routes
              );
            } else {
              this.$router.options.routes.unshift(routers);
            }
          }
        }
        this.$router.addRoutes(this.$router.options.routes);
      });
    }
  }
};
</script>

<style>
body,
html {
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
  color: #333333;
  font-size: 14px;
  overflow: hidden;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  background-color: #e9ecef;
}
</style>

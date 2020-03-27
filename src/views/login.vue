<template>
  <div class="login-outer-wrap">
    <div class="login-wrap" :style="{backgroundImage:  'url(' + bg + ')' }">
      <div class="login-box">
        <div class="login-title">登录</div>
        <div class="login-con">
          <form class="login-form">
            <div class="login-input-line">
              <input
                type="text"
                name="username"
                v-model="username"
                placeholder="请输入用户名"
                @keyup.enter="log_in"
                ref="input"
              />
            </div>
            <div class="login-input-line">
              <input
                type="password"
                class="password-text"
                v-model="password"
                placeholder="请输入密码"
                @keyup.enter="log_in"
              />
              <input type="hidden" name="password" />
            </div>
            <div class="pt10 clearfix">
              <div class="error-tip fs12 fl">{{errorMsg}}</div>
            </div>
            <div class="login-btn" @click="log_in()">登录</div>
          </form>
        </div>
      </div>
    </div>
    <div class="copyright">
      <p class="tac fs12 pt15">
        © 2017
        <span class>
          <span data-i18n-code="company_copyright">龙存（苏州）科技有限公司</span>
          <span style="padding-left: 5px;">
            <span data-i18n-code="copyright">版权所有</span>
          </span>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { hex_md5 } from "@/assets/js/md5";
import bg from "@/views/LoongUI/public/image/login-bg.png";
// import { allModule } from "@/views/LoongUI/frame/lib/config.js";
// import { homePage, setting } from "@/assets/js/config.js";
// import { $axios } from "@/assets/js/config.js";

export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
      bg: bg,
      errorMsg: ""
    };
  },
  created() {
    // window.sessionStorage.clear();
    // $.clearIntervals();
  },
  mounted() {
    this.$refs.input.focus();
  },
  methods: {
    log_in: function() {
      if (!this.username) {
        this.errorMsg = "请输入用户名";
      } else if (!this.password) {
        this.errorMsg = "请输入密码";
      } else {
        this.$axios({
          url: "/noToken/api/node/isMaster",
          type: "GET",
          data: {}
        })
          .then(data => {
            var param = {
              username: this.username,
              password: hex_md5(this.password)
            };
            if (data) {
              this.$axios({
                url: "/oauth/token",
                type: "GET",
                data: param
              })
                .then(data => {
                  if (data.error_code || data.error) {
                    this.errorMsg = "用户名或密码错误";
                  } else {
                    this.getUser();
                    // this.$router.push("/main");
                  }
                })
                .catch(err => {
                  var status = err.response.status;
                  if (status == 400) {
                    this.errorMsg = "服务连接失败";
                  } else if (status == 500) {
                    this.errorMsg = "登录失败";
                  }
                });
            } else {
              this.errorMsg = "访问的节点不是主管理服务节点";
            }
          })
          .catch(error => {
            var status = error.response.status;
            if (status == 410 || status == 500) {
              this.errorMsg = "服务连接失败";
            }
          });
      }
    },
    getUser: function() {
      this.$axios({
        url: "/api/utility/user/me",
        type: "GET",
        data: {}
      })
        .then(data => {
          window.sessionStorage.setItem("user", data.data.username);
          this.$router.push("/home");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.login-outer-wrap {
  height: 100%;
  overflow: auto;
  background-image: linear-gradient(to bottom, #43bbff, #1188dd);
}

.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px;
  min-width: 700px;
  background-position: center center;
  background-repeat: no-repeat;
}

.login-box {
  position: relative;
  width: 350px;
  height: 398px;
  background-color: #ffffff;
  border-radius: 4px;
  margin: auto;
  padding: 35px 20px 0 20px;
  top: calc((100% - 398px) / 2);
}

.login-title {
  padding: 30px 0 34px 33px;
  font-size: 24px;
  color: #666666;
}

.login-con {
  padding: 0 25px;
}

.login-input-line {
  padding: 18px 0 0 0;
}

.login-input-line input {
  width: 250px;
  height: 32px;
  padding-left: 10px;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
}

.login-btn {
  margin: 20px 0;
  width: 260px;
  height: 38px;
  font-size: 14px;
  line-height: 38px;
  background-color: #1188dd;
  color: #fff;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}

.error-tip {
  color: #ff2222;
}

.copyright {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 45px;
  color: #84c1ed;
}
</style>

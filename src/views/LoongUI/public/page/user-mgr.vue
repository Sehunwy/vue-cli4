<template>
  <div>
    <div id="userMgr">
      <div class="main-right ohy">
        <div class="min-width-970">
          <div class="opr-list flex flex-center jcfs pr">
            <div class="mr10">
              <div
                class="btn-opr"
                name="addUser"
                data-i18n-code="btn_add_user"
              >{{doI18n('btn_add_user')}}</div>
            </div>
            <div class="mr10">
              <div
                class="btn-opr"
                name="deleteUser"
                data-i18n-code="btn_delete_user"
              >{{doI18n('btn_delete_user')}}</div>
            </div>
            <div class="mr10">
              <div
                class="btn-opr"
                name="resetPwd"
                data-i18n-code="btn_reset_pwd"
              >{{doI18n('btn_reset_pwd')}}</div>
            </div>
            <div class="mr10">
              <div class="btn-opr" @click="test()">页面跳转</div>
            </div>
            <div class="mr10">
              <div class="btn-opr dn" name="setRole">用户角色设置</div>
            </div>
            <div class="user-search-box flex flex-center jcfs"></div>
          </div>
          <div class="user-content">
            <div class="user-table-box"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加用户 -->
    <div class="dialog-content dn" name="addUser">
      <div class="add-user-dialog">
        <form class="add-user-form">
          <div class="clearfix">
            <div class="fl">
              <label
                class="input-label-right"
                data-i18n-code="public_username"
              >{{doI18n('public_username')}}</label>
            </div>
            <div class="fl pr">
              <input
                class="input-common"
                name="username"
                valids="required username lengthRange"
                data-msg="{required:'public_username',username:'public_username','lengthRange':[2,18]}"
              />
              <!-- <input class="input-common" name="username" valids="required username"  data-msg="{required:'用户名',username:'用户名'}"> -->
            </div>
          </div>
          <div class="pt15 clearfix">
            <div class="fl">
              <label class="input-label-right" data-i18n-code="password">{{doI18n('password')}}</label>
            </div>
            <div class="fl pr">
              <input
                class="input-common"
                type="password"
                name="password"
                valids="required password"
                data-msg="{required:'password'}"
              />
            </div>
          </div>
          <div class="pt15 clearfix">
            <div class="fl">
              <label
                class="input-label-right"
                data-i18n-code="confirm_password"
              >{{doI18n('confirm_password')}}</label>
            </div>
            <div class="fl pr">
              <input
                class="input-common"
                type="password"
                name="repeatPassword"
                valids="required password"
                data-msg="{required:'confirm_password'}"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- 角色设置 -->
    <div class="dialog-content dn" name="setUserRole">
      <div class="set-role-dialog">
        <div class="opr-list flex flex-center jcfs">
          <div class="item-title" data-i18n-code="public_username">{{doI18n('public_username')}}</div>
          <input type="text" class="input-common disable-input-bg" name="username" disabled="true" />
        </div>
        <div class="role-list flex flex-center jcfs"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { userMgr } from "@/views/LoongUI/public/js/user-mgr.js";
import "@/views/LoongUI/public/css/user-mgr.css";
import layout from "@/views/main/main";
// import {constantRouterMap} from '@/router'
export default {
  name: "user-mgr",
  mounted() {
    userMgr();
  },
  methods: {
    test: function() {
      this.$router.push("/user/test");
    }
  }
};
</script>

<style scoped>
</style>

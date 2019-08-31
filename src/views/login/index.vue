<template>
<div class='container'>
  <van-nav-bar title="登录" />
  <van-cell-group>
    <van-field
      v-model="user.mobile"
      clearable
      left-icon="phone-circle-o"
      label="手机号"
      placeholder="请输入手机号"
      name="mobile"
      v-validate="'required'"
      :error-message="errors.first('mobile')"
    />

    <van-field
      left-icon="lock"
      v-model="user.code"
      label="验证码"
      placeholder="请输入验证码"
      name="code"
      v-validate="'required'"
      :error-message="errors.first('code')"
    />
 </van-cell-group>
  <div class="foot-btn">
    <van-button type="info" @click="onLogin" :loading="isLoginLoading">登录</van-button>
  </div>

</div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '17635373547',
        code: '246810'
      },
      isLoginLoading: false
    }
  },
  created () {
    this.$validator.localize('zh_CN', {
      custom: {
        mobile: {
          required: '手机号不能为空！！！'
        },
        code: {
          required: '验证码不能为空！！！'
        }
      }
    })
  },
  methods: {
    ...mapMutations(['setUser']),
    async onLogin () {
      try {
        const isValid = this.$validator.validate()
        if (!isValid) {
          return
        }
        this.isLoginLoading = true
        const { data } = await login(this.user)

        this.setUser(data.data)
        this.$router.push({ name: 'home' })
        this.isLoginLoading = false
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误!!')
        }
      }
      this.isLoginLoading = false
    }

  }
}
</script>

<style scoped lang='less'>
  .container {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #f5f7f9;
  }
  .foot-btn {
    padding: 20px;
    .van-button {
      width: 100%;
    }
  }

</style>

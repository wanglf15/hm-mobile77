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
  methods: {
    async onLogin () {
      try {
        this.$validator.validate().then(async valid => {
          if (!valid) {
            return
          }
          this.isLoginLoading = true
          const { data } = await login(this.user)
          console.log(data)
          this.$router.push({ name: 'home' })
        })
        this.isLoginLoading = false
      } catch (err) {
        this.isLoginLoading = false
        if (err.response && err.response.status === 400) {
          console.log(123)

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

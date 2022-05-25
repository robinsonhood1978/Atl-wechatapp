<template>
  <div>
    <mp-navbar v-if="!userProfile.is_customer" :tabs="tabs" :activeIndex='currentTab' @tabClick="tabClick"></mp-navbar>
    <div v-if="currentTab === 1 && !update">
      <h3>请输入网站用户名密码绑定已有账户</h3>
      <p>如果您没有网站账户，请选择"注册会员"开始使用我们的服务</p>
      <input type="username" placeholder="网站用户名" v-model="username" />
      <input type="password" placeholder="网站登陆密码" v-model="password"/>
      <button @click="login" >绑定</button>
    </div>
    <div v-if="currentTab === 0 || update">
      <h3>我们需要您的信息来识别您的货物</h3>
      <p v-if="!update">如果您已经在使用我们的服务，请选择"已有账户"</p>
      <input type="name" placeholder="姓名" v-model="name"  required/>
      <div class="input-desp">请使用您的真实中文姓名,该姓名需要填写在入仓包裹收件人栏</div>
      <input type="phone" placeholder="联系电话" v-model="phone" required/>
      <div class="input-desp">请填写收货人常用手机号，用于沟通紧急的货物事宜</div>
      <input type="email" placeholder="电子邮件" v-model="email" required/>
      <div class="input-desp">常用邮箱，用于接收货物提醒及作为网站登录的邮箱地址</div>
      <div v-if="update">
        <h3>网站地址: https://portal.yun.co.nz/</h3>
        <input type="password" placeholder="网站登录密码" v-model="password" required/>
        <div class="input-desp">网站登录密码，用于网站配合邮箱登录</div>
        <input type="password" placeholder="重复输入网站登录密码" v-model="password2" required/>
        <div class="input-desp">再次输入网站登录密码</div>
      </div>
      <div v-if="!update">
        <navigator class="terms" url="/pages/common/terms">点击阅读《用户服务条款》</navigator>
        <checkbox-group @change="checkboxChange">
          <label class="weui-cell weui-check__label">
            <checkbox class="weui-check" :value="item.value" :checked="item.checked" />
            <div class="weui-cell__hd weui-check__hd_in-checkbox">
              <icon class="weui-icon-checkbox_circle" type="circle" size="23" v-if="!item.checked"></icon>
              <icon class="weui-icon-checkbox_success" type="success" size="23" v-if="item.checked"></icon>
            </div>
            <div class="weui-cell__bd">已阅读并同意"用户服务条款"</div>
          </label>
        </checkbox-group>
      </div>
      <button @click="updateInfo" >提交信息</button>
    </div>

  </div>

</template>

<script>
import { post, login, showFail, showSuccess, appid, getUserProfile } from '@/utils/index'
import mpNavbar from 'mpvue-weui/src/navbar'
import { mapState } from 'vuex'
export default {
  components: {
    mpNavbar
  },
  computed: {
    ...mapState([
      'newUserInfo',
      'isLogedIn',
      'userProfile',
      'CID'
    ])
  },
  name: 'weblogin',
  mounted () {
  },
  onReady () {
    let tabId = this.$root.$mp.query.tab
    this.update = this.$root.$mp.query.update ? this.$root.$mp.query.update : false
    this.currentTab = parseInt(tabId)
    if (this.userProfile.is_customer) {
      this.currentTab = 1
    }
    if (this.update && this.userProfile.is_customer) {
      this.name = this.userProfile.customer.first_name
      this.phone = this.userProfile.customer.tel
      this.email = this.userProfile.customer.email
    }
  },
  data () {
    return {
      username: '',
      password: '',
      password2: '',
      tabs: ['注册会员', '已有账号'],
      currentTab: 0,
      item: {
        value: '0', checked: false
      },
      name: '',
      email: '',
      phone: '',
      update: false
    }
  },
  methods: {
    async login () {
      wx.showLoading({ title: '绑定中...', mask: true })
      let data = {
        'username': this.username,
        'password': this.password,
        'appid': appid
      }
      try {
        let resp = await post('freightcustomers/login/', data)
        //console.log(resp.message)
        if (resp.code !== 0) {
          showFail(resp.message)
        } else {
          showSuccess('绑定成功')

          login({
            success: function () {
              wx.hideLoading()
              showSuccess('登陆成功')
            },
            fail: function () {
              wx.hideLoading()
            }
          })
          // let url = '/pages/me'
          // wx.navigateTo({url})
          wx.navigateBack({ delta: 1 })
        }
      } catch (e) {
        showFail('登陆失败...')
      }
    },
    tabClick (index) {
      this.currentTab = index
    },
    checkboxChange (e) {
      console.log(e)
      if (e.mp.detail.value.length === 1) {
        this.item.checked = true
      } else {
        this.item.checked = false
      }
    },
    gotoMe () {
      let url = '/pages/me'
      wx.navigateTo({ url })
    },
    async updateInfo () {
      console.log('newUserInfo',this.newUserInfo)
      if (!this.item.checked && !this.update) {
        showFail('请阅读并同意用户条款')
        return
      }
      if (!this.name) {
        showFail('请输入姓名')
        return
      }
      if (!this.phone) {
        showFail('请输入联系电话')
        return
      }
      if (!this.email) {
        showFail('请输入邮箱地址')
        return
      }
      
      wx.showLoading({ title: '提交中...', mask: true })
      let avatar = this.newUserInfo && this.newUserInfo.avatarUrl
      let nickName = this.newUserInfo && this.newUserInfo.nickName
      console.log('avatar', avatar)
      console.log('nickName', nickName)

      let data = {
        name: this.name,
        email: this.email,
        tel: this.phone,
        nick_name: nickName,
        avatar: avatar,
      }
      try {
        let header = { 'Content-Type': 'application/x-www-form-urlencoded' }
        let resp = await post('packgo/profile/', data, header)
        //console.log(resp.message)
        if (resp.code !== 0) {
          showFail(resp.message)
        } else {
          if (!this.password) {
            wx.navigateBack({ delta: 1 })
            showSuccess('信息修改成功')
          }
          else{
            if (this.password!=this.password2) {
              showFail('两次输入密码不一致')
              return
            }
            try {
              let resp2 = await post('freightcustomers/wechat_password/', {password: this.password}, header)
              //console.log(resp.message)
              if (resp2.code !== 0) {
                showFail(resp2.message)
              } else {
                await getUserProfile()
                wx.navigateBack({ delta: 1 })
                showSuccess('提交成功')
              }
            } catch (e) {
              console.log(e)
              showFail('修改Web密码失败...')
            }
          }
          
        }
      } catch (e) {
        console.log(e)
        showFail('失败...')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  div {
    align-text: center;
    h3{
      margin: 30px;
      margin-bottom: 0px;
    }
    p {
      font-size: 0.6em;
      font-weight: bold;
      margin: 0 30px 30px 30px;
    }
  }
  input {
    margin:30px;
    margin-bottom: 0px;
    margin-top: 10px;
    padding: 0 10px;
    height:50px;
    border-width: 0px;
    border-style: solid;
    border-bottom-width: 1px;
  }
  button{
    height: 50px;
    border-width: 2px;
    border-color: black;
    margin: 30px;
    background: $theme-color;
    color: white;
  }
  .terms {
    text-align: center;
    font-weight: bold;
    font-size: 0.9em;
    color: #29b4ff;
    margin-top: 30px;
  }
  .input-desp{
    font-size: 0.6em;
    padding: 0;
    margin-top: 5px;
    margin-right: 35px;
    text-align: end;
  }
</style>

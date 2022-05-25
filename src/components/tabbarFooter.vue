<template>
  <view class="grace-footer footer">
    <view class="icon-btn" v-for="(nav, index) in navs" :key="index" :data-index="index" @tap="navTo">
      <navigator :url="nav.url" redirect>
      <view class="icon yunicon"
            :class="[nav.icon, navsActiveIndex==index?'active-primary':'']"
      ></view>
      <view class="text" :class="[navsActiveIndex==index?'active-primary':'']">{{nav.text}}</view>
      </navigator>
    </view>
  </view>
</template>

<script>
// var _self
export default {
  name: 'tabbarFooter',
  props: [
  ],
  data () {
    return {
      navs: [
        { icon: 'icon-yun', text: '包裹', url: '/pages/home' },
        { icon: 'icon-order', text: '运单', url: '/pages/order' },
        { icon: 'icon-calc', text: '计算', url: '/pages/fees/feesCalc' },
        { icon: 'icon-user', text: '我的', url: '/pages/me' }
      ],
      navsActiveIndex: 0,
      route: ''
    }
  },
  watch: {
  },
  mounted: function () {
    var pages = getCurrentPages()
    this.route = pages[pages.length - 1].route
    //console.log(this.route)
    this.navs.forEach((item, index) => {
      //console.log(item)
      if (item.url === ('/' + this.route)) {
        this.navsActiveIndex = index
      }
    })
  },
  methods: {
    navTo: function (e) {
      // 页面跳转代码请自行完善
      var index = e.currentTarget.dataset.index
      this.navsActiveIndex = index
    }
  }
}
</script>

<style scoped>
  .footer{box-shadow:none; border-top:1px solid #F5F6F8;
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .footer .icon-btn{border:none;}
</style>

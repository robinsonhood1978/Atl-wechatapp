<template>
  <view class="">
    <scroll-view class="grace-tab-title" scroll-x="true" id="grace-tab-title" :scroll-into-view="titleShowId">
      <view v-for="(tab, index) in tabs" :key="index" :class="[tabCurrentIndex == index ? 'grace-tab-current' : '']" :id="'tabTag-'+index" @tap="tabChange">{{tab.name}}</view>
    </scroll-view>
    <swiper class="grace-tab-swiper-full" :current="swiperCurrentIndex" @change="swiperChange" :style="{height:tabHeight+'px'}">
      <!-- 循环新闻项目 -->
      <swiper-item v-for="(news, newsIndex) in newsAll" :key="newsIndex">
        <scroll-view scroll-y="true" :data-scindex="newsIndex" @scrolltolower="scrollend">
          <view class="grace-news-list" style="padding:25upx; width:700upx;">
            <view class="item" v-for="(item, index) in news" :key="index">
              <view class="img img-l">
                <image src="https://graceui.oss-cn-beijing.aliyuncs.com/scollimgs/4.png" mode="widthFix"></image>
              </view>
              <view class="body">
                <view class="title">标题 [ {{index}} ]</view>
                <view class="desc">描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息</view>
              </view>
            </view>
          </view>
          <graceLoading :loadingType="tabs[newsIndex].loadingType"></graceLoading>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>
<script>
var _self
// 默认新闻数据（来自api请求）
// 每个选项下面的新闻列表
var news = [
  { title: '新闻标题', desc: '新闻描述...' },
  { title: '新闻标题', desc: '新闻描述...' },
  { title: '新闻标题', desc: '新闻描述...' },
  { title: '新闻标题', desc: '新闻描述...' },
  { title: '新闻标题', desc: '新闻描述...' },
  { title: '新闻标题', desc: '新闻描述...' },
  { title: '新闻标题', desc: '新闻描述...' },
  { title: '新闻标题', desc: '新闻描述...' },
  { title: '新闻标题', desc: '新闻描述...' },
  { title: '新闻标题', desc: '新闻描述...' }
]
// 对应下面3个标签的新闻内容数据
var newsAll = [news, news, news]
export default {
  data () {
    return {
      tabCurrentIndex: 0,
      swiperCurrentIndex: 0,
      tabHeight: 300,
      tabs: [
        // 标签名称 , 分类 id , 加载更多, 加载的页码
        { name: '关注', id: 'guanzhu', loadingType: 0, page: 1 },
        { name: '推荐', id: 'tuijian', loadingType: 0, page: 1 },
        { name: '体育', id: 'tiyu', loadingType: 0, page: 1 }
      ],
      newsAll: newsAll,
      titleShowId: 'tabTag-0',
      navs: [
        { icon: 'icon-yun', text: '包裹' },
        { icon: 'icon-order', text: '运单' },
        { icon: 'icon-calc', text: '计算' },
        { icon: 'icon-user', text: '我的' }
      ],
      navsActiveIndex: 0
    }
  },
  onLoad: function () {
    _self = this
  },
  onReady: function () {
    // 获取屏幕高度及比例
    uni.getSystemInfo({
      success: function (res) {
        var windowHeight = res.windowHeight
        // 获取头部标题高度
        var dom = uni.createSelectorQuery().select('#grace-tab-title')
        dom.fields({ size: true }, res2 => {
          if (!res2) { return }
          // 计算得出滚动区域的高度
          _self.tabHeight = windowHeight - res2.height
        }).exec()
      }
    })
  },
  methods: {
    navTo: function (e) {
      // 页面跳转代码请自行完善
      var index = e.currentTarget.dataset.index
      this.navsActiveIndex = index
    },
    tabChange: function (e) {
      var index = e.target.id.replace('tabTag-', '')
      this.swiperCurrentIndex = index
      this.tabCurrentIndex = index
      this.titleShowId = 'tabTag-' + index
    },
    swiperChange: function (e) {
      var index = e.detail.current
      this.tabCurrentIndex = index
      this.titleShowId = 'tabTag-' + index
    }
  }
}
</script>
<style>

</style>

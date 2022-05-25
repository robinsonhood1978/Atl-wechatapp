<template>
  <Login v-if="!isLogedIn"> </Login>
  <view v-else class="page" style="padding-bottom: 100upx">
    <swiper class="grace-swiper"
            autoplay="true" indicator-dots
            indicator-color="rgba(255, 255, 255, 1)"
            indicator-active-color="#3688FF"
            style="height:500upx;background-color: white"
            interval="3000">

      <swiper-item  v-for="(thumb, index) in images" :key="index" class="lightbox__holder" @click="predivImage" :id="images[index]">
        <image style="height:100%;width:100%" :src="thumb" mode="aspectFill" />
      </swiper-item>
    </swiper>
    <view class="detail-card">
      <view v-if="packageData.local_courier_name" class="title">{{packageData.local_courier_name}} {{packageData.local_courier_number}}</view>
      <view style="margin: 20upx">
        <view class="tip light">入库重量仅供参考,实际重量以打包后为准</view>
        <view class="desc">收货时间：{{formatedTime}}</view>
        <view class="desc">物品件数：{{packageData.pieces}} 件</view>
        <view class="desc">货物体积：{{volume}} m3</view>
        <view class="desc">货物重量：{{packageData.weight}} KG</view>
        <view class="desc">材积：{{volWeightFlight}} KG </view>
        <view v-if="packageData.dform" class="desc">
          所属运单：<navigator style="display: inline-block; color: red; font-weight:bold" :url="'/pages/freightorders/details?id=' + packageData.dform.id">
            {{packageData.dform.tracking_number }} 
          </navigator> (点击查看详情)
        </view>
      </view>
    </view>
    <view style="background-color: white">
    <view v-if="hidden == 0" class="detail" >
        <view :key="index" v-for="(item, index) in items">
          <view class="grace-rows grace-nowrap line-section">
            <view class=" item-title">
              <p v-if="index == 0">物品名称</p>
              <input type="text" maxlength="32" class="" v-model="item.title" placeholder="请填写" :disabled="disabled"/>
            </view>
            <view class="item-caizhi">
              <p v-if="index == 0">材质</p>
              <input type="text" class="" v-model.number="item.reference" placeholder="请填写" :disabled="disabled"/>
            </view>
            <view class="item-pieces">
              <p v-if="index == 0">件数</p>
              <input type="digit" class="" v-model.number="item.quantity" placeholder="0" :disabled="disabled"/>
            </view>
            <view class="item-price">
              <p v-if="index == 0">总价(¥)</p>
              <input type="digit" class="" v-model.number="item.subtotal" placeholder="CNY" :disabled="disabled"/>
            </view>
            <view class="item-pieces" v-if="items.length >= 2">
              <p v-if="index == 0">删除</p>
              <p @click="del_item(index)" v-if="!disabled"><view class="yunicon icon-remove icon" ></view></p>
            </view>
          </view>
      </view>
    </view>

    <div class="detail grace-nowrap total-row ">
      <p>货物总价: CNY ¥ {{total_price}}</p>
      <view  @click="add_item" :disabled="disabled"><view class="yunicon icon-add icon"></view></view>
    </div>
    <div class="detail item-notice">**请每行单独填写详细的物品名称，材质和最小包装数量(如衣服10件，炒开心果5包，乌龙茶3盒)，请勿多品名写在一行，品名请勿填写日用品/生活用品/食品/茶叶等概括性名称或者品牌如“三只松鼠”，混合材质请写明具体材质，例如塑料，金属等，以免误导耽误清关报关。</div>
    <view class="grace-form-item" style="align-items:flex-start;margin-left: 20upx;">
      <view class="grace-form-label" style="font-size: 1em;font-weight: bold;">运输方式</view>
      <view class="grace-form-body">
        <graceSelectTags :items="select_freight_type" type="radio" @change="changeFreightType"></graceSelectTags>
      </view>
    </view>
    <view class="grace-nowrap" style="margin: 20upx; margin-top: 40upx;padding-bottom: 40upx">
      <view style="font-size: 1em; width: 25%">客户备注：</view>
      <textarea class="notes" placeholder="请输入备注" v-model="formData.customer_note"  cursor-spacing="1em"/>
    </view>
    </view>
      <button class="submit" hover-class="submithover" style="margin-top: 1em" @click="submitBack" :disabled="disabled">提交并返回</button>
      <button class="submit inquire" hover-class="submithover" style="margin-top: 1em" @click="showFeedback" :disabled="disabled">反馈问题</button>
      <button class="submit inquire" hover-class="submithover" style="margin-top: 1em"
              v-if="companyInfo.show_customer_support"
            :send-message-title='"我要咨询包裹 "+ packageData.tracking_number'
            show-message-card="true"
            bindcontact='contactCallback'
            :session-from='session_str'
            open-type='contact' >咨询该包裹</button>
    <graceDrawer ref="graceDrawerFeed" v-on:closeDrawer="closeFeed" direction="right">
				<view slot="links" style="padding:0 25rpx;">
          <view class="ticket_type">{{ticket_type.title}}</view>
          <view class="package">包裹: {{packageData.local_courier_name}} {{packageData.local_courier_number}}</view>
          <view class="grace-margin-top">
            <text class="grace-title">备注</text>
          </view>
          <view class="grace-box-shadow" style="margin:0 30rpx;">
              <view class="grace-card-view">
                <view class="grace-card-body">
                  <view class="grace-card-desc">
                    <view class="grace-card-title">
                      <textarea v-model="ticketData.content" class="grace-textarea" value="" placeholder="请输入备注信息。" />
                    </view>
                  </view>
                </view>
              </view>
          </view>
          <div class="photos">
            <view class="grace-margin-top">
              <text class="grace-title">相关图片</text>
            </view>
            <div class="weui-uploader__bd">
              <div class="weui-uploader__files" id="uploaderFiles">
                <block v-for="(item, index) in files" :key="index">
                  <div class="weui-uploader__file" :id="item">
                    <image class="weui-uploader__img" :src="item" mode="aspectFill" @click="previewImage"  />
                    <div :id="index" class="weui-badge" style="position: absolute;top: 0;right: -.4em;z-index: 500;" @click="deleteimage">X</div>
                  </div>
                </block>
              </div>
              <div v-if="files.length < 5" class="weui-uploader__input-box">
                <div class="weui-uploader__input" @click="chooseImage"></div>
              </div>
            </div>
          </div>
          <view class="grace-box" style="margin:0 20rpx;" @click="submitFeedback">
              <view class="grace-card-view">
                <view style="margin:0 40rpx;" class="demo-wrap2">
                  <graceBorderRadius background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
                    <text class="demo2 grace-white">提交</text>
                  </graceBorderRadius>
                </view>
              </view>
          </view>
          
          <view class="grace-box" style="margin:0 20rpx;" @click="closeFeed">
              <view class="grace-card-view">
                <view style="margin:0 40rpx;" class="demo-wrap2">
                  <graceBorderRadius background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
                    <text class="demo2 grace-white">返回</text>
                  </graceBorderRadius>
                </view>
              </view>
          </view>
				</view>
		</graceDrawer>

    <graceDrawer ref="graceDrawerFeedback" v-on:closeDrawer="closeFeedback" direction="right">
				<view slot="links" style="padding:0 25rpx;">
          <view class="grace-relative" @tap.stop="">
            <view class="grace-accordion grace-margin-top">
              <!-- 项目0 -->
              <view :key="index" v-for="(ticket, index) in tickettypes" class="grace-box" style="margin:0 20rpx;" @click="feedback(ticket.id)">
                <view class="grace-card-view">
                  <view style="margin:0 40rpx;" class="demo-wrap2">
                    <graceBorderRadius background="#BE1416" :radius="['33rpx','33rpx','33rpx','33rpx']">
                      <text class="demo2 grace-white">{{ticket.title}}</text>
                    </graceBorderRadius>
                  </view>
                </view>
              </view>

              <view class="grace-box" style="margin:0 20rpx;"  v-if="companyInfo.show_customer_support">
                <view class="grace-card-view">
                  <view style="margin:0 40rpx;" class="demo-wrap2">
                        <button class="demo2 grace-white"
                          :send-message-title='"我要咨询包裹 "+ packageData.tracking_number'
                          show-message-card="true"
                          bindcontact='contactCallback'
                          :session-from='session_str'
                          open-type='contact' >人工咨询</button>
                  </view>
                </view>
              </view>

              
            </view>
          </view>
          <view class="grace-box" style="margin:0 20rpx;" @click="closeFeedback">
              <view class="grace-card-view">
                <view style="margin:0 40rpx;" class="demo-wrap2">
                  <graceBorderRadius background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
                    <text class="demo2 grace-white">返回</text>
                  </graceBorderRadius>
                </view>
              </view>
          </view>
				</view>
		</graceDrawer>
  </view>
</template>

<script>
import { apiHost, get, showSuccess, showFail, post, asyncUploadFile } from '@/utils/index'
import graceSelectTags from '@/graceUI/components/graceSelectTags.vue';
import moment from 'moment'
import { mapState } from 'vuex'
import event from '@/utils/event'
import Login from '@/components/login'
import graceDrawer from '@/graceUI/components/graceDrawer.vue'
import graceBorderRadius from "@/graceUI/components/graceBorderRadius.vue"
export default {
  components: {
    graceDrawer,
    graceBorderRadius,
    graceSelectTags,
    Login
  },
  data () {
    return {
			select_freight_type: [
				{ name: '海运', value: 'S', checked: false },
				{ name: '空运', value: 'F', checked: false }
			],
      ticketData: {
        type:1,
        content: '',
        priority:4
      }, 
      files: [],
      hidden: 0,
      ticket_type: {},
      tickettypes: [],
      packageId: 0,
      packageData: {},
      host: apiHost,
      images: [],
      thumbs: [],
      name: '未知用户',
      volume: 0,
      formData: {
        id: '',
        title: '',
        customer_note: '',
        freight_type: 'S',
        titles: [],
        quantities: [],
        totals: [],
        materials: []
      },
      items: [],
      item: {
        reference: '',
        quantity: 0,
        title: '',
        subtotal: '',
        total: '',
        totalstr: 0.00
      },
      canBack: true,
      fobiden_list:"日用品/生活用品/食品/茶叶/三只松鼠"
    }
  },
  computed: {
    ...mapState([
      'isLogedIn',
      'userProfile',
      'CID',
      'userInfo',
      'appOptions',
      'companyInfo'
    ]),
    session_str () {
      if (!this.isLogedIn) {
        return ''
      } else if (this.userProfile.customer) {
        return '{"nickName":"' + this.userInfo.nickName + '-' + this.userProfile.customer.applicant_number + '","avatarUrl":"' + this.userInfo.avatarUrl + '","note":"' + this.packageData.tracking_number + '"}'
      } else {
        return '{"nickName":"' + this.userInfo.nickName + '","avatarUrl":"' + this.userInfo.avatarUrl + '","note":"' + this.packageData.tracking_number + '"}'
      }
    },
    disabled () {
      return (this.packageData.dform && this.packageData.dform.paid)
    },
    total_price () {
      var total = 0
      this.items.forEach(function (i) {
        // let price = parseFloat(i.price)
        // let pieces = parseFloat(i.quantity)
        // i.subtotal = price * pieces
        // i.totalStr = i.subtotal.toFixed(2)
        total += (parseFloat(i.subtotal) || 0)
      })
      return total.toFixed(2)
    },
    formatedTime () {
      return moment(this.packageData.receive_time).local().format('DD/MM/YYYY HH:mm')
    },
    volWeight () {
      return (this.packageData.volume / 0.006).toFixed(2)
    },
    volWeightFlight () {
      return (this.packageData.volume / 0.005).toFixed(2)
    },
    formatedSendoutTime () {
      if (this.packageData.in_freight) {
        return this.packageData.in_freight.sent_time ? moment(this.packageData.in_freight.sent_time).local().format('DD/MM/YYYY HH:mm') : ''
      } else {
        return ''
      }
    }
  },
  watch: {
    isLogedIn: function () {
      if (this.isLogedIn) {
        this.loadData()
        this.ticketType()
      }
    }
  },
  onShow () {
    if (this.appOptions.scene === 1043) {
      this.canBack = false
    }
    console.log('canBack ' + this.canBack)
  },
  mounted () {
    this.packageId = this.$root.$mp.query.id
    console.log('Package ID: ' + this.packageId)
    if (this.isLogedIn) {
      this.loadData()
      this.ticketType()
    }
  },
  methods: {
    async submitFeedback () {
      wx.showLoading({ title: '提交中...', mask: true })
      var errid = 0
      try {
        this.ticketData.type = this.ticket_type.id
        this.ticketData.target_id = this.packageId

        console.log(this.ticketData)
        // wx upload file can upload only one file a time, so need to upload multiple times
        if (this.files.length === 0) {
          let header = { 'Content-Type': 'application/x-www-form-urlencoded' }
          let resp = await post('freighttickets/new/', this.ticketData, header)
          console.log('upload resp:' + resp)
          wx.hideLoading()
          showSuccess('上传成功')
          this.resetData()
        } else {
          let files = this.files
          let ticketID = -1
          for (var i = 0; i < files.length; i++) {
            if (i === 0) {
              let resp = await asyncUploadFile('freighttickets/new/', this.files[i], this.ticketData)
              console.log('file 1 time upload resp:' + resp)
              if (ticketID === -1) {
                let ticket = JSON.parse(resp)
                ticketID = ticket.object.id
                console.log('Ticket ID: ' + ticketID)
              }
            } else {
              if (ticketID === -1) {
                throw Error('no ticketID from first request.')
              }
              let resp = await asyncUploadFile('freighttickets/new/', files[i], {
                id: ticketID
              })
              console.log('upload resp:' + resp)
            }
          }
          this.resetData()
          console.log('New record created Done!')
          wx.hideLoading()
          showSuccess('上传成功')
        }
        wx.navigateBack({ delta: 1 })
        // this.resetData()
      } catch (error) {
        console.log('Upload failed! error:' + error)
        wx.hideLoading()
        showFail('上传错误')
        throw error
      }
      return errid

      // this.resetData()
    },
    async chooseImage (e) {
      var _this = this
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          _this.files = _this.files.concat(res.tempFilePaths)
        },
        fail: function () {
          console.log('fail')
        }
      })
    },
    previewImage (e) {
      console.log(this.files)
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.files // 需要预览的图片http链接列表
      })
    },
    deleteimage (e) {
      let id = e.currentTarget.id
      console.log('onDelete ID: ' + id)
      this.files.splice(id, 1)
    },
    feedback(id){
      console.log('id:', id)
      this.ticket_type = this.tickettypes.find(item => item.id == id)
      this.closeFeedback()
      this.showFeed()
    },
    closeFeedback : function(){
      this.hidden = 0;
      this.$refs.graceDrawerFeedback.hide();
    },
    showFeedback : function () {
      this.hidden = 1;
      this.$refs.graceDrawerFeedback.open();
    },
    closeFeed : function(){
      this.hidden = 0;
      this.$refs.graceDrawerFeed.hide();
    },
    showFeed : function () {
      this.hidden = 1;
      this.$refs.graceDrawerFeed.open();
    },
    changeFreightType : function(val){
      // console.log('robin:', val)
      this.formData.freight_type = val;
    },
    predivImage (e) {
      console.log(e)
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.images// 需要预览的图片http链接列表
      })
    },
    async ticketType() {
      let res = await get('freighttickets/types/?group=parcel')
      this.tickettypes = res.object
      console.log('this.tickettypes', this.tickettypes)
    },
    async loadData () {
      if (this.packageId === 0) {
        return
      }
      console.log('Get Customer Parcel Detail...')
      let resp = await get('parcels/' + this.packageId + '/')

      this.packageData = resp
      console.log(this.packageData)
      wx.setNavigationBarTitle({
        title: this.packageData.title ? this.packageData.title : '无标题'
      })
      this.images = this.packageData.images.map((item) => {
        return item.url.startsWith('http') ? item.url : (this.host + 'media/' + item.url)
        // return item.url
      })
      this.thumbs = this.packageData.images.map((item) => {
        return item.thumb.startsWith('http') ? item.thumb : (this.host + 'media/' + item.thumb)
        // return item.thumb
      })
      if (this.packageData.user) {
        this.name = this.packageData.user.first_name + ' ' + this.packageData.user.last_name +
            ' - ' + this.packageData.user.applicant_number
      }
      // this.volume = parseInt(parseFloat(this.packageData.volume) * 100 + 1)/100
      // this.volume = (parseInt(this.packageData.volume * 100) / 100 !== this.packageData.volume) ? parseInt(this.packageData.volume * 100) / 100 + 0.01 : (parseInt(this.packageData.volume * 100) / 100)
      this.volume = this.packageData.volume.toFixed(3)
      this.formData.customer_note = this.packageData.customer_note ? this.packageData.customer_note : ''
      this.formData.title = this.packageData.title

      this.select_freight_type.find(p => p.value == this.packageData.freight_type).checked = true

      this.items = this.packageData.orderdetail_set
      if (this.items.length === 0) {
        this.items.push(this.item)
      }
      this.formData.id = this.packageId
    },
    resetData () {
      this.packageData = []
      this.images = []
      this.packageId = 0
      this.thumbs = []
      this.name = ''
      this.formData = {
        title: '',
        customer_note: '',
        freight_type: 'S',
        titles: [],
        quantities: [],
        totals: [],
        materials: []
      }
      this.items = []
      this.item = {
        id: 0,
        reference: '',
        quantity: 1,
        title: '',
        subtotal: '',
        total: '',
        totalstr: 0.00
      }
    },
    async add_item () {
      var item = {
        id: 0,
        title: '',
        quantity: 1,
        reference: '',
        price: 0,
        subtotal: '',
        totalstr: 0.00
      }
      this.items.push(item)
      console.log(this.items)
    },
    async del_item (e) {
      // var size = JSON.parse(JSON.stringify(this.sizes[this.sizes.length - 1]))
      //
      // this.sizes.push(size)
      this.items.splice(e, 1)
      console.log(e)
    },
    async submit () {
      wx.showLoading({ title: '提交中...', mask: true })
      var errid = 0
      try {
        this.formData.titles = []
        this.formData.materials = []
        this.formData.quantities = []
        this.formData.totals = []
        this.items.forEach((item) => {
          if (item.title != '' && this.fobiden_list.includes(item.title)) {
            throw Error('Title')
          } 
          if (item.reference === '混合') {
            throw Error('Materials')
          }
          if (item.title === '' || item.quantity === '' || item.subtotal === '' || item.reference === '') {
            throw Error('Info')
          }

          this.formData.titles.push(item.title)
          this.formData.quantities.push(item.quantity)
          this.formData.materials.push(item.reference)
          this.formData.totals.push(item.subtotal)
        })
        this.formData.titles = JSON.stringify(this.formData.titles)
        this.formData.quantities = JSON.stringify(this.formData.quantities)
        this.formData.materials = JSON.stringify(this.formData.materials)
        this.formData.totals = JSON.stringify(this.formData.totals)

        console.log(this.formData)
        // let myformdata = new FormData(this.packageData)
        // console.log(myformdata)
        // wx upload file can upload only one file a time, so need to upload multiple times
        let header = { 'Content-Type': 'application/x-www-form-urlencoded' }
        let resp = await post('parcels/edit_parcel/', this.formData, header)
        // let resp = await post('companyparcels/edit_parcel/', this.packageData)
        console.log('upload resp:' + resp)
        wx.hideLoading()
        showSuccess('上传成功')
        event.emit('totalChanged', {
          id: this.packageData.id,
          total: this.total_price
        })

        // this.resetData()
      } catch (error) {
        errid = -1
        console.log('Upload failed! error:' + error)
        wx.hideLoading()
        if (error.message === 'Info') {
          showFail('请完善货物内容')
        } else if(error.message === 'Title'){
          showFail('请勿填写日用品/生活用品/食品/茶叶等概括性名称或者品牌如“三只松鼠”以免误导耽误清关报关')
        } else if(error.message === 'Materials'){
          showFail('混合材质请写明具体成分，例如塑料，金属')
        } else {
          showFail('上传错误')
        }
        throw error
      }
      return errid

      // this.resetData()
    },
    async submitBack () {
      try {
        let errid = await this.submit()
        console.log(errid)
        if (this.canBack) {
          wx.navigateBack({ delta: -1 })
        } else {
          wx.reLaunch({
            url: '/pages/home'
          })
        }
      } catch (error) {

      }
    },
    btnBack () {
      wx.reLaunch({
        url: '/pages/home'
      })
    }
  },
  onUnload () {
    this.resetData()
  }
}
</script>
<style scoped lang="scss">
button::after{ 
	border: none; 
}

button {
    border-radius: 33rpx;
    background: #BE1416;
}
  .ticket_type{line-height:80rpx; display:block; width:100%; text-align:center; font-size:35rpx;}
  .package{line-height:40rpx; display:block; width:100%; text-align:center; font-size:25rpx;}
  .photos{
    margin: 0 auto;
    padding: 0 2em;
    .weui-uploader__files{
      justify-content: center;
    }
  }
  .weui-uploader__file{
   position: relative;
  }
  .demo-wrap2{ width:85%; text-align:center; }
  .demo2{line-height:80rpx; display:block; width:100%; text-align:center; font-size:30rpx;}
  .detail-card {
    background-color: white;
    padding-top: 10upx;
    padding-bottom: 20upx;
    .title {
      font-size: 1.3em;
      font-weight: bold;
      margin: 20upx;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-bottom-color: #9b9b9b;
    }
    .desc {
      font-size: 0.9em;
      color: #626262;
    }
    .tip {
      text-align: left;
      color: #626262;
      font-size:0.9em;
    }
    .light {
      opacity: 0.56;
    }
   }
  .detail {
    margin: 20upx;
    align-items:center;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #9b9b9b;
    padding-top: 10upx;
    padding-bottom: 20upx;

    h1 {
      width: 30%;
      font-size: 32upx;
      font-weight: bold;
    }
    p {
      width: 70%;
      margin-bottom: 0;
      font-size: 36upx;
    }
    .line-section {
      p{
        font-size: 1em;
        margin-bottom: 10upx;
      }
      .item-title {
        width: 30%;
      }

      .item-caizhi {
        width: 30%;
      }

      .item-pieces {
        width: 20%;
      }

      .item-price {
        width: 30%;
      }
    }
    .icon {
      color: $uni-color-primary;
    }
  }
  p {
    font-size: 36rpx;
  }
  .item-notice {
      font-size: 22rpx !important;
      color:$theme-color;
    }
  .detail-container{
    margin: 1em;
    overflow-x:hidden;
    white-space:nowrap;
  }

  .total-row {
    padding-top: 0 !important;
    margin-top: 10upx !important;
    justify-content: space-between;
    p {
      font-weight: bold;
      font-size: 1em;
    }
    .icon {
      font-size: 1.6em;
    }
  }
  .submit{
    margin-top: 30upx;
    background-color: $theme-color;
    color: white;
    width: 80%;
    box-shadow: 0px 4px 16px #455B6308;
    border-radius: 3px;
  }
  .submitBack {
    margin-bottom: 50upx;
  }
  textarea {
    background: white;
    width: 70%;
    font-size: 1em;
    line-height: 1em;
    height: 3em;
  }
  .input-title{
    background: #ececec;
  }
  .inquire {
    background-color: $uni-color-error;
  }

</style>

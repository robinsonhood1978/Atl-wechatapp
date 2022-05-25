<template>
  <div>
    <div class="form-field" >
      <p>发件人地址信息</p>
      <div>
        <div v-for="(item, index) in adds" :key="index">
          <navigator :url="'/pages/common/addAddress?is_sender=true&id=' + item.id"  >

            <div class="weui-cell weui-cell_access weui-cell_link" @longpress="removeAddr" :data-index="item.id">
              <div class="weui-cell__bd">{{item.title?item.title+' ':''}}<br>
                {{item.firstname}} {{item.lastname}}<br>
                {{item.address}}, {{item.suburb}} <br> {{item.city}} {{item.postcode}}<br>
                {{item.tel}}</div>
              <div class="weui-cell__ft weui-cell__ft_in-access"></div>
            </div>
          </navigator>
        </div>
        <navigator url="/pages/common/addAddress?is_sender=true">
          <button class="pcl-btn" >新增地址</button>
        </navigator>
      </div>
      <h4 style="margin-top: 5px">点击地址进行编辑，长按删除</h4>
    </div>
  </div>
</template>

<script>
import { apiHost, get, del, setSenderAddress } from '@/utils/index'
import { mapState } from 'vuex'
// import mpModal from 'mpvue-weui/src/modal'
import event from '@/utils/event'
export default {
  computed: {
    ...mapState([
      'companyInfo',
      'senderAddress'
    ])
  },
  components: {
    // mpModal
  },
  data () {
    return {
      adds: null
    }
  },
  onShareAppMessage: function () {
    return {
      title: 'PackGo联系客服',
      path: 'pages/common/contact?uid=' + this.userProfile.uid,
      imageUrl: apiHost + this.companyInfo.logo
    }
  },
  mounted () {
    console.log('mounted')
    this.getAddress()
    let self = this
    event.on('addressChanged', this, function (obj) {
      self.getAddress()
    })
    this.adds = this.senderAddress
    console.log(this.adds)
  },
  methods: {
    removeAddr (e) {
      console.log(e)
      let addId = e.currentTarget.dataset.index
      let self = this
      wx.showModal({
        title: '提示',
        content: '确定要删除此地址吗？',
        success: async function (res) {
          if (res.confirm) {
            console.log('点击确定了 ' + addId)
            let header = { 'Content-Type': 'application/x-www-form-urlencoded' }
            let resp = await del('freightcustomers/addresses/', { id: addId }, header)
            if (resp.code === 0) {
              self.getAddress()
              event.emit('addressChanged', {})
            }
          } else if (res.cancel) {
            console.log('点击取消了')
            return false
          }
        }
      })
    },
    addressAdded (e) {
      console.log(e)
      if (e.code === 0) {
        this.getAddress()
      }
    },
    async getAddress () {
      // console.log('get address')
      const resp = await get('freightcustomers/addresses/?is_sender=true')
      if (resp.code !== 0) {
        console.log('Error to get address:' + resp.message)
        return
      }
      let address = resp.object
      if (!address) {
        address = []
      }
      this.adds = []
      setSenderAddress(address)
      this.adds = this.senderAddress

      console.log(this.senderAddress)
    }
  }
}
</script>

<style scoped lang="scss">
  .pcl-btn{
    margin-top: 10px;
    background-color: $theme-color;
    color: white;
    width: 600rpx;
    &:hover {
      background-color: white;
      color: $theme-color;
    }
  }
  .bg-dark{
    background-color: #e64340;
  }
  .form-field {
    margin: 20px auto;
    background: white;
    padding: 15px;
    p {
      font-weight: bold;
      font-size: 1.1em;
      margin: 5px 0px;
      text-align: center;
      margin-bottom: 10px;
    }
    h4 {
      text-align: center;
      font-size: 0.8em;
    }
    .weui-cell__bd {
      font-size: 1em;
    }

  }
</style>

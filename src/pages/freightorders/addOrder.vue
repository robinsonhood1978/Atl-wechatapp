<template>
  <view>
    <view class="grace-nowrap grace-margin-top">
				<view class="grace-step-item">
					<text :class="['grace-step-icon', step >= 1 ? 'step-red' : '']">1</text>
					<text :class="[step >= 1 ? 'text-red' : 'grace-step-text']">第1步</text>
				</view>
				<view :class="['grace-step-line', step >= 2 ? 'grace-step-line-active':'']"></view>
				<view class="grace-step-item">
					<text :class="['grace-step-icon', step >= 2 ? 'step-red' : '']">2</text>
					<text :class="[step >= 2 ? 'text-red' : 'grace-step-text']">第2步</text>
				</view>
				<view :class="['grace-step-line', step >= 3 ? 'grace-step-line-active':'']"></view>
				<view class="grace-step-item">
					<text :class="['grace-step-icon', step >= 3 ? 'step-red' : '']">3</text>
					<text :class="[step >= 3 ? 'text-red' : 'grace-step-text']">第3步</text>
				</view>
        <view :class="['grace-step-line', step >= 4 ? 'grace-step-line-active':'']"></view>
        <view class="grace-step-item">
					<text :class="['grace-step-icon', step >= 4 ? 'step-red' : '']">4</text>
					<text :class="[step >= 4 ? 'text-red' : 'grace-step-text']">第4步</text>
				</view>
			</view>
    <div style="padding: 10px 15px 50px">
      <div v-if="step == 1">
        <div class="title">请选择运单类型：</div>
        <radio-group @change="radioChange">
          <label class="weui-cell weui-check__label" v-for="(item, index) in freight_type" :key="index">

            <view class="weui-cell__hd">
              <radio :value="item.code" :checked="item.checked"/>
            </view>
            <view class="weui-cell__bd">   {{item.rangeKey}}</view>
          </label>
        </radio-group>
      </div>
      <div v-if="step == 2">
        <div class="title">请选择要发送的包裹：</div>
        <view class="grace-form-item" style="align-items:flex-start;margin:0 30rpx;">
					<view class="grace-form-label">包裹排序</view>
					<view class="grace-form-body">
						<graceSelectTags :items="orderby" type="radio" @change="changeOrder"></graceSelectTags>
					</view>
				</view>
        <!--    <mpCheckbox :list="parcels" v-model="parcelsToSend" @change="checkboxChange"></mpCheckbox>-->
        <checkbox-group @change="checkboxChange" class="weui-checkbox-group">
          <label class="weui-checkbox" v-for="(item, index) in parcels" :key="index" >
            <checkbox class="weui-checkbox-input" :value="item.id" :checked="item.checked"  :disabled="item.disabled || false"/>
            <div class="weui-checkbox-icon">
              <icon class="weui-checkbox-icon-circle" type="circle" size="23" v-if="!item.checked" :class="item.disabled ? 'weui-checkbox-diabled': ''"></icon>
              <icon class="weui-checkbox-icon-success" type="success" size="23" v-if="item.checked" :class="item.disabled ? 'weui-checkbox-diabled': ''"></icon>
            </div>
            <div class="weui-checkbox-bd" :class="item.disabled ? 'weui-checkbox-diabled': ''">
              
                   
                        <div @click="needDetail(item.id)" v-if="item.disabled">
                          {{item.title}} {{item.weight.toFixed(2)}}KG,  <span v-if="item.disabled">请完善货值</span> <span v-else>货值:¥{{item.total}}</span>
                           <span v-if="item.freight_type=='F'"><img style="width:20px;height:20px;margin-left:10px;" src="/static/icons/plane-color.png" alt="空运"></span>
                          <span v-if="item.freight_type=='S'"><img style="width:20px;height:20px;margin-left:10px;" src="/static/icons/motor-ship.png" alt="海运"></span>
                        </div>
                        <div v-else> {{item.title}} {{item.weight.toFixed(2)}}KG,  <span v-if="item.disabled">请完善货值</span> <span v-else>货值:¥{{item.total}}</span> 
                          <span v-if="item.freight_type=='F'"><img style="width:20px;height:20px;margin-left:10px;" src="/static/icons/plane-color.png" alt="空运"></span>
                          <span v-if="item.freight_type=='S'"><img style="width:20px;height:20px;margin-left:10px;" src="/static/icons/motor-ship.png" alt="海运"></span>
                        </div>
               
            </div>
          </label>
          <button class="pcl-btn selectall" @click="selectAll" >{{order.parcel_ids.length>0?'清除选择':'选择全部'}}</button>
        </checkbox-group>
      </div>
      <div class="total" v-if="step != 1">
        <view class="grace-margin-top">
				  <text class="grace-title">运单信息</text>
        </view>
        <view>
          <graceBoxBanner :border="['dashed','#D8D8D8', '1px']" 
          :color="['#BE1416','#999999', '#999999']" 
          :fontSize="['38rpx', '24rpx', '20rpx']" 
          background="#F8F8F8" :items="briefs"></graceBoxBanner>
        </view>
        </div>

      <div v-if="step == 3 && order.freight_type!='C'">
        <checkbox-group @change="redeliverCheckboxChange" class="weui-checkbox-group no-border">
          <label class="weui-checkbox single-checkbox">
            <checkbox class="weui-checkbox-input"  :checked="is_redeliver"  />
            <div class="weui-checkbox-icon">
              <icon class="weui-checkbox-icon-circle" type="circle" size="23" v-if="!is_redeliver"></icon>
              <icon class="weui-checkbox-icon-success" type="success" size="23" v-if="is_redeliver"></icon>
            </div>
            <div class="weui-checkbox-bd cusCheckbox">
            <span class="redelivery">
              转运运单 - 收件人需要承担GST
              <p>发件人不知道包裹目的地 货值低于1000NZD<span class="red"> 收件人负责货物GST</span></p>
            </span>
            </div>
          </label>
          <label class="weui-checkbox single-checkbox">
            <checkbox class="weui-checkbox-input"  :checked="is_redeliver"  />
            <div class="weui-checkbox-icon">
              <icon class="weui-checkbox-icon-circle" type="circle" size="23" v-if="is_redeliver"></icon>
              <icon class="weui-checkbox-icon-success" type="success" size="23" v-if="!is_redeliver"></icon>
            </div>
            <div class="weui-checkbox-bd cusCheckbox">
            <span class="redelivery">
              直邮运单 - 收件人不需要承担GST
              <p>发件人知道包裹目的地 货值低于1000NZD<span class="red"> 发件人负责货物GST</span></p>
            </span>
            </div>
          </label>
        </checkbox-group>
        <div v-if="!is_redeliver">
          <div class="title grace-text-center">发货人地址</div>
          <div class="form-field" >
            <div>
              <navigator url="/pages/common/address?show=1&is_sender=true">
              <radio-group v-if="d_sender_adds[0]">
                <label class="weui-cell weui-check__label" v-for="(sender) in d_sender_adds" :key="sender.id">
                  <radio class="weui-check" :value="sender.id" :checked="sender.checked" />
                  <div class="weui-cell__bd" style="font-size: 0.8em">{{sender.title?sender.title:''}}
                    <text class="grace-badge demo step-red" v-show="sender.id==d_sender_adds_id">默认</text><br v-if="sender.title">
                    {{sender.firstname}} {{sender.lastname}} <br>
                    {{sender.tel}}<br>
                    {{sender.address}}, {{sender.suburb}} <br>{{sender.city}}, {{sender.country}} {{sender.postcode}}</div>
                  <div class="weui-cell__ft weui-cell__ft_in-radio">
                    <div class="weui-cell__ft weui-cell__ft_in-access"></div>
                  </div>
                </label>
              </radio-group>
              
                <div class="weui-cell weui-cell_access weui-cell_link" >
                  <div class="weui-cell__bd">发货地址管理</div>
                  <div class="weui-cell__ft weui-cell__ft_in-access"></div>
                </div>
              </navigator>
            </div>
          </div>
        </div>

        
        <div class="title grace-text-center">收货人地址</div>
        <div class="form-field" >
          <div>
            <navigator url="/pages/common/address?show=1">
            <radio-group v-if="d_adds[0]">
              <label class="weui-cell weui-check__label" v-for="(item) in d_adds" :key="item.id">
                <radio class="weui-check" :value="item.id" :checked="item.checked" />
                <div class="weui-cell__bd" style="font-size: 0.8em">{{item.title?item.title:''}}
                  <text class="grace-badge demo step-red" v-show="item.id==d_adds_id">默认</text>
                  <br v-if="item.title">
                  {{item.firstname}} {{item.lastname}} <br>
                  {{item.tel}}<br>
                  {{item.address}}, {{item.suburb}}<br>{{item.city}}, {{item.country}} {{item.postcode}}</div>
                <div class="weui-cell__ft weui-cell__ft_in-radio">
                  <div class="weui-cell__ft weui-cell__ft_in-access"></div>
                </div>
              </label>
            </radio-group>

            

            
              <div class="weui-cell weui-cell_access weui-cell_link" >
                <div class="weui-cell__bd">收货地址管理</div>
                <div class="weui-cell__ft weui-cell__ft_in-access"></div>
              </div>
            </navigator>
          </div>
        </div>

        <div class="title grace-text-center">是否自提</div>
        <div class="form-field" >
          <div>
            <graceCheckBtn :checked="order.is_pickup" @change="checkedChange" :size="46">
              <text class="grace-text">我要自提</text>
            </graceCheckBtn>
          </div>
        </div>
         <div class="title grace-text-center" v-show="order.is_pickup">自提地址信息</div>
         
        <div class="form-field">
          <!-- <div class="weui-cell__bd" style="font-size: 0.8em" v-show="order.is_pickup">
                    请联系客服，获取自提地址信息 <br>
            </div> -->
          <div>
            <!--radio-group v-show="order.is_pickup">
              <label class="weui-cell weui-check__label" v-for="(item) in pickup_adds" :key="item.id">
                <radio class="weui-check" :value="item.id" :checked="item.checked" />
                <div class="weui-cell__bd" style="font-size: 0.8em">{{item.title?item.title:''}}<br v-if="item.title">
                  {{item.firstname}} {{item.lastname}} <br>
                  {{item.tel}}<br>
                  {{item.address}}, {{item.suburb}}<br>{{item.city}}, {{item.country}} {{item.postcode}}</div>
                
              </label>
            </radio-group-->
            <radio-group v-show="order.is_pickup" @change="pickupRadioChange">
          <label class="weui-cell weui-check__label" v-for="(item) in pickup_adds" :key="item.id">

            <view class="weui-cell__hd">
              <radio :value="item.id" :checked="item.checked"/>
            </view>
            <div class="weui-cell__bd" style="font-size: 0.8em">{{item.title?item.title:''}}<br v-if="item.title">
                  {{item.firstname}} {{item.lastname}} <br>
                  {{item.tel}}<br>
                  {{item.address}}, {{item.suburb}}<br>
                  {{item.city}}, {{item.country}} {{item.postcode}}<br>
                  <div v-if="item.description">自提时间：<br>{{item.description}}</div>
            </div>
          </label>
        </radio-group>
            

          </div>
        </div>

        <view class="grace-margin-top">
				  <text class="grace-title">备注</text>
        </view>
        <view class="grace-box-shadow" style="margin:0 30rpx;">
            <view class="grace-card-view">
              <view class="grace-card-body">
                <view class="grace-card-desc">
                  <view class="grace-card-title">
                    <textarea v-model="order.customer_note" class="grace-textarea" value="" placeholder="请输入备注信息。" />
                  </view>
                </view>
              </view>
            </view>
        </view>
      </div>

      <div v-if="step == 3 && order.freight_type=='C'">
        
        <view class="grace-margin-top">
				  <text class="grace-title">备注</text>
        </view>
        <view class="grace-box-shadow" style="margin:0 30rpx;">
            <view class="grace-card-view">
              <view class="grace-card-body">
                <view class="grace-card-desc">
                  <view class="grace-card-title">
                    <textarea v-model="order.customer_note" class="grace-textarea" value="" placeholder="请输入退货地址（最好直接拷贝粘贴商家的收货地址，避免输入错误），如果由卖方来仓库自取，请注明。" />
                  </view>
                </view>
              </view>
            </view>
        </view>
        
      </div>

      <div v-if="step == 4">
        <view class="graceSelectMenuItem grace-scroll-x" v-if="vouchers.length>=1">
          <!-- 此处演示数据来自后端 api，将后端的复杂数组转换为简单数组使用并适配 -->
          <div class="title" style="margin:auto; margin-right: 50upx" >请选择要使用的优惠券</div>
          <graceSelectMenu
            class="grace-red" style="margin:auto"
            :show="show2" :height="300" :selectIndex="selectIndex2" :items="selectMenu2"
            activeColor="#BE1416" fontSize="30rpx"
            @showMenu="showMenu2" @close="closeMenu2" @select="select2"></graceSelectMenu>
        </view>
        
        <div class="freight_desp">
          <view  v-for="(charge, index) in quote" :key="index"  @tap='selectCT(index)' >
            <FeesCard :isActive="charge_type_index === index"
                      :chargeType="charge"
            />
          </view>

          
            <view class="grace-margin-top">
              <text class="grace-title">货物明细</text>
            </view>
            
            <view class="weui-cells weui-cells_after-title">
                <view class="weui-cell weui-cell_example">
                   <view class="weui-cell__bd">包裹件数</view>
                    <view class="weui-cell__ft">{{briefs[0][0]}} 件</view>
                </view>
                <view class="weui-cell weui-cell_example">
                    <view class="weui-cell__bd">货物体积</view>
                    <view class="weui-cell__ft">{{briefs[1][0]}} 立方米</view>
                    </view>
                    <view class="weui-cell weui-cell_example">
                    <view class="weui-cell__bd">计费重量</view>
                    <view class="weui-cell__ft">{{ briefs[3][0] }} 公斤</view>
                    </view>
            </view>
          
          <view class="grace-margin-top">
            <text class="grace-title">增值服务</text>
          </view>
          <view class="grace-box-shadow">
            
            <checkbox-group @change="changeOpts" class="weui-checkbox-group">
              <label class="weui-checkbox" v-for="(item, index) in opts" :key="index" >
                <checkbox class="weui-checkbox-input" :value="item.id" :checked="item.checked"  :disabled="item.disabled || false"/>
                <div class="weui-checkbox-icon">
                  <icon class="weui-checkbox-icon-circle" type="circle" size="23" v-if="!item.checked" :class="item.disabled ? 'weui-checkbox-diabled': ''"></icon>
                  <icon class="weui-checkbox-icon-success" type="success" size="23" v-if="item.checked" :class="item.disabled ? 'weui-checkbox-diabled': ''"></icon>
                </div>
                
                  <view class="weui-cell__bd">{{item.title}}</view>
                    <view class="weui-cell__ft">{{ item.amount.toFixed(2) }} NZD</view>
                
              </label>
            </checkbox-group>
          </view>

          <view class="grace-margin-top">
            <text class="grace-title">派送方式</text>
          </view>
          <view class="grace-box-shadow">
            
            <radio-group @change="deliveryMethodRadioChange">
              <label class="weui-cell weui-check__label" v-for="(item, index) in delivery_methods" :key="index">

                <view class="weui-cell__hd">
                  <radio :value="item.id" :checked="item.checked"/>
                </view>
                <view class="weui-cell__bd">
                  <view class="weui-cell__bd">   {{item.title}}</view>
                  <view v-if="item.subtitle" class="weui-cell__lt">{{item.subtitle}}</view>
                  <view v-if="item.price_text" class="weui-cell__lt">{{item.price_text}}</view>
                </view>
                <view class="weui-cell__ft">{{ item.price.toFixed(2) }} NZD</view>
              </label>
            </radio-group>
          </view>
          

          <div v-if="quote">
            <view class="grace-margin-top">
              <text class="grace-title">价格明细</text>
            </view>
            <view class="weui-cells weui-cells_after-title">
                <view class="weui-cell">
                    <view class="weui-cell__bd">总价：</view>
                    <view class="weui-cell__ft red" v-if="!waiting && order.freight_type!='C'">{{ total }} NZD</view>
                    <view v-else>
                    <view class="weui-cell__ft red" v-if="order.freight_type=='C'">请联系客服获取</view>
                    <view class="weui-cell__ft red" v-else>处理完成后计算</view>
                    </view>
                </view>
            </view>
            <view class="weui-cells weui-cells_after-title">
                <view class="weui-cell weui-cell_example" v-for="(item,index) in quote[charge_type_index].details" :key="index">
                    <view class="weui-cell__bd">
                      <view class="weui-cell__bd">{{item.title}}</view>
                      <view v-if="item.msg" class="weui-cell__lt">{{item.msg}}</view>
                    </view>
                    <view class="weui-cell__ft red" v-if="waiting && item.title.indexOf('国际运输费')>-1">处理完成后计算</view>
                    <view class="weui-cell__ft" v-else>{{ item.gross.toFixed(2) }} NZD</view>
                </view>
                

                <view class="weui-cell weui-cell_example" v-for="(item,index) in opts_checked" :key="index">
                    <view class="weui-cell__bd">{{item.title}}</view>
                    <view class="weui-cell__ft">{{ item.amount.toFixed(2) }} NZD</view>
                </view>
            </view>
           <div class="title">报价项说明:</div> 
            <view class="weui-cells__title" v-for="(msg,index) in quote[charge_type_index].msg" :key="index">{{msg}}</view>
          </div>
          <div v-else>
            <view class="weui-cells__title">计算报价中...</view>
          </div>

          <div class="title">为避免后续处理延误，请选择最合适的计费方式，如不确定，请在<span style="color:red">生成运单后</span>联系客服确认更改。</div>

          <view v-if="wallet" class="grace-margin-top">
            <text class="grace-title">使用钱包余额支付</text>
          </view>
          <view v-if="wallet" class="grace-box-shadow">
            
            <checkbox-group @change="checkWallet" class="weui-checkbox-group">
              <label class="weui-checkbox">
                <checkbox class="weui-checkbox-input" :value="order.use_wallet" :checked="order.use_wallet"/>
                <div class="weui-checkbox-icon">
                  <icon class="weui-checkbox-icon-circle" type="circle" size="23" v-if="!order.use_wallet"></icon>
                  <icon class="weui-checkbox-icon-success" type="success" size="23" v-if="order.use_wallet"></icon>
                </div>
                
                  <view class="weui-cell__bd">使用钱包余额支付</view>
                    <view class="weui-cell__ft">{{ wallet }} NZD</view>
                
              </label>
            </checkbox-group>
          </view>
          
          <view class="grace-margin-top">
            <text class="grace-title">用户须知</text>
          </view>
          <view class="grace-box-shadow">
            <view class="grace-card-view">
              <view class="grace-card-body grace-border-b">
                <view class="grace-card-desc" v-for="(dec) in declarations" :key="dec.id">
                  <navigator :url="dec.link">
                  <view class="grace-card-title">
                    <text class="grace-card-name">{{dec.title}}</text>
                  </view>
                  </navigator>
                  <text class="grace-card-text">{{dec.description}}</text> 
                </view>
              </view>
              <view class="grace-card-footer">
                  <graceCheckBtn @change="checkedAgree" :size="46">
                    <text class="grace-card-name">我同意 </text><span class="color-demo">*</span>
                    
                    
                  </graceCheckBtn>
              </view>
            </view>
           
          </view>
        </div>
      </div>
      
      <div class="btn-group">
        <button class="pcl-btn" @click="submitOrder" v-if="step==4 && quote" :disabled="agreed">提交</button>
        <button class="pcl-btn" @click="nextStep" v-if="step<=3">下一步</button>
        <button class="pcl-btn" @click="prevStep" v-if="step >= 2">上一步</button>
      </div>
    </div>
  </view>
</template>

<script>
import { get, post, showSuccess, showFail, setAddress, setSenderAddress } from '@/utils/index'
// import mpCheckbox from 'mpvue-weui/src/checkbox'
import { mapState } from 'vuex'
import event from '@/utils/event'
import FeesCard from '@/components/fees-card'
import graceSelectTags from '@/graceUI/components/graceSelectTags.vue';
import graceSelectMenu from '@/graceUI/components/graceSelectMenu.vue'
import graceCheckBtn from "../../graceUI/components/graceCheckBtn.vue";
import graceBoxBanner from "../../graceUI/components/graceBoxBanner.vue";
// import vouchers from '../common/vouchers'
export default {
  data () {
    return {
      waiting: false,
      opts_fee: 0,
      declarations: null,
      agreed: 'disabled',
      briefs: [
				[0, '件', '包裹'],
				[0, 'm3', '体积'],
				[0, 'KG', '重量'],
        [0, 'KG', '材积'],
				[0, '¥', '申报货值']
			],
      opts_checked: null,
			opts    : null,
      c_sender_adds_id: 0,
      c_adds_id: 0,
      d_sender_adds_id: 0,
      d_adds_id: 0,
      is_redeliver: false,
      packageId: 0,
      parcels: [],
      step: 1,
      showAddAddress: false,
      addPickerIndex: 0,
      cusAddPickerIndex: 0,
      rangeKey: 'rangeKey',
      isSameAddForCus: true,
      freightPickerIndex: 0,
      ftype: '',
      freight_type: [{
        code: 'S',
        checked: false,
        rangeKey: '海运'
      }, {
        code: 'F',
        checked: false,
        rangeKey: '空运'
      }, {
        code: 'C',
        checked: false,
        rangeKey: '退货'
      }],
      charge_type_index: -1,
      order: {
        title: '',
        // charge_type: -1,
        freight_type: '',
        parcel_ids: [],
        is_pickup: false,
        locate_address_id: 0,
        receiver_address_id: -1,
        sender_address_id: -1,
        operations: [],
        description: '',
        customer_note: '',
        use_wallet: false
      },
      quote: null,
      adds: null,
      d_adds: null,
      pickup_adds: null,
      sender_adds: null,
      d_sender_adds: null,
      show2: false,
      selectIndex2: 1,
      vouchers: [],
      selectMenu2: []
    }
  },
  components: {
    // mpCheckbox,
    FeesCard,
    graceCheckBtn,
    graceSelectMenu,
    graceSelectTags,
    graceBoxBanner
  },
  computed: {
    ...mapState([
      'userProfile',
      'chargeTypes',
      'address',
      'senderAddress'
    ]),
    orderby() {
      let o = [
				{ name: '空运优先', value: '0', checked: true },
				{ name: '海运优先', value: '1', checked: false }
			]
      if(this.order.freight_type=='S'){
        o = [
          { name: '空运优先', value: '0', checked: false },
          { name: '海运优先', value: '1', checked: true }
        ]
      }
      return o
    },
    wallet() {
      return (this.userProfile.customer.gold + this.userProfile.customer.silver).toFixed(2)
    },
    delivery_methods(){
      let methods = null
      if(this.quote){
        methods = this.quote[this.charge_type_index].delivery_methods
        methods.forEach(item=>{
          item.checked=false
        })
      }
      return methods
    },
    total() {
      let sum = 0
      if(this.quote){
        console.log('charge_type_index:', this.charge_type_index)
        let t = this.quote[this.charge_type_index].total
        // console.log('sum:',t)
        t = Math.ceil(t*100)/100
        // console.log('ceil:',t)
        sum = parseFloat(t)+parseFloat(this.opts_fee)
        // console.log('add opts:',sum)
        // sum = sum.toFixed(2)
        sum = Math.ceil(sum*100)/100
        // console.log('sum ceil:',sum)
      }
        
      return sum
    },
    totalWeight () {
      let sum = 0
      this.parcels.forEach(function (element) {
        if (element.checked === true) {
          sum = sum + element.weight
        }
      })
      // let w = sum.toFixed(2)
      let w = Math.ceil(sum*10)/10
      this.briefs[2][0]=w
      return w
    },
    totalVolume () {
      let sum = 0
      this.parcels.forEach(function (element) {
        if (element.checked === true) {
          sum = sum + element.volume
        }
      })
      // let v = sum.toFixed(3)
      let v = Math.ceil(sum*1000)/1000
      this.briefs[1][0]=v
      console.log("this.briefs[1][0]:"+this.briefs[1][0])
      return v
    },
    volumeWeight () {
      let vw = (this.totalVolume / 0.006)
      vw = Math.ceil(vw*10)/10
      return vw
    },
    airVolumeWeight () {
      let av = (this.totalVolume / 0.005)
      av = Math.ceil(av*10)/10
      if(this.quote){
        av = this.quote[this.charge_type_index].weight
        av = Math.ceil(av*10)/10
      }
      this.briefs[3][0]=av
      return av
    },
    totalPieces () {
      let sum = 0
      this.parcels.forEach(function (element) {
        if (element.checked === true) {
          sum = sum + element.pieces
        }
      })
      this.briefs[0][0]=sum
      return sum
    },
    totalValue () {
      let sum = 0
      this.parcels.forEach(function (element) {
        if (element.checked === true) {
          sum = sum + element.total
        }
      })
      // let tv = (sum).toFixed(2)
      let tv = Math.ceil(sum*100)/100
      this.briefs[4][0] = tv
      return tv
    }
  },
  async mounted () {
    console.log('aaabbb')
    console.log(this.userProfile.customer.address);
    console.log(this.userProfile.customer.shipper_address);
    this.d_sender_adds_id=(this.userProfile.customer.shipper_address==null)?0:this.userProfile.customer.shipper_address
    this.d_adds_id=(this.userProfile.customer.address==null)?0:this.userProfile.customer.address
    this.pickup_adds = this.userProfile.company.pickup_addresses
    // var obj = JSON.parse(JSON.stringify(this.pickup_adds[0]));
    // obj.id = 123;
    // this.pickup_adds.push(obj);
    // console.log(this.pickup_adds)
  },
  onLoad: function () {
    this.loadPreOrder()
	},
  onUnload () {
    this.resetData()
  },
  onShow () {
    console.log('addOrder onShow')
    
  },
  methods: {
    changeOrder : function(val){
      this.parcels = this.parcels.reverse();
    },
    totop : function(){
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			});
		},
    async loadPreOrder(){
      if (!this.userProfile.is_customer) {
        return
      }
      let url = 'freightorders/?count=1'
      let pre_order = await get(url)
      if(pre_order.length>0){
        this.order.is_pickup = pre_order[0].is_pickup
        console.log('pre_order', pre_order[0].is_pickup)
        if(pre_order[0].locate_address){
          const locateAddressIndex = this.pickup_adds.findIndex(p => p.id === pre_order[0].locate_address.id)
          console.log('locateAddressIndex', locateAddressIndex)
          this.pickup_adds[locateAddressIndex].checked = true
        }
      }
      
    },
    checkWallet: function(e){
      this.order.use_wallet = !this.order.use_wallet
      console.log('order.use_wallet:', this.order.use_wallet)
    },
    changeOpts : function(e){
      console.log('checkbox发生change事件，携带value值为：' + e.mp.detail.value)
      // let checkboxItems = this.parcels
      let values = e.mp.detail.value
      for (let i = 0, lenI = this.opts.length; i < lenI; ++i) {
        this.opts[i].checked = false

        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (this.opts[i].id === parseInt(values[j])) {
            this.opts[i].checked = true
            break
          }
        }
      }
      this.opts_checked = this.opts.filter(item => item.checked === true)
        this.opts_fee = 0;
        this.opts_checked.forEach(item=>{
          this.opts_fee += item.amount
        })
        this.waiting = false
        for (let q = 0, qq = this.opts_checked.length; q < qq; ++q) {
            if(this.opts_checked[q].need_payment_after_operation){
              this.waiting = true
              break
            }
        }
      // this.parcels = checkboxItems
     this.order.operations = values
     console.log(this.order.operations)
    },
    checkedChange : function (e) {
			console.log(e);
			this.order.is_pickup = e[0];
      if(!e[0]){
        this.order.locate_address_id = 0;
      }
		},
    checkedAgree : function (e) {
			console.log(e);
			this.agreed = !e[0];
		},

    selectCT (index) {
      this.charge_type_index = index
      this.loadOpts()
      //console.log("this.order.operations:"+this.order.operations )
      this.order.operations = []
    },
    loadOpts(){
      this.opts = this.quote[this.charge_type_index].operation_types
      this.declarations = this.quote[this.charge_type_index].charge_type.declarations
      this.opts.forEach(item=>{
        item.checked=false
      })
    },
    addressRadioChange (e) {
      this.adds.forEach(item => {
        item.checked = false
        if (item.id === parseInt(e.currentTarget.id)) {
          item.checked = true
          this.order.receiver_address_id = item.id
          console.log(this.order)
        }
      })
      this.$forceUpdate()
    },
    senderAddressRadioChange (e) {
      console.log(e)
      this.sender_adds.forEach(item => {
        item.checked = false
        if (item.id === parseInt(e.currentTarget.id)) {
          item.checked = true
          this.order.sender_address_id = item.id
          console.log(this.order)
        }
      })
      console.log(this.sender_adds)
      this.$forceUpdate()
    },
    freightPickerChange (e) {
      let pickerindex = e.mp.detail.value
      if (this.chargeTypes[pickerindex]) {
        console.log('selected freight_type: ' +
            this.chargeTypes[pickerindex].title_zh_hans
        )
        this.freightPickerIndex = pickerindex
        this.order.charge_type = this.chargeTypes[pickerindex].id
        this.getQuote()
      }
    },
    async getQuote () {
      let header = { 'Content-Type': 'application/json' }
      let order = this.order
      this.charge_type_index = -1
      if (this.isSameAddForCus) {
        delete order.clearance_address_id
      }

      this.quote = null
      let resp
      if (this.selectMenu2.length > 1 && this.selectIndex2 > 0) {
        order.voucher_id = this.vouchers[this.selectIndex2 - 1].id
      } else {
        delete order.voucher_id
      }
      resp = await post('freightorders/quote/', order, header)
      if (resp.code === 0) {
        this.quote = resp.object
        if (this.quote.length >= 1) {
          this.charge_type_index = 0
          this.loadOpts()
          
        }
      }
      console.log(this.quote)
    },
    async getAddress () {
      this.d_sender_adds_id=(this.userProfile.customer.shipper_address==null)?0:this.userProfile.customer.shipper_address
      this.d_adds_id=(this.userProfile.customer.address==null)?0:this.userProfile.customer.address
      this.c_sender_adds_id=(this.userProfile.customer.c_shipper_address==null)?0:this.userProfile.customer.c_shipper_address
      this.c_adds_id=(this.userProfile.customer.c_address==null)?0:this.userProfile.customer.c_address
      
      const resp = await get('freightcustomers/addresses/')
      if (resp.code !== 0) {
        console.log('Error to get address:' + resp.message)
        return
      }
      let address = resp.object
      if (!address) {
        address = []
      }
      this.adds = address.filter(item => item.is_sender === false)
      this.sender_adds = address.filter(item => item.is_sender === true)

      //收件人
      if(this.c_adds_id!=0){
        this.d_adds = this.adds.filter(item => item.id == this.c_adds_id)
        
      }
      else{
        if(this.d_adds_id!=0){
          this.d_adds = this.adds.filter(item => item.id == this.d_adds_id)
          this.c_adds_id = this.d_adds_id
        } 
        else{
          this.d_adds = [];
          if(this.adds[0]){
            this.d_adds.push(this.adds[0]);
            this.c_adds_id = this.adds[0].id
          }
        }
      }
      //发件人
      if(this.c_sender_adds_id!=0){
        this.d_sender_adds = this.sender_adds.filter(item => item.id == this.c_sender_adds_id)
        
      } 
      else{
        if(this.d_sender_adds_id!=0){
          this.d_sender_adds = this.sender_adds.filter(item => item.id == this.d_sender_adds_id)
          this.c_sender_adds_id = this.d_sender_adds_id
        } 
        else{
          this.d_sender_adds = [];
          if(this.sender_adds[0]){
            this.d_sender_adds.push(this.sender_adds[0]);
            this.c_sender_adds_id = this.sender_adds[0].id
          }
        }
      }

      this.order.receiver_address_id = -1
      if (this.c_adds_id != 0) {
        this.order.receiver_address_id = this.c_adds_id
      }
      
      this.order.sender_address_id = -1
      if (this.c_sender_adds_id != 0) {
        this.order.sender_address_id = this.c_sender_adds_id
      }
      console.log("收件地址:"+this.c_adds_id)
      console.log("发件地址:"+this.c_sender_adds_id)
      
      console.log(' Robin get address')

      setAddress(this.adds)
      setSenderAddress(this.sender_adds)

      
      
      
      
      this.$forceUpdate()
    },
    airfirst(a,b) {
      if (a.freight_type < b.freight_type)
        return -1;
      if (a.freight_type > b.freight_type)
        return 1;
      return 0;
    },
    seafirst(a,b) {
      if (a.freight_type > b.freight_type)
        return -1;
      if (a.freight_type < b.freight_type)
        return 1;
      return 0;
    },
    async getParcel () {
      const self = this
      // let chargeTypes = await get('chargetypes/')
      // console.log(chargeTypes)
      // setChargeTypes(chargeTypes)
      // if (this.chargeTypes.length > 0) {
      //   this.order.charge_type = this.chargeTypes[0].id
      // }
      wx.showLoading({ title: '加载中...', mask: true })
      let url = 'parcels/?state=P'
      // if(this.order.freight_type=='F')
      //   url += '&filed=1'
      // else if (this.order.freight_type=='S')
      //   url += '&filed=2'
      //else if (this.order.freight_type=='C')
        url += '&unsent=1&count=0'
      
      this.parcels = await get(url)
      this.order.parcel_ids = []
      this.parcels = this.parcels.filter(p => (p.dform === null))
      if(this.order.freight_type=='F')
        this.parcels = this.parcels.sort(this.airfirst)
      else if(this.order.freight_type=='S')
        this.parcels = this.parcels.sort(this.seafirst)

      console.log("this.ftype:"+this.ftype)
      if(this.ftype=='C'){
          this.parcels.forEach(function (element) {
            self.$set(element, 'checked', false)
            self.$set(element, 'disabled', false)
          })
      }
      else{
          this.parcels.forEach(function (element) {
            self.$set(element, 'checked', false)
            if (element.need_details) {
              
                  self.$set(element, 'disabled', true)
              
            } else {
              self.$set(element, 'disabled', false)
            }
          })
      }
      
      console.log("parcels:"+this.parcels)
      event.on('totalChanged', this, function (obj) {
        console.log(obj.id + ' total:' + obj.total)
        this.parcels.forEach((p) => {
          if (p.id === obj.id) {
            if (parseFloat(obj.total) > 0) {
              self.$set(p, 'disabled', false)
              self.$set(p, 'checked', true)
              self.$set(p, 'total', parseFloat(obj.total))
              this.order.parcel_ids.push(p.id)
            }
            console.log(p)
          }
        })
        console.log(this.order.parcel_ids)
      })
      event.on('addressChanged', this, function (obj) {
        console.log('step3 address changed')
        self.getAddress()
      })
      this.getAddress()
      wx.hideLoading()

      setTimeout(async () => {
        // 默认二个菜单的数据来自api请求
        // 请求的原本数据格式 :
        // this.vouchers = []
        let apiUrl = 'promotions/vouchers/'
        let list = await get(apiUrl)
        console.log(list)
        if (list.code === 0) {
          this.vouchers = list.object
        } else {
          this.vouchers = []
        }
        // 将后端的复杂数组转换为索引关系一致的简单数组
        this.selectMenu2 = []
        if(this.vouchers){
          for (var i = 0; i < this.vouchers.length + 1; i++) {
            if (i === 0) {
              this.selectMenu2.push('不使用优惠券')
            } else {
              this.selectMenu2.push(this.vouchers[i - 1].promotion.title)
            }
          }
        }
        this.selectIndex2 = 0
      }, 1000)
    },
    checkboxChange (e) {
      console.log('checkbox发生change事件，携带value值为：' + e.mp.detail.value)
      // let checkboxItems = this.parcels
      let values = e.mp.detail.value
      for (let i = 0, lenI = this.parcels.length; i < lenI; ++i) {
        this.parcels[i].checked = false

        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (this.parcels[i].id === parseInt(values[j])) {
            this.parcels[i].checked = true
            break
          }
        }
      }
      // this.parcels = checkboxItems
      this.order.parcel_ids = values
      console.log(this.parcels)
    },
    radioChange(e) {
      console.log('radio发生change事件，携带value值为：', e.detail.value)
      this.ftype = e.detail.value
      const items = this.freight_type
      for (let i = 0, len = items.length; i < len; ++i) {
        items[i].checked = items[i].value === e.detail.value
      }
      this.order.freight_type = e.detail.value;
      console.log(this.order)
    },
    deliveryMethodRadioChange(e) {
      console.log('delivery radio发生change事件，携带value值为：', e.detail.value)
      this.order.delivery_method = parseInt(e.detail.value);
      console.log(this.order)
    },
    pickupRadioChange(e) {
      console.log('pickup radio发生change事件，携带value值为：', e.detail.value)
      this.order.locate_address_id = parseInt(e.detail.value);
    },
    cusCheckboxChange (e) {
      this.isSameAddForCus = !this.isSameAddForCus
    },
    redeliverCheckboxChange (e) {
      this.is_redeliver = !this.is_redeliver
      // this.isSameAddForCus = !this.order.is_pickup
    },
    nextStep () {
      if (this.step === 1) {
        if (this.order.freight_type === '') {
          wx.showToast({
            title: '请先选择运单类型',
            icon: 'none'
          })
          return
        }
      }
      if (this.step === 2) {
        if (this.order.parcel_ids.length === 0) {
          // showFail('请先选择要发送的包裹')
          wx.showToast({
            title: '请先选择要发送的包裹',
            icon: 'none'
          })
          return
        }
      } else if (this.step === 3) {
        
        if (this.order.sender_address_id === -1 && !this.is_redeliver) {
          // showFail('请先选择要发送的包裹')
          wx.showToast({
            title: '请先选择发件人地址',
            icon: 'none'
          })
          return
        }
        if (this.order.receiver_address_id === -1) {
          // showFail('请先选择要发送的包裹')
          wx.showToast({
            title: '请先选择收件人地址',
            icon: 'none'
          })
          return
        }
      }
      this.step = this.step + 1
      if (this.step === 2) {
        this.getParcel()
      }
      if (this.step === 3) {
        this.getAddress()
      }
      if (this.step === 4) {
        this.totop()
        this.getQuote()
      }
      console.log(this.step)
      this.$forceUpdate()
    },
    prevStep () {
      this.step = this.step - 1
      console.log(this.step)
      this.$forceUpdate()
    },
    closeModal (val) {
      this.showAddAddress = val
    },
    addressAdded (e) {
      console.log(e)
      if (e.code === 0) {
        this.getAddress()
      }
    },
    resetData () {
      this.packageId = 0
      this.parcels = []
      this.step = 1
    },
    async submitOrder () {
      if (this.charge_type_index === -1) {
        wx.showToast({
          title: '请选择计费类型',
          icon: 'none'
        })
        return
      }
      wx.showLoading({ title: '提交中...', mask: true })
      let header = { 'Content-Type': 'application/json' }
      let order = this.order
      order.is_pickup = order.is_pickup ? 'true' : 'false'
      order.charge_type = this.quote[this.charge_type_index].charge_type.id
      if (this.isSameAddForCus) {
        delete order.clearance_address_id
      }
      if (this.is_redeliver) {
        delete order.sender_address_id
      }
      if (this.selectMenu2.length > 1 && this.selectIndex2 > 0) {
        order.voucher_id = this.vouchers[this.selectIndex2 - 1].id
      } else {
        delete order.voucher_id
      }
      console.log(order)
      let resp = await post('freightorders/', order, header)
      console.log(resp)
      wx.hideLoading()
      event.emit('newOrder', {})
      if (resp.code === 0 && resp.object) {
        showSuccess('运单生成成功,请联系客服缴费')
        let orderUrl = '/pages/freightorders/details?id=' + resp.object.id + '&notify=true'
        wx.redirectTo({
          url: orderUrl
        })
      } else {
        showFail(resp.message)
      }
    },
    needDetail (id) {
      console.log(id)
      wx.navigateTo({
        url: '/pages/packages/details?id=' + id// 实际路径要写全
      })
    },
    selectAll () {
      if (this.order.parcel_ids.length > 0) {
        for (let i = 0, lenI = this.parcels.length; i < lenI; ++i) {
          this.parcels[i].checked = false
        }
        this.order.parcel_ids = []
      } else {
        let values = []
        for (let i = 0, lenI = this.parcels.length; i < lenI; ++i) {
          if (!this.parcels[i].need_details) {
            this.parcels[i].checked = true
            values.push(this.parcels[i].id)
          }
        }
        // this.parcels = checkboxItems
        this.order.parcel_ids = values
      }
      this.$forceUpdate()
    },
    showMenu2 () { this.show2 = true },
    closeMenu2 () { this.show2 = false },
    select2 (index) {
      this.selectIndex2 = index
      console.log('选择了 ' + this.selectMenu2[this.selectIndex2])
      // 如何对应获取后端 api 的值
      console.log(this.vouchers[this.selectIndex2 - 1])
      this.getQuote()
    }
  }
}
</script>
<style scoped lang="scss">
  .demo{margin:30rpx;}
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
  pcl-btn-hover {
    background-color: white;
    color: $theme-color;
  }
  .total {
    text-align: center;
    padding: 10px 0px;
    font-size: 0.7em;
    font-weight: bold;
  }
  .title {
    padding-left: 15px;
    padding-top: 10px;
  }
  .weui-checkbox-group {
    border-top: 0rpx solid #ccc;
    border-bottom: 1rpx solid #ccc;
  }
  .weui-checkbox {
    padding: 5px 10px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .weui-checkbox:active {
    background-color: #ececec;
  }
  .weui-checkbox:first-child:before {
    display: none;
  }
  .weui-checkbox:before {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    /*border-top: 1rpx solid #d9d9d9;*/
    color: #d9d9d9;
    left: 15px;
    right:15px;
  }
  .weui-checkbox-diabled {
    opacity: 0.5;
    color: #9b9b9b;
  }
  .weui-checkbox-input {
    position: absolute;
    left: -9999px;
  }
  .weui-checkbox-icon {
    padding-right: 0.35em;
  }
  .weui-checkbox-icon-circle,
  .weui-checkbox-icon-success {
    margin-left: 4.6px;
    margin-right: 4.6px;
  }
  .weui-checkbox-bd {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    font-size: 0.8em;
  }
  .address-btn {
    margin-top: 5px;
    button {
      /*font-size: 0.9em;*/
      text-overflow: ellipsis;
      /* Required for text-overflow to do anything */
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .cusCheckbox {
    font-size: 0.7em;
    font-weight: bold;
  }
  .no-border {
    border-width: 0px;
  }
  p {
    font-size: 0.8em;
  }
  .single-checkbox {
    padding-top: 15px;
  }
  .form-field {
    padding-top: 15px;
  }
  .btn-group {
    padding-top: 30px;
  }
  .freight_desp {
    padding: 20rpx;
  }
  .red {
    color: $theme-color;
    font-weight: bold;
    font-size: 1.1em;
  }
  .redelivery {
    font-size: 1.2em;
  }
  .selectall {
    width: 150rpx;
    height: 54rpx;
    font-size: 0.7em;
    margin: 5px;
  }
  .fees-details {
    margin: 20rpx;
  }
  .color-demo{font-size:40rpx;color:$theme-color;}
  .graceSelectMenuItem{width:200rpx; line-height:90rpx;}
  .grace-step-item{padding:10rpx 20rpx; width:100rpx; display:flex; flex-direction:column; align-items:center; flex-shrink:0;}
  .grace-step-icon{width:50rpx; font-size:30rpx; height:50rpx; text-align:center; line-height:50rpx; margin:10rpx; border-radius:100%; background-color:#F5F6F7; color:#999999;}
  .step-red{background-color:$theme-color; color:white;}
  .text-red{color:$theme-color;}
  .grace-step-text{text-align:center; line-height:50rpx; font-size:24rpx; color:#A5A7B2;}
  .grace-step-line{width:300rpx; height:45rpx; border-bottom:1px solid #A5A7B2;}
  .grace-step-line-active{border-color:$theme-color;}
</style>

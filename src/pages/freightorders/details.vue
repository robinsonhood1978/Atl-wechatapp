<template>
  <Login v-if="!isLogedIn"> </Login>
  <view v-else class="page" style="padding: 10px 15px 50px">
    <view class="detail-card" :class="[graceSkeleton == 'ing' ? 'grace-skeleton' : '']">
      <view class="title">追踪单号{{packageData.tracking_number}}</view>
      <view class="grace-list">
        <view class="grace-list-items">
          <view class="grace-list-body">
            <view class="grace-list-title">  客户姓名: {{userProfile.customer.first_name}} {{userProfile.customer.last_name}}</view>
            <view class="grace-list-title">  会员号: {{ userProfile.customer.applicant_number }} </view>
          </view>
        </view>
      </view>
      <view class="detail" style="margin: 20upx" v-if="packageData">
        <view class="desc" v-if="packageData.freight">所属航次：{{packageData.freight.title}}</view>
        <view class="desc">创建时间：{{formatedTime}}</view>
        <view class="desc">包裹件数：{{packageData.pieces}} 件</view>
        <view class="desc">申报价值：{{packageData.price}} 元</view>
        <div v-if="packageData.quote && (packageData.paid || (!packageData.paid && packageData.ready_to_pay))">
          <view class="desc">货物体积：{{packageData.volume}} 立方米</view>
          <view class="desc">货物重量：{{packageData.net_weight}} 公斤</view>
          <view class="desc">货物材积：{{(packageData.volume/0.005).toFixed(2)}} 公斤</view>
          <view class="desc">计费重量：{{packageData.weight?packageData.weight.toFixed(2):packageData.weight}} 公斤</view>
        </div>
        <view v-if="packageData.customer_note" class="desc">客户备注：{{packageData.customer_note}} </view>
      </view>
      <swiper v-if="images.length>0" class="grace-swiper"
            autoplay="true" indicator-dots
            indicator-color="rgba(255, 255, 255, 1)"
            indicator-active-color="#3688FF"
            style="height:500upx;background-color: white"
            interval="3000">

        <swiper-item  v-for="(thumb, index) in images" :key="index" class="lightbox__holder" @click="predivImage" :id="images[index]">
          <image style="height:100%;width:100%" :src="thumb" mode="aspectFill" />
        </swiper-item>
      </swiper>
      <view class="detail" style="margin: 20upx" v-if="packageData.source_address">
        <view class="desc">发货人员：{{packageData.source_address.firstname}} {{packageData.source_address.lastname}}</view>
        <view class="desc">发货地址：{{packageData.source_address.address}}, {{packageData.source_address.suburb}} </view>
        <view class="desc">发货城市：{{packageData.source_address.city}} {{packageData.source_address.postcode}}</view>
        <view class="desc">联系电话：{{packageData.source_address.tel}}</view>
      </view>
      <view class="detail" style="margin: 20upx" v-if="packageData.dest_address">
        <view class="desc">收货人员：{{packageData.dest_address.firstname}} {{packageData.dest_address.lastname}}</view>
        <view class="desc">收货地址：{{packageData.dest_address.address}}, {{packageData.dest_address.suburb}} </view>
        <view class="desc">目的城市：{{packageData.dest_address.city}} {{packageData.dest_address.postcode}}</view>
        <view class="desc">联系电话：{{packageData.dest_address.tel}}</view>
      </view>
      <div v-if="packageData.quote && (packageData.paid || (!packageData.paid && packageData.ready_to_pay))">
        <view class="detail" style="margin: 20upx" v-if="packageData.total">
          <view class="desc">收费类型：{{packageData.charge_type.title_zh_hans}}</view>
          <view class="desc" v-for="(item, index) in packageData.operations" :key="index">{{item.type.title}}：{{item.amount}}</view>
          <view class="desc" v-if="1>2">运输费用：
            NZD ${{packageData.shipping_cost}}
            <span class="shipping-cost">(含派送费：NZD ${{packageData.dest_shipping_cost}})</span>
          </view>
          <view v-if="wallet_pay" class="desc">钱包支付：
            <span style="font-weight: bold" v-if="packageData.quote && (packageData.paid || (!packageData.paid && packageData.ready_to_pay))">NZD ${{wallet_pay}}</span>
            <span style="font-weight: bold" v-else>待定</span>
          </view>
          <view class="desc">运单总价：
            <span style="font-weight: bold" v-if="packageData.quote && (packageData.paid || (!packageData.paid && packageData.ready_to_pay))">NZD ${{packageData.total}}</span>
            <span style="font-weight: bold" v-else>待定</span>
          </view>
        </view>
      </div>
      <view class="grace-margin-top" v-if="proofs.length>0">
        <text class="grace-title">付款凭证</text>
        <swiper class="grace-swiper"
              autoplay="true" indicator-dots
              indicator-color="rgba(255, 255, 255, 1)"
              indicator-active-color="#3688FF"
              style="height:500upx;background-color: white"
              interval="3000">

          <swiper-item  v-for="(thumb, index) in proofs" :key="index" class="lightbox__holder" @click="predivProof" :id="proofs[index]">
            <image style="height:100%;width:100%" :src="thumb" mode="aspectFill" />
          </swiper-item>
        </swiper>
      </view>
      
      <view class="grace-list" v-if="packageData.ready_to_pay && packageData.invoices">
        <view class="grace-list-items">
          <view class="grace-list-body">
            <view class="grace-list-title" @click="updatePersonalInfo">发票明细</view>
          </view>
          <view class="grace-list-arrow-right grace-icons icon-arrow-right" @click="showDrawer"></view>
        </view>
      </view>
      
      <view class="grace-box" style="margin:0 20rpx;" v-if="packageData.status.code=='RP' && packageData.delivery_type=='K'">
        <view class="grace-comments" v-if="packageData.reservation">
          <view class="grace-comments-items">
            <view class="grace-comments-body">
              <view class="grace-comments-header">
                <text class="grace-comments-header-text">已有自提预约</text>
                <text class="grace-comments-info-text">{{pickupCreateTime}}</text>
              </view>
              <view class="detail" style="margin: 20upx">
                <view class="desc">预约时间：{{pickupBookingTime}}</view>
                <view class="desc">备注：{{packageData.reservation.description}} </view>
              </view>
            </view>
          </view>
        </view>
        
        <view class="grace-card-view">
          <view style="margin:0 40rpx;" class="demo-wrap2" @click="showPrePickup">
            <graceBorderRadius background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
              <text class="demo2 grace-white">{{packageData.reservation? '重新预约自提':'预约自提'}}</text>
            </graceBorderRadius>
          </view>
        </view>
          </view>
      <view class="detail" style="margin: 20upx" v-if="packageData.locate_address && packageData.delivery_type=='K'">
        <b>自提地址：</b><br>
      <div v-for="(item) in pickup_adds" :key="item.id">
        <view class="desc" style="font-size: 0.8em" v-if="packageData.locate_address.id==item.id">
          {{item.title?item.title:''}}<br v-if="item.title">
          {{item.firstname}} {{item.lastname}} <br>
          {{item.tel}}<br>
          {{item.address}}, {{item.suburb}}<br>
          {{item.city}}, {{item.country}} {{item.postcode}}<br>
          <div v-if="item.description">自提时间：<br>{{item.description}}</div>
        </view>
          </div>
      </view>
    </view>
    <view class="grace-box" style="margin:0 20rpx;" v-if="packageData.paid">
        <view class="grace-card-view">
          <view class="grace-card-title">
            <button class="btn paid link"
              :send-message-title='"我要咨询运单 "+ packageData.tracking_number'
              show-message-card="true"
              bindcontact='contactCallback'
              :session-from='session_str'
              open-type='contact' >
              <p>已付款 点击咨询该运单</p>
            </button>
          </view>
        </view>
    </view>

    <view v-if="packageData.quote && !packageData.paid && packageData.ready_to_pay" class="grace-box" style="margin:0 20rpx;">
        <view class="grace-card-view">
          <view style="margin:0 40rpx;" class="demo-wrap2" @click="showShade">
            <graceBorderRadius background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
              <text class="demo2 grace-white">支付订单, 金额：NZD ${{need_pay}}</text>
            </graceBorderRadius>
          </view>
        </view>
    </view>

    <view v-if="!packageData.payment_file && packageData.quote && !packageData.paid && packageData.ready_to_pay" class="grace-box" style="margin:0 20rpx;">
        <view class="grace-card-view">
          <view style="margin:0 40rpx;" class="demo-wrap2" @click="showProof">
            <graceBorderRadius background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
              <text class="demo2 grace-white">上传付款凭证</text>
            </graceBorderRadius>
          </view>
        </view>
    </view>

    
    
    <view style="margin: 40upx"  v-if="packageData.quote && !packageData.paid && !packageData.ready_to_pay" class="">
      <p>仓库处理中......</p>
      <h1>请等待处理完成后确认最终运费。</h1>
    </view>

    <view class="grace-margin-top" v-if="trackingInfo.length > 0">
      <text class="grace-title">追踪信息</text>
    </view>
    <view class="grace-box" style="margin:0 20rpx;" v-if="trackingInfo.length > 0">
        <view class="grace-card-view" v-if="packageData.dest_shipments.length>0">
          <view class="grace-card-title">
            <text class="grace-card-name">
              快递公司：{{packageData.dest_shipments[packageData.dest_shipments.length-1].courier_company}}
            </text>
          </view>
          <view class="grace-card-title">
            <text class="grace-card-name">
              快递单号：{{packageData.dest_shipments[packageData.dest_shipments.length-1].tracking_number}}
            </text>
          </view>
          <view class="grace-card-title">
            <button class="btn btn-sccefii nopay link" @click="copyLink">
              <p>复制快递查询网址</p>
            </button>
          </view>
          <view class="grace-card-title">
            * 打开手机浏览器并粘贴此网址可进行快递追踪
          </view>
        </view>
    </view>
        
    <div class="package-status" v-if="trackingInfo.length > 0">
      <div class="status-box">
        <ul class="status-list">
          <li  v-for="(trackingItem, index) in trackingInfo" :key="index">
            <div class="status-content-before">{{trackingItem.create_time | dateStr}} - {{trackingItem.event }}</div>
            <!--            <div class="status-time-before">{{trackingItem.time }} </div>-->
            <!--            <div class="status-line"></div>-->
          </li>
          <li class="latest" v-if="packageData.freight && packageData.freight.eta_time">
            <div class="status-content-latest"  v-if="packageData.freight.eta_time" >{{ formatedETA }} - 预计送达</div>
            <!--            <div class="status-time-latest">{{packageData.freight.eta_time}}</div>-->
            <!--            -->
            <!--            <div class="status-line"></div>-->
          </li>
        </ul>
      </div>
    </div>
    <view class="grace-box" style="margin:0 20rpx;" v-if="companyInfo.show_customer_support">
      <view class="grace-card-view">
        
        <view style="margin:0 40rpx;" class="demo-wrap2"  @click="showFeedback">
            <graceBorderRadius background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
              <text class="demo2 grace-white">反馈问题</text>
            </graceBorderRadius>
          </view>
      </view>
    </view>
    <view style="margin: 20upx"  v-if="packageData.price">
      <h1>包裹列表</h1>
    </view>
    <PackageCardDetails v-for="(packageItem) in packageData.parcels" :key="packageItem.id" :packageData="packageItem"  ></PackageCardDetails>
    <!-- 遮罩组件 @closeShade="closeShade" 实现点击关闭自身，如果不需要次功能则不绑定此事件即可 -->
    <graceShade @closeShade="closeShade" ref="graceShade" background="rgba(0, 0, 0, 0.8)">
      
    </graceShade>

    <graceDrawer ref="graceDrawerProof" v-on:closeDrawer="closeProof" direction="right">
				<view slot="links" style="padding:0 25rpx;">
          <div class="photos">
            <view class="grace-margin-top">
              <text class="grace-title">相关图片</text>
            </view>
            <div class="weui-uploader__bd">
              <div class="weui-uploader__files" id="uploaderFiles">
                <block v-for="(item, index) in filesProof" :key="index">
                  <div class="weui-uploader__file" :id="item">
                    <image class="weui-uploader__img" :src="item" mode="aspectFill" @click="previewImageProof"  />
                    <div :id="index" class="weui-badge" style="position: absolute;top: 0;right: -.4em;z-index: 500;" @click="deleteimageProof">X</div>
                  </div>
                </block>
              </div>
              <div v-if="filesProof.length < 1" class="weui-uploader__input-box">
                <div class="weui-uploader__input" @click="chooseImageProof"></div>
              </div>
            </div>
          </div>
          <view class="grace-box" style="margin:0 20rpx;" @click="submitProof">
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

    <graceDrawer ref="graceDrawerFeed" v-on:closeDrawer="closeFeed" direction="right">
				<view slot="links" style="padding:0 25rpx;">
          <view class="ticket_type">{{ticket_type.title}}</view>
          <view class="package">追踪单号: {{packageData.tracking_number}}</view>
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
            </view>
          </view>
          <view class="grace-box" style="margin:0 20rpx;"  v-if="companyInfo.show_customer_support">
            <view class="grace-card-view">
              <view style="margin:0 40rpx;" class="demo-wrap2">
                    <button class="demo2 grace-white"
                      :send-message-title='"我要咨询运单 "+ packageData.tracking_number'
                      show-message-card="true"
                      bindcontact='contactCallback'
                      :session-from='session_str'
                      open-type='contact' >人工咨询</button>
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

    <graceDrawer ref="graceDrawer" v-on:closeDrawer="closeDrawer" direction="right">
				<view slot="links" style="padding:0 25rpx;">
          <div v-if="packageData && packageData.invoices">
            <div
              v-for="invoice in packageData.invoices"
              :key="invoice.id"
            >
              <view class="grace-margin-top">
                <text class="grace-title">{{ invoice.title }}</text>
              </view>
              
              <view class="weui-cells weui-cells_after-title" v-if="invoice.invoicedetail_set">
                  <view class="weui-cell weui-cell_example" v-for="detail in invoice.invoicedetail_set" :key="detail.id">
                      <view class="weui-cell__bd">{{detail.title}}</view>
                      <view class="weui-cell__ft">${{detail.subtotal}}</view>
                  </view>
                  <view class="weui-cell weui-cell_example">
                      <view class="weui-cell__bd">GST</view>
                      <view class="weui-cell__ft">{{invoice.tax}}</view>
                  </view>
                  <view class="weui-cell weui-cell_example">
                      <view class="weui-cell__bd">Total</view>
                      <view class="weui-cell__ft">{{invoice.total}}</view>
                  </view>
                  <view class="weui-cell weui-cell_example" v-if="packageData.paid">
                      <view class="weui-cell__bd">Paid</view>
                      <view class="weui-cell__ft">Yes</view>
                  </view>
                  <view class="weui-cell weui-cell_example">
                      <view class="weui-cell__bd">Date</view>
                      <view class="weui-cell__ft">{{FDate(invoice.create_time)}}</view>
                  </view>
              </view>
            </div>
          </div>
          <view class="grace-box" style="margin:0 20rpx;" @click="closeDrawer">
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

     <graceDrawer ref="graceDrawerPrePickup" v-on:closeDrawer="closePrePickup" direction="right">
				<view slot="links" style="padding:0 25rpx;">
          <view class="grace-margin-top">
            <graceDateTime :startYear="now_year" @confirm="confirm2" :value="pick_day" :isTime="false">
              <text class="pick-day grace-border-radius">{{pick_day}}<text class="grace-icons icon-date icon-left-margin"></text></text>
            </graceDateTime>
          </view>
          
          <view class="grace-form-item" style="align-items:flex-start;" v-if="timeSpan.length>0">
            <view class="grace-form-label">选择时段</view>
            <view class="grace-form-body">
              <graceSelectTags :items="timeSpan" type="radio" @change="changeTimeSpan"></graceSelectTags>
            </view>
          </view>
          <view class="grace-form-item" style="align-items:flex-start;" v-if="timeSpan.length===0">
            <view class="grace-card-view">
              <view style="margin:0 40rpx;" class="demo-wrap2">
                没有可预约时段
              </view>
            </view>
          </view>
          <view class="grace-margin-top">
            <text class="grace-title">备注</text>
          </view>
          <view class="grace-box-shadow" style="margin:0 30rpx;">
              <view class="grace-card-view">
                <view class="grace-card-body">
                  <view class="grace-card-desc">
                    <view class="grace-card-title">
                      <textarea v-model="memo" class="grace-textarea" value="" placeholder="请输入备注信息。" />
                    </view>
                  </view>
                </view>
              </view>
          </view>
          <view class="grace-box" style="margin:0 20rpx;" @click="submitReservation">
              <view class="grace-card-view">
                <view style="margin:0 40rpx;" class="demo-wrap2">
                  <graceBorderRadius background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
                    <text class="demo2 grace-white">提交预约</text>
                  </graceBorderRadius>
                </view>
              </view>
          </view>
          
          <view class="grace-box" style="margin:0 20rpx;" @click="closePrePickup">
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

    <graceDrawer ref="graceDrawerPay" v-on:closeDrawer="closeDrawerPay" direction="right">
				<view slot="links" style="padding:0 25rpx;">
          <view class="grace-relative" @tap.stop="">
            <view class="grace-accordion grace-margin-top">
              <!-- 项目0 -->
              <view class="grace-accordion-items">
                <view class="grace-accordion-title grace-border-b" id="grace-accordion-0" @tap="changeAccordion" hover-stay-time="100" hover-class="grace-opacity">
                  <text class="grace-icons icon-weixin">微信支付</text>
                  <text class="grace-icons icon-arrow-up" v-if="accordionActive == 'grace-accordion-0'"></text>
                  <text class="grace-icons icon-arrow-down" v-else></text>
                </view>
                <view :class="['grace-accordion-body', accordionActive == 'grace-accordion-0' ? 'grace-accordion-show' : 'grace-accordion-hide']" style="font-size:0;" @click="wechatpay(packageData.id)">
                  <graceBorderRadius background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
                    <text class="demo2 grace-white">微信支付 NZD ${{need_pay}} </text>
                  </graceBorderRadius>
                </view>
              </view>
              <!-- 项目1 -->
              <view class="grace-accordion-items">
                <view class="grace-accordion-title grace-border-b" id="grace-accordion-1" @tap="changeAccordion" hover-stay-time="100" hover-class="grace-opacity">
                  <text class="grace-icons icon-scancode">支付宝/微信扫码付款</text>
                  <text class="grace-icons icon-arrow-up" v-if="accordionActive == 'grace-accordion-1'"></text>
                  <text class="grace-icons icon-arrow-down" v-else></text>
                </view>
                <view :class="['grace-accordion-body', accordionActive == 'grace-accordion-1' ? 'grace-accordion-show' : 'grace-accordion-hide']" style="font-size:0;">
                  <view style="margin: 30rpx">
                    <text class="paymment-bank">请扫码支付NZD ${{need_pay}}</text>
                    <text class="paymment-bank paymment-bank-copy" @click="copyRef" >Reference: {{packageData.tracking_number}}</text>
                    <h3 style="font-size:0.6rem">点击复制备注信息,为了加速处理流程，请支付后截图发给客服存档。</h3>
                  </view>
                  <image src="/static/images/ATL-Latipay.png" style="width:100%;" mode="widthFix"></image>
                </view>
              </view>
              <!-- 项目2 -->
              <view class="grace-accordion-items">
                <view class="grace-accordion-title grace-border-b" id="grace-accordion-2" @tap="changeAccordion" hover-stay-time="100" hover-class="grace-opacity">
                  <text class="grace-icons icon-share">银行转账付款</text>
                  <text class="grace-icons icon-arrow-up" v-if="accordionActive == 'grace-accordion-2'"></text>
                  <text class="grace-icons icon-arrow-down" v-else></text>
                </view>
                <view :class="['grace-accordion-body', accordionActive == 'grace-accordion-2' ? 'grace-accordion-show' : 'grace-accordion-hide']">
                  <view style="margin: 30rpx">
                  <text class="paymment-bank">请转账 NZD ${{need_pay}} 至以下账号</text>
                  <text class="paymment-bank">银行账户名：Aion Technologies Ltd</text>
                  <text class="paymment-bank paymment-bank-copy" @click="copyBank">银行账户号：02-1244-0178838-000</text>
                  <text class="paymment-bank paymment-bank-copy" @click="copyRef" >Reference: {{packageData.tracking_number}}</text>
                  <h3 style="font-size:0.6rem">点击复制银行账号及备注信息,为了加速处理流程，请支付后截图发给客服存档。</h3>
                  </view>
                </view>
              </view>
              <view class="grace-accordion-items" v-if="wallet>0">
                <view class="grace-accordion-title grace-border-b" id="grace-accordion-3" @tap="changeAccordion" hover-stay-time="100" hover-class="grace-opacity">
                  <text class="grace-icons icon-wallet">钱包支付(余额:${{wallet}})</text>
                  <text class="grace-icons icon-arrow-up" v-if="accordionActive == 'grace-accordion-3'"></text>
                  <text class="grace-icons icon-arrow-down" v-else></text>
                </view>
                <view :class="['grace-accordion-body', accordionActive == 'grace-accordion-3' ? 'grace-accordion-show' : 'grace-accordion-hide']" style="font-size:0;" @click="walletRef">
                  <graceBorderRadius background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
                    <text class="demo2 grace-white" v-if="enoughMoney">钱包支付 NZD ${{need_pay}} </text>
                    <text class="demo2 grace-white" v-else>余额不足,请联系客服充值。</text>
                  </graceBorderRadius>
                </view>
              </view>
            </view>
            <h3 style="color:white;font-size:0.6rem"> 支付完成后，仓库会进行处理，如有问题或其他费用客服将遵循多退少补原则联系您协商解决,请务必选择最合适的收费类型以避免不必要的延误。</h3>
            
            
          </view>
          <view class="grace-box" style="margin:0 20rpx;" @click="closeDrawerPay">
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
    <mp-modal ref="walletPayModal" title="确认支付" :content="confirmPay" :showCancel="true" @confirm="walletpay" ></mp-modal>
    <mp-modal ref="copyModalRef" title="确认复制" content="是否确认复制Reference？当前剪贴板内容将被覆盖。" :showCancel="true" @confirm="confirmCopyRef" ></mp-modal>
    <mp-modal ref="copyModalBank" title="确认复制" content="是否确认复制银行账号？当前剪贴板内容将被覆盖。" :showCancel="true" @confirm="confirmCopyBank" ></mp-modal>
    <mp-modal ref="copyModalLink" title="确认复制" content="是否确认复制快递查询网址？当前剪贴板内容将被覆盖。" :showCancel="true" @confirm="confirmCopyLink" ></mp-modal>
    <mp-modal ref="copyModalLinkCopy" title="信息提示" content="快递查询网址已复制，请打开浏览器并粘贴网址后查看" :showCancel="false" ></mp-modal>
</view>
</template>

<script>
import graceDrawer from '@/graceUI/components/graceDrawer.vue';
import graceBorderRadius from "@/graceUI/components/graceBorderRadius.vue";
import { apiHost, get, showSuccess, showFail, post, asyncUploadFile, asyncUploadCommonFile } from '@/utils/index'
import moment from 'moment'
import { mapState } from 'vuex'
import PackageCardDetails from '@/components/package-card-detail'
import Login from '@/components/login'
import graceShade from "../../graceUI/components/graceShade.vue";
import graceLink from "../../graceUI/components/graceLink.vue";
import mpModal from 'mpvue-weui/src/modal'
import gImg from "@/graceUI/components/graceImg.vue";
import graceScroll from '@/graceUI/components/graceScroll.vue';
import graceSwiper from "@/graceUI/components/graceSwiper.vue";
import graceDateTime from "@/graceUI/components/graceDateTime.vue";
import graceSelectTags from '@/graceUI/components/graceSelectTags.vue';

export default {
  components: {
    graceDrawer,
    graceBorderRadius,
    Login,
    PackageCardDetails,
    graceShade,
    graceLink,
    mpModal,
    gImg,
    graceScroll,
    graceDateTime,
    graceSelectTags,
    graceSwiper
  },
  data () {
    return {
      proofData: {
        type: 'payment'
      },
      ticketData: {
        type:1,
        content: '',
        priority:4
      },
      filesProof: [], 
      files: [],
      hidden: 0,
      ticket_type: {},
      tickettypes: [],
      memo: '',
      selectedSpan : '',
			timeSpan: [],
      pick_time: [],
      wait_hours: 6,
      end_hour: 18,
      pick_start_hour: 9,
      pick_start_date: '',
      pick_day:"请选择具体日期",
      swiperItems : [],
      pickup_adds: null,
      accordionActive: "grace-accordion-0",
      graceSkeleton: 'ing',
      packageId: 0,
      host: apiHost,
      images: [],
      thumbs: [],
      proofs: [],
      name: '未知用户',
      formData: {
        id: '',
        title: '',
        customer_note: '',
        titles: [],
        quantities: [],
        totals: [],
        materials: []
      },
      items: [],
      item: {
        reference: '',
        quantity: 1,
        title: '',
        subtotal: '',
        total: '',
        totalstr: 0.00
      },
      canBack: true,
      trackingInfo: [],
      packageData: {
        tracking_number: 'Loading...'
      },
      needToPay: false,
      wallet_pay: 0,
      need_pay: 0
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'isLogedIn',
      'userProfile',
      'companyID',
      'appOptions',
      'companyInfo'
    ]),
    now_year() {
      var date = new Date();
			return date.getFullYear();
    },
    confirmPay() {
      return "订单金额： NZD $"+this.need_pay+"， 是否确认使用钱包支付？"
    },
    wallet() {
      return (this.userProfile.customer.gold + this.userProfile.customer.silver).toFixed(2)
    },
    enoughMoney() {
      let m = (this.userProfile.customer.gold + this.userProfile.customer.silver).toFixed(2) - this.need_pay
      return (m>=0)?true:false
    },
    // need_pay() {
    //   return this.packageData.total - this.packageData.total_paid
    // },
    session_str () {
      if (!this.isLogedIn) {
        return ''
      } else if (this.userProfile.customer) {
        return '{"nickName":"' + this.userInfo.nickName + '-' + this.userProfile.customer.applicant_number + '","avatarUrl":"' + this.userInfo.avatarUrl + '","note":"' + this.packageData.tracking_number + '"}'
      } else {
        return '{"nickName":"' + this.userInfo.nickName + '","avatarUrl":"' + this.userInfo.avatarUrl + '","note":"' + this.packageData.tracking_number + '"}'
      }
    },
    total_price () {
      var total = 0
      if (this.items) {
        this.items.forEach(function (i) {
          total += (parseFloat(i.subtotal) || 0)
        })
        return total.toFixed(2)
      }
      return 0
    },
    formatedTime () {
      return moment(this.packageData.create_time).local().format('DD/MM/YYYY')
    },
    pickupCreateTime () {
      return moment(this.packageData.reservation?.create_time).local().format('DD/MM/YYYY')
    },
    pickupBookingTime () {
      return moment(this.packageData.reservation?.booking_time).local().format('DD/MM/YYYY HH:mm')
    },
    formatedETA () {
      if (this.packageData.freight) {
        return moment(this.packageData.freight.eta_time).local().format('DD/MM/YYYY')
      } else {
        return ''
      }
    },
    // volume () {
    //   return this.packageData.net_volume ? (this.packageData.net_volume.toFixed(3)) : 0
    // },
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
      }
    },
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
    var notify = this.$root.$mp.query.notify
    console.log(notify)
    if (notify) {
      showSuccess('运单生成成功,请付款')
    }
    var pay = this.$root.$mp.query.pay
    console.log(pay)
    if (pay) {
      this.needToPay = pay
    }
  },
  methods: {
    async ticketType() {
      let res = await get('freighttickets/types/?group=fo')
      this.tickettypes = res.object
      console.log('this.tickettypes', this.tickettypes)
    },
    async submitProof () {
      wx.showLoading({ title: '提交中...', mask: true })
      var errid = 0
      try {
        if (this.filesProof.length === 0) {
          showFail('请选择图片')
          return
        } else {
          let files = this.filesProof
          for (var i = 0; i < files.length; i++) {
            if (i === 0) {
              let resp = await asyncUploadCommonFile('freightorders/' + this.packageId + '/files/', 'payment', this.filesProof[i], this.proofData)
              console.log('fileProof 1 time upload resp:' + resp)
            } 
          }
          console.log('New record created Done!')
          wx.hideLoading()
          showSuccess('上传成功')
          setTimeout(()=>{
            this.$refs.graceDrawerProof.hide();
            this.loadData()
          }, 2000);
        }
        // wx.navigateBack({ delta: 1 })
        this.filesProof = []
      } catch (error) {
        console.log('Upload failed! error:' + error)
        wx.hideLoading()
        showFail('上传错误')
        throw error
      }
      return errid

      // this.resetData()
    },
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
    async chooseImageProof (e) {
      var _this = this
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          _this.filesProof = _this.filesProof.concat(res.tempFilePaths)
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
    previewImageProof (e) {
      console.log(this.filesProof)
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.filesProof // 需要预览的图片http链接列表
      })
    },
    deleteimage (e) {
      let id = e.currentTarget.id
      console.log('onDelete ID: ' + id)
      this.files.splice(id, 1)
    },
    deleteimageProof (e) {
      let id = e.currentTarget.id
      console.log('onDelete ID: ' + id)
      this.filesProof.splice(id, 1)
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
    async submitReservation () {
      if (this.pick_day == '请选择具体日期') {
        wx.showToast({
          title: '请选择自提日期',
          icon: 'none'
        })
        return
      }
      if (this.selectedSpan == '') {
        wx.showToast({
          title: '请选择自提时段',
          icon: 'none'
        })
        return
      }
      wx.showLoading({ title: '提交中...', mask: true })
      let header = { 'Content-Type': 'application/json' }
      let reservation = {
        booking_date: this.pick_day + ' ' + this.selectedSpan,
        reference: '运单追踪号: '+ this.packageData.tracking_number,
        description: this.memo
      }
      let resp = await post('freightorders/' + this.packageId + '/reservation/', reservation, header)
      console.log(resp)
      wx.hideLoading()
      if (resp.code === 0 && resp.object) {
        showSuccess('预约成功')
        setTimeout(()=>{
          this.$refs.graceDrawerPrePickup.hide();
          this.loadData()
        }, 2000);
      } else {
        showFail(resp.message)
      }
    },
    changeTimeSpan : function(val){
      this.selectedSpan = val;
      console.log('this.selectedSpan', this.selectedSpan)
    },
    confirm2:function (res) {
			this.pick_day = res[0]+'-'+res[1]+'-'+res[2];
      let date1 = new Date(this.pick_day)
      let date2 = new Date(this.pick_start_date)
      console.log('date1', date1)
      console.log('date2', date2)
      if(date1<date2){
        uni.showToast({
          title:"日期有误，请重新选择", icon:"none"
        });
        this.pick_day = '请选择具体日期'
      }
      else if(date1.getTime() === date2.getTime()){
        var date = new Date();
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        this.pick_start_hour = h + this.wait_hours
        console.log('this.pick_start_hour', this.pick_start_hour)

        this.timeSpan=[]
        if(this.pick_start_hour<this.end_hour){
          this.pick_time.forEach((item, index) => {
            let objTime = { name: 'php', value: '0', checked: false }
            if(this.pick_start_hour<=item[0].split(":")[0]){
              objTime.name = item[0]+ '--' + item[1]
              objTime.value = item[0]
              this.timeSpan.push(objTime)
            }
          })
        }
      }
      else if(date1 > date2){
        console.log('date1>date2')
        this.timeSpan=[]
        this.pick_time.forEach((item, index) => {
          let objTime = { name: 'php', value: '0', checked: false }
          objTime.name = item[0]+ '--' + item[1]
          objTime.value = item[0]
          this.timeSpan.push(objTime)
        })
      }
		},
    taped : function(e){
      this.$refs.graceImage[e].showIt();
		},
    closeImage : function (id) {
      this.$refs.graceImage[id].hideIt();
    },
    openImage : function (id) {
			this.$refs.graceImage[id].showIt();
		},
    FDate (d) {
      return moment(d).local().format('DD/MM/YYYY')
    },
    showDrawer : function(){this.$refs.graceDrawer.open();},
		closeDrawer : function(){this.$refs.graceDrawer.hide();},
    closeDrawerPay : function(){this.$refs.graceDrawerPay.hide();},
    predivImage (e) {
      console.log(e)
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.images// 需要预览的图片http链接列表
      })
    },
    predivProof (e) {
      console.log(e)
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.proofs// 需要预览的图片http链接列表
      })
    },
    async loadData () {
      if (this.packageId === 0) {
        return
      }
      wx.showLoading({ title: '加载中...', mask: true })
      console.log('Get Customer Parcel Detail...')
      let pickup = await get('packgo/reservation/')
      
      // let pick_day = pickup.object.start_date
      this.pick_start_date = pickup.object.start_date
      let pickDate = new Date(this.pick_start_date)
      let today = new Date()
      if(pickDate<today){
        this.pick_start_date = today.format('yyyy-MM-dd')
      }

      this.pick_time = pickup.object.config.schedule[0].timespan
      this.timeSpan = []

      this.pick_time.forEach((item, index) => {
          let objTime = { name: 'php', value: '0', checked: false }
          objTime.name = item[0]+ '--' + item[1]
          objTime.value = item[0]
          this.timeSpan.push(objTime)
      })
      this.wait_hours = pickup.object.config.min_prepare_hours
      this.end_hour = pickup.object.config.end_hour
      
      

      let resp = await get('freightorders/' + this.packageId + '/')
      this.packageData = resp
      if(this.packageData.payment_file!=null){
        this.proofs.push(this.packageData.payment_file)
        this.proofs = this.proofs.map((item) => {
          return item.url.startsWith('http') ? item.url : (this.host + '/media/' + item.url)
        })
      }
      if(this.packageData.images.length>0){
        this.images = this.packageData.images.map((item) => {
          return item.url.startsWith('http') ? item.url : (this.host + 'media/' + item.url)
        })
        // console.log(this.images)
        this.thumbs = this.packageData.images.map((item) => {
          return item.thumb.startsWith('http') ? item.thumb : (this.host + 'media/' + item.thumb)
        })
        this.packageData.images.forEach((item, index) => {
          let obj = {
            img : '',
            url : '',
            title: '',
            opentype : 'click'
          }
          // obj.img = this.host + item.thumb
          obj.img = item.thumb
          console.log(item)
          this.swiperItems.push(obj)
          
        })
      }
      this.wallet_pay = (this.packageData.gold + this.packageData.silver).toFixed(2)
      this.need_pay = (this.packageData.total - this.packageData.total_paid).toFixed(2)
      //this.packageData.pickup_address = 13649
  //     this.packageData.dest_shipments = [
  //     {
  //        "id":17646,
  //        "courier_account":{
  //           "id":9,
  //           "title":"Aion CP 0000-3999",
  //           "code":"SVACP",
  //           "contact_info":null
  //        },
  //        "outer_id":"PCL030281S PCL32316",
  //        "weight":0.0,
  //        "volume":0.0,
  //        "total":0.0,
  //        "pieces":0,
  //        "oversize_pieces":0,
  //        "overweight_pieces":0,
  //        "reference":null,
  //        "tracking_number":"4668370001190901HAM005BS",
  //        "tracking_link":"https://trackandtrace.courierpost.co.nz/Search/4668370001190901",
  //        "tracking_numbers":"4668370001190901HAM005BS,4668370001190902HAM008BS,4668370001190903HAM008BS,4668370001190904HAM008BS",
  //        "courier_company":"CourierPost",
  //        "driver_name":null,
  //        "ship_time":"2021-05-12T13:12:26.360587+12:00",
  //        "email_time":null,
  //        "deliver_time":null,
  //        "address_verified":false,
  //        "is_delivered":false,
  //        "pos":0,
  //        "tracking_info":null,
  //        "content_info":null,
  //        "comments":null,
  //        "driver_note":null,
  //        "label_print_time":null,
  //        "label_pdf_path":"pack/shipments/4668370001190901HAM005BS.pdf",
  //        "shipping_fname":null,
  //        "shipping_lname":null,
  //        "shipping_mname":null,
  //        "shipping_building":null,
  //        "shipping_street":null,
  //        "shipping_street2":null,
  //        "shipping_suburb":null,
  //        "shipping_phone":null,
  //        "shipping_email":null,
  //        "shipping_city":null,
  //        "shipping_state":null,
  //        "shipping_postcode":null,
  //        "shipping_country":null,
  //        "shipping_instruction":null,
  //        "company":3,
  //        "operator":4879,
  //        "group":null
  //     }
  //  ]
      // console.log('robin:', this.packageData)
      wx.setNavigationBarTitle({
        title: this.packageData.tracking_number ? this.packageData.tracking_number : '无标题'
      })
      if (this.packageData.user) {
        this.name = this.packageData.user.first_name + ' ' + this.packageData.user.last_name +
            ' - ' + this.packageData.user.applicant_number
      }
      if (this.userProfile && this.userProfile.company){
        this.pickup_adds = this.userProfile.company.pickup_addresses
      }
      // this.volume = parseInt(parseFloat(this.packageData.volume) * 100 + 1)/100
      this.volume = (parseInt(this.packageData.volume * 100) / 100 !== this.packageData.volume) ? parseInt(this.packageData.volume * 100) / 100 + 0.01 : (parseInt(this.packageData.volume * 100) / 100)
      this.formData.customer_note = this.packageData.customer_note ? this.packageData.customer_note : ''
      this.formData.title = this.packageData.title
      this.items = this.packageData.orderdetail_set
      if (this.items && this.items.length === 0) {
        this.items.push(this.item)
      }
      this.formData.id = this.packageId
      this.trackingInfo = this.packageData.tracking_info
      console.log(this.trackingInfo)
      // 骨架屏规划后延长 500 毫秒进行数据替换
      setTimeout(() => {
        this.graceSkeleton = 'end'
      }, 500)
      wx.hideLoading()
      if(this.needToPay){
        this.needToPay = false
        this.showShade()
      }
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
    async walletpay () {
      let resp = await get('freightorders/' + this.packageId + '/pay/?type=wallet')
      console.log(resp)
      if(resp.code === 0){
        this.closeShade()
        setTimeout(showSuccess, 500, '支付成功')
        // showSuccess('支付成功')
        this.loadData()
      }
      else{
        showFail("支付失败，请选择其他途径")
      }
    },
    async wechatpay (id) {
      var data = {
        oid: id
      }
      let header = { 'Content-Type': 'application/json' }
      let resp = await post('packgo/latipay/', data, header)
      console.log(resp)
      let _this = this
      wx.requestPayment({
        ...resp,
        success: function (res) {
          console.log(res)
          _this.closeShade()
          setTimeout(showSuccess, 500, '支付成功')
          _this.loadData()
        },
        fail (res) {
          console.log(res)
          showFail("支付失败，请选择其他途径")
        }
      })
    },
    showPrePickup : function () {
      this.pick_day = '请选择具体日期'
      this.selectedSpan = ''
      this.$refs.graceDrawerPrePickup.open();
    },
    closePrePickup : function () {
      this.$refs.graceDrawerPrePickup.hide();
    },
    showShade : function () {
      if(this.packageData.paid){
        showFail("已经支付，请勿重复支付")
        return
      } 
      this.$refs.graceDrawerPay.open();
    },
    showProof : function () {
      this.$refs.graceDrawerProof.open();
    },
    closeProof : function () {
      this.$refs.graceDrawerProof.hide();
    },
    closeShade : function () {
      this.$refs.graceDrawerPay.hide();
    },
    changeAccordion : function(e){
      var accordionIndex = e.currentTarget.id;
      if (this.accordionActive == accordionIndex){accordionIndex = '';}
      this.accordionActive = accordionIndex;
    },
    copyRef () {
      this.$refs.copyModalRef.show()
    },
    walletRef () {
      this.$refs.walletPayModal.show()
    },
    confirmCopyRef () {
      wx.setClipboardData({
        data: this.packageData.tracking_number,
        success (res) {
          wx.getClipboardData({
            success (res) {
              console.log(res.data) // data
              showSuccess("运单号已复制")
            }
          })
        }
      })
    },
    copyBank () {
      this.$refs.copyModalBank.show()
    },
    copyLink () {
      this.$refs.copyModalLink.show()
    },
    confirmCopyBank () {
      wx.setClipboardData({
        data: "02-1244-0178838-000",
        success (res) {
          wx.getClipboardData({
            success (res) {
              console.log(res.data) // data
              showSuccess("帐号已复制")
            }
          })
        }
      })
    },
    confirmCopyLink () {
      let url
      if(this.packageData.dest_shipments.length>0){
        url = this.packageData.dest_shipments[this.packageData.dest_shipments.length-1].tracking_link
      }
      wx.setClipboardData({
        data: url,
        success (res) {
          wx.getClipboardData({
            success (res) {
              // console.log(res.data) // data
              // showSuccess(url)
            }
          })
        }
      })
      this.$refs.copyModalLinkCopy.show()
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
  .pick-day{display:block; width:388rpx; line-height:66rpx; background-color:#3688FF; color:#FFFFFF; font-size:28rpx; text-align:center;}
  .demo-msg{width:500rpx; font-size:0;}
  .demo-msg-in{width:500rpx; height:800rpx;}
  .demo-wrap2{ width:85%; text-align:center; }
  .demo2{line-height:80rpx; display:block; width:100%; text-align:center; font-size:30rpx;}
  p {
    font-size: 36upx;
  }
  .parcel-list{
    margin-left: -40upx;
    margin-right:-40upx;
  }
  .btn {
    height: 100rpx;
    width: 80%;
    margin: 10rpx auto;
    background-color: $uni-color-warning;
    color: white;
    width: 80%;
    box-shadow: 0px 4px 16px #455B6308;
    border-radius: 3px;
    text-align: center;
    color: white;
    display: flex;
  }
  .paid {
    background-color: $theme-color;
  }
  .nopay {
    background-color: $uni-color-warning;
  }
  .link {
    vertical-align: middle;
    p {
      padding: 10px;
      font-size: 0.8em;
      font-weight: bold;
      margin: auto;
      color: white;
    }
  }
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
      color: $theme-color;
    }
    .desc {
      font-size: 0.8em;
      color: #626262;
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
    color: #626262;

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
  .detail-container{
    margin: 1em;
    overflow-x:hidden;
    white-space:nowrap;
  }
  .shipping-cost {
    font-size: 0.7em;
    margin-left: 2em;
  }
  .package-status {
    background: white;
    margin: 30upx;
    padding: 30upx;
    ul li {
      list-style: none;
    }

    .package-status {
      padding: 18px 0 0 0
    }

    .status-list {
      margin: 0;
      padding: 0;
      margin-top: -5px;
      padding-left: 8px;
      list-style: none;
    }

    .status-list > li {
      border-left: 2px solid $theme-color;
      text-align: left;
    }

    .status-list > li:before {
      /* 流程点的样式 */
      content: '';
      border: 3px solid $theme-color;
      background-color: $theme-color;
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 10px;
      margin-left: -7px;
      margin-right: 10px
    }

    .status-box {
      overflow: hidden
    }

    .status-list > li {
      height: auto;
      width: 95%;
    }

    .status-list {
      margin-top: -8px
    }

    .status-box {
      position: relative
    }

    .status-box:before {
      content: " ";
      background-color: #f3f3f3;
      display: block;
      position: absolute;
      top: -8px;
      left: 20px;
      width: 10px;
      height: 4px
    }

    .status-list {
      margin-top: 0px;
    }

    .status-list > li:not(:first-child) {
      padding-top: 10px;
    }

    .status-content-before {
      text-align: left;
      margin-left: 25px;
      margin-top: -20px;
    }

    .status-content-latest {
      text-align: left;
      margin-left: 25px;
      color: $theme-color;
      margin-top: -20px;
    }

    .status-time-before {
      text-align: left;
      margin-left: 25px;
      font-size: 10px;
      margin-top: 5px;
    }

    .status-time-latest {
      text-align: left;
      margin-left: 25px;
      color: $theme-color;
      font-size: 10px;
      margin-top: 5px;
    }

    .status-line {
      border-bottom: 1px solid #ccc;
      margin-left: 25px;
      margin-top: 10px;
    }

    .list {
      padding: 0 20px;
      background-color: #F8F8F8;
      margin: 10px 0 0 25px;
      border: 1px solid #EBEBEB;
      li {
        line-height: 30px;
        color: #616161;
      }
    }
  }
  .no-style {
    color: white;
    padding:10px;
    background-color: unset;
    line-height: unset;
    font-size: unset;
    padding: unset;
    &:after {
      border-width: 0;
    }
    &:hover {
      background-color: unset;
    }
  }
  .button-hover {
    background-color: unset;
  }
  .inquire {
    background-color: $uni-color-error;
  }
  .payments-overlay{width:500rpx; font-size:0; padding: 50rpx 20rpx;}
  .payments-overlay-in{width:500rpx; height:800rpx;}
  .close-btn{width:80rpx; height:80rpx; line-height:80rpx; text-align:center; font-size:40rpx; z-index:7;}
  .wechatpay {
    background-color: RGBA(129, 211, 117, 1.00);
    color: white;
    vertical-align: center;
    horizontal-align: center;
    margin: 30rpx auto;
  }
  .wechatpay-icon {
    width: 50rpx;
    display: inline;
    margin: auto 0px;
    margin-right: 50rpx;
  }
  .wechatpay-text {

  }
  .paymment-bank {
    display: block;
    margin: 10rpx 0;
  }
  .paymment-bank-copy {
    text-decoration: underline;
  }
  
  .grace-accordion-show{height:auto; animation:fadeIn 300ms linear;}
  .grace-accordion-hide{height:0; animation:fadeOut 300ms linear;}
  .grace-accordion-title{color:#323232; background:#F8F8F8;}
  .grace-accordion-title .grace-icons:before{margin-right:15rpx; font-size:36rpx !important;}
  .grace-article-list{}
  .grace-article-list-item{width:100%; overflow:hidden; padding:25rpx; border-bottom:25rpx solid #F8F8F8; box-sizing:border-box;}
  .grace-article-list-more-imgs{display:flex; flex-direction:row; justify-content:space-between; flex-wrap:nowrap;}
  .grace-article-list-img1{margin-top:15rpx;}
  .grace-article-list-img2-in{width:335rpx; height:200rpx; padding:20rpx 0;}
  .grace-article-list-img3-in{width:220rpx; height:150rpx; padding:20rpx 0;}
  .scrolldemo{display:flex; flex-wrap:nowrap; justify-content:space-between; align-items:center; padding:15rpx; background:#F5F6F8;}
  .scroll-icon{width:60rpx; text-align:center; font-size:32rpx; height:60rpx; line-height:60rpx; flex-shrink:0;}
</style>

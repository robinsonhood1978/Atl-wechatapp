<template>
	<gracePage :customHeader="false">
		<view class="grace-body" slot="gBody">
            <view style="padding:25rpx 50rpx; background:#F5F6F7">
                <graceSearch @inputting="inputting" @confirm="confirm" :placeholder="key" :kwd="key"></graceSearch>
            </view>
			<view class="grace-title grace-margin-top" style="margin:0 40rpx;" >
				<view class="grace-title-border"></view>
				<text class="grace-title-text grace-blue">左侧图片模式</text>
				<text class="grace-text-small grace-gray">grace.hcoder.net</text>
			</view>
			<view class="grace-list" style="margin:0 40rpx;" >
				<navigator class="grace-list-items">
					<view class="grace-list-image grace-relative">
						<image class="grace-list-image" src="https://graceui.oss-cn-beijing.aliyuncs.com/faces/1.png" mode="widthFix"></image>
						<view class="grace-badge-point"></view>
					</view>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">标题信息</text>
							<text class="grace-list-title-desc">20190318</text>
						</view>
						<view class="grace-list-body-desc">描述信息</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</navigator>
				<view class="grace-list-items">
					<view class="grace-list-image">
						<image class="grace-list-image" src="https://graceui.oss-cn-beijing.aliyuncs.com/faces/2.png" mode="widthFix"></image>
					</view>
					<view class="grace-list-body">
						<view class="grace-list-title">
							<text class="grace-list-title-text">标题信息</text>
							<text class="grace-list-title-desc">20190318</text>
						</view>
						<view class="grace-list-body-desc">描述信息</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
			</view>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceFlex from "../../graceUI/components/graceFlex.vue";
import graceSearch from "@/graceUI/components/graceSearch.vue";
export default {
	data() {
		return {
            key: ""
        }
	},
    onReady () {
        let key = this.$root.$mp.query.key
        this.key = key
    },
	onLoad:function(){},
	methods:{},
	components:{
		gracePage,
        graceFlex,
        graceSearch
	}
}
</script>
<style>
</style>
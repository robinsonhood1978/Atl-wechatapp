<template>
	<view class="grace-scroll-body">
		<view class="grace-scroll-msg grace-scrolling">
			<slot></slot>
		</view>
	</view>
</template>
<script>
export default {}
</script>
<style scoped>
.grace-scroll-body{width:100%; line-height:150rpx; height:150rpx; overflow:hidden;}
.grace-scroll-msg{line-height:150rpx; height:150rpx; white-space:nowrap;}
.grace-scrolling{animation:graceScrollingx 12s linear infinite;}
@keyframes graceScrollingx{ 0% { transform: translateX(100%); } 100% { transform: translateX(-200%); }}
</style>
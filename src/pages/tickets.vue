<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-flex-v1" id="gBody">
			<view class="SegmentedControlIn">
				<graceSegmentedControl :items="cates" :current="current" @change="change"></graceSegmentedControl>
			</view>
			<scroll-view scroll-y class="grace-list grace-margin-top" :style="{height:scrollHeight+'px'}">
				<TicketCard
                    :key="Item.id"
                    :ticket="Item"
                    v-for="(Item) in ticketsNow"
                  ></TicketCard>
			</scroll-view>
		</view>
	</gracePage>
</template>
<script>
import TicketCard from '@/components/ticket-card'
import { get, setCID, showSuccess, setUID, setSCENE, primaryColor, version } from '@/utils/index'
import gracePage from "@/graceUI/components/gracePage.vue";
import graceSegmentedControl from '@/graceUI/components/graceSegmentedControl.vue';
import { mapState } from 'vuex'
export default {
    data() {
    	return {
			cates : ["进行中", "已完成"],
			current : 0,
			scrollHeight : 500,
			tickets : [],
            ticketsNow : []
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
    },
	onReady:function(){
		setTimeout(()=>{
			uni.createSelectorQuery().select('#gBody').fields(
				{size: true}, (res) => {
					this.scrollHeight = res.height - uni.upx2px(180);
				}
			).exec();
		},1000);
	},
    mounted () {
        if (this.isLogedIn) {
            this.ticketList()
        }
    },
	methods:{
        async ticketList() {
            let res = await get('freighttickets/?limit=0&offset=0&type=all')
            this.tickets = res
            this.ticketsNow = res.filter(item => item.end_date === null)
            console.log('res:', res)
            console.log('ticketsNow:', this.ticketsNow)
        },
        async ticketType() {
            let res = await get('freighttickets/types/?group=parcel')
            this.tickettypes = res.object
            console.log('this.tickettypes', this.tickettypes)
        },
		change : function(e){
			this.current = e;
            this.ticketsNow = (e==0) ? this.tickets.filter(item => item.end_date === null) : this.tickets.filter(item => item.end_date != null)
            console.log('e:', e)
		}
	},
	components:{TicketCard, gracePage, graceSegmentedControl}
}
</script>
<style>
.SegmentedControlIn{width:500rpx; padding:0 125rpx; margin-top:38rpx;}
</style>
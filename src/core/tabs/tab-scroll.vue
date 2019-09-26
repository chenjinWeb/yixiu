<template>
  <div class="tab-scroll" ref="scroll">
    <slot></slot>
		<div class="finish-text" v-if="registerScroll && !finished && hasScroll">
			<!-- 加载中。。。 -->
			<img src="../../assets/img/jiazai.gif" alt="未加載">
		</div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
  Mixins,
  Provide,
  Ref,
  Emit,
  Model
} from "vue-property-decorator";

@Component({
  components: {},
  name: "tab-scroll"
})
export default class TabScroll extends Vue {
	@Ref("scroll") scrollRef!: HTMLDivElement;
	@Prop({default: false}) registerScroll!: boolean;

	@Emit('pullDown') pullDown(){}
	@Emit('pullUp') pullUp(){}

	@Prop() finished!: boolean;

	start_pageX!:number
	start_pageY!:number
	openPullDown!:boolean
	openPullUp!:boolean
	hasScroll = false; // 滚动了

	offsetHeight = 30

  mounted() {
		if(this.registerScroll){
			// this.scrollRef.addEventListener("touchstart", this.touchstart);
			// this.scrollRef.addEventListener("touchmove", this.touchmove);
			// this.scrollRef.addEventListener("touchend", this.touchend);
			this.scrollRef.addEventListener("scroll", this.scrollEvent)
		}
	}

	touchstart(event:TouchEvent){
		this.openPullDown = this.scrollRef.scrollTop == 0;
		this.openPullUp = this.scrollRef.scrollTop + this.scrollRef.clientHeight == this.scrollRef.scrollHeight;
		let touch: Touch = event.changedTouches[0] || event.targetTouches[0] || event.touches[0];
		this.start_pageX = touch.pageX;
		this.start_pageY = touch.pageY;

		this.scrollRef.style.transitionDuration = '0ms'
	}
	touchmove(event:TouchEvent){
		let touch: Touch = event.changedTouches[0] || event.targetTouches[0] || event.touches[0];
		let pageY = touch.pageY - this.start_pageY;
		if ((this.openPullDown && pageY > 0) || (this.openPullUp && pageY < 0)) {
			event.stopPropagation();
			event.preventDefault();
			this.scrollRef.style.transform = `translate(0px, ${pageY / 3}px) scale(1) translateZ(0px)`
			this.scrollRef.style.webkitTransform = `translate(0px, ${pageY / 3}px) scale(1) translateZ(0px)`
		}
	}
	touchend(event:TouchEvent){
		let touch: Touch = event.changedTouches[0] || event.targetTouches[0] || event.touches[0];
		this.scrollRef.style.transitionDuration = '800ms'
		this.scrollRef.style.transform = 'translate(0px, 0px) scale(1) translateZ(0px)'
		this.scrollRef.style.webkitTransform = 'translate(0px, 0px) scale(1) translateZ(0px)'
		let pageY = touch.pageY - this.start_pageY;
    if (this.openPullDown && pageY > 0) {
      if (pageY / 3 >= this.offsetHeight) {
				this.pullDown()
      }
		}
    if (this.openPullUp && pageY < 0) {
      if (pageY / 3 <= -this.offsetHeight) {
				this.pullUp()
      }
    }
	}

	scrollEvent(){
		this.hasScroll = true;
		if (this.scrollRef.scrollTop + this.scrollRef.clientHeight == this.scrollRef.scrollHeight) {
      !this.finished && this.pullUp();
    }
	}

  created() {}

  destroyed() {

	}
}
</script>
<style lang="less" scoped>
.tab-scroll {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
  z-index: 2;
  display: block;
	background: #fafafa;
	overflow:scroll;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
  will-change: scroll-position;
	overscroll-behavior: contain;

	transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  transition-duration: 0ms;
  transform: translate(0px, 0px) scale(1) translateZ(0px);
}
.finish-text{
	font-size: 0.32rem;
	text-align: center;
	padding: 0 0 0.2rem 0;
	color: #5d5d5d;
	img{
		width: .5rem;
	}
}

</style>


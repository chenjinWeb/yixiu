<template>
  <!-- <tab-modal> -->
    <!-- <tab-scroll> -->
      <div>
				<div class="integral-box" v-if="!scaleBo">
					<div class="img-box" :style="{'display': imgLoadBo?'block':'none'}" ref="canvasImg">
						<p class="name">{{name}}</p>
						<img class="img1" crossorigin="anonymous" :src="url" alt @load="imgLoad()" />
						<img crossorigin="anonymous" class="code" src="//yxxl.net.cn/banner/10000/code.jpg" />
					</div>
				</div>
				<div class="integral-box2" :class="{'active': scaleBo}">
					<img class="img2" :src="imgUrl" v-if="imgUrl" />
				</div>
			</div>
    <!-- </tab-scroll> -->
  <!-- </tab-modal> -->
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
  Mixins,
  Provide,
  Ref
} from "vue-property-decorator";
import MixinUtil from "../core/mixins";
import { getLocalStorage, BehaviorSubject } from "../core/util";
import { STORAGE_QUESTION } from "../core/config";
import { homeResult, homeShare, homeHot } from "../service/home";
import { State } from 'vuex-class';

@Component({
  components: {}
})
export default class Jieguo2 extends Mixins(MixinUtil) {
  @Provide() questionId!: any;
  @Provide() questionType!: any;
  @Provide() integral!: any;
	@Ref("canvasImg") readonly canvasImg!: HTMLDivElement;
	@Provide() details:any = {}
	@State bannerList!: any[]
	@Provide() shareSubject:BehaviorSubject = new BehaviorSubject()

  name: any = "";
  scaleBo = false;
  imgLoadBo = false;
  imgUrl: string = "";

  get url() {
    return `//yxxl.net.cn/banner/10000/${+this.integral - 2}.jpg`;
  }

  imgLoad() {
    this.imgLoadBo = true;
    this.saveImg();
  }

  saveImg() {
    import("html2canvas").then(result => {
      let html2canvas = result.default;
      html2canvas(this.canvasImg, {
        backgroundColor: "#00000000",
        // allowTaint: true,
        useCORS: true
      }).then((canvas: HTMLCanvasElement) => {
        this.imgUrl = canvas.toDataURL("image/png", 1.0);
        setTimeout(() => {
          this.scaleBo = true;
        }, 600);
      });
    });
	}

	wxLoad(){
		this.shareSubject.next()
	}

  mounted() {}

  created() {
    this.homeStat(202, -3);
    this.questionId = this.$route.query.questionId;
    this.questionType = this.$route.query.questionType;
    this.integral = this.$route.query.integral;
		this.name = this.$route.query.name;

		this.details = this.bannerList.find(item => item.questionId == this.questionId)

		this.shareSubject.subscribe(()=> {
			this.updateAppMessageShareData({
				title: this.details.questionTitle,
				desc: this.details.questionDesc,
				link: `${location.origin}/test?questionId=${this.details.questionId}&questionType=2&share=1`,
				imgUrl: `${location.origin}/${this.details.questionPic}`,
			})
		})
  }

  destroyed() {}
}
</script>
<style lang="less" scoped>

.integral-box2{
	transition: all 0.2s ease;
	transform: scale(1);
	&.active {
    transform: scale(0.9);
	}
	img{
		max-width: 100%;
		max-height: 100%;
	}
}

.integral-box {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
	height: 100%;
	transform: translate(100%)
}

.img-box {
  position: relative;
  img {
    max-width: 100%;
    display: block;
  }
  .img2 {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .name {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    top: 2.48rem;
    font-size: 0.28rem;
    font-weight: 700;
  }

  .code {
    position: absolute;
    bottom: 0.2rem;
    left: 0.38rem;
    width: 1.12rem;
  }
}
</style>

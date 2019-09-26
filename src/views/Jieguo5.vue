<template>
  <!-- <tab-modal> -->
    <!-- <tab-scroll> -->
      <div class="canvas-bg" :class="{'active': scaleBo}" @click.self="scaleBo = !scaleBo"  >
          <div>
            <!-- v-if="!scaleBo" :style="{'display': imgLoadBo?'block':'none'}" -->
            <div class="integral-box" v-if="!scaleBo">
                <div class="img-box"   ref="canvasImg" :style="{'display': imgLoadBo?'block':'none'}">
                  <p class="name">{{name}}</p>
                  <img class="img1" crossorigin="anonymous" :src="url" alt @load="imgLoad()" />
                     <!-- <img crossorigin="anonymous" class="code" src="http://yixiu.test.upcdn.net/banner/10003/code.jpg" /> -->
                  <img class="img3" crossorigin="anonymous" :src='himgsrc' alt @load="imgLoad()" />
                  <div class="he">
                  </div>

              </div>
            </div>

            <div class="integral-box2" :class="{'active': scaleBo}">
              <img class="img2" :src="imgUrl" v-if="imgUrl" />
            </div> 
            <div class="hint">
                长按保存图片&nbsp;发朋友圈鸭
            </div>
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
    console.log(this.integral)
    // debugger
    return `//yxxl.net.cn/banner/10003/${+this.integral-2}.jpg`;
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
  mounted() {

  }
  data(){
    let num=Math.floor((Math.random()*5+1))
    let himgsrc="//yxxl.net.cn/banner/10003/"+num+".png"
    return{
      himgsrc
    }
  }
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
  // transform: translate(100%);
}
.img3{
    position: absolute;
    border-radius:100%;

    width: 1.33rem;
    height: 1.27rem;
    top: 0.4rem;
    left: 0.17rem;

  }
.img-box {
  position: relative;
  text-align: center;
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
    left:.95rem;
    width:1.5rem;
    left: .5rem;
    text-align: center;
    bottom: .2rem;
    font-size: 0.28rem;
    font-weight: 700;

  }
  .seave{
    // position: absolute;
    // left: 50%;
    // transform: translate(-50%,-50%);
    font-size: .26rem;
  }
  .he{
    font-size: .1rem;
    text-align: center;
    width:2rem;
    margin:0 auto;
    position: absolute;
    left: 50%;
    transform: translate(-50%,0);
    bottom: 0.4rem;
  }
  .cause{
    position: absolute;
    left:1.9rem;
    top: 1.48rem;
    font-size: .5rem;
  }
  .code{
    width: .9rem;
    height: .9rem;
    margin:0 auto;
  }
}
.hint{
  text-align: center;
  height: 0.7rem;
  line-height: 0.7rem;
  font-size:0.34rem;
  border-radius: 0.2rem;
  border:1px solid rgba(255, 255, 255, 0.8);
  margin: 0 0.25rem;
  color:white;
}
.canvas-bg {
  position: absolute;
  top: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  overflow-y: auto;
  &.active {
		top: 0;
		z-index: 2;
  }
}
</style>

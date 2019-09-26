<template>
  <!-- ？？ -->
  <tab-modal>
    <tab-scroll :registerScroll="true" @pullUp="pullUp()" :finished="scrollFinish">

      <div class="banner">
        <img class="banner-img" :src="question.questionPic" />
        <img @click="black()" class="banner-black" src="../assets/img/icon-left-black.png" alt />
        <div class="jieguo-bg"></div>
        <p class="item-1">{{question.questionTitle}}</p>
      </div>


      <div class="test-info">
        <div class="jieguo-info-title">
          <img src="../assets/img/jieguo-title-l.png" />
          <span>{{result.resultTitle}}</span>
          <img src="../assets/img/jieguo-title-r.png" />
        </div>
        <p class="test-info-jieguo">{{result.resultDesc}}</p>
      </div>

      <div class="jieguo-btn">
        <div class="jg-btn save" v-ripple @click="saveImg();homeStat(104, questionId)">保存分享</div>
        <!-- <div class="jg-btn share" v-ripple @click="wxShare();homeStat(105, questionId)">分享</div> -->
      </div>

			<p class="cai-love">猜你喜欢</p>
			<template v-for="(item,index) in hotList">
				<router-link class="product-card-link" :key="index" :to="{name: 'test', query:{questionId: item.questionId}}">
					<div class="product-card" :key="index">
						<div class="product-text">
							<p>{{item.questionTitle}}</p>
							<p>{{item.questionDesc}}</p>
							<p>{{item.questionCount}}个问题</p>
						</div>
						<div class="product-img">
							<img :src="item.questionPic"/>
						</div>
						<div class="product-bottom-text">
							<p>
								<span>{{item.visitNum}}</span>人已测
							</p>
							<p @click="homeGood(item,$event)">
								<img v-if="!item.zanNumBo" class="icon-zang" src="../assets/img/icon-zang-active.png" alt />
								<img v-if="item.zanNumBo" class="icon-zang" src="../assets/img/icon-zang.png" alt />
								<span>{{item.zanNum}}</span>
							</p>
						</div>
						<div class="product-bg-1"></div>
						<div class="product-bg-2"></div>
					</div>
				</router-link>
			</template>

    </tab-scroll>

    <!--
			<svg hidden ref="jieguoBgSvgA"></svg>
			<canvas ref="jieguoBg"></canvas>
    -->

    <div class="canvas-bg" :class="{'active': showImg}" @click.self="showImg = !showImg" >
      <!-- v-if="!showImg" -->
      <div class="close" @click="close()">x</div>
      <div class="canvas-box canvas-html" ref="canvasImg" v-if="!showImg">
        <div class="canvas-header">
					<img crossOrigin="anonymous" :src="question.questionPic"/>
					<!-- <img crossOrigin="anonymous" :src="question.questionPicBase64"/> -->
					<div class="jieguo-bg"></div>
					<h2 class="canvas-title">{{question.questionTitle}}</h2>
				</div>

				<div class="canvas-jieguo-box">
					<div class="canvas-jieguo-title">
						<img src="../assets/img/jieguo-title-l.png" />
						<p>{{result.resultTitle}}</p>
						<img src="../assets/img/jieguo-title-r.png" />
					</div>
					<p class="jieguo-text">{{result.resultDesc3}}...</p>
				</div>

				<div class="canvas-jieguo-bottom">
					<img class="erweima-img" src="../assets/img/erweima-img.png" />
					<img class="shouyishou" src="../assets/img/shouyishou.png" />
				</div>

      </div>
      <div class="canvas-box canvas-img" :class="{'active': showImg}">
        <img style="max-width: 100%;display: block;" :src="imgUrl" alt />
      </div>
      <div class="hint">
        长按保存图片&nbsp;发朋友圈鸭
      </div>
    </div>
  </tab-modal>
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
import { getLocalStorage, BehaviorSubject, getCharSizeByCanvas } from "../core/util";
import { STORAGE_QUESTION } from "../core/config";
import { homeResult, homeShare, homeHot, homeList } from "../service/home";
import { float } from 'html2canvas/dist/types/css/property-descriptors/float';

@Component({
  components: {}
})
export default class Jieguo extends Mixins(MixinUtil) {
  // @Ref('jieguoBg') readonly jieguoBg!: HTMLCanvasElement
  // @Ref('jieguoBgSvgA') readonly jieguoBgSvgA!: SVGSVGElement
  @Ref("canvasImg") readonly canvasImg!: HTMLDivElement;

  showImg = false;
	showImgLoading = false;
	resultLoading = false;
	imgUrl = "";
	questionId = 0;


  result: any = {};
  question: any = {};
	hot: any = {};
	hotList:any[] = []
	query = {
		page:1,
		limit: 5,
		questionCategory: 0
	}
	@Provide() shareSubject:BehaviorSubject = new BehaviorSubject()
	scrollFinish = false;

  mounted() {

  }
  created() {
		this.homeStat(202);
		let question = getLocalStorage(STORAGE_QUESTION) || this.$route.query;
		this.questionId = question.questionId || 0

    if (question) {
      homeResult(question).then(res => {
        if (res.code == 200) {
          this.question = res.data.question;
					res.data.result.resultDesc3 = res.data.result.resultDesc;

					let fontSize = this.getDomFontSize();
					let styleFont = getCharSizeByCanvas('。', {fontSize: fontSize * 0.3})
          let length = Math.floor((5.4 * fontSize) / styleFont.width * 7);
          if(res.data.result.resultDesc3.length>length){
            res.data.result.resultDesc3=res.data.result.resultDesc3.slice(0,length - 11);
          }

          this.result = res.data.result;
					this.hot = res.data.hot;
					this.resultLoading = true;
					this.query.questionCategory = this.question.questionCategory;
					this.loadImg(this.question.questionPic).then(img => {
						let canvas = document.createElement('canvas');
						let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
						canvas.width = img.width;
						canvas.height = img.height;
						ctx.drawImage(img, 0, 0);
						this.question.questionPicBase64 = canvas.toDataURL();
						// canvas.toBlob((blob)=> {
						// 	this.question.questionPicBase64 = URL.createObjectURL(blob)
            // })
						this.shareSubject.subscribe(()=> {
							this.updateAppMessageShareData({
								title: this.question.questionTitle,
								desc: this.result.shareDesc,
								link: `${location.origin}/test?questionId=${this.result.questionId}&share=1`,
								imgUrl: `${location.origin}/type/wx-share-${this.question.questionCategory}.png`,
							})
						})

					})

					homeList(this.query).then(res => {
						if(res.code == 200){
							res.data.find((item:any) => item.questionId === this.questionId)
							this.hotList = res.data
						}
					})
        }
      });
    }
  }
  // ？？
  saveImg() {
		if(!this.resultLoading) return;
    if (this.showImgLoading) return;
    this.showImgLoading = true;
    import("html2canvas").then(result => {
			let html2canvas = result.default;
			console.info(this.canvasImg)
      html2canvas(this.canvasImg, {
        backgroundColor: "rgba(17,77,197, 1)",
				// allowTaint: true,
				useCORS: true,
      }).then((canvas: HTMLCanvasElement) => {
        this.imgUrl = canvas.toDataURL("image/png", 1.0);
        this.showImg = true;
        this.showImgLoading = false;
      });
		});
	}

	wxLoad(){
    this.shareSubject.next()
	}
  close(){
  this.showImg=false;
  }
  wxShare() {

	}

	pullUp(){
		this.scrollFinish = false;
		homeList(this.query).then(res => {
			if(res.code == 200){
				if(res.data.length){
					this.hotList.push(...res.data)
					++this.query.page
				}else{
					this.scrollFinish = true;
				}
			}
		})
	}

  /////////////////////
  // async canvasA(){

  // 	let fontSize = this.getDomFontSize()
  // 	let ctx = this.jieguoBg.getContext('2d') as CanvasRenderingContext2D
  // 	let matrix = this.jieguoBgSvgA.createSVGMatrix()
  // 	let width = this.jieguoBg.width = 670 * fontSize / 100;
  // 	this.jieguoBg.height = 700

  // 	// 画边框圆角
  // 	this.drawRoundRect(ctx, 0, 0, width, this.jieguoBg.height, 40 * fontSize / 100 )
  // 	ctx.clip();

  // 	// 画背景图
  // 	let img = await this.loadImg('img/canvas-henl-bg.jpg')
  // 	// 背景图平铺
  // 	let pat = ctx.createPattern(img, 'repeat') as CanvasPattern;
  // 	pat.setTransform(matrix.scale(width / img.width));
  // 	ctx.rect(0,0,width,this.jieguoBg.height);
  // 	ctx.fillStyle=pat;
  // 	ctx.fill();

  // 	let height = 0;

  // 	// 开始画 数据
  // 	let img2 = await this.loadImg('img/123.jpg')
  // 	// img2.width / img2.height = 656 * fontSize / 100 / h
  // 	let width2 = 656 * fontSize / 100
  // 	let height2 = width2 / img2.width * img2.height
  // 	let x2 = 7 * fontSize / 100
  // 	let y2 = height = 7 * fontSize / 100
  // 	ctx.drawImage(img2, x2 , y2, width2, height2);
  // 	height += height2

  // 	let title3 = '测测你的最佳结婚年龄？'
  // 	ctx.save()
  // 	let fontSize3 = 46 * fontSize / 100
  // 	ctx.font = `bold ${fontSize3}px 微软雅黑`;
  // 	ctx.fillStyle = '#1f1f1f';
  // 	ctx.textBaseline = 'middle';
  // 	let text3 = ctx.measureText(title3);
  // 	height += 60 * fontSize / 100
  // 	ctx.fillText(title3, (width - text3.width) / 2 , height);
  // 	height += fontSize3
  // 	ctx.restore()

  // 	let img4 = await this.loadImg('img/canvas-jieguo-title-l.png')
  // 	let img5 = await this.loadImg('img/canvas-jieguo-title-r.png')
  // 	let title4 = '你的测试结果'
  // 	ctx.save()
  // 	let fontSize4 = 34 * fontSize / 100
  // 	height += 83 * fontSize / 100
  // 	let x4 = 92 * fontSize / 100
  // 	let y4 = height + (fontSize4 - 10 * fontSize / 100) / 2
  // 	ctx.drawImage(img4, x4 , y4, 114 * fontSize / 100, 10 * fontSize / 100);
  // 	let x5 = 465 * fontSize / 100
  // 	let y5 = height + (fontSize4 - 10 * fontSize / 100) / 2
  // 	ctx.drawImage(img5, x5 , y5, 114 * fontSize / 100, 10 * fontSize / 100);
  // 	ctx.font = `bold ${fontSize3}px 微软雅黑`;
  // 	ctx.fillStyle = '#1f1f1f';
  // 	ctx.textBaseline = 'middle';
  // 	let text4 = ctx.measureText(title4);
  // 	ctx.fillText(title4, (width - text4.width) / 2 , height);

  // 	ctx.restore()

  // 	console.info(height)
  // 	// this.jieguoBg.height = height

  // }

  // 获取全局字体大小
  getDomFontSize() {
    let fontSize: any = window.document.documentElement.style.fontSize;
    if (fontSize) {
      let f = fontSize.match(/\d+/);
      if (f) return +f[0];
    }
    return 50;
  }

  // 封装一个函数，将用来绘制圆角矩形
  /**
   * line 四个角是否都圆角 左上为开始点
   */
  drawRoundRect(
    cxt: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    line = [true, true, true, true]
  ) {
    cxt.save();
    cxt.beginPath();
    if (line[0]) {
      cxt.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2);
    } else {
      cxt.lineTo(x, y);
    }
    cxt.lineTo(width - radius + x, y);
    if (line[1]) {
      cxt.arc(
        width - radius + x,
        radius + y,
        radius,
        (Math.PI * 3) / 2,
        Math.PI * 2
      );
    } else {
      cxt.lineTo(width - x, y);
    }
    cxt.lineTo(width + x, height + y - radius);
    if (line[2]) {
      cxt.arc(
        width - radius + x,
        height - radius + y,
        radius,
        0,
        (Math.PI * 1) / 2
      );
    } else {
      cxt.lineTo(width - x, height - y);
    }
    cxt.lineTo(radius + x, height + y);
    if (line[3]) {
      cxt.arc(
        radius + x,
        height - radius + y,
        radius,
        (Math.PI * 1) / 2,
        Math.PI
      );
    } else {
      cxt.lineTo(x, height - y);
    }
    cxt.closePath();
    cxt.restore();
  }

  loadImg(src: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve,reject) => {
      let img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
				resolve(img);
			};
			img.onerror = (err)=> {
				reject(err)
			}
			img.src = src;
    });
  }

  /////////////////////

  destroyed() {}
}
</script>
<style lang="less" scoped>
////////////////////

.hint{
  text-align: center;
  height: 0.7rem;
  line-height: 0.7rem;
  font-size:0.34rem;
  width:6.7rem;
  border-radius: 0.2rem;
  border:1px solid rgba(255, 255, 255, 0.8);
  margin: 0 auto;
  color:white;
}
.close{
  color: #f7f7f7;
  width: .4rem;
  height:.4rem;
  text-align: center;
  border-radius: 50%;
  position: absolute;
  top:.3rem;
  right: .1rem;
  border: white 1px solid;
}
.canvas-jieguo-bottom {
  height: 1.4rem;
  background: #124db3;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .erweima-img {
    max-width: 1.12rem;
    display: block;
  }
  .shouyishou {
    max-width: 2.88rem;
    display: block;
  }
}
.canvas-jieguo-title {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0.38rem 0 .1rem 0;
  height: 0.5rem;
  img {
    max-width: 1.14rem;
    min-width: 1.14rem;
    display: block;
  }
  p {
    color: #1f1f1f;
    font-size: 0.34rem;
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding: 0 0.2rem;
    text-align: center;
  }
}
.canvas-jieguo-box {
  width: 5.94rem;
  border-radius: 0.2rem;
  background-color: #ffffff;
  margin: 0.3rem auto 0.3rem auto;
  overflow: hidden;
  .jieguo-text {
    color: #1f1f1f;
    font-size: 0.3rem;
    font-weight: 500;
    text-align: justify;
    line-height: 1.5;
    text-indent: 0.6rem;
		margin: 0rem 0.25rem 0.4rem 0.25rem;
		letter-spacing: 0;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // display: -webkit-box;
    // -webkit-line-clamp: 8;
    // -webkit-box-orient: vertical;
  }
}
.canvas-title {
  color: #fff;
	font-size: 0.38rem;
	font-weight: 500;
	text-align: center;
	position: absolute;
	top: 50%;
	width: 100%;
	transform: translate(0,-50%);
}

.canvas-header {
  width: 6.56rem;
  margin: 0.07rem auto 0 auto;
  overflow: hidden;
	border-radius: 0.2rem;
	position: relative;
	.jieguo-bg{
		position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.2);
	}
  img {
    width: 100%;
    display: block;
  }
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

.canvas-box {
  width: 6.7rem;
  border-radius: 0.2rem;
  background: url("../assets/img/canvas-henl-bg.jpg") repeat-y;
  background-size: 100% auto;
  overflow: hidden;
  margin-top:1rem;
	&.canvas-html{
		position: absolute;
		transform: translate(-50%, -50%);
		top: 50%;
		left: 50%;
	}
	&.canvas-img{
		display: flex;
		margin: .8rem auto .3rem;
		align-items: center;
	}
	z-index: -1;
  // transition: transform 0.3s cubic-bezier(0.42, 0, 0.58, 1) 0s, opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1) 0s, -webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1) 0s;
  &.active {
		z-index: 2;
    // transform: translate(-50%,-50%) scale(0.8);
  }
}

///////////////////

.product-card-link{
	display: block;
}

.product-card {
  margin: 0.4rem auto 0.3rem auto;
}
.product-bg-1 {
   height: 2.88rem;
  width: 6.9rem;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000;
  opacity: 0.2;
}
.product-img img{
  height: 100%;
}
.cai-love {
  color: #1f1f1f;
  font-size: 0.38rem;
  font-weight: 700;
  text-align: center;
}
.jieguo-btn {
  display: flex;
  justify-content: space-around;
  margin: 0.6rem 0 0.8rem 0;
  .jg-btn {
    width: 2.2rem;
    height: 0.8rem;
    border-radius: .4rem;
    color: #f7f7f7;
    font-size: .34rem;
    font-weight: 500;
    text-align: center;
    line-height: 0.8rem;
    overflow: hidden;
    position: relative;

    &.save {
      background: url("../assets/img/jg-btn-save.png") repeat-y;
    }
    &.share {
      background: url("../assets/img/jg-btn-share.png") repeat-y;
    }
  }
}
.jieguo-info-title {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 0.3rem;
  span {
    color: #1f1f1f;
    white-space: nowrap;
    font-size: 0.38rem;
    font-weight: 700;
    padding: 0 0.2rem;
  }
  img {
    width: 1.46rem;
  }
}


.test-info {
  width: 6.9rem;
  border-radius: 0.2rem;
  background-color: #ffffff;
  padding: 0.6rem;
  margin: 0.3rem auto 0 auto;
  .test-info-jieguo {
    color: #1f1f1f;
    font-size: 0.3rem;
    font-weight: 500;
    line-height: 1.5;
    text-indent: 0.6rem;
    text-align: justify;
  }
}

.banner {
  position: relative;
  height: 3rem;
  display: flex;
  align-items: center;
  overflow: hidden;
  .banner-img {
    width: 100%;
  }
  .banner-black {
    position: absolute;
    top: 0;
    left: 0;
    height: 0.38rem;
    margin: 0.2rem;
    z-index: 9;
  }
  .item-1 {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  width:100%;
  color: #ffffff;
  // color: #1f1f1f;
  font-size: 0.38rem;
  // font-weight: 700;
  text-align: center;
  // margin-top: 0.75rem;
  margin-bottom: 0.6rem;
  padding: 0 0.3rem;
  position: absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
 }
 .jieguo-bg {
  height: 2.88rem;
  width: 7.6rem;
  position: absolute;
  top: 0;
  left: 0;
  // background-color: #000000;
  opacity: 0.5;
  background: linear-gradient(to bottom, #000000, #00000000);
}

}
</style>

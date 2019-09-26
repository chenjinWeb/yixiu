<template>
  <div>

    <div class="jieguo-box" :class="{'active':!imgUrl}">
      <div class="jieguo-img" ref="canvasImg">
        <template v-for="(item,index) of elements">
          <img :src="item.url" :key="index" v-if="item.type === 'image'" :style="item.style" @load="imgLoad(item)"/>
          <span :key="index" v-if="item.type === 'text'" :style="item.style">{{item.text}}</span>
        </template>
      </div>
      <div class="jieguo-tips" v-if="!isWxMini">长按保存图片 发朋友圈鸭</div>
      <div class="jieguo-tips" v-if="isWxMini && sharebutton">长按保存图片 发朋友圈鸭</div>
    </div>

<!--  v-if="!imgUrl" -->
		<div class="jiazai" v-if="!imgUrl"></div>

    <div class="jieguo-box" :class="{'active':imgUrl}">
			<div class="jieguo-box-2" :class="{'active2':scaleBo}">
				<div class="jieguo-img">
					<img :src="imgUrl">
				</div>
				<div class="jieguo-tips" v-if="!isWxMini">长按保存图片 发朋友圈鸭</div>
				<div class="jieguo-tips" v-if="isWxMini && sharebutton">长按保存图片 发朋友圈鸭</div>
			</div>
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
  Ref
} from "vue-property-decorator";
import MixinUtil from "../core/mixins";
import { getLocalStorage, BehaviorSubject } from "../core/util";
import { STORAGE_QUESTION } from "../core/config";
import { homeResult, homeShare, homeHot } from "../service/home";
import { State } from "vuex-class";

@Component({
  components: {}
})
export default class Jieguoz extends Mixins(MixinUtil) {
  @State bannerList!: any[];
  @State userInfo!: any;

  @Provide() shareSubject: BehaviorSubject = new BehaviorSubject();
  @Ref("canvasImg") readonly canvasImg!: HTMLDivElement;
  imgUrl: string = "";

  details!: any;
  questionId!: any;
  questionType!: any;
  integral!: any;
  name!: any;
  gender!: any;
  avatarUrl!: any;
  sharebutton!: any;
  scaleBo: any = false;

  elements: any[] = [];

  saveImg() {
    import("html2canvas").then(result => {
      let html2canvas = result.default;
      html2canvas(this.canvasImg, {
        backgroundColor: "#00000000",
        useCORS: true
      }).then((canvas: HTMLCanvasElement) => {
				this.imgUrl = canvas.toDataURL("image/png", 1.0);
				setTimeout(() => {
          this.scaleBo = true;
        }, 100);
        canvas.toBlob(blob => {
          console.info(URL.createObjectURL(blob));
        });
      });
    });
	}

	imgLoad(item:any){
		item.imgLoad = true
		if(this.elements){
			let length = this.elements.filter(item => item.type === 'image' && !item.imgLoad).length
			if(length == 0){
				this.saveImg();
			}
		}
	}

  wxLoad() {
    this.shareSubject.next();
  }

  getResultUrl(questionId: any, number: any) {
    let development = process.env.NODE_ENV === "development";
    return `${
      development ? "https://h5.yxxl.net.cn" : location.origin
    }/banner/${questionId}/${number}`;
  }

	mounted() {}

	// 获取动态二维码
  getCodeUrl(body:any) {
    //https://api.yxxl.net.cn/h5/home/sharexcxpic?pagePath=pages/index/index&scene=1100&width=500
    let params: any[] = [];
    Object.keys(body).forEach(key => {
      params.push(`${key}=${body[key]}`)
    })
    return `https://api.yxxl.net.cn/h5/home/sharexcxpic?${params.join('&')}`
	}

	loadImage(src){
		return new Promise<HTMLImageElement>(( resolve,reject )=>{
			let img = new Image()
			img.crossOrigin = 'anonymous'
			img.src = src
			img.onload = ()=> {
				resolve(img)
			}
		})
	}

	async getBase64ImageBySrc(src){
		let img = await this.loadImage(src)

		let canvas = document.createElement("canvas");
    canvas.width = img.width;
		canvas.height = img.height;
		let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.drawImage(img, 0, 0, img.width, img.height);
		return canvas.toDataURL()
	}

	async initImg(){
		let h = Math.floor(Math.random() * 10) + 1;

		// let _codeUrl = this.getCodeUrl({
    //   scene: `${encodeURIComponent(`questionId=${this.questionId}&questionType=${this.questionType}`)}`,
    //   pagePath: 'pages/web/web',
    //   width: 500
		// })

		let _codeUrl = this.getCodeUrl({
      scene: `${encodeURIComponent(`i=${this.questionId}&t=${this.questionType}&r=1`)}`,
      pagePath: 'pages/index/index',
      width: 500
		})

		console.info(_codeUrl)

		// let _codeUrl = this.getCodeUrl({
    //   scene: `${encodeURIComponent(`redirect=${encodeURIComponent(`pages/web/web?questionId=${this.questionId}&questionType=${this.questionType}`)}`)}`,
    //   pagePath: 'pages/index/index',
    //   width: 500
		// })

		console.info(_codeUrl)

		let codeUrl = await this.getBase64ImageBySrc(_codeUrl)

		let imgDate
		let elements: any[] = []

    switch (+this.questionId) {

      case 10001:
				h = Math.floor(Math.random() * 12) + 1;
        elements = [
          {
            type: "image",
            url: this.getResultUrl(
              this.questionId,
              `${ this.integral - 2 }.jpg`
            ),
            style: {}
          },
          // {
          //   type: "image",
          //   url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code.jpg"),
          //   style: {
          //     position: 'absolute',
					// 		top: '8.54rem',
					// 		left: '1.64rem',
					// 		width: '1.25rem',
					// 		border: '0.08rem solid #fff',
          //   }
					// },
					{
            type: "image",
            url: this.avatarUrl || this.getResultUrl(this.questionId, `${h}.png`),
            style: {
              position: "absolute",
              top: `1.24rem`,
              width: "1.2rem",
              height: "1.2rem",
							left: "1.1rem",
							zIndex: 999,
							borderRadius: "50%",
							border: `0.05rem solid #fff`
            }
          },
          {
            type: "text",
            text: this.name,
            style: {
              position: "absolute",
              top: "2.4rem",
							left: "0.86rem",
							display: 'block',
							width: '1.5rem',
              textAlign: 'center',
              fontWeight: 400,
              fontSize: "0.34rem"
            }
          },
				];

				imgDate = {
					type: "image",
					url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code.jpg"),
					style: {
						position: 'absolute',
						zIndex: 999,
						top: '8.54rem',
						left: '1.64rem',
						width: '1.25rem',
						border: '0.08rem solid #fff',
					}
				}
				if(this.isWxMini){
					if(+this.sharebutton){
						elements.push(imgDate)
					}
				}else{
					elements.push(imgDate)
				}
				break;
      case 10002:
        elements = [
          {
            type: "image",
            url: this.getResultUrl(
              this.questionId,
              `${ this.integral - 2 }.jpg`
            ),
            style: {}
          },
          // {
          //   type: "image",
          //   url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code.jpg"),
          //   style: {
          //     position: 'absolute',
					// 		top: '7.6rem',
					// 		left: '3.12rem',
					// 		width: '1.2rem',
					// 		border: '0.05rem solid #fff',
          //   }
          // },
          {
            type: "text",
            text: this.name,
            style: {
              position: "absolute",
              top: "1.6rem",
							left: "0.1rem",
							display: 'block',
							width: '2rem',
              textAlign: 'right',
              fontWeight: 400,
              fontSize: "0.34rem"
            }
          },
          {
            type: "text",
            text: '长按识二维码',
            style: {
              position: "absolute",
							top: "8.86rem",
							width: '3rem',
							left: "2.2rem",
							display: 'block',
							fontWeight: 400,
							textAlign: 'center',
              fontSize: "0.24rem"
            }
          },
          {
            type: "text",
            text: '测你单身的原因',
            style: {
              position: "absolute",
							top: "9.16rem",
							width: '3rem',
							left: "2.2rem",
							display: 'block',
							fontWeight: 400,
							textAlign: 'center',
              fontSize: "0.24rem"
            }
          },
          {
            type: "text",
            text: '单身的原因是',
            style: {
              position: "absolute",
              top: "1.48rem",
              left: "2.16rem",
              fontWeight: 400,
              fontSize: "0.5rem"
            }
          }
				];

				imgDate = {
					type: "image",
					url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code.jpg"),
					style: {
						position: 'absolute',
						zIndex: 999,
						top: '7.6rem',
						left: '3.12rem',
						width: '1.2rem',
						border: '0.05rem solid #fff',
					}
				}
				if(this.isWxMini){
					if(+this.sharebutton){
						elements.push(imgDate)
					}
				}else{
					elements.push(imgDate)
				}

				break;
      case 10004:
				h = Math.floor(Math.random() * 16) + 1;
        elements = [
          {
            type: "image",
            url: this.getResultUrl(
              this.questionId,
              `${this.gender}-${Math.floor((+this.integral - 1)/2)}.jpg`
            ),
            style: {}
          },
          {
            type: "image",
            url: this.avatarUrl || this.getResultUrl(this.questionId, `${h}.png`),
            style: {
							position: "absolute",
							zIndex: 999,
              top: `5.54rem`,
              width: "2.4rem",
              height: "2.4rem",
							left: "2.54rem",
							borderRadius: "50%",
							border: `0.1rem solid #fff`
            }
          },
          // {
          //   type: "image",
          //   url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code.jpg"),
          //   style: {
          //     position: "absolute",
          //     top: "10.05rem",
          //     left: "0.2rem",
          //     width: "1rem"
          //   }
          // },
          {
            type: "text",
            text: this.name,
            style: {
              position: "absolute",
              top: "0.9rem",
							left: "0.8rem",
							display: 'block',
							width: '3rem',
              textAlign: 'right',
              fontWeight: 400,
              fontSize: "0.34rem"
            }
          },
          {
            type: "text",
            text: '长按识二维码',
            style: {
              position: "absolute",
              top: "10.1rem",
              left: "1.3rem",
              fontWeight: 400,
              fontSize: "0.24rem"
            }
          },
          {
            type: "text",
            text: '测你的TA是什么动物系',
            style: {
              position: "absolute",
              top: "10.6rem",
              left: "1.3rem",
              fontWeight: 400,
              fontSize: "0.24rem"
            }
          },
          {
            type: "text",
            text: '的TA是',
            style: {
              position: "absolute",
              top: "0.84rem",
              left: "4rem",
              fontWeight: 700,
              fontSize: "0.4rem"
            }
          }
				];

				imgDate = {
					type: "image",
					url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code.jpg"),
					style: {
						position: "absolute",
						zIndex: 999,
						top: "10.05rem",
						left: "0.2rem",
						width: "1rem"
					}
				}
				if(this.isWxMini){
					if(+this.sharebutton){
						elements.push(imgDate)
					}
				}else{
					elements.push(imgDate)
				}

				break;
      case 10005:
				h = Math.floor(Math.random() * 10) + 1;
        elements = [
          {
            type: "image",
            url: this.getResultUrl(
              this.questionId,
              `${this.gender}-${Math.floor((+this.integral - 1)/2)}.png`
            ),
            style: {}
          },
          {
            type: "image",
            url: this.avatarUrl || this.getResultUrl(this.questionId, `h-${h}.png`),
            style: {
							position: "absolute",
							zIndex: 999,
              top: `1.5rem`,
              width: "1.6rem",
              height: "1.6rem",
							left: "5.65rem",
							border: `0.1rem solid #fff`
            }
          },
          // {
          //   type: "image",
          //   url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code-2.jpg"),
          //   style: {
          //     position: "absolute",
          //     top: "9.66rem",
          //     left: "6.3rem",
          //     width: "0.95rem"
          //   }
          // },
          {
            type: "text",
            text: this.name,
            style: {
              position: "absolute",
              top: "9.68rem",
              left: "2.6rem",
              fontWeight: 400,
              fontSize: "0.34rem"
            }
          }
				];

				imgDate = {
					type: "image",
					url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code-2.jpg"),
					style: {
						position: "absolute",
						zIndex: 999,
						top: "9.66rem",
						left: "6.3rem",
						width: "0.95rem"
					}
				}
				if(this.isWxMini){
					if(+this.sharebutton){
						elements.push(imgDate)
					}
				}else{
					elements.push(imgDate)
				}

				break;
			case 10006:
				h = Math.floor(Math.random() * 6) + 1;
        elements = [
          {
            type: "image",
            url: this.getResultUrl(
              this.questionId,
              `${this.integral - 2}.png`
            ),
            style: {}
          },
          // {
          //   type: "image",
          //   url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code.jpg"),
          //   style: {
          //     position: "absolute",
          //     top: "10.72rem",
          //     left: "0.4rem",
          //     width: "1.3rem"
          //   }
					// },
					{
            type: "image",
            url: this.avatarUrl || this.getResultUrl(this.questionId, `h-${h}.png`),
            style: {
							position: "absolute",
							zIndex: 999,
              top: `0.4rem`,
              width: "1.3rem",
              height: "1.3rem",
							left: "0.68rem",
							border: `0.1rem solid #fff`,
							borderRadius: '50%',
            }
          },
          {
            type: "text",
            text: this.name,
            style: {
              position: "absolute",
              top: "1.22rem",
              left: "2.2rem",
              fontWeight: 400,
              color: '#fff',
              fontSize: "0.34rem"
            }
          }
				];

				imgDate = {
					type: "image",
					url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code.jpg"),
					style: {
						position: "absolute",
						zIndex: 999,
						top: "10.72rem",
						left: "0.4rem",
						width: "1.3rem"
					}
				}
				if(this.isWxMini){
					if(+this.sharebutton){
						elements.push(imgDate)
					}
				}else{
					elements.push(imgDate)
				}

				break;
			case 10007:
        elements = [
          {
            type: "image",
            url: this.getResultUrl(
              this.questionId,
              `${this.integral - 2}.png`
            ),
            style: {}
          },
          // {
          //   type: "image",
          //   url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code-2.jpg"),
          //   style: {
          //     position: "absolute",
          //     top: "10.26rem",
          //     left: "1.32rem",
          //     width: "1.15rem"
          //   }
					// },
          {
            type: "text",
            text: this.name,
            style: {
              position: "absolute",
              top: "1.84rem",
              left: "50%",
              fontWeight: 500,
              color: '#000',
							fontSize: "0.5rem",
							transform: 'translate(-50%)'
            }
          }
				];

				imgDate = {
					type: "image",
					url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code-2.jpg"),
					style: {
						position: "absolute",
						zIndex: 999,
						top: "10.26rem",
						left: "1.32rem",
						width: "1.15rem"
					}
				}
				if(this.isWxMini){
					if(+this.sharebutton){
						elements.push(imgDate)
					}
				}else{
					elements.push(imgDate)
				}

				break;
			case 10008:
				h = Math.floor(Math.random() * 8) + 1;
        elements = [
          {
            type: "image",
            url: this.getResultUrl(
              this.questionId,
              `${this.gender}-${Math.floor((+this.integral - 1)/2)}.png`
            ),
            style: {}
          },
          {
            type: "image",
            url: this.avatarUrl || this.getResultUrl(this.questionId, `h-${h}.png`),
            style: {
							position: "absolute",
							zIndex: 999,
              top: `3.1rem`,
              width: "1.12rem",
              height: "1.12rem",
							left: "5.4rem",
            }
          },
          // {
          //   type: "image",
          //   url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code.jpg"),
          //   style: {
          //     position: "absolute",
          //     top: "9.9rem",
          //     left: "0.3rem",
          //     width: "1.1rem"
          //   }
          // },
          {
            type: "text",
            text: this.name,
            style: {
              position: "absolute",
              top: "2.4rem",
							left: "2.2rem",
							color: '#000',
              fontWeight: 400,
              fontSize: "0.34rem"
            }
          },
          {
            type: "text",
            text: '长按识别二维码',
            style: {
              position: "absolute",
              top: "10rem",
							left: "1.6rem",
							color: '#fff',
              fontWeight: 400,
              fontSize: "0.28rem"
            }
          },
          {
            type: "text",
            text: '查看你的印象成绩单',
            style: {
              position: "absolute",
              top: "10.5rem",
							left: "1.6rem",
							color: '#fff',
              fontWeight: 400,
              fontSize: "0.28rem"
            }
          },
				];

				imgDate = {
					type: "image",
					url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code.jpg"),
					style: {
						position: "absolute",
						zIndex: 999,
						top: "9.9rem",
						left: "0.3rem",
						width: "1.1rem"
					}
				}
				if(this.isWxMini){
					if(+this.sharebutton){
						elements.push(imgDate)
					}
				}else{
					elements.push(imgDate)
				}

        break;
			case 10009:
				h = Math.floor(Math.random() * 8) + 1;
        elements = [
          {
            type: "image",
            url: this.getResultUrl(
              this.questionId,
              `${this.integral - 2}.jpg`
            ),
            style: {}
          },
          {
            type: "image",
            url: this.avatarUrl || this.getResultUrl(this.questionId, `h-${h}.png`),
            style: {
							position: "absolute",
							zIndex: 999,
              top: `1.95rem`,
              width: "0.75rem",
              height: "0.75rem",
							left: "6.4rem",
            }
          },
          // {
          //   type: "image",
          //   url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code.jpg"),
          //   style: {
					// 		position: "absolute",
					// 		zIndex: 999,
          //     top: "8.75rem",
          //     left: "0.3rem",
					// 		width: "1.25rem",
					// 		height: "1.25rem",
          //   }
          // },
          {
            type: "text",
            text: this.name,
            style: {
              position: "absolute",
              top: "2.1rem",
							left: "1.8rem",
							color: '#000',
              fontWeight: 400,
              fontSize: "0.36rem"
            }
          },
				];

				imgDate = {
					type: "image",
					url: this.isWxMini ? codeUrl : this.getResultUrl(this.questionId, "code.jpg"),
					style: {
						position: "absolute",
						zIndex: 999,
						top: "8.75rem",
						left: "0.3rem",
						width: "1.25rem"
					}
				}

				if(this.isWxMini){
					if(+this.sharebutton){
						elements.push(imgDate)
					}
				}else{
					elements.push(imgDate)
				}
        break;
		}
		this.elements = elements
	}

  created() {
    this.homeStat(202, -3);
    this.questionId = this.$route.query.questionId;
    this.questionType = this.$route.query.questionType;
		this.integral = this.$route.query.integral;

		this.isWxMini = this.userInfo.isWxMini;

    this.name = this.$route.query.name || this.userInfo.nickName || '';
    this.gender = this.$route.query.gender || this.userInfo.gender || 1;
    this.avatarUrl = this.userInfo.avatarUrl;
		this.sharebutton = !!+this.userInfo.sharebutton;

    this.details = this.bannerList.find(
      item => item.questionId == this.questionId
		);

		this.initImg().then(() => {

			this.shareSubject.subscribe(() => {
				this.updateAppMessageShareData({
					title: this.details.questionTitle,
					desc: this.details.questionDesc,
					link: `${location.origin}/test?questionId=${this.details.questionId}&questionType=2&share=1`,
					imgUrl: `${location.origin}/${this.details.questionShare}`
				});
			});

		})
  }

  destroyed() {}
}
</script>
<style lang="less" scoped>
.jiazai{
	position: absolute;
	z-index: 999;
	background: url('../assets/img/jiazai.gif') no-repeat center;
	top: 0;
  bottom: 0;
  left: 0;
	right: 0;
	background-size: 0.6rem;
}

.jieguo-tips {
  text-align: center;
  height: 0.7rem;
  line-height: 0.7rem;
  font-size: 0.34rem;
  border-radius: 0.2rem;
  border: 1px solid hsla(0, 0%, 100%, 0.8);
  margin: 0.4rem 0.25rem 0 0.25rem;
  color: #fff;
	padding: 0 1rem;
	width: calc(100% - 0.5rem);
}

.jieguo-box-2{
	transition: transform 0.2s ease;
	transition-delay: 200ms;
	transform: scale(1);
	&.active2{
		transform: scale(0.9);
	}
}

.jieguo-img {
	width: 100vw;
	min-height: 50vh;
	position: relative;
	overflow: auto;
  img {
    max-width: 100%;
    display: block;
	}
}

.jieguo-box {
	position: absolute;
	min-width: 100%;
	min-height: 100%;
	display: none;
  top: 0;
  // bottom: 0;
  // left: 0;
  // right: 0;
  background: rgba(0, 0, 0, 0.6);
  overflow-y: auto;
	&.active{
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
}
</style>

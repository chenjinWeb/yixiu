<template>
  <tab-modal>
    <tab-scroll>
      <div class="banner">
        <img class="banner-img" :src="details.questionPic2 || details.questionPic" />
        <img v-if="!isWxMini" @click="black()" class="banner-black" src="../assets/img/icon-left-black.png" alt />
      </div>

      <p class="item-1">{{details.questionTitle}}</p>
      <p class="item-2">{{details.questionCount || 0}}个问题认识真实的自己</p>
      <div class="item-3">
        <p class="item-3-1">
          <span>{{details.visitNum || 0}}</span>人已测
        </p>
      </div>
      <div class="test-info">
        <p class="test-info-p">{{details.questionDesc}}</p>
      </div>

      <div class="start-btn-box">
				<div class="start-btn-bg-1" @click="dati()">
					<div class="start-btn-bg-2">
						<!--  v-ripple -->
            <p class="btn-text" :class="{'active': isStart}">开始测试</p>
          </div>
				</div>
				<!-- <router-link class="start-btn-bg-1" :to="{name: 'dati', query:{questionId: questionId, questionType: questionType}}">
					<div class="start-btn-bg-2" v-ripple>
            <p class="btn-text">开始测试</p>
          </div>
				</router-link> -->
      </div>
    </tab-scroll>

		<div class="name-box-mask" v-if="nameBo">
      <div class="box-mask"></div>
      <div class="name-box">
				<div class="form-ctrl">
					<label class="form-label">性名</label>
					<input type="text" v-model="name" data-name="userName" class="form-input" placeholder="请输入您的名字">
				</div>
				<div class="btns">
					<div class="name-btn" @click="nameBo = false">取消</div>
					<div class="name-btn" @click="goJieguo">确定</div>
				</div>
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
  Provide
} from "vue-property-decorator";
import {
  State,
  Getter,
  Action,
  Mutation,
  namespace
} from 'vuex-class'
import MixinUtil from "../core/mixins";
import { homeBegin } from '../service/home';
import { BehaviorSubject } from '../core/util';

@Component({
  components: {}
})
export default class Test extends Mixins(MixinUtil) {
  mounted() {}

	@Provide() questionId!:any
	@Provide() questionType!:any
	@Provide() name:any = ''
	@Provide() nameBo:any = false
	@Provide() details:any = {}
	@Provide() isStart:any = false;

	@State bannerList!: any[]
	@Mutation setUserInfo!: Function;

	@Provide() shareSubject:BehaviorSubject = new BehaviorSubject()

  created() {

		this.questionId = this.$route.query.questionId;
		this.questionType = this.$route.query.questionType || 1;
		this.isWxMini = this.$route.query.isWxMini;

		switch(+this.questionType){
			case 1:
			case 2:
				if(this.questionId){
					homeBegin({questionId:this.questionId}).then(res => {
						if(res.code == 200){
							this.details = res.data.details

							this.shareSubject.subscribe(()=> {
								this.updateAppMessageShareData({
									title: this.details.questionTitle,
									desc: this.details.questionDesc,
									link: `${location.origin}/test?questionId=${this.details.questionId}&share=1`,
									imgUrl: `${location.origin}/type/wx-share-${this.details.questionCategory}.png`,
								})
							})

						}
					})
				}
				break;
			case 3:
				this.details = this.bannerList.find(item => item.questionId == this.questionId)
				this.shareSubject.subscribe(()=> {
					this.updateAppMessageShareData({
						title: this.details.questionTitle,
						desc: this.details.questionDesc,
						link: `${location.origin}/test?questionId=${this.details.questionId}&questionType=2&share=1`,
						imgUrl: `${location.origin}/${this.details.questionPic}`,
					})
				})
        break;
		}
	}

	wxLoad(){
		console.info('ok')
		this.isStart = true;
		this.shareSubject.next()
		this.isWxMini = this.$route.query.isWxMini;
		if(this.isWxMini){
			console.info(this.$route.query)
			this.setUserInfo(this.$route.query)
		}
	}

	dati(){
		if(!this.questionId) return;
		if(!this.isStart) return;
		if(this.details.noQuestion && this.details.useName){
			this.$router.push({name: 'ai', query:{questionId:this.questionId,questionType: this.questionType}})
			return;
		}
		this.$router.push({name: 'dati', query:{questionId:this.questionId,questionType: this.questionType}})
	}

	goJieguo(){
		if(!this.name) return;
		this.$router.push({
			name: "jieguoz",
			query: {
				integral: `${Math.floor(Math.random()* (this.details.resultNum || 1) ) + 1 + 2}`,
				questionId: this.questionId,
				questionType: this.questionType,
				name: this.name,
			}
		});
	}

	goJieguo2(){
		this.$router.push({
			name: "jieguoz",
			query: {
				integral: `${Math.floor(Math.random()* (this.details.resultNum || 1) ) + 1 + 2}`,
				questionId: this.questionId,
				questionType: this.questionType,
			}
		});
	}

  destroyed() {}
}
</script>
<style lang="less" scoped>
.start-btn-bg-2 {
  width: 2.47rem;
  height: 2.47rem;
  background: url("../assets/img/test-yuan.png") no-repeat center;
  background-size: 2.14rem 2.14rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
	align-items: center;
	overflow: hidden;
	position: relative;
	pointer-events: all;
  .btn-text {
    color: #cbcbcb;
    font-size: 0.42rem;
    font-weight: 500;
    width: 0.84rem;
		text-align: center;
		&.active{
			color: #f7f7f7;
		}
  }
}
.start-btn-bg-1 {
  width: 2.47rem;
  height: 2.47rem;
  background-color: #e3eaf3;
  border-radius: 50%;
  display: flex;
  justify-content: center;
	align-items: center;
	pointer-events: none;
}
.start-btn-box {
  margin: 0.4rem;
  display: flex;
  justify-content: center;
}
.item-1 {
  color: #1f1f1f;
  font-size: 0.5rem;
  font-weight: 700;
  text-align: center;
	margin-top: 0.55rem;
	padding: 0 0.3rem;
}
.item-2 {
  color: #666666;
  font-size: 0.28rem;
  font-weight: 500;
  text-align: center;
  margin-top: 0.15rem;
}
.item-3 {
  display: flex;
  justify-content: center;
  margin: 0.3rem 0 0.5rem 0;
  .item-3-1 {
    border-radius: 0.27rem;
    background-color: #e4ebf7;
    display: inline-block;
    padding: 0 0.2rem;
    span {
      color: #196eff;
      font-size: 0.35rem;
      font-weight: 700;
    }
    color: #000000;
    font-size: 0.25rem;
    font-weight: 500;
  }
}

.test-info {
  width: 6.9rem;
  border-radius: 0.2rem;
  background-color: #ffffff;
  padding: 0.4rem 0.6rem;
  margin: 0 auto;

  color: #1f1f1f;
  font-size: 0.3rem;
  font-weight: 500;
  line-height: 1.5;
  text-indent: 0.6rem;
	text-align: justify;
	.test-info-p{

		overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space:pre-wrap;
    box-sizing: border-box;
    flex-direction: column;
    align-content: flex-start;
    flex-shrink:0;
    text-align: left;
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
}


////////////////////

.name-box-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  .box-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.72);
  }
  .name-box {
    position: relative;
    z-index: 1;
    width: 90vw;
    background:#fff;
    padding: 0.4rem 0.4rem;
    border-radius: 0.15rem;
    text-align: center;
  }
  .name-input {
    border-bottom: 0.02rem solid #ccc;
    height: 0.7rem;
    input {
      height: 100%;
      width: 100%;
      text-align: center;
    }
    font-size: 0.28rem;
	}
	.btns{
		display: flex;
		justify-content: flex-end;
	}
  .name-btn {
    margin: 0.3rem 0.6rem 0 0.6rem;
    height: 0.6rem;
    line-height: 0.6rem;
    display: inline-block;
    // width: 1.2rem;
    text-align: center;
  }
}

//////////////
</style>

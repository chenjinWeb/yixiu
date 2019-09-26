<template>
  <tab-modal>
    <tab-scroll>
      <div class="cesuan-box">
        <div class="input-box">
          <input class="cesuan-name" v-model="name" placeholder="请输入你的姓名" :disabled="animationData" />
        </div>
        <div class="start-btn-box">
          <div class="start-btn-bg-1" @click="exportAnimation">
            <div class="start-btn-bg-2">
              <p class="btn-text">{{btnText}}</p>
            </div>
            <div class="btn-animation" :class="{'active': animationData}"></div>
            <div class="btn-animation" :class="{'active2': animationData}"></div>
          </div>
        </div>
        <p v-if="animationData" class="cesuan-text">AI分析结果中，请稍后...</p>
      </div>
    </tab-scroll>

		<div v-if="toast" class="toast">{{toast}}</div>

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
import { State } from "vuex-class";

@Component({
  components: {}
})
export default class Guan extends Mixins(MixinUtil) {
  name = "";
  btnText = "AI人工智能测算"; // 结果分析中，稍后 //
  animationData = false;

  @Provide() toast: any = '';
  @Provide() questionId!: any;
  @Provide() questionType!: any;
  @Provide() setTimeoutNum!: any;
  @Provide() details: any = {};

  @State bannerList!: any[];

  mounted() {}
  created() {
    this.questionId = this.$route.query.questionId;
    this.questionType = this.$route.query.questionType || 1;
    this.details = this.bannerList.find(
      item => item.questionId == this.questionId
    );
	}

  destroyed() {
		clearTimeout(this.setTimeoutNum)
	}

  exportAnimation() {
    if (!/^[\u4e00-\u9fa5]+$/.test(this.name)) {
			this.toast = '请输入正确的姓名'
			setTimeout(()=> {
				this.toast = ''
			}, 2000)
      return;
    }
    if (this.animationData) return;
    this.btnText = "分析中...";
    this.animationData = true;
    this.setTimeoutNum = setTimeout(() => {
      this.$router.push({
        name: "jieguoz",
        query: {
					integral: `${Math.floor(Math.random() * (this.details.resultNum || 1)) + 1 + 2}`,
					questionId: this.questionId,
					questionType: this.questionType,
					name: this.name
				}
      });
    }, 3000);
  }
}
</script>
<style lang="less" scoped>
.input-box {
  height: 0.66rem;
  border-radius: 0.33rem;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  display: flex;
  width: 6rem;
  margin: 0 auto;
}

.cesuan-text {
  font-size: 0.32rem;
  color: #ccc;
  text-align: center;
  padding-top: 0.3rem;
}

.start-btn-box {
  margin: 0.4rem;
  display: flex;
  justify-content: center;
}

.btn-animation {
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  bottom: 0.15rem;
  right: 0.15rem;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
  border-radius: 50%;
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
  position: relative;
}

.start-btn-bg-2 {
  width: 2.47rem;
  height: 2.47rem;
  background: url("https://h5.yxxl.net.cn/static/img/test-yuan.png") no-repeat
    center;
  background-size: 2.14rem 2.14rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  pointer-events: all;
  z-index: 2;

  .btn-text {
    color: #f7f7f7;
    font-size: 0.36rem;
    font-weight: 500;
    width: 1.7rem;
    text-align: center;
    line-height: 1.5;
  }
}

.cesuan-name {
  text-align: center;
  background: transparent;
  width: 100%;
  height: 100%;
  font-size: 0.32rem;
}

.cesuan-box {
  display: flex;
  flex-direction: column;
  margin-top: 5rem;
}

.btn-animation.active {
  animation: a 2000ms ease;
  animation-iteration-count: infinite;
  animation-delay: 0;
}

.btn-animation.active2 {
  animation: a 2000ms ease;
  animation-iteration-count: infinite;
  animation-delay: 1000ms;
}

@keyframes a {
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(1.5);
    opacity: 0;
  }
}

.toast {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 6px 10px;
		font-size: 16px;
		max-width: 80%;
		border-radius: 5px;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		z-index: 999;
		opacity: 1;
		transition: all 0.2s ease;
		display: block;
}
.toast.active{
		opacity: 1;
}

</style>

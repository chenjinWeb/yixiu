<template>
  <tab-modal>
    <tab-scroll>
      <div class="header">
        <img @click="black()" class="header-icon-left" src="../assets/img/icon-left.png" />
        <p class="header-title">关注</p>
        <i></i>
      </div>

      <div class="yixiu-code">
        <img src="../assets/img/yixiu-code.png" alt />
      </div>

      <p class="yixiu-code-text">长按识别二维码 获取更多测试</p>

			<div class="close-box">
				<img class="close" src="../assets/img/close.png" @click="back">
			</div>
    </tab-scroll>
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
import { getLocalStorage, BehaviorSubject } from "../core/util";
import { STORAGE_QUESTION } from "../core/config";
import { homeResult, homeShare, homeHot } from "../service/home";
import { State } from "vuex-class";

@Component({
  components: {}
})
export default class Guan extends Mixins(MixinUtil) {

	back(){
		this.$router.back()
	}

  mounted() {}
  created() {}
  destroyed() {}
}
</script>
<style lang="less" scoped>
.close-box{
	display: flex;
	justify-content: center;
	width: 0.6rem;
	height: 0.6rem;
	margin: 0 auto;
	.close{
		width: 100%;
	}
}

.yixiu-code-text {
  text-align: center;
  padding: 0.6rem;
  font-size: 0.26rem;
  color: #3a3a3a;
}
.yixiu-code {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 56vw;
  margin: 1rem auto 0 auto;
  img {
    max-width: 100%;
    max-height: 100%;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 1.1rem;
  .header-icon-left {
    width: 0.19rem;
    height: 0.38rem;
    margin: 0.15rem 0.3rem;
  }
  .header-title {
    color: #1f1f1f;
    font-size: 0.42rem;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  i {
    display: block;
    width: 0.19rem;
    height: 0.38rem;
    margin: 0.15rem 0.3rem;
  }
}
</style>

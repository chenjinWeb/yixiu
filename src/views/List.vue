<template>
  <tab-modal>
    <tab-scroll :registerScroll="true" @pullDown="pullDown()" @pullUp="pullUp()" :finished="scrollFinish">
      <div class="header">
        <img @click="black()" class="header-icon-left" src="../assets/img/icon-left.png" />
        <p class="header-title">{{this.title}}</p>
        <i></i>
      </div>
      <div class="container">
        <template v-for="(item,index) in list">
          <router-link class="product-card-link" :key="index" :to="{name: 'test', query:{questionId: item.questionId}}">

            <div class="product-card">
              <div class="product-text">
                <p>{{item.questionTitle}}</p>
                <p>{{item.questionDesc}}</p>
                <p>{{item.questionCount}}个问题</p>
              </div>
              <div class="product-img">
                <img :src="item.questionPic" alt />
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
  Provide
} from "vue-property-decorator";
import MixinUtil from "../core/mixins";
import { homeList, homeSearch } from '../service/home';

@Component({
  components: {}
})
export default class List extends Mixins(MixinUtil) {

	@Provide() list:any[] = []
	@Provide() questionTitle!: any
	@Provide() categoryName!: any
	@Provide() categoryId!:any

	@Provide() query:any = {
		page:1,
		limit:10
	}

	scrollFinish = false;
// ？？？？？？？
	get title(){
		return this.categoryName || this.questionTitle
	}

  mounted() {

  }

  created() {
		this.categoryName = this.$route.query.categoryName
		this.categoryId = this.$route.query.categoryId
		this.questionTitle = this.$route.query.questionTitle
		if(this.categoryId){
			this.query.questionCategory = this.categoryId
			this.initData()
		}
		if(this.questionTitle){
			this.query.questionTitle = this.questionTitle
			homeSearch(this.query).then(res => {
				if(res.code == 200){
					this.list = res.data
				}
			})
		}
	}

	initData(){
		this.query.page = 1;
		homeList(this.query).then(res => {
			if(res.code == 200){
				this.list = res.data
				++this.query.page
			}
		})
	}

	pullDown(){
		this.initData()
	}

	pullUp(){
		this.scrollFinish = false;
		homeList(this.query).then(res => {
			if(res.code == 200){
				if(res.data.length){
					this.list.push(...res.data)
					++this.query.page
				}else{
					this.scrollFinish = true;
				}
			}
		})
	}

  destroyed() {}
}
</script>

<style lang="less" scoped>
.product-bg-1 {
  height: 2.88rem;
  width: 6.9rem;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.5;
  background: linear-gradient(to bottom, #000000, #00000000);
}
.product-bg-2 {
  height: 2.88rem;
  width: 6.9rem;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000;
  opacity: 0.2;
}
.product-card-link{
	margin-bottom: 0.32rem;
	display: block;
	pointer-events: none;
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
	i{
		display: block;
		width: 0.19rem;
    height: 0.38rem;
    margin: 0.15rem 0.3rem;
	}
}
.container {
  padding: 0 0.3rem;
}
.product-bottom-text p:nth-child(1){
  font-size: 0.20rem;
}
.product-bottom-text p:nth-child(1) span{
  font-size: 0.28rem;
}
</style>

<template>
  <tab-modal>
    <tab-scroll :registerScroll="true" @pullDown="pullDown()" @pullUp="pullUp()" :finished="scrollFinish">
      <div class="container">
        <div class="search-box">
          <h1>一休心理</h1>
          <router-link :to="{name: 'search'}">
            <div class="item-search">
              <img class="icon-search" src="../assets/img/icon-search.png" alt />
              <p class="text-search">你想测什么</p>
            </div>
          </router-link>
        </div>
      </div>
			<preview-img class="banner-box" :tips="true">
				<div class="banner-img" v-for="(item,index) in bannerList" :key="index" @click.stop="goTest(item);homeStat(101,-2)">
					<!-- <img src="../assets/img/banner-1.png" alt=""> -->
					<!-- <p class="banner-title">距离摆脱单身还差多久？</p>  -->
					<img :src="item.questionPic" :alt="item.questionTitle" />
					<!-- <p class="banner-title">{{item.questionTitle}}</p> -->
					<div class="banner-dise"></div>
				</div>
			</preview-img>

			<div class="container">
        <div class="classification">
          <div class="item-type" v-ripple v-for="(item,index) in categoryList" :key="index" @click="goNavList(item);homeStat(index+1)">
            <img :src="item.logoUrl" alt />
            <p>{{item.categoryName}}</p>
          </div>
        </div>

        <div class="l-r-box" v-if="recommendList.length">
          <h2 class="title">每日推荐</h2>
          <p class="gun-number">
            <span class="active">{{tuijian_index}}</span>/
            <span>3</span>
          </p>
        </div>
      </div>

      <!-- 产品 -->
      <preview-img class="product-list" @change="previewChange" v-if="recommendList.length" >

				<div class="product-border" v-for="(item,index) in recommendList" :key="index" @click.stop="goTest2(item);homeStat(102, item.questionId)">
          <div class="product-box" >
            <div class="item-top">
              <div class="item-img">
                <img :src="item.questionPic" alt />
              </div>
              <div class="item-title">
                <p class="yi">{{item.questionTitle}}</p>
                <p>{{item.questionDesc}}</p>
              </div>
            </div>
            <div class="item-bottom">
              <p class="ceshi-number">
                <span>{{item.visitNum}}</span>人已测
              </p>
              <div v-ripple class="ceshi-btn text-align-center">去测</div>
            </div>
          </div>
        </div>

      </preview-img>

      <div class="container">
        <div class="l-r-box">
          <h2 class="title">精选热门</h2>
          <!-- <router-link class="gengguo-img" :to="{name: 'list'}">
            <span>更多</span>
            <img src="../assets/img/icon-xiangyou.png" alt />
          </router-link> -->
        </div>

        <!-- 精选热门 产品 -->
        <div class="product-hot-list">

          <template v-for="(item,index) in hotList">
            <!-- @click.stop="goTest(item);homeStat(103, item.questionId)" -->
            <!-- <router-link class="product-card-link" :key="index" :to="{name: 'test', query:{questionId: item.questionId}}"> -->
              <div class="product-card" :key="index" @click.stop="goTest(item);homeStat(103, item.questionId)">
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
            <!-- </router-link> -->
          </template>

        </div>

      </div>


    </tab-scroll>

		<div class="guildbg" v-if="guildBgShow">
			<div class="guild" v-if="guildShow">
						<!-- @click="qrcode" -->
					<img src="../assets/img/guide.png" alt="" @click="guildShow = !guildShow">
					<div class="close" @click="guildBgShowFun">x</div>
			</div>
			<div class="code" v-if="!guildShow">
				<img src="../assets/img/yixiu-code.png" alt="">
				<p>识别上方二维码 获取更多免费测试</p>
				<div class="close" @click="guildBgShowFun">x</div>
			</div>
		</div>

		<div v-drag class="guild-yunduo" v-if="guildYunduoShow" @click="guildYunduoShowFun">

			<div class="close-box">
				<img src="../assets/img/close.png" @click.stop="guildYunduoShowFun">
			</div>

			<router-link :to="{path: '/guan'}">
				<img src="../assets/img/yunduo-yixiu.png" alt="">
			</router-link>
		</div>

		<!-- <transition-nav-open-close>
			<router-view />
		</transition-nav-open-close> -->

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
import {homeInit, homeHot} from '../service/home';
import { shareBehaviorSubject} from '../core/util';

@Component({
	components: {}
})
export default class Home extends Mixins(MixinUtil) {

	@Provide() tuijian_index: any = 1;
	@Provide() categoryList:any[] = [];
	@Provide() hotList:any[] = [];
	@Provide() recommendList:any[] = [];
	query = {
		page:2,
		limit: 5
	}

	@State bannerList!: any[]
	scrollFinish = false;
	guildShow = true;
	guildBgShow = false;
	guildYunduoShow = true;

  mounted() {
		// this.guildBgShow = !!+(window.sessionStorage.getItem('guildBgShow') || 1)
		this.guildYunduoShow = !!+(window.sessionStorage.getItem('guildYunduoShow') || 1)
	}

  created() {
		this.homeStat(201);
		homeInit().then(res => {
			if(res.code == 200){
				this.categoryList = res.data.categoryList
				this.hotList = res.data.hotList
				this.recommendList = res.data.recommendList
			}
    })

    let self=this
	}

  destroyed() {}

  previewChange(index: any) {
    this.tuijian_index = index + 1;
	}

	goNavList(item:any){
		this.$router.push({name: 'list', query:{categoryName: item.categoryName, categoryId: item.categoryId}})
	}

	pullDown(){

	}

	pullUp(){
		this.scrollFinish= false;
		homeHot(this.query).then(res => {
			if(res.code == 200){
				if(res.data.length){
          this.hotList.push(...res.data)
					++this.query.page
				}else{
					this.scrollFinish= true;
				}
			}
		})
	}

	guildBgShowFun(){
		this.guildBgShow = !this.guildBgShow
		window.sessionStorage.setItem('guildBgShow', '0')
	}

	guildYunduoShowFun(){
		this.guildYunduoShow = !this.guildYunduoShow
		window.sessionStorage.setItem('guildYunduoShow', '0')

	}

}
</script>

<style lang="less" scoped>

.guild-yunduo{
	position: fixed;
	z-index: 98;
	top: 6.36rem;
	right: 0.25rem;
	width: 1.4rem;
	img{
		width: 100%;
	}

	.close-box{
		display: flex;
		justify-content: flex-end;
		width: 0.2rem;
		height: 0.2rem;
		margin-left: auto;
	}
}

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
.product-hot-list {
	padding-bottom: 0.3rem;
  .product-card + .product-card {
    margin-top: 0.3rem;
  }
}

.product-list {
  display: flex;
  overflow: hidden;
  .product-border {
    min-width: 7.5rem;
    padding: 0 0.3rem;
  }
}

.gengguo-img {
  color: #999999;
  font-size: 0.28rem;
  img {
    width: 0.13rem;
    height: 0.25rem;
    margin-left: 0.1rem;
  }
}
.product-box {
  width: 6.9rem;
  height: 2.89rem;
  border-radius: 0.2rem;
  background-color: #ffffff;
  padding: 0.42rem 0.3rem;
  .item-top {
    display: flex;
    .item-img {
      width: 1.42rem;
      min-width: 1.42rem;
      height: 1.42rem;
			margin-right: 0.3rem;
			display: flex;
			justify-content: center;
			overflow: hidden;
			border-radius: 0.25rem;
      img {
        height: 100%;
      }
    }
    .item-title {
      width: 4.4rem;
      p:nth-child(1) {
        color: #1f1f1f;
        font-size: 0.38rem;
        font-weight: 700;
				padding-bottom: 0.3rem;
				overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      p:nth-child(2) {
        color: #666666;
        font-size: 0.24rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .item-bottom {
    margin-left: 1.72rem;
    display: flex;
    justify-content: space-between;
    line-height: 0.64rem;
    text-align: center;
    .ceshi-btn {
      width: 1.56rem;
			height: 0.64rem;
			line-height: 1;
      border-radius: 0.32rem;
      background: url(../assets/img/ceshi-btn-bg.png) no-repeat center;
			background-size: 1.56rem 0.64rem;
			position: relative;
			overflow: hidden;

      color: #f7f7f7;
      font-size: 0.28rem;
    }
    .ceshi-number {
      color: #000000;
      font-size: 0.28rem;
      width:100%;
      span {
        color: #000000;
        font-size: 0.24rem;
        font-weight: 700;
      }
    }
  }

}
.gun-number {
  color: #999999;
  font-size: 0.32rem;
  font-weight: 500;
  span.active {
    color: #1f1f1f;
    font-size: 0.42rem;
    font-weight: 700;
  }
}
.title {
  color: #1f1f1f;
  font-size: 0.42rem;
}
.l-r-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
  margin-top: 0.6rem;
}
.classification {
  width: 6.9rem;
  height: 3.65rem;
  border-radius: 0.2rem;
  background-color: #ffffff;
  margin-top: 0.3rem;
  display: flex;
  flex-wrap: wrap;
  .item-type {
    text-align: center;
    flex: 20%;
    margin: auto;
		border-radius: 0.3rem;
		position: relative;
		overflow: hidden;
    img {
      width: 0.8rem;
      height: 0.8rem;
    }
    p {
      color: #1f1f1f;
      font-size: 0.26rem;
      font-weight: 500;
    }
  }
}

.banner-box {
  height: 2.76rem;
  margin-top: 0.4rem;
  overflow: hidden;
	.banner-img{
		width: 100%;
		border-radius: 0.2rem;
		background-color: #ffffff;
		margin: 0 0.3rem;
		position: relative;
		overflow: hidden;
    display: flex;
    align-items: center;
		.banner-title{
			text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
			color: #ffffff;
			font-size: 0.38rem;
			position: absolute;
			bottom: 0;
			z-index: 1;
			padding: 0.3rem 0.4rem;
			font-weight: 700;
		}
		img{
			max-width: 100%;
		}
		.banner-dise{
			background: url('../assets/img/banner-dise-bg.png');
			height: 1.4rem;
			position: absolute;
			width: 100%;
			bottom: 0;
			left: 0;
		}
	}
}

.container {
  padding: 0 0.3rem;
}
.search-box {
  display: flex;
  align-items: center;
  margin-top: 0.45rem;
  h1 {
    color: #1f1f1f;
    font-size: 0.5rem;
		margin-right: 0.26rem;
		white-space: nowrap;
  }
  .item-search {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    width: 4.6rem;
    height: 0.66rem;
    border-radius: 0.33rem;
    justify-content: center;
  }
  .icon-search {
    width: 0.25rem;
    height: 0.25rem;
    margin-right: 0.1rem;
  }
  .text-search {
    color: #999999;
    font-size: 0.29rem;
    font-weight: 500;
  }

}

.guildbg {
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
	text-align: center;
	z-index: 99;
  img{
    width:7rem;
    margin-top:1rem;

  }
  .close{
    width: 0.5rem;
    height: 0.5rem;
    border: 1px solid #fff;
    border-radius: 50%;
		margin:.5rem auto 0;
		font-size: 0.36rem;
		line-height: 0.4rem;
		color: #fff;
		text-align: center;
  }
  .code{
    width: 6rem;
    text-align: center;
    margin:0 auto;

    img{
      width: 3rem;
    }
    p{
      width: 4rem;
      margin:.3rem auto;
      line-height: .6rem;
      border: 1px solid #fff;
      border-radius:.2rem;
      color: #fff;
    }
  }
}
</style>

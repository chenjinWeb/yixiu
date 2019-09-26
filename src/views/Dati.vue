<template>
  <tab-modal>
    <tab-scroll class="tab-scroll-bg">
      <div class="header" v-if="!isWxMini">
        <img @click="black()" class="header-back" src="../assets/img/icon-left-black.png" alt />
        <p class="header-title">{{details.questionTitle}}</p>
      </div>

      <div class="dati-box">
        <img class="dati-header-img" src="../assets/img/dati-bg.png" alt />
        <div class="dati-body" v-if="question.answers">
          <p class="timu-text">{{question.questionListDesc}}</p>
          <template v-for="(item,index) in question.answers">
            <div class="timu-select" v-ripple @click="complete(item)" :key="index">
              <!-- <span>{{sortLetter[index]}}</span> -->
              <p>{{item.answerDesc}}</p>
            </div>
          </template>
          <div class="box-center">
            <p class="timu-num">
              <span>{{question.questionListSort || answersIndex + 1}}</span>
              /{{details.questionCount}}
            </p>
          </div>
          <div
            v-if="(question.questionListSort || answersIndex + 1) != 1"
            class="timu-previous"
            v-ripple
            @click="last()"
          >上一题</div>
        </div>
      </div>
    </tab-scroll>

    <div class="name-box-mask" v-if="nameBoxShow">
      <div class="box-mask"></div>
      <div class="name-box">

				<div class="form-ctrl" v-if="details.useGender">
					<label class="form-label">性别</label>
					<div class="radio-box" data-name="gender">
						<div class="radio-radio" data-value="1" :class="{'active': sex == 1}" @click=" sex = 1 ">
							<span></span>
							<label>男</label>
						</div>
						<div class="radio-radio" data-value="0" :class="{'active': sex == 2}" @click=" sex = 2 ">
							<span></span>
							<label>女</label>
						</div>
					</div>
				</div>

				<div class="form-ctrl" v-if="details.useName">
					<label class="form-label">性名</label>
					<input type="text" v-model="name" data-name="userName" class="form-input" placeholder="请输入您的名字">
				</div>


        <!-- <div class="name-input">
          <input v-model="name" type="text" placeholder="请输入您的名字" />
        </div> -->
        <div class="name-btn" @click="goJieguo2()">点击查看结果</div>
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
import { State, Getter, Action, Mutation, namespace } from "vuex-class";
import MixinUtil from "../core/mixins";
import { homeBegin, homeNext, homeList, homeLast } from "../service/home";
import {
  setLocalStorage,
  getLocalStorage,
  BehaviorSubject
} from "../core/util";
import { STORAGE_QUESTION, STORAGE_SESSIONKEY } from "../core/config";

@Component({
  components: {}
})
export default class Dati extends Mixins(MixinUtil) {
  @Provide() questionId!: any;
  @Provide() sex: any = '1';
  @Provide() showname: any = 1;
  @Provide() questionType!: any;
  @Provide() sessionKey!: any;
  @Provide() details: any = {};
  @Provide() question: any = {};
  @Provide() sortLetter: any = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
	];

	@State userInfo!: any;

  @State bannerList!: any[];
  @State answersIndex!: number;
  @State answersIntegral!: any[];
  @Mutation answersIndexAdd!: Function;
  @Mutation answersIndexLast!: Function;
  @Mutation answersIntegralAdd!: Function;
  @Mutation answersIntegralLast!: Function;
  @Mutation answersIntegralClear!: Function;

  nameBoxShow = false;
  name = ""; //用户昵称
  @Provide() shareSubject: BehaviorSubject = new BehaviorSubject();

  mounted() {
  }
  data() {
    return {
      nan:'',
      nv:''
    }
  }
  created() {

    this.sessionKey = getLocalStorage(STORAGE_SESSIONKEY);
    this.questionId = this.$route.query.questionId;
		this.questionType = this.$route.query.questionType || 1;
		this.isWxMini = this.userInfo.isWxMini;

    switch (+this.questionType) {
      case 1:
      case 2:
        if (this.questionId) {
          homeBegin({ questionId: this.questionId }).then(res => {
            if (res.code == 200) {
              this.details = res.data.details;
              this.question = res.data.question;
              this.sessionKey = res.data.sessionKey;
              setLocalStorage(STORAGE_SESSIONKEY, res.data.sessionKey);

              this.shareSubject.subscribe(() => {
                this.updateAppMessageShareData({
                  title: this.details.questionTitle,
                  desc: this.details.questionDesc,
                  link: `${location.origin}/test?questionId=${this.details.questionId}&share=1`,
                  imgUrl: `${location.origin}/type/wx-share-${this.details.questionCategory}.png`,
                });
              });
            }
          });
        }
        break;
      case 3:
        this.details = this.bannerList.find(
          item => item.questionId == this.questionId
        );
        this.question = this.details.question[this.answersIndex];
        this.shareSubject.subscribe(() => {
          this.updateAppMessageShareData({
            title: this.details.questionTitle,
            desc: this.details.questionDesc,
            link: `${location.origin}/test?questionId=${this.details.questionId}&questionType=2&share=1`,
            imgUrl: `${location.origin}/${this.details.questionPic}`
          });
        });
        break;
    }
  }

  wxLoad() {
    this.shareSubject.next();
  }

  goJieguo2() {
		let isReturn = true;
    switch (+this.questionId) {
      // case 10000:
      //   console.log(this.questionId);
      //   this.$router.push({
      //     name: "jieguo2",
      //     query: {
      //       integral: `${this.answersIntegral.reduce((a, b) => a + b)}`,
      //       questionId: this.questionId,
      //       questionType: this.questionType,
      //       name: this.name
      //     }
      //   });
      //   break;
      case 10001:
        console.log(this.questionId);
        //   debugger
        this.$router.push({
          name: "jieguoz",
          query: {
            integral: `${this.answersIntegral.reduce((a, b) => a + b)}`,
            questionId: this.questionId,
            questionType: this.questionType,
            name: this.name
          }
        });
        break;
      case 10002:
        this.$router.push({
          name: "jieguoz",
          query: {
            integral: `${this.answersIntegral.reduce((a, b) => a + b)}`,
            questionId: this.questionId,
            questionType: this.questionType,
            name: this.name,
          }
        });
        break;
      // case 10003:
      //   console.log(this.questionId);
      //   this.$router.push({
      //     name: "jieguo5",
      //     query: {
      //       integral: `${this.answersIntegral.reduce((a, b) => a + b)}`,
      //       questionId: this.questionId,
      //       questionType: this.questionType,
      //       name: this.name,
      //     }
      //   });
      //   break;
      case 10004:
        console.log(this.questionId);
        this.$router.push({
          name: "jieguoz",
          query: {
            integral: `${this.answersIntegral.reduce((a, b) => a + b)}`,
            questionId: this.questionId,
            questionType: this.questionType,
            name: this.name,
            sex:this.sex,
          }
        });
        break;
			case 10005:
				if(!this.name) isReturn = false;
				this.$router.push({
          name: "jieguoz",
          query: {
            integral: `${this.answersIntegral.reduce((a, b) => a + b)}`,
            questionId: this.questionId,
            questionType: this.questionType,
            name: this.name,
            gender:this.sex,
          }
        });
				break;
			case 10006:
				this.$router.push({
          name: "jieguoz",
          query: {
            integral: `${this.answersIntegral.reduce((a, b) => a + b)}`,
            questionId: this.questionId,
            questionType: this.questionType,
            name: this.name,
            gender:this.sex,
          }
        });
				break;
			case 10008:
				this.$router.push({
          name: "jieguoz",
          query: {
            integral: `${this.answersIntegral.reduce((a, b) => a + b)}`,
            questionId: this.questionId,
            questionType: this.questionType,
            name: this.name,
            gender:this.sex,
          }
        });
				break;
			case 10009:
				this.$router.push({
          name: "jieguoz",
          query: {
            integral: `${this.answersIntegral.reduce((a, b) => a + b)}`,
            questionId: this.questionId,
            questionType: this.questionType,
            name: this.name,
          }
        });
				break;
    }
    isReturn && this.answersIntegralClear();
  }

  complete(item: any) {
    switch (+this.questionType) {
      case 1:
      case 2:
        let body: any = {
          questionListId: this.question.questionListId,
          answerId: item.answerId,
          questionId: this.details.questionId,
          resultId: item.resultId,
          sessionKey: this.sessionKey
        };
        setLocalStorage(STORAGE_QUESTION, body);

        body.sessionKey = this.sessionKey;
        homeNext(body).then(res => {
          if (res.code == 200) {
            if (res.data.type == 2) {
              body.resultId = res.data.data.resultId;
              setLocalStorage(STORAGE_QUESTION, body);
              this.$router.push({ name: "jieguo", query: body });
              return;
            }
            this.question = res.data.data;
          }
        });
        break;
      case 3:
        this.answersIntegralAdd(item.integral);
        if (this.details.questionCount == this.answersIndex + 1) {
					if((this.details.useGender || this.details.useName) && !this.isWxMini){
						this.nameBoxShow = true;
						return;
					}else{
						this.goJieguo2()
						return;
					}
        }
        this.answersIndexAdd();
        this.question = this.details.question[this.answersIndex];
        break;
    }
  }
  show(){
    this.showname=2
    // this.$refs.anime.

  }
  last() {
    switch (+this.questionType) {
      case 1:
      case 2:
        let body: any = {
          questionListId: this.question.questionListId,
          questionId: this.details.questionId,
          sessionKey: this.sessionKey
        };
        homeLast(body).then(res => {
          if (res.code == 200) {
            this.question = res.data.data;
          }
        });
        break;
      case 3:
        this.answersIntegralLast();
        this.answersIndexLast();
        this.question = this.details.question[this.answersIndex];
        break;
    }
  }

  destroyed() {}
}
</script>

<style lang="less" scoped>



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
  .name-btn {
    margin-top: 0.3rem;
    height: 0.6rem;
    line-height: 0.6rem;
    display: inline-block;
    // width: 1.2rem;
    text-align: center;
  }
}





.box-center {
  display: flex;
  justify-content: center;
  margin-top: 0.4rem;
  font-size: 0.3rem;
}
.timu-previous {
  width: 1.52rem;
  height: 0.64rem;
  background-color: #ffffff;
  line-height: 0.64rem;
  border-top-left-radius: 0.32rem;
  border-bottom-left-radius: 0.32rem;
  overflow: hidden;
  position: relative;

  text-align: center;
  color: #196eff;
  font-size: 0.3rem;
  font-weight: 500;
  right: 0;
  bottom: 0.8rem;
  position: absolute;
}

.timu-select + .timu-select {
  margin-top: 0.15rem;
}

.timu-select {
  width: 100%;
  border-radius: 0.2rem;
  padding: 0.4rem 0.5rem 0.4rem 0.3rem;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  span {
    color: #1f1f1f;
    font-size: 0.42rem;
    font-weight: 700;
    margin-right: 0.2rem;
  }
  p {
    color: #1f1f1f;
    font-size: 0.34rem;
    font-weight: 500;
    line-height: 1.5;
    margin: 0 auto;
  }
}

.timu-text {
  color: #1f1f1f;
  font-size: 0.34rem;
  text-align: justify;
  font-weight: 400;
  margin: 0.25rem 0;
}

.timu-num {
  height: 0.64rem;
  padding: 0 0.32rem;
  //   background-color: #dce1e8;
  line-height: 0.64rem;
  border-radius: 0.32rem;
  color: #1f1f1f;
  font-size: 0.14rem;
  font-weight: 400;
  display: flex;
  align-items: center;
  margin-top: 0.15rem;
  span {
    font-size: 0.35rem;
    padding-left: 0.1rem;
  }
}
.dati-box {
  margin: 0 auto;
  margin-bottom: 0.3rem;
  padding-top: 0.2rem;
  width: 6.7rem;
  border-radius: 0.4rem;
  overflow: hidden;
  .dati-header-img {
    height: 1.61rem;
    position: relative;
    z-index: 1;
  }
  .dati-body {
    background-color: #e6ebf2;
    padding: 0.4rem 0.4rem 1.4rem 0.4rem;
    margin-top: -0.35rem;
    position: relative;
  }
}

.tab-scroll-bg {
  background: #124db3;
}
.header {
  height: 1.2rem;
  display: flex;
  align-items: center;
  .header-back {
    height: 0.42rem;
    margin: 0.3rem;
  }
  .header-title {
    color: #ffffff;
    font-size: 0.4rem;
    font-weight: 400;
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.sexchoice{
  margin-top:.2rem;
  span{width: 0.5rem;display: inline-block;}
  input{margin-right:.1rem}
}



.animetion{

}
</style>

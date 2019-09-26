<template>
  <tab-modal>
    <tab-scroll>
      <div class="search-box">
        <img @click="black()" class="search-nav" src="../assets/img/icon-left.png" alt />
        <label class="search-input-box">
          <img class="icon-search" src="../assets/img/icon-search.png" alt />
          <input
            v-model="questionTitle"
            type="search"
            @keydown.enter="search"
            @focus="inputFocus"
            @blur="inputBlur"
            placeholder="你想测什么"
          />
        </label>
        <button class="btn" @click="search">搜索</button>
      </div>

      <div class="container">
        <h1 class="his-title">历史搜索</h1>

        <div class="history-list">
          <template v-for="(item,index) in historyList">
            <router-link :to="{name: 'list', query:{'questionTitle': item}}" :key="index">
              <span class="item">{{item}}</span>
            </router-link>
          </template>
        </div>

        <h1 class="his-title">精选热门</h1>

        <ul class="jingxuan-list">
          <li
            class="item"
            v-for="(item, index) in jingxuanList"
            :key="index"
            :class="{'active': index < 3}"
          >
            <router-link :to="{name: 'test', query:{questionId:item.questionId}}">
              <span>{{index + 1}}</span>
              {{item.questionTitle}}
            </router-link>
          </li>
        </ul>
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
import { getLocalStorage, setLocalStorage } from "../core/util";
import { homeHot } from '../service/home';

@Component({
  components: {}
})
export default class Search extends Mixins(MixinUtil) {
  historyList:any[] = [];
  jingxuanList:any[] = [];

  questionTitle = "";

  mounted() {}

  created() {

		homeHot({page:1,limit:10}).then(res => {
			if(res.code == 200){
				this.jingxuanList = res.data
			}
		})

    let historyList = getLocalStorage("historyList");
    if (!historyList) {
      historyList = [
        "爱情",
        "性格",
        // "两性",
        // "财富",
        // "专业",
        "星座",
        // "能力",
        // "职业",
        // "趣味",
        // "综合"
      ];
      setLocalStorage("historyList", historyList);
		}
		this.historyList = historyList;
  }

  destroyed() {}

  inputFocus(event: any) {
    let ref = event.target || event.srcElement;
    ref.classList.add("active");
  }

  inputBlur(event: any) {
    let ref = event.target || event.srcElement;
    ref.classList.remove("active");
  }

  search() {
    if (!this.questionTitle) return;
    this.$router.push({
      name: "list",
      query: { questionTitle: this.questionTitle }
		});
		this.historyList.unshift(this.questionTitle)
		if(this.historyList.length > 10) this.historyList.pop()
		setLocalStorage("historyList", this.historyList);
  }
}
</script>
<style lang="less" scoped>
.jingxuan-list {
  .item {
    color: #1f1f1f;
    font-size: 0.34rem;
    font-weight: 500;
    padding: 0.35rem 0;
    &:nth-child(1) {
      padding-top: 0;
    }
    span {
      font-weight: 700;
      font-size: 0.34rem;
      color: #1f1f1f;
      padding-right: 0.24rem;
    }
    a {
      color: #1f1f1f;
    }
    &.active {
      span {
        color: #196eff;
      }
    }
  }
}
.his-title {
  color: #1f1f1f;
  font-size: 0.42rem;
  margin: 0.36rem 0;
}
.history-list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
  .item {
    height: 0.6rem;
    border-radius: 0.3rem;
    background-color: #ffffff;
    padding: 0 0.3rem;
    margin-bottom: 0.24rem;
    margin-right: 0.2rem;
    display: flex;
    align-items: center;

    color: #1f1f1f;
    font-size: 0.28rem;
    font-weight: 500;
  }
}
.search-box {
  display: flex;
  align-items: center;
  margin-top: 0.2rem;
  justify-content: space-between;
  padding-right: 0.3rem;
  .search-nav {
    width: 0.19rem;
    height: 0.38rem;
    margin: 0.1rem 0.3rem;
  }
  .search-input-box {
    width: 4.5rem;
    height: 0.7rem;
    border-radius: 0.35rem;
    border: .1rem white solid;
    background-color: #ffffff;
    display: flex;
    justify-content:center;
    align-items: center;
    .icon-search {
      width: 0.25rem;
      height: 0.25rem;
      margin-right: 0.1rem;
      margin-left: 0.35rem;
    }
    input {
      width: 3.4rem;
      height: 100%;
      color: #999999;
      font-size: 0.3rem;
      transition: all 0.15s ease;
      &.active {
        width: 5rem;
      }
    }
  }
  .btn{
    width: 1.5rem;
    border:0;
    background-color: transparent;
    outline: none;
    font-size: 0.3rem;
  }
}

.container {
  padding: 0 0.3rem;
}
</style>

<template>
  <div class="wheel-planting">
    <div ref="box" class="preview-img-box" :class="{active: animation}">
      <slot></slot>
    </div>
    <div class="planting" v-if="tips && number > 1">
      <span
        class="item"
        :class="{active: index === index2}"
        v-for="(item,index2) in number"
        :key="index2"
      ></span>
    </div>
  </div>
</template>
<script>
export default {
  name: "preview-img",
  props: {
    time: {
      type: Number,
      default: 4000
    },
    change: {
      type: Function,
      default: () => {}
		},
		tips:{
			type: Boolean,
      default: false
		}
  },
  data() {
    return {
      number: 0,
      width: 0,
      x: 0,
      index: 0,
      timerNumber: 0,
      destroyed: false,
      animation: true,
      startX: 0,
      startY: 0,
      moveX: 0,
      moveY: 0
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.init();
    this.initEvent();
  },
  methods: {
    initEvent() {
      this.$refs.box.addEventListener("touchstart", this.touchstart);
      this.$refs.box.addEventListener("touchmove", this.touchmove);
      this.$refs.box.addEventListener("touchend", this.touchend);
    },
    touchstart(event) {
      this.stop();
      this.animation = false;
      this.moveX = this.startX = (event.touches || event.targetTouches)[0].clientX;
      this.moveY = this.startY = (event.touches || event.targetTouches)[0].clientY;
    },
    touchmove(event) {
      this.moveX = (event.touches || event.targetTouches)[0].clientX;
      this.moveY = (event.touches || event.targetTouches)[0].clientY;
			let x = this.startX - this.moveX;
			let y = this.startY - this.moveY;

			if(Math.abs(this.startX - this.moveX) > 20 && Math.abs(x) > Math.abs(y)){
				this.move(x);
			}
    },
    touchend(event) {
      this.animation = true;
      let x = this.startX - this.moveX;
      if (this.width / this.number / 3 <= Math.abs(x)) {
        if (x > 0) {
          this.next();
        } else {
          this.pre();
        }
      } else {
        this.now();
      }
      this.start();
    },
    init() {
      let children = Array.from(this.$refs.box.children);
      this.number = children.length;
      children.forEach(item => {
        item.style.width = item.clientWidth + "px";
      });
      let width = (this.width = children
        .map(a => a.clientWidth)
        .reduce((a, b) => a + b));
      this.$refs.box.style.width = width + "px";
      this.$refs.box.style.display = "flex";
      if (this.number > 1) {
        this.start();
      }
    },
    start() {
      this.destroyed = false;
      this.timerNumber = setInterval(() => {
        if (this.destroyed) return;
        this.next();

      }, this.time);
    },
    stop() {
      this.destroyed = true;
      clearInterval(this.timerNumber);
    },
    pre() {
      let _x = this.width / this.number;
      --this.index;
      if (this.index < 0) this.index = this.number - 1;
			this.$refs.box.style.transform = `translateX(${-(this.index * _x)}px)`;
			this.$emit("change", this.index);
    },
    next() {
      let _x = this.width / this.number;
      ++this.index;
      if (this.index > this.number - 1) this.index = 0;
			this.$refs.box.style.transform = `translateX(${-(this.index * _x)}px)`;
			this.$emit("change", this.index);
    },
    now() {
      let _x = this.width / this.number;
      this.$refs.box.style.transform = `translateX(${-(this.index * _x)}px)`;
    },
    move(x) {
      let _x = this.width / this.number;
      this.$refs.box.style.transform = `translateX(${-(
        this.index * _x +
        x
      )}px)`;
    }
  },
  destroyed() {
    this.stop();
  }
};
</script>
<style lang="less" scoped>
.wheel-planting {
  position: relative;
}
.planting {
  position: absolute;
  display: flex;
  bottom: 0.18rem;
  right: 0.7rem;
	// transform: translateX(-50%);
  .item {
    width: 0.12rem;
    height: 0.12rem;
    display: block;
    background-color: #000000;
    opacity: 0.3;
    border-radius: 50%;
    margin: 0 0.06rem;
    &.active {
			background-color: #fff;
			opacity: 1;
    }
  }
}
.preview-img-box {
	transform: translateX(0);
	height: 100%;
  &.active {
    transition: all 0.5s;
  }
}
</style>



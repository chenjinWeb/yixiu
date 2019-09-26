/*
 * @Author: moka === gaoyuanfell@sina.com
 * @Date: 2019-07-16 09:50:04
 * @Last Modified by: moka
 * @Last Modified time: 2019-08-06 18:59:20
 */
import { Component, Vue, Provide } from 'vue-property-decorator';
import { homeGood, homeStat, homeShare } from '../service/home';
import { shareBehaviorSubject } from './util';
import { Getter, State } from 'vuex-class';

function isWeixinCient(){
	var ua = navigator.userAgent.toLowerCase();
	let m = ua.match(/MicroMessenger/i)
	if(m && m[0] == "micromessenger") {
			return true;
	} else {
			return false;
	}
}
interface ShareData{
	title?: string, // 分享标题
	desc?: string, // 分享描述
	link?: string, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
	imgUrl?: string, // 分享图标
}

@Component({})
export default class MixinUtil extends Vue {

	//  微信小程序 判断
	@Provide() isWxMini
	@Provide() isWx = false

	@Getter('questionPic') questionPic:any
	@State shareData!: any
	//默认分享
	wxLoad(){
		let text = this.shareData.text
		let img = this.shareData.img
		this.updateAppMessageShareData({
			title: '一休心理',
			desc: text[Math.floor(Math.random() * text.length)],
			imgUrl: `${location.origin}/${img[Math.floor(Math.random() * img.length)]}`,
			link: location.origin,
		})
	}

	beforeCreate() {
		this.isWx = isWeixinCient()
		if(!this.isWx){
			shareBehaviorSubject.next()
		}else{
			homeShare({ questionId: -1, shareUrl: location.href }).then(res => {
				if (res.code == 200) {
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: res.data.appId, // 必填，公众号的唯一标识
						timestamp: res.data.timestamp, // 必填，生成签名的时间戳
						nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
						signature: res.data.signature, // 必填，签名
						jsApiList: [
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareQQ',
							'onMenuShareWeibo',
							'onMenuShareQZone',
							'chooseImage',
							'getLocalImgData',
						] // 必填，需要使用的JS接口列表
					});
					(document.getElementById('jiazai') as HTMLDivElement).style.display = 'flex'
					wx.ready(() => {
						(document.getElementById('jiazai') as HTMLDivElement).style.display = 'none'
						shareBehaviorSubject.next()
					});
				}
			});
		}
	}

	created () {
		shareBehaviorSubject.subscribe(() => {
			console.info('1111111')
			this.wxLoad();
		})
		if(this.$route.query.share){
			let href = location.href
			history.pushState(null,'',location.origin)
			history.pushState(null,'',href)
		}
	}

	black() {
		// this.$router.back();
		this.$router.go(-1);

	}

	setTitle(title){
		document.title = title
	}

	goTest(item: any) {
		this.$router.push({ name: 'test', query: { questionId: item.questionId, questionType: item.questionType } })
	}

	goTest2(item: any) {
		this.$router.push({ name: 'test', query: { questionId: item.questionId } })
	}

	homeGood(item: any, event: MouseEvent) {
		event.stopPropagation()
		event.preventDefault()
		homeGood({ questionId: item.questionId }).then(res => {
			if(res.code == 200){
				if(res.type == 1){
					--item.zanNum
					Vue.set(item, 'zanNumBo', false)
				}else{
					++item.zanNum
					Vue.set(item, 'zanNumBo', true)
				}
			}
		})
	}

	homeStat(typeId: any, questionId = -1) {
		homeStat({ typeId, questionId }).then(res => {
			if (res.code == 200) {
				console.log(`------- typeId: ${typeId} 记录 ------`)
			}
		})
	}

	updateAppMessageShareData(result: ShareData) {
		/*分享到朋友圈*/
		wx.onMenuShareTimeline({
			title: `${result.title}/${result.desc}`, // 分享标题
			desc: result.desc || '', // 分享描述
			link: result.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: result.imgUrl, // 分享图标
			success: () => {

			},
			cancel: () => {

			}
		});
		/*分享给朋友*/
		wx.onMenuShareAppMessage({
			title: result.title, // 分享标题
			desc: result.desc || '', // 分享描述
			link: result.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: result.imgUrl, // 分享图标
			success: () => {

			},
			cancel: () => {

			}
		});
		wx.onMenuShareQQ({
			title: result.title, // 分享标题
			desc: result.desc || '', // 分享描述
			link: result.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: result.imgUrl, // 分享图标
			success: () => {

			},
			cancel: () => {

			}
		});
		wx.onMenuShareWeibo({
			title: result.title, // 分享标题
			desc: result.desc || '', // 分享描述
			link: result.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: result.imgUrl, // 分享图标
			success: () => {

			},
			cancel: () => {

			}
		});
		wx.onMenuShareQZone({
			title: result.title, // 分享标题
			desc: result.desc || '', // 分享描述
			link: result.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: result.imgUrl, // 分享图标
			success: () => {

			},
			cancel: () => {

			}
		});
		wx.onMenuShareQZone({
			title: result.title, // 分享标题
			desc: result.desc || '', // 分享描述
			link: result.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: result.imgUrl, // 分享图标
			success: () => {

			},
			cancel: () => {

			}
		});
	}

	beforeDestroy() {
		shareBehaviorSubject.unsubscribe()
	}
}

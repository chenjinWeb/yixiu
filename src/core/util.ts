/*
 * @Author: moka === gaoyuanfell@sina.com
 * @Date: 2019-07-16 09:50:07
 * @Last Modified by: moka
 * @Last Modified time: 2019-07-19 17:23:39
 */
export function getLocalStorage(key: any) {
	let str: any = window.localStorage.getItem(key)
	try {
		return JSON.parse(str)
	} catch (error) {
		return str
	}
}

export function setLocalStorage(key: any, value: any) {
	if (typeof value == 'object') {
		window.localStorage.setItem(key, JSON.stringify(value))
	}else{
		window.localStorage.setItem(key, value)
	}
}

export class BehaviorSubject {
  private func: Function[] = []
  private catchData: any;
  private behavior = false;

  next(data?: any) {
    this.catchData = data;
    this.behavior = true;
    if (this.func.length) {
      this.func.forEach(fn => {
        fn.call(fn, data)
      });
    }
  }

  subscribe(func:Function){
    if (this.behavior) {
      func.call(func, this.catchData)
    }
		this.func.push(func)
    return () => {
      this._unsubscribe(func)
    }
  }

  private _unsubscribe(func:Function) {
    let index = this.func.indexOf(func)
		if (!!~index) this.func.splice(index, 1)
		console.info(this.func)
	}

	unsubscribe(){
		this.behavior = false;
		this.func.length = 0;
		this.catchData = undefined;
	}
}


export const shareBehaviorSubject = new BehaviorSubject();

function toQueryPair(key:any, value:any, bo:any) {
	if (typeof value === 'undefined') {
			return key;
	}
	return key + '=' + (bo ? encodeURIComponent(value === null ? '' : String(value)) : value === null ? '' : String(value));
}

export const toBodyString = function (obj:any, bo = true) {
	let ret:any[] = [];
	for (let key in obj) {
			let values = obj[key];
			if (values && values.constructor === Array) { //数组
					let queryValues:any[] = [];
					for (let i = 0, len = values.length, value; i < len; i++) {
							value = values[i];
							queryValues.push(toQueryPair(key, value, bo));
					}
					ret = ret.concat(queryValues);
			} else { //字符串
					ret.push(toQueryPair(key, values, bo));
			}
	}
	return ret.join('&');
}

export function uuid() {
	let d = new Date().getTime();
	if (window.performance && typeof window.performance.now === "function") {
		d += performance.now(); //use high-precision timer if available
	}
	let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
		c
	) {
		let r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
	});
	return uuid;
}

export function getCharSizeByCanvas(char:any, style:any = {}){
	let canvas = document.createElement('canvas')
	canvas.style.position = "ablsolute"
	let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    let { fontSize = 14, fontFamily = "Arial" } = style
    document.body.appendChild(canvas)
    ctx.font = `${fontSize}px ${fontFamily}`
    document.body.removeChild(canvas)
    let text = ctx.measureText(char)
    ctx.fillText(char, 50, 50)
    let result = {
        height: fontSize,
        width: text.width
    }
    return result
}

export const isWxMini = !!window['__wxjs_environment']

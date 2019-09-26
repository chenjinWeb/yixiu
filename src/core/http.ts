/*
 * @Author: moka === gaoyuanfell@sina.com
 * @Date: 2019-07-16 09:50:00
 * @Last Modified by:   moka
 * @Last Modified time: 2019-07-16 09:50:00
 */
import axios, { AxiosRequestConfig } from 'axios'
import config, { STORAGE_USER_TOKEN } from './config'
import { getLocalStorage } from './util';

interface Result{
	data:any,
	code:number,
	msg:string,
	[key:string]:any
}

let instance = axios.create({
	baseURL: config.baseURL, // api的base_url
	timeout: 5000 // 请求超时时间
});

instance.interceptors.request.use(
	request => {
		let token = getLocalStorage(STORAGE_USER_TOKEN)
		if(token){
			request.headers = {
				token: token
			}
		}
		(document.getElementById('jiazai') as HTMLDivElement).style.display = 'flex'
		return request;
	},
	error => {
		(document.getElementById('jiazai') as HTMLDivElement).style.display = 'none'
		return Promise.reject(error)
	}
);

// 拿到数据 统一处理报错信息
instance.interceptors.response.use(
	response => {
		(document.getElementById('jiazai') as HTMLDivElement).style.display = 'none'
		return response.data
	},
	error => {
		(document.getElementById('jiazai') as HTMLDivElement).style.display = 'none'
		return Promise.reject(error)
	}
);

export function get(url: string, body = {}, config: AxiosRequestConfig = {}):Promise<Result> {
	config.params = body;
	return instance.get(url, config)
}

export function postJson(url: string, body = {}, config = {}):Promise<Result> {
	return instance.post(url, body, config)
}

export function postForm(url: string, body: any = {}, config = {}):Promise<Result> {
	let search = new URLSearchParams();
	Object.keys(body).forEach(key => {
		search.set(key, body[key]);
	})
	return instance.post(url, search.toString(), config)
}

export function postFormData(url: string, body: any = {}, config: AxiosRequestConfig = {}):Promise<Result> {
	let f = new FormData()
	Object.keys(body).forEach(key => {
		f.append(key, body[key]);
	})
	return instance.post(url, f, config)
}

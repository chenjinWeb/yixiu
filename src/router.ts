import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const Guan = () => import(/* webpackChunkName: "guan" */ './views/Guan.vue');
const search = () => import(/* webpackChunkName: "search" */ './views/Search.vue');
const list = () => import(/* webpackChunkName: "list" */ './views/List.vue');
const test = () => import(/* webpackChunkName: "test" */ './views/Test.vue');
const dati = () => import(/* webpackChunkName: "dati" */ './views/Dati.vue');
const jieguo = () => import(/* webpackChunkName: "jieguo" */ './views/Jieguo.vue');
// const jieguo2 = () => import(/* webpackChunkName: "jieguo2" */ './views/Jieguo2.vue');
// const jieguo3 = () => import(/* webpackChunkName: "jieguo3" */ './views/Jieguo3.vue');
// const jieguo4 = () => import(/* webpackChunkName: "jieguo4" */ './views/Jieguo4.vue');
// const jieguo5 = () => import(/* webpackChunkName: "jieguo5" */ './views/Jieguo5.vue');
// const jieguo6 = () => import(/* webpackChunkName: "jieguo6" */ './views/Jieguo6.vue');

const Jieguoz = () => import(/* webpackChunkName: "Jieguoz" */ './views/Jieguoz.vue');
const Ai = () => import(/* webpackChunkName: "Ai" */ './views/Ai.vue');

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
		{
			path: '/',
			redirect: '/index'
		},
		{
			path: '/index',
			component: Home,
		},
		{
			path: '/guan',
			component: Guan,
		},
		{
			path: '/search',
			name: 'search',
			component: search
		},
		{
			path: '/list',
			name: 'list',
			component: list
		},
		{
			path: '/test',
			name: 'test',
			component: test
		},
		{
			path: '/dati',
			name: 'dati',
			component: dati
		},
		{
			path: '/jieguo',
			name: 'jieguo',
			component: jieguo
		},
		{
			path: '/jieguoz',
			name: 'jieguoz',
			component: Jieguoz
		},
		{
			path: '/ai',
			name: 'ai',
			component: Ai
		},
		// {
		// 	path: '/jieguot',
		// 	name: 'jieguo2',
		// 	component: jieguo2
		// },
		// {
		// 	path: '/jieguoa',
		// 	name: 'jieguo3',
		// 	component: jieguo3
		// },
		// {
		// 	path: '/jieguob',
		// 	name: 'jieguo4',
		// 	component: jieguo4
		// },
		// {
		// 	path: '/jieguoc',
		// 	name: 'jieguo5',
		// 	component: jieguo5
		// },
		// {
		// 	path: '/jieguod',
		// 	name: 'jieguo6',
		// 	component: jieguo6
		// },

  ]
})

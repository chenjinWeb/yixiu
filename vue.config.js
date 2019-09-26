// vue.config.js
const path = require('path')
// const PrerenderSPAPlugin = require('prerender-spa-plugin')
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

const routes = [
	'/m/index',
	'/m/search',
	'/m/list',
	'/m/test',
	'/m/dati',
	'/m/jieguo'
]

module.exports = {
	lintOnSave: false,
	// publicPath: '/yixiu/',
	// outputDir: 'dist/yixiu',
	assetsDir: 'static',
	productionSourceMap: false,
	// configureWebpack: config => {
	// 	if (process.env.NODE_ENV !== 'production') return;
	// 	return {
	// 		plugins: [
	// 			new PrerenderSPAPlugin({
	// 				staticDir: path.join(__dirname, 'dist'),
	// 				outputDir: path.join(__dirname, 'dist'),
	// 				indexPath: path.join(__dirname, 'dist/m', 'index.html'),
	// 				routes: routes,
	// 				// 这个很重要，如果没有配置这段，也不会进行预编译
	// 				renderer: new Renderer({
	// 					inject: {
	// 						foo: 'bar'
	// 					},
	// 					headless: false,
	// 					// 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
	// 					renderAfterDocumentEvent: 'custom-render-trigger',
	// 					maxConcurrentRoutes: 6,
	// 					renderAfterTime: 5000
	// 				})
	// 			}),
	// 		]
	// 	}
	// }
}

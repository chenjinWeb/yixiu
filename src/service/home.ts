import { postJson } from '../core/http';

/**
 * 1.1首页初始化
 * @param body
 */
export function homeInit(body = {}){
	return postJson('/h5/home/init', body)
}

/**
 * 1.2推荐
* @param body
* 	参数 类型 描述
		page int 页码
		limit int 行数
*/
export function homeRecommend(body = {}){
	return postJson('/h5/home/recommend', body)
}

/**
 * 1.3热门
 * @param body
 *
 * 	参数 类型 描述
		page int 页码
		limit int 行数
 */
export function homeHot(body = {}){
	return postJson('/h5/home/hot', body)
}

/**
 * 1.5列表
 * @param body
 *
 * 	参数 类型 描述
		page int 页码
		limit int 行数
		questionCategory int 对应1.1的categoryId
 */
export function homeList(body = {}){
	return postJson('/h5/home/list', body)
}

/**
 * 1.6搜索
 * @param body
 *
 * 	参数 类型 描述
		page int 页码
		limit int 行数
		questionTitle int 搜索关键词
 */
export function homeSearch(body = {}){
	return postJson('/h5/home/search', body)
}


/**
 * 点赞
 * @param body
 * questionId
 */
export function homeGood(body = {}){
	return postJson('/h5/home/good', body)
}



/**
 * 	1.7 开始答题
 * @param body
 *
 * 	参数 类型 描述
		questionId int 问题ID
 */
export function homeBegin(body = {}){
	return postJson('/h5/home/begin', body)
}

/**
 * 1.8 下一题
 * @param body
 *
 * 	参数 类型 描述
		questionId int 题目ID，参照1.7
		questionListId int 问题ID，参照1.7
		answerId int 答案ID，参照1.7
		sessionKey string 参照1.7
 */
export function homeNext(body = {}){
	return postJson('/h5/home/next', body)
}

/**
 * 1.12 上一题
 * @param body
 *
 * questionId int
   questionListId int
   sessionKey string
 */
export function homeLast(body = {}){
	return postJson('/h5/home/last', body)
}

/**
 * 1.9 结果
 * @param body
 *
 * 	参数 类型 描述
		questionId int 题目ID，参照1.7
		questionListId int 问题ID，参照1.7
		answerId int 答案ID，参照1.7
		resultId int 结果ID，参照1.7
		sessionKey string 参照1.7
 */
export function homeResult(body = {}){
	return postJson('/h5/home/result', body)
}

/**
 * 微信分享
 * @param body
 *
 * {"questionId":1}
 */
export function homeShare(body = {}){
	return postJson('/h5/home/share', body)
}

/**
 * 行为统计
 * @param body
 * typeId
 */
export function homeStat(body = {}){
	return postJson('/h5/home/stat', body)
}

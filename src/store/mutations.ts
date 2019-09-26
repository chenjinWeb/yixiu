import { RootState } from './types';

export default{
	answersIndexAdd(state:RootState, payload:any){
		++state.answersIndex
	},
	answersIndexLast(state:RootState, payload:any){
		--state.answersIndex
	},
	answersIntegralAdd(state:RootState, payload:any){
		state.answersIntegral.push(payload)
	},
	answersIntegralLast(state:RootState, payload:any){
		state.answersIntegral.pop()
	},
	answersIntegralClear(state:RootState){
		state.answersIntegral.length = 0
		state.answersIndex = 0
	},
	setUserInfo(state:RootState, payload:any){
		state.userInfo = payload
	}
}

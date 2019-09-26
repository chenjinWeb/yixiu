import { RootState } from './types';

export default{
	questionPic(state:RootState){
		return state.bannerList[0].questionPic
	}
}

import * as types from './actionTypes';

export function changeUserInfo(user) {
	return {type: types.USERINFO_CHANGED, user};
}
export function setUser(user) {
	return async function(dispatch, getState) {
		dispatch(changeUserInfo(user));
	};
}
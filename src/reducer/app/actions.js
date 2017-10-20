import * as types from './actionTypes';

export function changeAppRoot(root) {
	return {type: types.ROOT_CHANGED, root: root};
}
export function logout() {
	return async function(dispatch, getState) {
		dispatch(changeAppRoot('login'));
	};
}
export function login() {
	return async function(dispatch, getState) {
		dispatch(changeAppRoot('after-login'));
	};
}
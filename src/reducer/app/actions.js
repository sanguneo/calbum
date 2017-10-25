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


export function loading() {
	return {type: types.LOADING};
}
export function loaded() {
	return {type: types.LOADED};
}


export function changing() {
	return {type: types.CHANGING};
}
export function changed() {
	return {type: types.CHANGED};
}


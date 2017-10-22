import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
	root: undefined, // 'login' / 'after-login'
	loading: undefined // true, false
});

export default function app(state = initialState, action = {}) {
	switch (action.type) {
		case types.ROOT_CHANGED:
			return Object.assign({}, state, {
				root: action.root
			});
		case types.LOADING:
			return Object.assign({}, state, {
				loading: true
			});
		case types.LOADED:
			return Object.assign({}, state, {
				loading: false
			});
		default:
			return state;
	}
}
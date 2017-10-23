import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
	profile: require('../../../img/profile.png'),
	name: '',
	email: '',
	signhash: ''
});

export default function user(state = initialState, action = {}) {
	switch (action.type) {
		case types.USERINFO_CHANGED:
			let userinfo = {};
			if (action.user.profile) userinfo.profile = action.user.profile;
			if (action.user.name) userinfo.name = action.user.name;
			if (action.user.email) userinfo.email = action.user.email;
			if (action.user.signhash) userinfo.signhash = action.user.signhash;
			return Object.assign({}, state, userinfo);
		default:
			return state;
	}
}
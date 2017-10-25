'use strict';

import * as types from './actionTypes';

export function setUser(user) {
	return {type: types.USERINFO_CHANGED, user};
}
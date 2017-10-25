/**
 * Created by 나상권 on 2017-05-25.
 */
'use strict';

let gvar = {};
export function setVar(key, tvar) {
	gvar[key] = tvar;
}
export function getVar(key) {
	return gvar[key];
}
export function getUntil(key, callback, checker) {
	let check = checker ? checker : () => true;
	if (gvar.hasOwnProperty(key)) {
		if (check(gvar[key])) {
			callback(gvar[key]);
		} else {
			setTimeout(() => {
				getUntil(key, callback, check);
			}, 10);
		}
	} else {
		setTimeout(() => {
			getUntil(key, callback, check);
		}, 10);
	}
}

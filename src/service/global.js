/**
 * Created by 나상권 on 2017-05-25.
 */
let gvar = {};
export function setVar(key, tvar) {
	gvar[key] = tvar;
}
export function getVar(key) {
	return gvar[key];
}

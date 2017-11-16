/**
 * Created by 나상권 on 2017-05-19.
 */

'use strict';

export let rootProps = {navigator: null};
export let rNsetter = (navigator) => {
	rootProps.navigator = navigator;
}
export let rDsetter = (dbsvc) => {
	rootProps.dbsvc = dbsvc;
}
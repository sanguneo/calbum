'use strict';

import {applyMiddleware, combineReducers, createStore} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import * as reducers from './reducer';
import * as appActions from './reducer/app/actions';
import * as userActions from './reducer/user/actions';

import {AsyncStorage, processColor as pc, Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {registerScreens} from './screen';

import dbSVC from './service/calbumdb_svc';
const dbsvc = new dbSVC();
//import cryptSVC from './service/crypt_svc';

const RNFS = require('./service/rnfs_wrapper');

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

let processColor = null;

registerScreens(store, Provider);

export default class App {
	constructor() {
		processColor = (Platform.OS === 'ios') ? pc: (color) => color;
		RNFS.readDir(RNFS.PlatformDependPath)
			.then(result => {
				let resarr = [];
				result.forEach(e => resarr.push(e.path));
				if (resarr.indexOf(RNFS.PlatformDependPath + '/_original_') < 0) {
					RNFS.mkdir(RNFS.PlatformDependPath + '/_original_');
				}
				if (resarr.indexOf(RNFS.PlatformDependPath + '/_profiles_') < 0) {
					RNFS.mkdir(RNFS.PlatformDependPath + '/_profiles_');
				}
			})
			.catch(err => {
				console.error(err.message, err.code);
			});
		RNFS.readDir(RNFS.PlatformDependPath + '/_original_')
			.then(result => {
				let resarr = [];
				result.forEach(e => resarr.push(e.path));
				console.log(resarr);
			})
			.catch(err => {
				console.error(err.message, err.code);
			});

		store.subscribe(this.onStoreUpdate.bind(this));

		AsyncStorage.getItem('token').then(token => {
			if (typeof token === 'undefined' || token === null) {
				store.dispatch(appActions.logout());
			} else {
				AsyncStorage.multiGet(
					['token', '_id', 'name', 'email', 'signhash'],
					(err, stores) => {
						let obj = {};
						stores.forEach(store => { obj[store[0]] = store[1];});
						obj.profile = {uri: 'file://' + RNFS.PlatformDependPath + '/_profiles_/' + obj.signhash + '.scalb' + '?key=' + Math.random() * 10000};
						store.dispatch(userActions.setUser(obj));
						store.dispatch(appActions.login());
					}
				);
			}
		}).done();
	}
	onStoreUpdate() {
		const {root} = store.getState().app;
		if (this.currentRoot != root) {
			this.currentRoot = root;
			this.startApp(root);
		}
	}
	startApp(root) {
		let navigator = {nav: null};
		let appStyle = {
			screenBackgroundColor: processColor('white'),
			navBarTransparent: false,
			navBarTranslucent: false,
			drawUnderNavBar: false,
			navBarHideOnScroll: false,
			statusBarColor: processColor('#36384C'),
			navBarBackgroundColor: processColor('#36384C'),
			navBarTextColor: processColor('#ffffff'),
			navBarButtonColor: processColor('#ffffff'),
			navBarTitleTextCentered: false,
			topBarElevationShadowEnabled: false,
			statusBarHidden: false,
			statusBarTextColorScheme: 'light',
			statusBarTextColorSchemeSingleScreen: 'light',
			statusBarBlur: true,
			orientation: 'portrait'
		};
		switch (root) {
			case 'login':
				Navigation.startSingleScreenApp({
					screen: {
						screen: 'calbum.LoginScreen',
						title: '로그인'
					},
					appStyle,
					drawer: {},
					passProps: {dbsvc, profileInitial: true, profileCreate: true},
					animationType: 'fade'
				});
				return;
			case 'after-login':
				Navigation.startSingleScreenApp({
					screen: {
						screen: 'calbum.TotalScreen',
						title: '전체보기'
					},
					appStyle,
					drawer: {
						left: {
							screen: 'calbum.SideMenu',
							passProps: {dbsvc}
						},
						style: {
							drawerShadow: false,
							leftDrawerWidth: 53.5,
						},
						disableOpenGesture: false
					},
					passProps: {dbsvc},
					animationType: 'fade'
				});
				return;
			default:
				console.error('Unknown app root');
				return;
		}
	}
}

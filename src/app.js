import {applyMiddleware, combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";

import * as reducers from "./reducer";
import * as appActions from "./reducer/app/actions";
import * as userActions from "./reducer/user/actions";

import {AsyncStorage} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {registerScreens} from './screen'

import * as global from './service/global';
import dbSVC from './service/calbumdb_svc';
import cryptSVC from './service/crypt_svc';

const RNFS = require('react-native-fs');

const dbsvc = new dbSVC(false);
const crypt = new cryptSVC();

// redux related book keeping
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

registerScreens(store, Provider);

export default class App {
	constructor() {
		RNFS.readDir(RNFS.DocumentDirectoryPath).then((result) => {
			let resarr = [];
			result.forEach((e) => resarr.push(e.path));
			if (resarr.indexOf(RNFS.DocumentDirectoryPath + '/_original_') < 0) {
				RNFS.mkdir(RNFS.DocumentDirectoryPath + '/_original_');
			}
			if (resarr.indexOf(RNFS.DocumentDirectoryPath + '/_profiles_') < 0) {
				RNFS.mkdir(RNFS.DocumentDirectoryPath + '/_profiles_');
			}
		}).catch((err) => {
			console.error(err.message, err.code);
		});
		store.subscribe(this.onStoreUpdate.bind(this));

		AsyncStorage.getItem('token').then((token) => {
			if (typeof token === 'undefined' || token === null) {
				store.dispatch(appActions.logout());
			} else {
				AsyncStorage.multiGet(['token', '_id', 'name', 'email', 'signhash'], (err, stores) => {
					let obj = {};
					stores.forEach((store) => { obj[store[0]] = store[1]; });
					let pPath = RNFS.DocumentDirectoryPath + '/_profiles_/' + obj.signhash + '.scalb';
					let key = Math.random() * 10000;
					obj.profile = {uri: 'file://' + pPath + '?key=' + key};
					store.dispatch(userActions.setUser(obj));
					store.dispatch(appActions.login());

				});
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
		let passProps = {dbsvc, crypt, global};
		let appStyle = {
			screenBackgroundColor: 'white',
			navBarTransparent: false,
			navBarTranslucent: false,
			drawUnderNavBar: false,
			navBarHideOnScroll: false,
			statusBarColor: '#36384C',
			navBarBackgroundColor: '#36384C',
			navBarTextColor: '#fff',
			navBarButtonColor: '#fff',
			navBarTitleTextCentered: true,
			topBarElevationShadowEnabled: false,
			statusBarHidden: true,
			statusBarTextColorScheme: 'light',
			statusBarTextColorSchemeSingleScreen: 'light',
			statusBarBlur: true,
			orientation: 'portrait',
		};
		switch (root) {
			case 'login':
				Navigation.startSingleScreenApp({
					screen: {
						screen: 'calbum.LoginScreen',
						title: '로그인',
					},
					appStyle,
					drawer: {},
					passProps: {...passProps, profileInitial: true, profileCreate : true},
					animationType: 'fade',
				});
				return;
			case 'after-login':
				Navigation.startSingleScreenApp({
					screen: {
						screen: 'calbum.TotalScreen',
						title: '전체보기',
					},
					appStyle,
					drawer: {
						left: {
							screen: 'calbum.SideMenu',
							passProps
						},
						disableOpenGesture: false
					},
					passProps,
					animationType: 'fade',
				});
				return;
			default:
				console.error('Unknown app root');
				return;
		}
	}
}


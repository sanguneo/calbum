/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

console.sdebug = true;
var orig_log = console.log;
var orig_error = console.error;
console.log = function(){
	return console.sdebug ? orig_log.apply(this, arguments) : null;
}
console.error = function(){
	return console.sdebug ? orig_error.apply(this, arguments) : null;
}

JSON.clone = (arg) => {JSON.parse(JSON.stringify(arg))};
JSON.formatedString= (arg) => JSON.stringify(arg, null, 4);

import {Navigation} from 'react-native-navigation';
const RNFS = require('react-native-fs');
import {registerScreens} from './screen'
registerScreens();

import * as global from './service/global';
import dbSVC from './service/calbumdb_svc';
import cryptSVC from './service/crypt_svc';

const dbsvc = new dbSVC(true);
const crypt = new cryptSVC();

Navigation.startSingleScreenApp({
    screen: {
        screen: 'calbum.TotalScreen',
        title: '컨설팅 앨범',
    },
    appStyle: {
        screenBackgroundColor: 'white',
        navBarTransparent: false, // make the nav bar transparent, works best with drawUnderNavBar:true,
        drawUnderNavBar: false,
		navBarHideOnScroll: false,
		navBarBackgroundColor: '#f26968',
        navBarTextColor: '#fff',
        navBarButtonColor: '#fff',
		navBarTitleTextCentered: true, // default: false. centers the title.
		topBarElevationShadowEnabled: false,
        statusBarHidden: true,
        statusBarTextColorScheme: 'dark',
        statusBarTextColorSchemeSingleScreen: 'dark',
        statusBarBlur: false,
        orientation: 'portrait',
    },
    drawer: {
        left: {
            screen: 'calbum.SideMenu',
            passProps: {dbsvc, crypt, global}
        },
        disableOpenGesture: false
    },
    passProps: {dbsvc, crypt, global},
    animationType: 'fade'
});

RNFS.readDir(RNFS.DocumentDirectoryPath).then((result) => {
    let resarr = [];
    result.forEach((e) => resarr.push(e.path));
    if (resarr.indexOf(RNFS.DocumentDirectoryPath + '/_profiles_') < 0) {
        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/_profiles_');
        console.log('mkdir \'_profiles_\' success!!');
    }
}).catch((err) => {
    console.error(err.message, err.code);
});

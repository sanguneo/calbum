/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

JSON.formatedString= (arg) => JSON.stringify(arg, null, 4);

import {Navigation} from 'react-native-navigation';
const RNFS = require('react-native-fs');
import {registerScreens} from './screen'
registerScreens();

import * as global from './service/global';
import dbSVC from './service/calbumdb_svc';
import cryptSVC from './service/crypt_svc';

const dbsvc = new dbSVC(false);
const crypt = new cryptSVC();

Navigation.startSingleScreenApp({
    screen: {
        screen: 'calbum.SummaryScreen',
        title: '컨설팅 앨범',
    },
    appStyle: {
		navBarTextFontFamily: 'namsan',
		navBarSubtitleFontFamily: 'namsan',
        screenBackgroundColor: 'white',
        navBarTransparent: false, // make the nav bar transparent, works best with drawUnderNavBar:true,
		navBarTranslucent: false,
        drawUnderNavBar: false,
		navBarHideOnScroll: false,
		navBarBackgroundColor: '#36384C',
        navBarTextColor: '#fff',
        navBarButtonColor: '#fff',
		navBarTitleTextCentered: false, // default: false. centers the title.
		topBarElevationShadowEnabled: false,
        statusBarHidden: false,
        statusBarTextColorScheme: 'light',
        statusBarTextColorSchemeSingleScreen: 'light',
        statusBarBlur: true,
        orientation: 'portrait',
		navBarTextFontSize: 5,
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

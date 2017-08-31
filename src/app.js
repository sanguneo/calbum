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
        title: 'hair.pin',
    },
    appStyle: {
        screenBackgroundColor: 'white',
        navBarTransparent: false, // make the nav bar transparent, works best with drawUnderNavBar:true,
		navBarTranslucent: false,
        drawUnderNavBar: false,
		navBarHideOnScroll: false,
		statusBarColor: '#36384C',
		navBarBackgroundColor: '#36384C',
        navBarTextColor: '#fff',
        navBarButtonColor: '#fff',
		navBarTitleTextCentered: false, // default: false. centers the title.
		topBarElevationShadowEnabled: false,
        statusBarHidden: true,
        statusBarTextColorScheme: 'light',
        statusBarTextColorSchemeSingleScreen: 'light',
        statusBarBlur: true,
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
    animationType: 'fade',
});

RNFS.readDir(RNFS.DocumentDirectoryPath).then((result) => {
    let resarr = [];
    result.forEach((e) => resarr.push(e.path));
	if (resarr.indexOf(RNFS.DocumentDirectoryPath + '/_original_') < 0) {
		RNFS.mkdir(RNFS.DocumentDirectoryPath + '/_original_');
		console.log('mkdir \'_original_\' success!!');
	}
    if (resarr.indexOf(RNFS.DocumentDirectoryPath + '/_profiles_') < 0) {
        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/_profiles_');
        console.log('mkdir \'_profiles_\' success!!');
    }
}).catch((err) => {
    console.error(err.message, err.code);
});

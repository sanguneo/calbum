/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import {Navigation} from 'react-native-navigation';

import {registerScreens} from './screen'
registerScreens();

import dbSVC from './service/calbumdb_svc';
import cryptSVC from './service/crypt_svc';

const dbsvc = new dbSVC(true);
const crypt = new cryptSVC();

Navigation.startSingleScreenApp({
    screen: {
        screen: 'calbum.IntroScreen',
        title: 'cAlbum',
    },
    appStyle: {
        screenBackgroundColor: 'white',
        navBarTransparent: false, // make the nav bar transparent, works best with drawUnderNavBar:true,
        drawUnderNavBar: false,
        navBarTextColor: 'white',
        navBarButtonColor: 'white',
        statusBarHidden: true,
        statusBarTextColorScheme: 'dark',
        statusBarTextColorSchemeSingleScreen: 'dark',
        statusBarBlur: false,
        navBarBackgroundColor: '#f26968',
        orientation: 'portrait',
        forceTitlesDisplay: true
    },
    drawer: {
        left: {
            screen: 'calbum.SideMenu',
            passProps: {dbsvc, crypt}
        },
        disableOpenGesture: false
    },
    passProps: {dbsvc, crypt},
    animationType: 'fade'
});
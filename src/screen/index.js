'use strict';

import {Navigation} from 'react-native-navigation';

import NoticeScreen from './NoticeScreen';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import SubscribeScreen from './SubscribeScreen';
import ModifyScreen from './ModifyScreen';
import TotalScreen from './TotalScreen';
import InTagScreen from './InTagScreen';
import TagScreen from './TagScreen';
import ViewScreen from './ViewScreen';
import SideMenu from './SideMenu';

export function registerScreens(store, provider) {
	Navigation.registerComponent('calbum.NoticeScreen', () => NoticeScreen, store, provider);
	Navigation.registerComponent('calbum.LoginScreen', () => LoginScreen, store, provider);
	Navigation.registerComponent('calbum.SignupScreen', () => SignupScreen, store, provider);
	Navigation.registerComponent('calbum.SubscribeScreen', () => SubscribeScreen, store, provider);
	Navigation.registerComponent('calbum.ModifyScreen', () => ModifyScreen, store, provider);
	Navigation.registerComponent('calbum.TotalScreen', () => TotalScreen, store, provider);
	Navigation.registerComponent('calbum.InTagScreen', () => InTagScreen, store, provider);
	Navigation.registerComponent('calbum.TagScreen', () => TagScreen, store, provider);
	Navigation.registerComponent('calbum.ViewScreen', () => ViewScreen, store, provider);
    Navigation.registerComponent('calbum.SideMenu', () => SideMenu, store, provider);
}

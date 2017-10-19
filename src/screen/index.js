import {Navigation} from 'react-native-navigation';

import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import SubscribeScreen from './SubscribeScreen';
import ModifyScreen from './ModifyScreen';
import TotalScreen from './TotalScreen';
import InTagScreen from './InTagScreen';
import TagScreen from './TagScreen';
import ViewScreen from './ViewScreen';
import SideMenu from './SideMenu';

export function registerScreens() {
	Navigation.registerComponent('calbum.LoginScreen', () => LoginScreen);
	Navigation.registerComponent('calbum.SignupScreen', () => SignupScreen);
	Navigation.registerComponent('calbum.SubscribeScreen', () => SubscribeScreen);
	Navigation.registerComponent('calbum.ModifyScreen', () => ModifyScreen);
	Navigation.registerComponent('calbum.TotalScreen', () => TotalScreen);
	Navigation.registerComponent('calbum.InTagScreen', () => InTagScreen);
	Navigation.registerComponent('calbum.TagScreen', () => TagScreen);
	Navigation.registerComponent('calbum.ViewScreen', () => ViewScreen);
    Navigation.registerComponent('calbum.SideMenu', () => SideMenu);
}

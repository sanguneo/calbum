import {Navigation} from 'react-native-navigation';

import IntroScreen from './IntroScreen';
import ProfileScreen from './ProfileScreen';
import SubscribeScreen from './SubscribeScreen';
import ViewScreen from './ViewScreen';
import CheckoutScreen from './CheckoutScreen';
import SecondScreen from './SecondScreen';
import ThirdScreen from './ThirdScreen';
import SideMenu from './SideMenu';

// register all screens of the app (including internal ones)
export function registerScreens() {
    Navigation.registerComponent('calbum.IntroScreen', () => IntroScreen);
	Navigation.registerComponent('calbum.ProfileScreen', () => ProfileScreen);
    Navigation.registerComponent('calbum.SubscribeScreen', () => SubscribeScreen);
	Navigation.registerComponent('calbum.ViewScreen', () => ViewScreen);
    Navigation.registerComponent('calbum.CheckoutScreen', () => CheckoutScreen);
    Navigation.registerComponent('calbum.SecondScreen', () => SecondScreen);
    Navigation.registerComponent('calbum.ThirdScreen', () => ThirdScreen);
    Navigation.registerComponent('calbum.SideMenu', () => SideMenu);
}

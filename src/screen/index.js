import {Navigation} from 'react-native-navigation';

import IntroScreen from './IntroScreen';
import SubscribeScreen from './SubscribeScreen';
import SecondScreen from './SecondScreen';
import ThirdScreen from './ThirdScreen';
import SideMenu from './SideMenu';

// register all screens of the app (including internal ones)
export function registerScreens() {
    Navigation.registerComponent('calbum.IntroScreen', () => IntroScreen);
    Navigation.registerComponent('calbum.SubscribeScreen', () => SubscribeScreen);
    Navigation.registerComponent('calbum.SecondScreen', () => SecondScreen);
    Navigation.registerComponent('calbum.ThirdScreen', () => ThirdScreen);
    Navigation.registerComponent('calbum.SideMenu', () => SideMenu);
}

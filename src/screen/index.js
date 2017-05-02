import {Navigation} from 'react-native-navigation';

import IntroScreen from './IntroScreen';
import SecondScreen from './SecondScreen';

// register all screens of the app (including internal ones)
export function registerScreens() {
    Navigation.registerComponent('calbum.IntroScreen', () => IntroScreen);
    Navigation.registerComponent('calbum.SecondScreen', () => SecondScreen);
}

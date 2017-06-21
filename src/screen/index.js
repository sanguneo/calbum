import {Navigation} from 'react-native-navigation';

import ProfileScreen from './ProfileScreen';
import SubscribeScreen from './SubscribeScreen';
import TotalScreen from './TotalScreen';
import AlbumScreen from './AlbumScreen';
import ViewScreen from './ViewScreen';
import ThirdScreen from './ThirdScreen';
import SideMenu from './SideMenu';

// register all screens of the app (including internal ones)
export function registerScreens() {
	Navigation.registerComponent('calbum.ProfileScreen', () => ProfileScreen);
	Navigation.registerComponent('calbum.SubscribeScreen', () => SubscribeScreen);
	Navigation.registerComponent('calbum.TotalScreen', () => TotalScreen);
	Navigation.registerComponent('calbum.AlbumScreen', () => AlbumScreen);
	Navigation.registerComponent('calbum.ViewScreen', () => ViewScreen);
    Navigation.registerComponent('calbum.ThirdScreen', () => ThirdScreen);
    Navigation.registerComponent('calbum.SideMenu', () => SideMenu);
}

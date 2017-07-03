import {Navigation} from 'react-native-navigation';

import ProfileScreen from './ProfileScreen';
import SubscribeScreen from './SubscribeScreen';
import TotalScreen from './TotalScreen';
import SummaryScreen from './SummaryScreen';
import InAlbumScreen from './InAlbumScreen';
import InTagScreen from './InTagScreen';
import AlbumScreen from './AlbumScreen';
import TagScreen from './TagScreen';
import ViewScreen from './ViewScreen';
import SideMenu from './SideMenu';

// register all screens of the app (including internal ones)
export function registerScreens() {
	Navigation.registerComponent('calbum.ProfileScreen', () => ProfileScreen);
	Navigation.registerComponent('calbum.SubscribeScreen', () => SubscribeScreen);
	Navigation.registerComponent('calbum.TotalScreen', () => TotalScreen);
	Navigation.registerComponent('calbum.SummaryScreen', () => SummaryScreen);
	Navigation.registerComponent('calbum.InAlbumScreen', () => InAlbumScreen);
	Navigation.registerComponent('calbum.InTagScreen', () => InTagScreen);
	Navigation.registerComponent('calbum.AlbumScreen', () => AlbumScreen);
	Navigation.registerComponent('calbum.TagScreen', () => TagScreen);
	Navigation.registerComponent('calbum.ViewScreen', () => ViewScreen);
    Navigation.registerComponent('calbum.SideMenu', () => SideMenu);
}

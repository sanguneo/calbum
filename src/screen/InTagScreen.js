/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	Alert,
	Image,
	Dimensions
} from 'react-native';

import Thumbnail from '../component/Thumbnail';

const RNFS = require('react-native-fs');

const owidth = (function() {
	let w = Dimensions.get('window').width;
	let p = Math.round(w / 150);
	return Math.round(w/p) - 8;
})();

export default class InTagScreen extends Component {
	static navigatorButtons = {
		leftButtons: [
			{
				id: 'sideMenu' // id is locked up 'sideMenu'
			}
		]
	};

	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.props.global.setVar('parent', this);
		this.state = {
			rows: [],
		}
		this._getPhoto(this.props.profile);
	}
	_goPhoto(title, unique_key) {
		this.props.navigator.push({
			screen: "calbum.ViewScreen", // unique ID registered with Navigation.registerScreen
			title: title, // title of the screen as appears in the nav bar (optional)
			passProps: {unique_key, dbsvc:this.props.dbsvc, crypt:this.props.crypt, global: this.props.global, profile: this.props.profile},
			navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
			navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
			animated: true,
			animationType: 'fade' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
		});
	}
	_getPhoto() {
		this.props.dbsvc.getPhotoByTag((ret) => {
			this.setState({
				rows: ret.map((i, idx) => {
					return <Thumbnail
						key={idx}
						style={styles.thumbnail}
						title={i.title}
						uri={'file://' + RNFS.DocumentDirectoryPath + '/_thumb_/' + i.unique_key + '_' + this.props.profile[2] + '.jpg'}
						onPress={()=> {this._goPhoto(i.title +'', i.unique_key + '');}}
					/>
				})
			});
		}, this.props.profile[0], this.props.tagname);
	}
	onNavigatorEvent(event) {
	}
	render() {
		return (
			<ScrollView>
				<View style={styles.container}>
					{this.state.rows}
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	text: {
		width: Dimensions.get('window').width,
		height: 40,

		textAlign: 'center',
		textAlignVertical: 'center'
	},
	thumbnail: {
		width: owidth,
		height: owidth,

		marginVertical: 5,
		marginHorizontal: 4,

		borderColor: 'rgba(0,0,0,0.2)',
		borderWidth: 1
	}
});

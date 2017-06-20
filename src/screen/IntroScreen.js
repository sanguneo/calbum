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

export default class IntroScreen extends Component {
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
		this.global = props.global;
		this.state = {
			rows: [],
			userid: ''
		}
		props.dbsvc.getPhoto((ret) => {
			this.setState({
				rows: ret.map((i, idx) => {
						return <Thumbnail
							key={idx}
							style={styles.thumbnail}
							title={i.title}
							uri={'file://' + RNFS.DocumentDirectoryPath + '/_thumb_/' + i.unique_key + '_' + i.user_key + '.jpg'}
						/>
					})
			});
		});

	}
	onNavigatorEvent(event) {

	}
	render() {
		return (
			<ScrollView>
				<Text>{this.state.userid}</Text>
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
		// justifyContent: 'space-around',
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

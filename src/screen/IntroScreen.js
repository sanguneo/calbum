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
	Alert
} from 'react-native';

const RNFS = require('react-native-fs');

export default class IntroScreen extends Component {
	static navigatorButtons = {
		leftButtons: [
			{
				id: 'sideMenu' // id is locked up 'sideMenu'
			}
		],
		rightButtons: [
		]
	};

	constructor(props) {
		super(props);
		this.state = {
			rows: []
		}
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		var svcc = props.dbsvc;
		svcc.getUSER((ret) => {
			this.setState({rows: ret});
		});
		RNFS.readDir(RNFS.DocumentDirectoryPath)
		.then((result) => {
			let resarr = [];
			result.forEach((e) => resarr.push(e.path));
			if (resarr.indexOf(RNFS.DocumentDirectoryPath + '/_profiles_') < 0) {
				RNFS.mkdir(RNFS.DocumentDirectoryPath + '/_profiles_');
				console.log('mkdir \'_profiles_\' success!!');
			}
		})
		.catch((err) => {
			console.error(err.message, err.code);
		});
	}

	onNavigatorEvent(event) {
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					{this.state.rows}
					페이지를 테스트합니다.
				</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});

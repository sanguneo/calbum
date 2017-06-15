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
	Alert,
	Image
} from 'react-native';
const RNFS = require('react-native-fs');
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
		this.state = {
			rows: []
		}
		props.dbsvc.getPhoto((ret) => {
			this.setState({
				rows: JSON.formatedString(ret.map((i) => {
						return i.title + '_' +i.unique_key;
					}))
			});
		});
	}
	onNavigatorEvent(event) {

	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					{this.state.rows}
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
		textAlign: 'left',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});

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
		var svcc = props.dbsvc;
		svcc.getUSER((ret) => {
			this.setState({rows: ret});
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

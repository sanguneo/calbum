'use strict';

import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';

export default class Button extends Component {
	render() {
		return (
			<TouchableOpacity
				style={[styles.button, this.props.style]}
				onPress={this.props.onPress}>
				<Image source={this.props.imgsource} style={styles.btnimg} />
				<Text style={styles.btntext}>{this.props.btnname}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		backgroundColor: '#bdbdbd',
		borderRadius: 5,
		borderColor: '#e0e0e0',
		borderWidth: 1
	},
	btnimg: {
		width: 26,
		height: 26,
		marginTop: 9,
		marginBottom: 6,
		tintColor: '#fff'
	},
	btntext: {
		marginLeft: 10,
		height: 30,
		fontSize: 20,
		marginTop: 7,
		marginBottom: 5,
		textAlignVertical: 'center',
		color: '#fff'
	}
});

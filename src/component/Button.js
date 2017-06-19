import React, {Component} from 'react';
import {
	TouchableOpacity,
	Image,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export default class Button extends Component{
	render() {
		return (
			<TouchableOpacity style={[styles.button, this.props.style]} onPress={this.props.onPress}>
				<Image source={this.props.imgsource} style={styles.btnimg} /><Text style={styles.btntext} >저장</Text>
			</TouchableOpacity>
		);
	}
};

const styles = StyleSheet.create({

	button: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		backgroundColor: '#6cbf84',
		borderRadius: 5,
		borderColor: '#dfe2d2',
		borderWidth:1
	},
	btnimg: {
		width: 20,
		height: 20,
		marginTop: 13,
		marginBottom: 12,
		tintColor: '#fff',
	},
	btntext: {
		marginLeft: 20,
		height: 30,
		fontSize: 20,
		marginTop:7,
		textAlignVertical: 'center',
		color: '#fff'
	}

});

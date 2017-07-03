import React, {Component} from 'react';
import {
	TouchableOpacity,
	Image,
	StyleSheet,
	Text,
} from 'react-native';

export default class Thumbnail extends Component{
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<TouchableOpacity style={[styles.thumbnail, this.props.style]} onPress={this.props.onPress}>
				<Image source={{uri:this.props.uri}} style={styles.thumbImage}></Image>
				<Text style={styles.thumbnailText}>{this.props.title}</Text>
			</TouchableOpacity>
		);
	}
};

const styles = StyleSheet.create({
	thumbnail: {
		width: 150,
		height: 150,
	},
	thumbImageWrapper: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	thumbImage: {
		flex: 0.75,
	},
	thumbnailText: {
		flex: 0.25,
		textAlignVertical: 'center',
		paddingHorizontal: 10
	}
});

'use strict';

import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Util from '../service/util_svc';

export default class Thumbnail extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let title = this.props.title
			? this.props.title
			: this.props.regdate
				? Util.dateFormatter(this.props.regdate)
				: 'noname';
		return (
			<TouchableOpacity
				style={[styles.thumbnail, this.props.style]}
				onPress={this.props.onPress}>
				<Image source={{uri: this.props.uri}} style={styles.thumbImage} />
				<Text style={styles.thumbnailText} numberOfLines={1} ellipsizeMode='tail' >{title}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	thumbnail: {
		width: 150,
		height: 150
	},
	thumbImageWrapper: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	thumbImage: {
		flex: 0.75
	},
	thumbnailText: {
		flex: 0.25,
		textAlignVertical: 'center',
		paddingHorizontal: 5,
		fontSize: 13
	}
});

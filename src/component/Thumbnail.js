import React, {Component} from 'react';
import {
	TouchableOpacity,
	Image,
	StyleSheet,
	Text,
} from 'react-native';

const pad = (num, size=2) => {
	var s = "0000" + num;
	return s.substr(s.length-size);
}

export default class Thumbnail extends Component{
	constructor(props) {
		super(props);
	}

	_dateFormatter(timestamp, format) {
		let date = new Date(parseInt(timestamp));
		return format
			.replace('Y',pad(date.getFullYear(),4))
			.replace('M',pad(date.getMonth()+1))
			.replace('D',pad(date.getDate()))
			.replace('h',pad(date.getHours()))
			.replace('i',pad(date.getMinutes()))
			.replace('s',pad(date.getSeconds()));
	}

	render() {
		let title = this.props.title ? this.props.title : (this.props.regdate ? this._dateFormatter(this.props.regdate, 'Y-M-D h:i') : 'noname');
		return (
			<TouchableOpacity style={[styles.thumbnail, this.props.style]} onPress={this.props.onPress}>
				<Image source={{uri:this.props.uri}} style={styles.thumbImage}></Image>
				<Text style={styles.thumbnailText}>{title}</Text>
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
		paddingHorizontal: 5
	}
});

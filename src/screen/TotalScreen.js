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

export default class TotalScreen extends Component {
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
		if (this.props.profile)
			this._getPhoto(this.props.profile);
	}
	_getPhoto(profilearg) {
		let profile = profilearg ? profilearg :  [false];
		this.props.dbsvc.getPhoto((ret) => {
			let res = [];
			let curr_an = '_reset_';
			for (var i=0;i < ret.length;i++){
				if (!ret[i].albumname)
					ret[i].albumname = '사진첩 선택안함';
				if (curr_an !== ret[i].albumname) {
					curr_an = ret[i].albumname;
					res.push(curr_an);
				}
				res.push(ret[i]);
			}
			this.setState({
				rows: res.map((i, idx) => {
					if (typeof i === 'string') {
						return <Text key={idx} style={styles.text}>{i}</Text>;
					}
					return <Thumbnail
						key={idx}
						style={styles.thumbnail}
						title={i.title}
						uri={'file://' + RNFS.DocumentDirectoryPath + '/_thumb_/' + i.unique_key + '_' + i.user_key + '.jpg'}
					/>
				})
			});
		}, profile[0]);
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

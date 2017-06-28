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
	TextInput,
	TouchableOpacity,
	Dimensions
} from 'react-native';

const commonStyle = {
	placeholderTextColor: '#bbb'
}
export default class TagScreen extends Component {
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
			tagname: '',
			rows: [],
		}
		if (this.props.profile)
			this._getTags();
	}
	onNavigatorEvent(event) {
	}
	_goTag(tagname) {
		let aobj = {
			screen: "calbum.InTagScreen",
			title: '"' + tagname + '" 태그',
			passProps: {dbsvc:this.props.dbsvc, crypt:this.props.crypt, global: this.props.global, profile: this.props.profile},
			navigatorStyle: {},
			navigatorButtons: {leftButtons: [
				{
					id: 'sideMenu' // id is locked up 'sideMenu'
				}
			]},
			animated: false,
			animationType: 'none'
		}
		if (tagname === '선택안함') {
			aobj.title = '앨범 선택안됨';
		}else {
			aobj.passProps.tagname = tagname;
		}

		this.props.navigator.push(aobj);
	}
	_getTags() {
		this.props.dbsvc.getTagGroups(this.props.profile[0], (ret) => {
			this.setState({rows: ret.map((item)=>{return item.name})});
		});
	}
	render() {
		let taglist = this.state.rows.map((item, idx) => {
			return (
				<View  style={styles.row} key={idx}>
					<TouchableOpacity key={idx} onPress={()=>{this._goTag(item + '');}} >
						<Text style={styles.rowContent}>{item}</Text>
					</TouchableOpacity>
				</View>
			);
		});
		return (
			<ScrollView>
				<View style={styles.container}>
					{taglist}
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
		paddingHorizontal: 10,
	},
	row: {
		flexDirection: 'row',
		height: 40,
		paddingHorizontal: 20,
		marginHorizontal: 5,
		marginVertical: 5,

		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
	},
	rowContent: {
		height: 40,
		paddingHorizontal: 0,

		textAlignVertical: 'center',

		fontSize: 18,
		color: '#000',
	},
});

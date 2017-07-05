/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	TouchableOpacity,
	Dimensions
} from 'react-native';

import Thumbnail from '../component/Thumbnail';
import Titler from '../component/Titler';

const RNFS = require('react-native-fs');

const owidth = (() => {
	let w = Dimensions.get('window').width;
	let p = Math.round(w / 150);
	return Math.round(w/p) - 8;
})();
const ot = (() => {
	return Math.round(Dimensions.get('window').width / 150);
})();

export default class SummaryScreen extends Component {
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
			style:{}
		}
		this.props.global.getUntil('side',
			(e) =>{
				this.setState({
					profile: e.state.profile,
					uniquekey: e.state.uniquekey,
					userid: e.state.userid,
					name: e.state.name,
					email: e.state.email,
				})
			},
			(c) => {
				this._getPhoto(this.props.profile);
				return c.state.uniquekey !== undefined && c.state.uniquekey !== null && c.state.uniquekey !== '';
			}
		);

	}
	_goAlbum(albumname) {
		let aobj = {
			screen: "calbum.InAlbumScreen",
			title: '"' + albumname + '" 앨범',
			passProps: {dbsvc:this.props.dbsvc, crypt:this.props.crypt, global: this.props.global, profile: [this.state.uniquekey, this.state.profile, this.state.userid, this.state.name, this.state.email]},
			navigatorStyle: {},
			navigatorButtons: {leftButtons: [
				{
					id: 'sideMenu' // id is locked up 'sideMenu'
				}
			]},
			animated: false,
			animationType: 'none'
		}
		if (albumname === '선택안함') {
			aobj.title = '앨범 선택안됨';
		}else {
			aobj.passProps.albumname = albumname;
		}

		this.props.navigator.push(aobj);
	}
	_goPhoto(title, unique_key) {
		this.props.navigator.push({
			screen: "calbum.ViewScreen", // unique ID registered with Navigation.registerScreen
			title: title, // title of the screen as appears in the nav bar (optional)
			passProps: {title, unique_key, dbsvc:this.props.dbsvc, crypt:this.props.crypt, global: this.props.global, profile: [this.state.uniquekey, this.state.profile, this.state.userid, this.state.name, this.state.email]},
			navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
			navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
			animated: true,
			animationType: 'fade', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
			overrideBackPress: true,
		});
	}
	_getPhoto(profilearg) {
		let profile = profilearg ? profilearg :  [false];
		this.props.dbsvc.getPhotoEachGroup((ret) => {
			if(ret.length > 0) {
				let res = [];
				let curr_an = '_reset_';
				for (var i = 0; i < ret.length; i++) {
					if (!ret[i].albumname)
						ret[i].albumname = '선택안함';
					if (curr_an !== ret[i].albumname) {
						curr_an = ret[i].albumname;
						res.push(curr_an);
					}
					res.push(ret[i]);
				}
				this.setState({
					rows: res.map((i, idx) => {
						if (typeof i === 'string') {
							return <Titler key={idx} onPress={()=>{this._goAlbum(i + '');}}>{i}</Titler>
						}
						return <Thumbnail
							key={idx}
							style={styles.thumbnail}
							title={i.title}
							uri={'file://' + RNFS.DocumentDirectoryPath + '/_thumb_/' + i.unique_key + '_' + this.state.userid + '.jpg'}
							onPress={()=> {this._goPhoto(i.title +'', i.unique_key + '');}}
						/>
					})
				});
			} else {
				this.setState({
					style: {
						flex: 1,
						flexWrap: 'nowrap',
						justifyContent: 'center',
						alignItems: 'center',
					},
					rows: <Text style={{fontSize: 20}}>{'결과가 없습니다.'}</Text>
				});
			}
		}, profile[0], ot);
	}
	onNavigatorEvent(event) {
	}
	render() {
		if (this.state.rows.length >0)
			return (<View>
				<ScrollView>
					<View style={styles.container}>
						{this.state.rows}
					</View>
				</ScrollView>
			</View>)
		else
			return (<View style={[styles.container, this.state.style]}>
				{this.state.rows}
			</View>);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
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

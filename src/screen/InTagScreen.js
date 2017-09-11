import React, {Component} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';

import Thumbnail from '../component/Thumbnail';
import Util from '../service/util_svc';
import AdBar from '../component/AdBar';
import Loading from '../component/Loading';

const RNFS = require('react-native-fs');

const owidth = (function() {
	let w = Dimensions.get('window').width;
	let p = Math.round(w / 150);
	return Math.round(w/p) - 8;
})();

export default class InTagScreen extends Component {

	static navigatorButtons = {
		leftButtons: [{ id: 'sideMenu'}]
	};


	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.props.global.setVar('parent', this);
		this.state = {
			rows: [],
			style: {},
			loading: true
		};
		this._getPhoto(this.props.user);
	}

	onNavigatorEvent(event) {
	}


	_goPhoto(title, uniqkey) {
		this.props.navigator.push({
			screen: "calbum.ViewScreen", // unique ID registered with Navigation.registerScreen
			title: title, // title of the screen as appears in the nav bar (optional)
			passProps: {title, uniqkey, dbsvc:this.props.dbsvc, crypt:this.props.crypt, global: this.props.global, user: this.props.user},
			navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
			navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
			animated: true,
			animationType: 'fade', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
			overrideBackPress: true,
		});
	}
	_getPhoto() {
		let key = Math.random();
		this.props.dbsvc.getPhotoByTag((ret) => {
			if(ret.length > 0) {
				this.setState({
					style: null,
					rows: ret.map((i, idx) => {
						return <Thumbnail
							key={idx}
							style={styles.thumbnail}
							title={i.title}
							regdate={i.reg_date}
							uri={'file://' + RNFS.DocumentDirectoryPath + '/_thumb_/' + i.unique_key + '_' + this.props.user[2] + '.jpghidden?key=' + key}
							onPress={()=> {this._goPhoto(i.title ? i.title : Util.dateFormatter(i.reg_date), i.unique_key + '');}}
						/>
					}),
				});
				setTimeout(() => {
					this.setState({
						loading : false
					});
				}, 1000);
			} else {
				setTimeout(() => {
					this.setState({
						loading : false
					});
				}, 1000);
			}
		}, this.props.user[0], this.props.tagname);
	}


	render() {
		if (this.state.rows.length >0)
			return (<View style={styles.wrapper}>
				<ScrollView style={styles.scrollview}>
					<View style={styles.container}>
						{this.state.rows}
					</View>
				</ScrollView>
				<AdBar/>
				<Loading show={this.state.loading}/>
			</View>);
		else
			return (<View style={[styles.container, styles.nodatastyle]}>
				<Text style={{fontSize: 20}}>{'사진을 등록해주세요!'}</Text>
				<AdBar style={{position: 'absolute',width: Dimensions.get('window').width,bottom: 0}}/>
				<Loading show={this.state.loading}/>
			</View>);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	scrollview: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height - 260,
	},
	container: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	nodatastyle: {
		flex: 1,
		flexWrap: 'nowrap',
		justifyContent: 'center',
		alignItems: 'center',
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

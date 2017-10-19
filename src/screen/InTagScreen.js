import React, {Component} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';

import Thumbnail from '../component/Thumbnail';
import AdBar from '../component/AdBar';
import Loading from '../component/Loading';
import Util from '../service/util_svc';

const RNFS = require('react-native-fs');

const{width,height,deviceWidth,deviceHeight, scale}=function(){
	let i=Dimensions.get("window"),e=i.scale;
	return{width:i.width,height:i.height,deviceWidth:i.width*e,deviceHeight:i.height*e,scale: e}
}();
const owidth = (function() {
	let devW = (1440 > deviceWidth > 1080) ? 1440 : deviceWidth;
	let scaledThumbSize = 150 * scale;
	let quantityInline = Math.ceil(devW / scaledThumbSize);
	return Math.round(devW / quantityInline / scale) - 8 - (quantityInline - Math.round(devW / scaledThumbSize));
})();

export default class InTagScreen extends Component {

	static navigatorButtons = {
		leftButtons: [{ id: 'sideMenu'}]
	};


	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.state = {
			rows: [],
			style: {},
			loading: true
		};
        this.props.global.setVar('parent', this);
		this._getPhoto(this.props.user);
	}

	onNavigatorEvent(event) {
	}


	_goPhoto(title, photohash) {
		this.props.navigator.push({
			screen: "calbum.ViewScreen", // unique ID registered with Navigation.SignupScreen
			title: title, // title of the screen as appears in the nav bar (optional)
			passProps: {title, photohash, dbsvc:this.props.dbsvc, crypt:this.props.crypt, global: this.props.global, user: this.props.user},
			navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
			navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
			animated: true,
			animationType: 'fade', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
			overrideBackPress: true,
		});
	}
	_getPhoto() {
		let key = Math.random()*10000;
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
							uri={'file://' + RNFS.DocumentDirectoryPath + '/_thumb_/' + i.unique_key + '_' + this.props.user.email + '.calb?key=' + key}
							onPress={()=> {this._goPhoto(i.title ? i.title : Util.dateFormatter(i.reg_date), i.unique_key + '');}}
						/>
					}),
				});
				setTimeout(() => {
					this.setState({
						loading : false
					});
				}, 100);
			} else {
				setTimeout(() => {
					this.setState({
						loading : false
					});
				}, 500);
			}
		}, this.props.user.signhash, this.props.tagname);
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
				<AdBar style={{position: 'absolute',width: width,bottom: 0}}/>
				<Loading show={this.state.loading}/>
			</View>);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		width: width,
		height: height,
	},
	scrollview: {
		width: width,
		height: height - 260,
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
		width: width,
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

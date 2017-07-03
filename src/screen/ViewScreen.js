/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
	StyleSheet,
	Text,
	ScrollView,
	View,
	Image,
	Dimensions,
	TouchableOpacity,
	Alert,
	TextInput,
	Picker,
} from 'react-native';

import Button from '../component/Button';
import Lightbox from '../component/Lightbox';
import Hr from '../component/Hr';
import LabeledInput from '../component/LabeledInput';
const RNFS = require('react-native-fs');

const imgOpt = {
	width: 400,
	height: 800,
	cropping: true
};

const inputProps = {
	keyboardType: 'default',
	placeholder: '테그',
	autoFocus: false,
};

const commonStyle = {
	placeholderTextColor: '#bbb',
	hrColor: '#000',
	backgroundColor: '#f5f5f5'
}

import ImageViewer from 'react-native-image-zoom-viewer';
const images = [{ url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'}]
export default class ViewScreen extends Component {
	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.props.navigator.setStyle({
			navBarHideOnScroll: true,
		})
		this.crypt = props.crypt;
		this.db = props.dbsvc;
		this.state = {
			success: 'no',
			merged: {uri: null},
			title: this.props.title,
			recipe: '',
			userid: this.props.profile[2],
			userkey: this.props.profile[0],
			tags: [],
			regdate: new Date().getTime(),
			unique_key: this.props.unique_key,
			album: '',
			comment: '',
			albums: [],
			lightbox: true,
			side: '이미지',
			imageurl: [{ url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'}]
		}
	}

	onNavigatorEvent(event) {
		if (event.id === 'menu') {
			this.props.navigator.toggleDrawer({
				side: 'left',
				animated: true
			});
		}
	}

	componentDidMount() {
		let key = Math.random()*100000;
		this.db.getPhotoSpecific((res) => {
			let pPath = 'file://'+ RNFS.DocumentDirectoryPath + '/_original_/' + res.unique_key + '_' + this.state.userid + '.jpg?key=' + key;
			this.setState({
				merged: {uri: pPath},
				title: res.title,
				album: res.albumname,
				recipe: res.recipe,
				comment: res.comment.replace('\\n', '\n'),

			});
		}, this.state.userkey, this.state.unique_key);
		this.db.getTagSpecific((res) => {
			this.setState({
				tags: res.map((res)=>{
					return '#' + res.name;
				})
			});
		}, this.state.userkey, this.state.unique_key);
	}
	_getSideOriginal(side) {
		if(side === 'left'){
			this.refs.imagesbefore._open();
		} else {
			this.refs.imagesafter._open();
		}
	}
	_lbClose() {
		this.refs.imagesbefore._close();
		this.refs.imagesafter._close();
	}

	render() {
		let imgBefore = this.state.merged.uri ? <ImageViewer imageUrls={[{url: this.state.merged.uri.replace('.jpg', '_left.jpg')}]}/> : null;
		let imgAfter = this.state.merged.uri ? <ImageViewer imageUrls={[{url: this.state.merged.uri.replace('.jpg', '_right.jpg')}]}/> : null;
		return (
			<View>
				<ScrollView style={styles.container}>
					<View style={styles.imgView}>
						<Image source={this.state.merged} style={styles.img}/>
						<TouchableOpacity style={[styles.oimg, styles.leftImg]} onPress={()=> {this._getSideOriginal('left')}}></TouchableOpacity>
						<TouchableOpacity style={[styles.oimg, styles.rightImg]} onPress={()=> {this._getSideOriginal('right')}}></TouchableOpacity>
					</View>
					<View style={[styles.bgView,{marginTop: 15}]}>
						<Text style={{fontSize: 17}}>기본정보</Text>
					</View>
					<View style={styles.formWrapper}>
						<LabeledInput label={"제목"}>
							<Text style={styles.textboxag}>{this.state.title}</Text>
						</LabeledInput>
						<Hr lineColor={commonStyle.hrColor}/>
						<LabeledInput label={"앨범"}>
							<Text style={styles.textboxag}>{this.state.album}</Text>
						</LabeledInput>
						<Hr lineColor={commonStyle.hrColor}/>
						<LabeledInput label={"테그"}>
							<Text style={styles.textboxag}>{this.state.tags.join(', ')}</Text>
						</LabeledInput>
					</View>
					<View style={[styles.formWrapperDiv, {marginBottom: 30}]}>
						<Button imgsource={require('../../img/recipe.png')} style={{flex: 0.5, backgroundColor: '#2a93d5'}} onPress={()=>{this.refs.recipe._open();}} btnname={'레시피 보기'}/>
						<Button imgsource={require('../../img/comment.png')} style={{flex: 0.5, backgroundColor: '#aed9da'}} onPress={()=>{this.refs.comment._open();}} btnname={'코멘트 보기'}/>
					</View>
				</ScrollView>
				<Lightbox ref={'recipe'} title={'레시피'} duration={1000} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#000000'} color={'#ffffff'}>
					<View style={{width: Dimensions.get('window').width - 80, paddingHorizontal: 10, paddingBottom: 10}}>
						<Text style={{lineHeight: 30,fontSize: 16}}>{this.state.recipe === '' ? '레시피 없음' : this.state.recipe}</Text>
					</View>
				</Lightbox>
				<Lightbox ref={'comment'} title={'코멘트'} duration={1000} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#000000'} color={'#ffffff'}>
					<View style={{width: Dimensions.get('window').width - 80, paddingHorizontal: 10, paddingBottom: 10}}>
						<Text style={{lineHeight: 30,fontSize: 16}}>{this.state.comment === '' ? '코멘트 없음' : this.state.comment}</Text>
					</View>
				</Lightbox>
				<Lightbox ref={'imagesbefore'} title={'Before'} duration={1000} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#000'} color={'#fff'} collapsed={true} close={()=>{this._lbClose()}}>
					<View style={{width: Dimensions.get('window').width,height: Dimensions.get('window').height}}>
						{imgBefore}
					</View>
				</Lightbox>
				<Lightbox ref={'imagesafter'} title={'After'} duration={1000} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#000'} color={'#fff'} collapsed={true} close={()=>{this._lbClose()}}>
					<View style={{width: Dimensions.get('window').width,height: Dimensions.get('window').height}}>
						{imgAfter}
					</View>
				</Lightbox>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
	},
	imgView: {
		flex: 1,
		flexDirection: 'row',
		width: Dimensions.get('window').width ,
		height: Dimensions.get('window').width,
		justifyContent: 'center',
		alignItems: 'center'
	},
	img: {
		width: Dimensions.get('window').width < 800 ? Dimensions.get('window').width  : 800,
		height: Dimensions.get('window').width < 800 ? Dimensions.get('window').width : 800,
	},
	oimg: {
		position: 'absolute',
		backgroundColor: 'rgba(255,255,255,0.05)',
		width: Dimensions.get('window').width < 800 ? Dimensions.get('window').width /2  : 400,
		height: Dimensions.get('window').width < 800 ? Dimensions.get('window').width : 800,
	},
	leftImg: {
		left:0
	},
	rightImg: {
		right:0
	},
	formWrapper: {
		flex: 1,
		margin: 10,
		borderRadius:5,
		backgroundColor: commonStyle.backgroundColor
	},
	formWrapperDiv: {
		flexDirection: 'row',
		margin: 10,
		borderRadius:5,
		backgroundColor: commonStyle.backgroundColor
	},
	bgView: {
		backgroundColor: 'white',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 3,
		marginBottom: 2,
	},
	imglabel: {
		position: 'absolute',
		bottom: 10,
		width: Dimensions.get('window').width < 800 ? Dimensions.get('window').width / 2 : 400,
		fontSize: 15,
		textAlign: 'center'
	},
	labeledtextbox: {
		height: 42,

		margin: 0,
		marginLeft: 10,
		marginRight: 10,


		fontSize: 16,
		color: '#000',
		textAlign: 'left'
	},
	textbox: {
		height: 58,
		marginLeft: 10,
		marginRight: 10,
		fontSize: 16,
		color: '#000',
		marginBottom: 10,
	},
	textboxag: {
		minHeight: 36,
		lineHeight: 30,
		marginLeft: 20,
		marginRight: 20,
		fontSize: 16,
		color: '#000',
		borderWidth: 1,
		borderColor: '#000'
	},
	textboxag: {
		minHeight: 40,
		lineHeight: 30,
		marginLeft: 20,
		marginRight: 20,
		paddingBottom: 10,
		fontSize: 16,
		color: '#000',
	},
	album: {
		height: 41,
		marginLeft: 5,
		marginRight: 5,
		color: '#000',
		borderColor: commonStyle.placeholderTextColor,
		alignItems: 'center',
	},
});

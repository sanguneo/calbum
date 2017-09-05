import React, {Component} from 'react';
import {
	StyleSheet,
	Text,
	ScrollView,
	View,
	Image,
	Dimensions,
	TouchableOpacity
} from 'react-native';

import Button from '../component/Button';
import Lightbox from '../component/Lightbox';
import Hr from '../component/Hr';
import LabeledInput from '../component/LabeledInput';
import ImageViewer from 'react-native-image-zoom-viewer';
const RNFS = require('react-native-fs');

const commonStyle = {
	placeholderTextColor: '#bbb',
	hrColor: '#000',
	backgroundColor: '#f5f5f5'
}

export default class ViewScreen extends Component {

	static navigatorButtons = {
		rightButtons: [{ icon: require('../../img/modify.png'), id: 'edit' }]
	};


	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.props.navigator.setStyle({
			navBarHideOnScroll: true,
		});
		this.crypt = props.crypt;
		this.db = props.dbsvc;
		this.state = {
			success: 'no',
			merged: {uri: null},
			recipe: '',
			userid: this.props.profile[2],
			userkey: this.props.profile[0],
			tags: [],
			uniqkey: this.props.uniqkey,
			album: '',
			comment: '',
			albums: [],
			lightbox: true,
			side: '이미지',
			imageurl: [{ url: ''}]
		}
	}
	onNavigatorEvent(event) {
		if (event.id === 'close') {
			this._lightboxClose();
		}
		if (event.id === 'edit') {
			this.props.navigator.push({
				screen: "calbum.ModifyScreen",
				title: "'" + this.state.title + "' 수정하기",
				passProps: {
					dbsvc: this.props.dbsvc,
					crypt: this.props.crypt,
					global: this.props.global,
					profile: [
						this.state.userkey,
						this.state.profile,
						this.state.userid,
						this.state.name,
						this.state.email
					],
					parentUpdate : (title) => {
						this._getPhotoInformation();
						this.props.navigator.setTitle({title: title})
					},
					targetProps : {
						merged: this.state.merged,
						title: this.state.title,
						album: this.state.album,
						recipe: this.state.recipe,
						comment: this.state.comment,
						tags: this.state.tags.map((res)=>{ return res.name;}),
						uniqkey: this.props.uniqkey,
					}
				},
				navigatorStyle: {},
				navigatorButtons: {
					rightButtons: [{ icon: require('../../img/checkmark.png'),id: 'save'}]
				},
				animated: true,
				animationType: 'slide-up'
			});
		}
		if (event.id === 'backPress') {
			if (!this.side) {
				this.props.navigator.pop();
			} else {
				this._lightboxClose();
			}
		}
	}


	_getPhotoInformation() {
		let key = Math.random()*100000;
		this.db.getPhotoSpecific((res) => {
			let pPath = 'file://'+ RNFS.DocumentDirectoryPath + '/_original_/' + res.unique_key + '_' + this.state.userid + '.jpghidden?key=' + key;
			this.setState({
				merged: {uri: pPath},
				title: res.title,
				album: res.albumname,
				recipe: res.recipe.replace('\\n', '\n'),
				comment: res.comment.replace('\\n', '\n'),
			});
		}, this.state.userkey, this.state.uniqkey);
		this.db.getTagSpecific((res) => {
			this.setState({tags: res});
		}, this.state.userkey, this.state.uniqkey);
	}

	_getSideOriginal(side) {
		this.side = null;

		this.props.navigator.setButtons({
			leftButtons: [],
			rightButtons: [{id: 'close', icon: require('../../img/navicon_close.png')}],
			animated: true
		});
		if(side === 'left'){
			this.side = 'imagesbefore';
			this.props.navigator.setTitle({title: 'Before'});
		} else {
			this.side = 'imagesafter';
			this.props.navigator.setTitle({title: 'After'});
		}
		this.refs[this.side]._open();


	}
	_lightboxClose() {
		this.refs[this.side]._close();
		this.props.navigator.setTitle({ title: this.props.title });
		this.props.navigator.setButtons({
			leftButtons: [{id: 'back'}],
			rightButtons: [{ icon: require('../../img/modify.png'), id: 'edit'}],
			animated: true
		});
		this.side = null;
	}


	componentDidMount() {
		this._getPhotoInformation();
	}
	render() {
		let album = this.state.album ? this.state.album : '선택안함';
		let tags = this.state.tags.length === 0 ? '테그 없음' : this.state.tags.map((res)=>{
			return '#' + res.name;
		}).join(', ');
		let imgBefore = this.state.merged.uri ? <ImageViewer imageUrls={[{url: this.state.merged.uri.replace('.jpghidden', '_left.jpghidden')}]}/> : null;
		let imgAfter = this.state.merged.uri ? <ImageViewer imageUrls={[{url: this.state.merged.uri.replace('.jpghidden', '_right.jpghidden')}]}/> : null;
		return (
			<View>
				<ScrollView style={styles.container}>
					<View style={styles.imgView}>
						<Image source={this.state.merged} style={styles.img}/>
						<Text style={[styles.imglabel, styles.lblLeft]}>Before</Text>
						<Text style={[styles.imglabel, styles.lblRight]}>After</Text>
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
							<Text style={styles.textboxag}>{album}</Text>
						</LabeledInput>
						<Hr lineColor={commonStyle.hrColor}/>
						<LabeledInput label={"테그"}>
							<Text style={styles.textboxag}>{tags}</Text>
						</LabeledInput>
					</View>
					<View style={[styles.formWrapperDiv, {marginBottom: 30}]}>
						<Button imgsource={require('../../img/recipe.png')} style={{flex: 0.5, backgroundColor: '#E3BAB3'}} onPress={()=>{this.refs.recipe._open();}} btnname={'레시피 보기'}/>
						<Button imgsource={require('../../img/comment.png')} style={{flex: 0.5, backgroundColor: '#A1BBD0'}} onPress={()=>{this.refs.comment._open();}} btnname={'코멘트 보기'}/>
					</View>
				</ScrollView>
				<Lightbox ref={'recipe'} title={'레시피'} duration={500} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#fff'} color={'#000'}>
					<View style={{width: Dimensions.get('window').width - 80, paddingHorizontal: 10, paddingBottom: 10}}>
						<Text style={{lineHeight: 20,fontSize: 16}}>{this.state.recipe === '' ? '레시피 없음' : this.state.recipe}</Text>
					</View>
				</Lightbox>
				<Lightbox ref={'comment'} title={'코멘트'} duration={500} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#fff'} color={'#000'}>
					<View style={{width: Dimensions.get('window').width - 80, paddingHorizontal: 10, paddingBottom: 10}}>
						<Text style={{lineHeight: 20,fontSize: 16}}>{this.state.comment === '' ? '코멘트 없음' : this.state.comment}</Text>
					</View>
				</Lightbox>
				<Lightbox ref={'imagesbefore'} title={'Before'} duration={500} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#000'} color={'#fff'} collapsedStyle={{paddingTop:0}} collapsed={true} hideTop={true} close={()=>{this._lightboxClose()}}>
					<View style={{width: Dimensions.get('window').width,height: Dimensions.get('window').height}}>
						{imgBefore}
					</View>
				</Lightbox>
				<Lightbox ref={'imagesafter'} title={'After'} duration={500} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#000'} color={'#fff'} collapsedStyle={{paddingTop:0}} collapsed={true} hideTop={true} close={()=>{this._lightboxClose()}}>
					<View style={{width: Dimensions.get('window').width,height: Dimensions.get('window').height}}>
						{imgAfter}
					</View>
				</Lightbox>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	imgView: {
		flex: 1,
		flexDirection: 'row',
		width: Dimensions.get('window').width ,
		height: Dimensions.get('window').width + 40,
		justifyContent: 'center',
		alignItems: 'flex-start',
		borderColor: 'lightgray',
		borderBottomWidth: 1
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
	imglabel: {
		position: 'absolute',
		bottom: -15,
		width: Dimensions.get('window').width < 800 ? Dimensions.get('window').width / 2 : 400,
		height: 50,
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white',
	},
	lblLeft: {
		color: 'rgba(227,48,45,0.9)',
		right: Dimensions.get('window').width < 800 ? Dimensions.get('window').width / 2 : 400,
	},
	lblRight: {
		color: 'rgba(58,142,207,0.8)',
		left: Dimensions.get('window').width < 800 ? Dimensions.get('window').width / 2 : 400,
	}
});

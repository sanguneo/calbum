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
const RNFS = require('react-native-fs');

const commonStyle = {
	placeholderTextColor: '#bbb',
	hrColor: '#000',
	backgroundColor: '#f5f5f5'
}

import ImageViewer from 'react-native-image-zoom-viewer';
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
			imageurl: [{ url: ''}]
		}
	}

	onNavigatorEvent(event) {
		if (event.id === 'close') {
			this._lightboxClose();
		}
		if (event.id === 'backPress') {
			if (!this.side)
				this.props.navigator.pop();
			else
				this._lightboxClose();
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
		let close = () => {};
		this.side = null;

		this.props.navigator.setButtons({
			leftButtons: [], // see "Adding buttons to the navigator" below for format (optional)
			rightButtons: [{id: 'close', icon: require('../../img/navicon_close.png')}], // see "Adding buttons to the navigator" below for format (optional)
			animated: true // does the change have transition animation or does it happen immediately (optional)
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
		this.props.navigator.setTitle({
			title: this.props.title // the new title of the screen as appears in the nav bar
		});
		this.props.navigator.setButtons({
			leftButtons: [{id: 'back'}],
			rightButtons: [],
			animated: true // does the change have transition animation or does it happen immediately (optional)
		});
		this.side = null;
	}

	render() {
		let imgBefore = this.state.merged.uri ? <ImageViewer imageUrls={[{url: this.state.merged.uri.replace('.jpg', '_left.jpg')}]}/> : null;
		let imgAfter = this.state.merged.uri ? <ImageViewer imageUrls={[{url: this.state.merged.uri.replace('.jpg', '_right.jpg')}]}/> : null;
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
							<Text style={styles.textboxag}>{this.state.album}</Text>
						</LabeledInput>
						<Hr lineColor={commonStyle.hrColor}/>
						<LabeledInput label={"테그"}>
							<Text style={styles.textboxag}>{this.state.tags.join(', ')}</Text>
						</LabeledInput>
					</View>
					<View style={[styles.formWrapperDiv, {marginBottom: 30}]}>
						<Button imgsource={require('../../img/recipe.png')} style={{flex: 0.5, backgroundColor: '#E3BAB3'}} onPress={()=>{this.refs.recipe._open();}} btnname={'레시피 보기'}/>
						<Button imgsource={require('../../img/comment.png')} style={{flex: 0.5, backgroundColor: '#A1BBD0'}} onPress={()=>{this.refs.comment._open();}} btnname={'코멘트 보기'}/>
					</View>
				</ScrollView>
				<Lightbox ref={'recipe'} title={'레시피'} duration={500} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#fff'} color={'#000'}>
					<View style={{width: Dimensions.get('window').width - 80, paddingHorizontal: 10, paddingBottom: 10}}>
						<Text style={{lineHeight: 30,fontSize: 16}}>{this.state.recipe === '' ? '레시피 없음' : this.state.recipe}</Text>
					</View>
				</Lightbox>
				<Lightbox ref={'comment'} title={'코멘트'} duration={500} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#fff'} color={'#000'}>
					<View style={{width: Dimensions.get('window').width - 80, paddingHorizontal: 10, paddingBottom: 10}}>
						<Text style={{lineHeight: 30,fontSize: 16}}>{this.state.comment === '' ? '코멘트 없음' : this.state.comment}</Text>
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
	imglabel: {
		position: 'absolute',
		bottom: 10,
		width: Dimensions.get('window').width < 800 ? Dimensions.get('window').width / 2 : 400,
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

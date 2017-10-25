'use strict';

import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';

import * as appActions from "../reducer/app/actions";

import Button from '../component/Button';
import Lightbox from '../component/Lightbox';
import Hr from '../component/Hr';
import LabeledInput from '../component/LabeledInput';
import AdBar from '../component/AdBar';
import Loading from '../component/Loading';
import Tags from '../component/Tags';
import ImageViewer from 'react-native-image-zoom-viewer';
import Util from '../service/util_svc';

const RNFS = require('react-native-fs');

const {width, height} = Dimensions.get('window');

const commonStyle = {
	placeholderTextColor: '#bbb',
	hrColor: '#878787',
	backgroundColor: '#f5f5f5'
};

class ViewScreen extends Component {

	static navigatorButtons = {
		rightButtons: [{ icon: require('../../img/cut.png'), id: 'edit' }]
	};

	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.props.navigator.setStyle({
			navBarHideOnScroll: true,
		});
		this.crypt = props.crypt;
		this.state = {
			success: 'no',
			title: '',
			merged: {uri: ''},
			recipe: '',
			email: props.user.email,
			signhash: props.user.signhash,
			tags: [],
			photohash: props.photohash,
			comment: '',
			lightbox: true,
			side: '이미지',
			imageurl: [{ url: ''}],
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
					parentUpdate : (title) => {
						this._getPhotoInformation();
						title ? this.props.navigator.setTitle({title}) : null;
						this.props.updateList();
					},
					targetProps : {
						merged: this.state.merged,
						title: this.state.title,
						recipe: this.state.recipe,
						comment: this.state.comment,
						tags: this.state.tags.map((res)=>{ return res.name;}),
						photohash: this.state.photohash,
						regdate: this.state.regdate
					}
				},
				navigatorStyle: {},
				navigatorButtons: {},
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

	_goTag(tagname) {
		let aobj = {
			screen: "calbum.InTagScreen",
			title: '#' + tagname,
			passProps: {dbsvc:this.props.dbsvc, crypt:this.props.crypt, global: this.props.global},
			navigatorStyle: {},
			navigatorButtons: {
				rightButtons: [{ icon: require('../../img/cut.png'), id: 'edit' }]
			},
			animated: false,
			animationType: 'none'
		};
		if (tagname === '선택안함') {
			aobj.title = '태그 선택안됨';
		}else {
			aobj.passProps.tagname = tagname;
		}

		this.props.navigator.push(aobj);
	}
	_getPhotoInformation() {
		this.props.dispatch(appActions.loading());
		let key = Math.random()*10000;
		this.props.dbsvc.getPhotoSpecific((res) => {
			let pPath = 'file://'+ RNFS.DocumentDirectoryPath + '/_original_/' + res.photohash + '_' + this.props.user.email + '.scalb?key=' + key;
			let info = {
				merged: {uri: pPath},
				title: res.title,
				regdate: res.reg_date,
				recipe: res.recipe.replace('\\n', '\n'),
				comment: res.comment.replace('\\n', '\n'),
			};
			this.props.dbsvc.getTagSpecific((rest) => {
				info.tags = rest;
				this.setState(info);
				this.props.navigator.setTitle({ title: this.props.title ? this.props.title : Util.dateFormatter(this.props.regdate)});
				this.props.dispatch(appActions.loaded());
			}, this.props.user.signhash, this.state.photohash);
		}, this.props.user.signhash, this.state.photohash);
	}

	_getSideOriginal(side) {
		this.side = null;
		this.props.navigator.setButtons({
			leftButtons: [],
			rightButtons: [{id: 'close', icon: require('../../img/close.png')}],
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
		this.props.navigator.setTitle({ title: this.props.title ? this.props.title : Util.dateFormatter(this.props.regdate)});
		this.props.navigator.setButtons({
			leftButtons: [{id: 'back'}],
			rightButtons: [{ icon: require('../../img/cut.png'), id: 'edit'}],
			animated: true
		});
		this.side = null;
	}

	componentWillMount() {
		this._getPhotoInformation();
	}
	render() {
		let imgBefore = this.state.merged.uri ? <ImageViewer imageUrls={[{url: this.state.merged.uri.replace('.scalb', '_left.scalb')}]}/> : null;
		let imgAfter = this.state.merged.uri ? <ImageViewer imageUrls={[{url: this.state.merged.uri.replace('.scalb', '_right.scalb')}]}/> : null;
		let cropBefore = this.state.merged.uri ? {uri : this.state.merged.uri.replace('.scalb', '_cropleft.scalb')} : require('../../img/pickphoto.png');
		let cropAfter = this.state.merged.uri ? {uri : this.state.merged.uri.replace('.scalb', '_cropright.scalb')} : require('../../img/pickphoto.png');
		return (
			<View>
				<ScrollView style={styles.container}>
					{/*<View style={styles.imgView}>*/}
						{/*<Image source={this.state.merged} style={styles.img}/>*/}
						{/*<Text style={[styles.imglabel, styles.lblLeft]}>Before</Text>*/}
						{/*<Text style={[styles.imglabel, styles.lblRight]}>After</Text>*/}
						{/*<TouchableOpacity style={[styles.oimg, styles.leftImg]} onPress={()=> {this._getSideOriginal('left')}}></TouchableOpacity>*/}
						{/*<TouchableOpacity style={[styles.oimg, styles.rightImg]} onPress={()=> {this._getSideOriginal('right')}}></TouchableOpacity>*/}
					{/*</View>*/}
					<View style={styles2.imgView}>
						<TouchableOpacity onPress={() => {this._changeImage('left')}}>
							<Image source={cropBefore} style={[styles2.img, {borderRightWidth: 0}]}/>
							<Text style={[styles2.imglabel, styles2.lblLeft]}>Before</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {this._changeImage('right')}}>
							<Image source={cropAfter} style={[styles2.img, {borderLeftWidth: 0}]}/>
							<Text style={[styles2.imglabel, styles2.lblRight]}>After</Text>
						</TouchableOpacity>
					</View>
					<View style={[styles.bgView,{marginTop: 15}]}>
						<Text style={{fontSize: 17}}>기본정보</Text>
					</View>
					<View style={styles.formWrapper}>
						<LabeledInput label={"제목"}>
							<Text style={styles.textboxag}>{this.state.title !== '' ? this.state.title : '제목없음'}</Text>
						</LabeledInput>
						<Hr lineColor={commonStyle.hrColor}/>
						<LabeledInput label={"태그"}>
							{this.state.tags.length === 0 ?
								<Text style={styles.textboxag}>{'태그없음'}</Text> :
								<Tags
									tagContainerStyle={styles.tagContainer}
									tagInputContainerStyle={styles.tagInputContainerStyle}
									tagTextStyle={styles.tagTextStyle}
									value={this.state.tags.map((res)=>{return res.name})}
									pressTag={(e) => {this._goTag(e)}}
									tagColor={commonStyle.placeholderTextColor}
									placeholderTextColor={commonStyle.placeholderTextColor}
									tagTextColor="white"
									parseOnBlur={true}
									numberOfLines={99}
									ref={"tag"}
								/>
							}
						</LabeledInput>
					</View>
					<View style={[styles.formWrapperDiv, {marginBottom: 30}]}>
						{this.state.recipe === '' ? null : <Button imgsource={require('../../img/recipe.png')} style={{flex: 0.5, backgroundColor: '#ff412b'}} onPress={()=>{this.refs.recipe._open();}} btnname={'레시피 보기'}/>}
						{this.state.comment === '' ? null : <Button imgsource={require('../../img/comment.png')} style={{flex: 0.5, backgroundColor: '#3692d9'}} onPress={()=>{this.refs.comment._open();}} btnname={'코멘트 보기'}/>}
					</View>
					<AdBar />
				</ScrollView>
				<Loading show={this.props.app.loading} style={{bottom: 0}}/>
				<Lightbox ref={'recipe'} title={'레시피'} duration={500} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#fff'} color={'#000'}>
					<View style={{width: width - 80, paddingHorizontal: 10, paddingBottom: 10}}>
						<Text style={{lineHeight: 20,fontSize: 16}}>{this.state.recipe === '' ? '레시피없음' : this.state.recipe}</Text>
					</View>
				</Lightbox>
				<Lightbox ref={'comment'} title={'코멘트'} duration={500} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#fff'} color={'#000'}>
					<View style={{width: width - 80, paddingHorizontal: 10, paddingBottom: 10}}>
						<Text style={{lineHeight: 20,fontSize: 16}}>{this.state.comment === '' ? '코멘트없음' : this.state.comment}</Text>
					</View>
				</Lightbox>
				<Lightbox ref={'imagesbefore'} title={'Before'} duration={500} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#000'} color={'#fff'} collapsedStyle={{paddingTop:0}} collapsed={true} hideTop={true} close={()=>{this._lightboxClose()}}>
					<View style={{width: width,height: height}}>
						{imgBefore}
					</View>
				</Lightbox>
				<Lightbox ref={'imagesafter'} title={'After'} duration={500} fromValue={0} toValue={1} stylekey={'opacity'} bgColor={'#000'} color={'#fff'} collapsedStyle={{paddingTop:0}} collapsed={true} hideTop={true} close={()=>{this._lightboxClose()}}>
					<View style={{width: width,height: height}}>
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
		width: width ,
		height: width + 40,
		justifyContent: 'center',
		alignItems: 'flex-start',
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
	img: {
		width: width < 800 ? width  : 800,
		height: width < 800 ? width : 800,
	},
	oimg: {
		width: width < 800 ? width /2  : 400,
		height: width < 800 ? width : 800,
	},
	oimg2: {
		position: 'absolute',
		backgroundColor: 'rgba(255,255,255,0.05)',
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
	tagbox: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		marginLeft: 20,
		marginRight: 10,
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
		minHeight: 30,
		lineHeight: 30,
		marginLeft: 20,
		marginRight: 20,
		paddingBottom: 10,
		fontSize: 16,
		color: '#000',
	},
	texttagboxag: {
		minHeight: 40,
		lineHeight: 30,
		fontSize: 16,
		color: '#000',
	},
	imglabel: {
		position: 'absolute',
		bottom: -15,
		width: width < 800 ? width / 2 : 400,
		height: 50,
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white',
	},
	lblLeft: {
		color: '#E3302D',
		right: width < 800 ? width / 2 : 400,
	},
	lblRight: {
		color: '#3A8ECF',
		left: width < 800 ? width / 2 : 400,
	},
	tagContainer: {
		height: 30
	},
	tagTextStyle :{
		fontSize: 16
	},
	tagInputContainerStyle: {
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		flexDirection:'row',
	}
});

const styles2 = StyleSheet.create({
	container: {
		flex: 1,
	},
	imgView: {
		flex: 1,
		flexDirection: 'row',
		width: width ,
		height: width + 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	img: {
		width: width < 800 ? width / 2 : 400,
		height: width < 800 ? width : 800,
	},
	imglabel: {
		width: width < 800 ? width / 2 : 400,
		height: 44,
		marginTop: 4,
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white',
	},
	lblLeft: {
		color: '#E3302D',
	},
	lblRight: {
		color: '#3A8ECF',
	},
	formWrapper: {
		flex: 1,
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
		fontSize: 14,
		color: '#000',
		marginBottom: 10,
	},
	textboxag: {
		height: 36,
		marginLeft: 20,
		marginRight: 20,
		fontSize: 16,
		color: '#000',
	},
	tagContainer: {
		height: 30
	},
	tagTextStyle :{
		fontSize: 16
	},
	tagInputContainerStyle: {
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		flexDirection:'row',
	}
});

function mapStateToProps(state) {
	return {
		app: state.app,
		user: state.user
	};
}

export default connect(mapStateToProps)(ViewScreen);
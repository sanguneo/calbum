'use strict';

import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';

import AdBar from '../component/AdBar';
import Button from '../component/Button';
import Hr from '../component/Hr';
import LabeledInput from '../component/LabeledInput';
import Lightbox from '../component/Lightbox';
import Loading from '../component/Loading';
import Tags from '../component/Tags';

import ImageViewer from 'react-native-image-zoom-viewer';
const RNFS = require('react-native-fs');
import Util from '../service/util_svc';

import {connect} from 'react-redux';
import * as appActions from '../reducer/app/actions';

const {width, height, deviceWidth, deviceHeight, scale} = (function() {
	let i = Dimensions.get('window'),
		e = i.scale;
	return {
		width: i.width,
		height: i.height,
		deviceWidth: i.width * e,
		deviceHeight: i.height * e,
		scale: e
	};
})();

const commonStyle = {
	placeholderTextColor: '#bbb',
	hrColor: '#878787',
	backgroundColor: '#f5f5f5'
};

class ViewScreen extends Component {
	static navigatorButtons = {
		rightButtons: [
			{icon: require('../../img/cut.png'), id: 'edit'},
			{icon: require('../../img/remove.png'), id: 'delete'}
			]
	};

	constructor(props) {
		super(props);
		props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		props.navigator.setStyle({
			navBarHideOnScroll: true
		});
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
			imageurl: [{url: ''}]
		};
	}
	onNavigatorEvent(event) {
		if (event.id === 'close') {
			this._lightboxClose();
		}
		if (event.id === 'edit') {
			this.props.navigator.push({
				screen: 'calbum.ModifyScreen',
				title: "'" + this.state.title + "' 수정하기",
				passProps: {
					dbsvc: this.props.dbsvc,
					crypt: this.props.crypt,
					parentUpdate: title => {
						this._getPhotoInformation();
						title ? this.props.navigator.setTitle({title}) : null;
						this.props.updateList();
					},
					targetProps: {
						merged: this.state.merged,
						title: this.state.title,
						recipe: this.state.recipe,
						comment: this.state.comment,
						tags: this.state.tags.map(res => {
							return res.name;
						}),
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
		if (event.id === 'delete') {
			this._deleteDesign();
		}
		if (event.id === 'backPress') {
			if (!this.side) {
				this.props.navigator.pop();
			} else {
				this._lightboxClose();
			}
		}
	}
	
	_deleteDesign() {
		Alert.alert(
			'디자인을 삭제하시겠습니까?',
			'삭제된 디자인은 되돌릴 수 없습니다.\n확인을 누르시면 삭제됩니다.',
			[
				{
					text: '확인',
					onPress: () => {
						this.props.dispatch(appActions.changing());
						let uriBase = this.state.merged.uri.replace('file://', '').split('?')[0];
						RNFS.unlink(uriBase).catch(e => {console.log(e);});
						RNFS.unlink(uriBase.replace('_original_', '_thumb_')).catch(e => {console.log(e);});
						RNFS.unlink(uriBase.replace('.scalb', '_left.scalb')).catch(e => {console.log(e);});
						RNFS.unlink(uriBase.replace('.scalb', '_right.scalb')).catch(e => {console.log(e);});
						RNFS.unlink(uriBase.replace('.scalb', '_cropleft.scalb')).catch(e => {console.log(e);});
						RNFS.unlink(uriBase.replace('.scalb', '_cropright.scalb')).catch(e => {console.log(e);});
						this.props.dbsvc.deletePhoto(this.state.photohash, this.state.signhash);
						this.props.navigator.pop();
					}
				},
				{text: '취소'}
			],
			{cancelable: true}
		);
	}

	_goTag(tagname) {
		let aobj = {
			screen: 'calbum.InTagScreen',
			title: '#' + tagname,
			passProps: {
				dbsvc: this.props.dbsvc,
				crypt: this.props.crypt
			},
			navigatorStyle: {},
			navigatorButtons: {
				rightButtons: [
					{icon: require('../../img/cut.png'), id: 'edit'},
					{icon: require('../../img/remove.png'), id: 'delete'}
				]
			},
			animated: false,
			animationType: 'none'
		};
		if (tagname === '선택안함') {
			aobj.title = '태그 선택안됨';
		} else {
			aobj.passProps.tagname = tagname;
		}

		this.props.navigator.push(aobj);
	}
	_getPhotoInformation() {
		this.props.dispatch(appActions.loading());
		let key = Math.random() * 10000;
		this.props.dbsvc.getPhotoSpecific(
			res => {
				let pPath = 'file://' + RNFS.DocumentDirectoryPath + '/_original_/' + res.photohash + '_' + this.props.user.email + '.scalb?key=' + key;
				let info = {
					merged: {uri: pPath},
					title: res.title,
					regdate: res.reg_date,
					recipe: res.recipe.replace('\\n', '\n'),
					comment: res.comment.replace('\\n', '\n')
				};
				this.props.dbsvc.getTagSpecific(
					rest => {
						info.tags = rest;
						this.setState(info);
						this.props.navigator.setTitle({
							title: this.props.title
								? this.props.title
								: Util.dateFormatter(this.props.regdate)
						});
						this.props.dispatch(appActions.loaded());
					},
					this.props.user.signhash,
					this.state.photohash
				);
			},
			this.props.user.signhash,
			this.state.photohash
		);
	}

	_getSideOriginal(side) {
		this.side = null;
		this.props.navigator.setButtons({
			leftButtons: [],
			rightButtons: [{id: 'close', icon: require('../../img/close.png')}],
			animated: true
		});
		if (side === 'left') {
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
			title: this.props.title
				? this.props.title
				: Util.dateFormatter(this.props.regdate)
		});
		this.props.navigator.setButtons({
			leftButtons: [{id: 'back'}],
			rightButtons: [{icon: require('../../img/cut.png'), id: 'edit'}],
			animated: true
		});
		this.side = null;
	}

	componentWillMount() {
		this._getPhotoInformation();
	}
	render() {
		let imgBefore = this.state.merged.uri ? (
			<ImageViewer
				imageUrls={[
					{url: this.state.merged.uri.replace('.scalb', '_left.scalb')}
				]}
			/>
		) : null;
		let imgAfter = this.state.merged.uri ? (
			<ImageViewer
				imageUrls={[
					{url: this.state.merged.uri.replace('.scalb', '_right.scalb')}
				]}
			/>
		) : null;
		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.container}>
					{/*<View style={styles.imgView}>*/}
					{/*<Image source={this.state.merged} style={styles.img}/>*/}
					{/*<Text style={[styles.imglabel, styles.lblLeft]}>Before</Text>*/}
					{/*<Text style={[styles.imglabel, styles.lblRight]}>After</Text>*/}
					{/*<TouchableOpacity style={[styles.oimg, styles.leftImg]} onPress={()=> {this._getSideOriginal('left')}}></TouchableOpacity>*/}
					{/*<TouchableOpacity style={[styles.oimg, styles.rightImg]} onPress={()=> {this._getSideOriginal('right')}}></TouchableOpacity>*/}
					{/*</View>*/}
					<View style={styles.imgView}>
						<TouchableOpacity onPress={() => { this._getSideOriginal('left');}}>
							<Image
								source={this.state.merged.uri ? {uri: this.state.merged.uri.replace('.scalb', '_cropleft.scalb')} : null}
								style={[styles.img, {borderRightWidth: 0}]}
							/>
							<Text style={[styles.imglabel, styles.lblLeft]}>Before</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => { this._getSideOriginal('right');}}>
							<Image
								source={this.state.merged.uri ? {uri: this.state.merged.uri.replace('.scalb', '_cropright.scalb')} : null}
								style={[styles.img, {borderLeftWidth: 0}]}
							/>
							<Text style={[styles.imglabel, styles.lblRight]}>After</Text>
						</TouchableOpacity>
					</View>
					<View style={[styles.bgView, {marginTop: 15}]}>
						<Text style={{fontSize: 17}}>기본정보</Text>
					</View>
					<View style={styles.formWrapper}>
						<LabeledInput label={'제목'}>
							<Text style={styles.textboxag}>
								{this.state.title !== '' ? this.state.title : '제목없음'}
							</Text>
						</LabeledInput>
						<Hr lineColor={commonStyle.hrColor} />
						<LabeledInput label={'태그'}>
							{this.state.tags.length === 0 ? (
								<Text style={styles.textboxag}>{'태그없음'}</Text>
							) : (
								<Tags
									tagContainerStyle={styles.tagContainer}
									tagInputContainerStyle={styles.tagInputContainerStyle}
									tagTextStyle={styles.tagTextStyle}
									value={this.state.tags.map(res => {
										return res.name;
									})}
									pressTag={e => {
										this._goTag(e);
									}}
									tagColor={commonStyle.placeholderTextColor}
									placeholderTextColor={commonStyle.placeholderTextColor}
									tagTextColor="white"
									parseOnBlur={true}
									numberOfLines={99}
									ref={'tag'}
								/>
							)}
						</LabeledInput>
					</View>
					<View style={[styles.formWrapperDiv, {marginBottom: 30}]}>
						{this.state.recipe === '' ? null : (
							<Button
								imgsource={require('../../img/recipe.png')}
								style={{flex: 0.5, backgroundColor: '#ff412b'}}
								onPress={() => {
									this.refs.recipe._open();
								}}
								btnname={'레시피 보기'}
							/>
						)}
						{this.state.comment === '' ? null : (
							<Button
								imgsource={require('../../img/comment.png')}
								style={{flex: 0.5, backgroundColor: '#3692d9'}}
								onPress={() => {
									this.refs.comment._open();
								}}
								btnname={'코멘트 보기'}
							/>
						)}
					</View>

				</ScrollView>
				<AdBar />
				<Loading show={this.props.app.loading} style={{bottom: 0}} />
				<Lightbox
					ref={'recipe'}
					title={'레시피'}
					duration={500}
					fromValue={0}
					toValue={1}
					stylekey={'opacity'}
					bgColor={'#fff'}
					color={'#000'}>
					<View
						style={{
							width: width - 80,
							paddingHorizontal: 10,
							paddingBottom: 10
						}}>
						<Text style={{lineHeight: 20, fontSize: 16}}>
							{this.state.recipe === '' ? '레시피없음' : this.state.recipe}
						</Text>
					</View>
				</Lightbox>
				<Lightbox
					ref={'comment'}
					title={'코멘트'}
					duration={500}
					fromValue={0}
					toValue={1}
					stylekey={'opacity'}
					bgColor={'#fff'}
					color={'#000'}>
					<View
						style={{
							width: width - 80,
							paddingHorizontal: 10,
							paddingBottom: 10
						}}>
						<Text style={{lineHeight: 20, fontSize: 16}}>
							{this.state.comment === '' ? '코멘트없음' : this.state.comment}
						</Text>
					</View>
				</Lightbox>
				<Lightbox
					ref={'imagesbefore'}
					title={'Before'}
					duration={500}
					fromValue={0}
					toValue={1}
					stylekey={'opacity'}
					bgColor={'#000'}
					color={'#fff'}
					collapsedStyle={{paddingTop: 0}}
					collapsed={true}
					hideTop={true}
					close={() => {
						this._lightboxClose();
					}}>
					<View style={{width, height}}>
						{imgBefore}
					</View>
				</Lightbox>
				<Lightbox
					ref={'imagesafter'}
					title={'After'}
					duration={500}
					fromValue={0}
					toValue={1}
					stylekey={'opacity'}
					bgColor={'#000'}
					color={'#fff'}
					collapsedStyle={{paddingTop: 0}}
					collapsed={true}
					hideTop={true}
					close={() => {
						this._lightboxClose();
					}}>
					<View style={{width, height}}>
						{imgAfter}
					</View>
				</Lightbox>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		width: width,
		height: height
	},
	container: {
		width: width,
		height: height - 210
	},
	imgView: {
		flex: 1,
		flexDirection: 'row',
		width: width,
		height: width + 30,
		justifyContent: 'center',
		alignItems: 'center'
	},
	img: {
		width: width < 800 ? width / 2 : 400,
		height: width < 800 ? width : 800
	},
	oimg: {
		width: width < 800 ? width / 2 : 400,
		height: width < 800 ? width : 800
	},
	oimg2: {
		position: 'absolute',
		backgroundColor: 'rgba(255,255,255,0.05)'
	},
	leftImg: {
		left: 0
	},
	rightImg: {
		right: 0
	},
	formWrapper: {
		flex: 1,
		margin: 10,
		borderRadius: 5,
		backgroundColor: commonStyle.backgroundColor
	},
	formWrapperDiv: {
		flexDirection: 'row',
		margin: 10,
		borderRadius: 5,
		backgroundColor: commonStyle.backgroundColor
	},
	bgView: {
		backgroundColor: 'white',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 3,
		marginBottom: 2
	},
	tagbox: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		marginLeft: 20,
		marginRight: 10
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
		marginBottom: 10
	},
	textboxag: {
		minHeight: 30,
		lineHeight: 30,
		marginLeft: 20,
		marginRight: 20,
		paddingBottom: 10,
		fontSize: 16,
		color: '#000'
	},
	texttagboxag: {
		minHeight: 40,
		lineHeight: 30,
		fontSize: 16,
		color: '#000'
	},
	imglabel: {
		width: width < 800 ? width / 2 : 400,
		height: 44,
		marginTop: 4,
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white'
	},
	lblLeft: {
		color: '#E3302D'
	},
	lblRight: {
		color: '#3A8ECF'
	},
	tagContainer: {
		height: 30
	},
	tagTextStyle: {
		fontSize: 16
	},
	tagInputContainerStyle: {
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		flexDirection: 'row'
	}
});

function mapStateToProps(state) {
	return {
		app: state.app,
		user: state.user
	};
}

export default connect(mapStateToProps)(ViewScreen);

'use strict';

import React, {Component} from 'react';
import {Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

import AutoGrowingTextInput from '../component/AutoGrowingTextInput';
import Button from '../component/Button';
import Hr from '../component/Hr';
import LabeledInput from '../component/LabeledInput';
import TagInput from '../component/TagInput';

import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import Image2merge from '../../native_modules/image2merge';
import Util from '../service/util_svc';

import {connect} from 'react-redux';
import * as appActions from '../reducer/app/actions';

const RNFS = require('../service/rnfs_wrapper');

const {width, height} = Dimensions.get('window');

const imgOpt = {
	width: 400,
	height: 800,
	cropping: true
};

const commonStyle = {
	placeholderTextColor: '#bbb',
	hrColor: '#878787',
	backgroundColor: '#f5f5f5'
};
class ModifyScreen extends Component {
	static navigatorButtons = {
		leftButtons: [],
		rightButtons: [{icon: require('../../img/save.png'), id: 'save'}]
	};

	constructor(props) {
		super(props);
		props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		props.navigator.setStyle({
			navBarHideOnScroll: true
		});
		this.state = {
			success: 'no',
			email: props.user.email,
			signhash: props.user.signhash,
			uriLeft: {
				uri: props.targetProps.merged.uri.replace('.scalb', '_cropleft.scalb')
			},
			uriRight: {
				uri: props.targetProps.merged.uri.replace('.scalb', '_cropright.scalb')
			},
			srcLeft: '',
			srcRight: '',
			title: props.targetProps.title,
			recipe: props.targetProps.recipe,
			tags: props.targetProps.tags,
			photohash: props.targetProps.photohash,
			comment: props.targetProps.comment
		};
		this.scrollYPos = 0;
	}
	onNavigatorEvent(event) {
		if (event.id === 'save') {
			this._submit();
		}
	}

	_onChangeTags = tags => {
		this.setState({
			tags
		});
	};
	_changeImage(direct) {
		let randomkey = Math.random() * 10000;
		if (direct === 'left') {
			ImagePicker.openPicker(imgOpt)
				.then(result => {
					ImageResizer.createResizedImage(result.path.replace('file://', ''), 400, 800, 'JPEG', 100, 0,
						RNFS.PlatformDependPath + '/_original_/'
					).then(({name}) => {
							let renamed = RNFS.PlatformDependPath + '/_original_/' + this.state.photohash + '_' + this.props.user.email + '_cropleft.scalb';
							RNFS.moveFile(
								RNFS.PlatformDependPath + '/_original_/' + name,
								renamed
							).then(() => {
								this.setState({uriLeft: {uri: 'file://' + renamed + '?key=' + randomkey}});
								RNFS.unlink(result.path.replace('file://', '')).catch(()=>{});
							});

						}
					).catch((err) => {
						console.log(err);
					});
					ImageResizer.createResizedImage(result.sourceURL.replace('file://', ''), 800, 800, 'JPEG', 100, 0,
						RNFS.PlatformDependPath + '/_original_/'
					).then(({name}) => {
							let renamed = RNFS.PlatformDependPath + '/_original_/' + this.state.photohash + '_' + this.props.user.email + '_left.scalb';
							RNFS.moveFile(
								RNFS.PlatformDependPath + '/_original_/' + name,
								renamed
							).then(() => {
								this.setState({srcLeft: 'file://' + renamed + '?key=' + randomkey});
							});
						}
					).catch((err) => {
						console.log(err);
					});
				}).catch(e => {
				console.log(e);
			});
		} else {
			ImagePicker.openPicker(imgOpt)
				.then(result => {
					ImageResizer.createResizedImage(result.path.replace('file://', ''), 400, 800, 'JPEG', 100, 0,
						RNFS.PlatformDependPath + '/_original_/'
					).then(({name}) => {
							let renamed = RNFS.PlatformDependPath + '/_original_/' + this.state.photohash + '_' + this.props.user.email + '_cropright.scalb';
							RNFS.moveFile(
								RNFS.PlatformDependPath + '/_original_/' + name,
								renamed
							).then(() => {
								this.setState({uriRight: {uri: 'file://' + renamed + '?key=' + randomkey}});
								RNFS.unlink(result.path.replace('file://', '')).catch(()=>{});
							});

						}
					).catch((err) => {
						console.log(err);
					});
					ImageResizer.createResizedImage(result.sourceURL.replace('file://', ''), 800, 800, 'JPEG', 100, 0,
						RNFS.PlatformDependPath + '/_original_/'
					).then(({name}) => {
							let renamed = RNFS.PlatformDependPath + '/_original_/' + this.state.photohash + '_' + this.props.user.email + '_right.scalb';
							RNFS.moveFile(
								RNFS.PlatformDependPath + '/_original_/' + name,
								renamed
							).then(() => {
								this.setState({srcRight: 'file://' + renamed + '?key=' + randomkey});
							});
						}
					).catch((err) => {
						console.log(err);
					});
				}).catch(e => {
				console.log(e);
			});
		}
	}
	_mergeImage() {
		Image2merge.image2merge(
			[this.state.uriLeft.uri, this.state.uriRight.uri],
			this.state.photohash,
			this.props.user.email,
			() => {}
		);
	}
	_insertDB() {
		this.props.dbsvc.updatePhoto(
			this.state.photohash,
			this.state.title,
			this.state.recipe,
			this.state.comment,
			this.props.user.signhash
		);
	}
	_insertTag() {
		this.props.dbsvc.insertTag(
			this.state.tags,
			this.state.photohash,
			this.props.user.signhash
		);
	}
	_formCheck() {
		if (this.state.uriLeft.uri === '') {
			Alert.alert('확인', '선택한 왼쪽 이미지에 오류가 있습니다.\n다시 선택해주세요.');
			return false;
		}
		if (this.state.uriRight.uri === '') {
			Alert.alert('확인', '선택한 오른쪽 이미지에 오류가 있습니다.\n다시 선택해주세요.');
			return false;
		}
		return true;
	}
	_submit() {
		if (!this._formCheck()) return;
		Alert.alert(
			'작성완료',
			'작성한 내용을 확인하셨나요?\n확인을 누르시면 저장됩니다.',
			[
				{
					text: '확인',
					onPress: () => {
						this._mergeImage();
						this._insertDB();
						this._insertTag();
						this.props.parentUpdate(this.state.title);
						this.props.dispatch(appActions.changing());
						this.props.navigator.pop();
					}
				},
				{text: '취소'}
			],
			{cancelable: true}
		);
	}


	_whereLine(event) {
		this.scrollYPos = event.nativeEvent.contentOffset.y;
	}

	componentWillMount() {
		this.props.navigator.setTitle({
			title: this.props.targetProps.title
				? this.props.targetProps.title
				: Util.dateFormatter(this.props.targetProps.regdate)
		});
	}

	render() {
		return (
			<ScrollView style={styles.container} ref={'ScrollView'} onScroll={event => this._whereLine(event)} keyboardShouldPersistTaps='handled'>
				<View style={styles.imgView}>
					<TouchableOpacity
						onPress={() => {
							this._changeImage('left');
						}}>
						<Image
							source={this.state.uriLeft}
							style={[styles.img, {borderRightWidth: 0}]}
						/>
						<Text style={[styles.imglabel, styles.lblLeft]}>Before</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							this._changeImage('right');
						}}>
						<Image
							source={this.state.uriRight}
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
						<TextInput
							ref={'title'}
							style={styles.labeledtextbox}
							editable={true}
							autoCorrect={false}
							underlineColorAndroid={'transparent'}
							onChangeText={title => this.setState({title})}
							value={this.state.title}
							placeholder={'제목'}
							placeholderTextColor={commonStyle.placeholderTextColor}
						/>
					</LabeledInput>
					<Hr lineColor={commonStyle.hrColor} />
					<LabeledInput label={'태그'}>
						<TagInput
							tagContainerStyle={styles.tagContainer}
							tagInputContainerStyle={styles.tagInputContainerStyle}
							tagTextStyle={styles.tagTextStyle}
							value={this.state.tags}
							onChange={this._onChangeTags}
							tagColor={commonStyle.placeholderTextColor}
							placeholderTextColor={commonStyle.placeholderTextColor}
							tagTextColor="white"
							inputProps={{
								keyboardType: 'default',
								placeholder: '태그',
								autoFocus: false
							}}
							parseOnBlur={true}
							numberOfLines={99}
							ref={'tag'}
						/>
					</LabeledInput>
				</View>
				<View style={styles.bgView}>
					<Text style={{fontSize: 17}}>레시피</Text>
				</View>
				<View style={styles.formWrapper}>
					<AutoGrowingTextInput
						styleInput={styles.textboxag}
						underlineColorAndroid={'transparent'}
						onChangeText={(recipe) => {this.setState({recipe})}}
						measureBottom={(e)=>{
							this.refs.ScrollView.scrollTo({y: this.scrollYPos + e});
						}}
						value={this.state.recipe}
						placeholder={'레시피'}
						placeholderTextColor={commonStyle.placeholderTextColor}
						blurOnSubmit={false}
					/>
				</View>
				<View style={styles.bgView}>
					<Text style={{fontSize: 17}}>코멘트</Text>
				</View>
				<View style={styles.formWrapper}>
					<AutoGrowingTextInput
						styleInput={styles.textboxag}
						underlineColorAndroid={'transparent'}
						onChangeText={comment => this.setState({comment})}
						measureBottom={(e)=>{
							this.refs.ScrollView.scrollTo({y: this.scrollYPos + e});
						}}
						value={this.state.comment}
						placeholder={'코멘트'}
						placeholderTextColor={commonStyle.placeholderTextColor}
						blurOnSubmit={false}
					/>
				</View>
				<View style={[styles.formWrapper, {marginTop: 20, marginBottom: 30}]}>
					<Button
						imgsource={require('../../img/save.png')}
						style={{backgroundColor: '#3692d9'}}
						onPress={() => {
							this._submit();
						}}
						btnname={'저장'}
					/>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
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
	formWrapper: {
		flex: 1,
		margin: 10,
		borderRadius: 5,
		backgroundColor: commonStyle.backgroundColor,
		overflow: 'hidden'
	},
	bgView: {
		backgroundColor: 'white',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 3,
		marginBottom: 2
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
		marginBottom: 10
	},
	textboxag: {
		height: 36,
		marginLeft: 20,
		marginRight: 20,
		fontSize: 16,
		color: '#000'
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

export default connect(mapStateToProps)(ModifyScreen);

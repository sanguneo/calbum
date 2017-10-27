'use strict';

import React, {Component} from 'react';
import {Alert, Dimensions, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';

import * as appActions from '../reducer/app/actions';

import LabeledInput from '../component/LabeledInput';
import Hr from '../component/Hr';
import Button from '../component/Button';
import Loading from '../component/Loading';
import AdBar from '../component/AdBar';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';

const RNFS = require('react-native-fs');

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

const imgOpt = {
	width: 400,
	height: 400,
	cropping: true
};

const commonStyle = {
	placeholderTextColor: '#bbb',
	hrColor: '#878787',
	backgroundColor: '#f5f5f5'
};
class SignupScreen extends Component {
	constructor(props) {
		super(props);
		props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.state = {
			signhash: '',
			profile: require('../../img/profile.png'),
			email: '',
			name: '',
			pass: '',
			passchk: ''
		};
	}
	onNavigatorEvent(event) {
		if (event.id === 'menu') {
			this.props.navigator.toggleDrawer({
				side: 'left',
				animated: true
			});
		}
		if (event.id === 'save') {
			this._submit();
		}
		if (event.id === 'backPress') {
			this.props.navigator.pop();
		}
	}

	_changeImage() {
		ImagePicker.openPicker(imgOpt)
			.then(profile => {
				this.setState({profile: {uri: profile.path}});
			})
			.catch(e => {
				console.log(e);
			});
	}
	_formCheck() {
		if (!this.state.profile.uri) {
			Alert.alert('확인', '이미지를 선택해주세요.');
			return false;
		} else if (!this.state.name && this.state.name.length >= 4) {
			Alert.alert('확인', '이름을 입력해주세요.');
			this.refs['r_name'].focus();
			return false;
		} else if (!this.state.email) {
			Alert.alert('확인', '이메일을 입력해주세요.');
			this.refs['r_eml'].focus();
			return false;
		} else if (
			!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(
				this.state.email
			)
		) {
			Alert.alert('확인', '이메일을 형식에 맞게 입력해주세요.');
			this.refs['r_eml'].focus();
			return false;
		} else if (this.state.pass.length < 8) {
			Alert.alert('확인', '패스워드는 8자 이상이어야합니다.');
			this.refs['r_pass'].focus();
			return false;
		} else if (this.state.pass !== this.state.passchk) {
			Alert.alert('확인', '패스워드 확인문자가 일치하지않습니다.');
			this.refs['r_chk'].focus();
			return false;
		}
		return true;
	}
	_submit() {
		if (!this._formCheck()) return;
		let formdata = new FormData();
		formdata.append('profile', {
			uri: this.state.profile.uri,
			type: 'image/jpeg',
			name: this.state.email + '.scalb'
		});
		formdata.append('nickname', this.state.name);
		formdata.append('email', this.state.email);
		formdata.append('password', this.state.pass);
		this.props.dispatch(appActions.loading());
		axios.post('http://calbum.sanguneo.com/user/signup', formdata, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data'
			}
		}).then(response => {
			if (response.data.message == 'success') {
				RNFS.unlink(
					this.state.profile.uri.replace('file://', '')
				).catch(e => {
					console.error(e);
				});
				this.props.dispatch(appActions.loaded());
				this.props.navigator.pop();
			} else if (response.data.message == 'emailexist') {
				this.props.dispatch(appActions.loaded());
				Alert.alert('사용중인 이메일 입니다.');
			} else {
				this.props.dispatch(appActions.loaded());
				Alert.alert('회원가입에 오류가 발생했습니다.');
			}
		}).catch(e => {
			Alert.alert('인터넷에 연결되어있지 않습니다.\n확인후 다시 시도해주세요.');
			console.log('error', e);
		});
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.container}>
					<View style={styles.imgView}>
						<TouchableOpacity
							onPress={() => {
								this._changeImage();
							}}>
							<Image source={this.state.profile} style={styles.img} />
						</TouchableOpacity>
					</View>
					<View style={styles.formWrapper}>
						<LabeledInput label={'이름'} labelStyle={styles.labelStyle}>
							<TextInput
								style={styles.labeledtextbox}
								editable={true}
								autoCorrect={false}
								underlineColorAndroid={'transparent'}
								ref={'r_name'}
								onChangeText={name => this.setState({name})}
								value={this.state.name}
								placeholder={'이름을 입력해주세요'}
								placeholderTextColor={commonStyle.placeholderTextColor}
							/>
						</LabeledInput>
						<Hr lineColor={commonStyle.hrColor} />
						<LabeledInput label={'이메일'} labelStyle={styles.labelStyle}>
							<TextInput
								style={styles.labeledtextbox}
								editable={true}
								autoCorrect={false}
								underlineColorAndroid={'transparent'}
								ref={'r_eml'}
								onChangeText={email => this.setState({email})}
								value={this.state.email}
								placeholder={'이메일을 입력해주세요'}
								placeholderTextColor={commonStyle.placeholderTextColor}
								keyboardType={'email-address'}
							/>
						</LabeledInput>
						<Hr lineColor={commonStyle.hrColor} />
						<LabeledInput label={'비밀번호'} labelStyle={styles.labelStyle}>
							<TextInput
								style={styles.labeledtextbox}
								editable={true}
								autoCorrect={false}
								underlineColorAndroid={'transparent'}
								ref={'r_pass'}
								onChangeText={pass => this.setState({pass})}
								value={this.state.pass}
								placeholder={'비밀번호를 입력해주세요'}
								placeholderTextColor={commonStyle.placeholderTextColor}
								secureTextEntry={true}
							/>
						</LabeledInput>
						<Hr lineColor={commonStyle.hrColor} />
						<LabeledInput label={'확인'} labelStyle={styles.labelStyle}>
							<TextInput
								style={styles.labeledtextbox}
								editable={true}
								autoCorrect={false}
								underlineColorAndroid={'transparent'}
								ref={'r_chk'}
								onChangeText={passchk => this.setState({passchk})}
								value={this.state.passchk}
								placeholder={'비밀번호를 다시 입력해주세요'}
								placeholderTextColor={commonStyle.placeholderTextColor}
								secureTextEntry={true}
							/>
						</LabeledInput>
					</View>
					<View style={[styles.formWrapper]}>
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
				<AdBar/>
				<Loading show={this.props.app.loading} />
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
		height: height - 260
	},
	imgView: {
		flex: 1,
		flexDirection: 'row',
		height: 202,
		width: 202,
		marginHorizontal: (width - 202) / 2,
		marginVertical: 20,
		borderColor: '#eee',
		borderWidth: 1
	},
	img: {
		width: 200,
		height: 200
	},
	formWrapper: {
		flex: 1,
		marginTop: 10,
		marginHorizontal: 45,
		marginBottom: 30,
		borderRadius: 5,
		backgroundColor: '#f5f5f5'
	},
	labeledtextbox: {
		height: 42,
		marginHorizontal: 10,
		fontSize: 15,
		color: '#000',
		textAlign: 'left',
		textAlignVertical: 'center'
	},
	textbox: {
		height: 58,
		marginHorizontal: 10,
		marginBottom: 10,
		fontSize: 15,
		color: '#000'
	},
	labelStyle: {
		fontSize: 15
	}
});

function mapStateToProps(state) {
	return {
		app: state.app
	};
}

export default connect(mapStateToProps)(SignupScreen);

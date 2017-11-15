'use strict';

import React, {Component} from 'react';
import {Alert, AsyncStorage, Dimensions, Image, ScrollView, StyleSheet, TextInput, View} from 'react-native';

import AdBar from '../component/AdBar';
import Button from '../component/Button';
import Hr from '../component/Hr';
import LabeledInput from '../component/LabeledInput';
import Loading from '../component/Loading';

import axios from 'axios';
import Util from '../service/util_svc';

import {connect} from 'react-redux';
import * as appActions from '../reducer/app/actions';
import * as userActions from '../reducer/user/actions';

const RNFS = require('../service/rnfs_wrapper');


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
class LoginScreen extends Component {
	constructor(props) {
		super(props);
		props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.state = !props.profileCreate ?
			{
					profile: props.user.profile,
					name: props.user.name,
					email: props.user.email,
					pass: '',
					signhash: props.user.signhash
			} : {
					signhash: '',
					profile: require('../../img/profile.png'),
					email: '',
					name: ''
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
			console.log('back');
		}
	}

	_formCheck() {
		if (!this.state.email && Util.emailcheck(this.state.email)) {
			console.log(this.state.email);
			Alert.alert('확인', '이메일을 확인해주세요.');
			this.refs['r_eml'].focus();
			return false;
		} else if (this.state.pass.length < 8) {
			Alert.alert('확인', '패스워드는 8자 이상이어야합니다.');
			this.refs['r_pass'].focus();
			return false;
		}
		return true;
	}
	_login() {
		if (!this._formCheck()) return;
		this.props.dispatch(appActions.loading());
		axios.post(
			'http://hpserver.sanguneo.com/user/login',
			{email: this.state.email, password: this.state.pass},
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}
		).then(response => {
			if (response.data.message === 'success') {
				let key = Math.random() * 10000;
				let pPath = RNFS.PlatformDependPath + '/_profiles_/' + response.data.signhash + '.scalb';
				let userinfo = {
					token: response.data.token,
					_id: response.data._id,
					email: response.data.email,
					signhash: response.data.signhash,
					name: response.data.nickname,
					profile: {uri: 'file://' + pPath + '?key=' + key}
				};
				AsyncStorage.multiSet(Object.entries(userinfo).filter((e) => e[0] !== 'profile'));
				let loginOK = () => {
					this.setState(userinfo);
					this.props.dispatch(userActions.setUser(userinfo));
					this.props.dispatch(appActions.loaded());
					this.props.dispatch(appActions.login());
					this.props.navigator.pop();
				};
				RNFS.exists(pPath).then((res) => {
					if (res) {
						loginOK();
					} else {
						RNFS.downloadFile({
							fromUrl: 'http://hpserver.sanguneo.com/upload/profiles/' + userinfo.signhash,
							toFile: pPath
						}).promise.then((res) => {
							loginOK();
						}).catch(e => {
							console.error('error', e);
						});
					}
				}).catch((err) => {
					console.error(err);
				});
			} else if (response.data.message === 'noaccount')  {
				this.props.dispatch(appActions.loaded());
				Alert.alert(
					'',
					'사용자 정보가 존재하지 않습니다.\n가입하시겠습니까?',
					[
						{
							text: '확인',
							onPress: () => {
								this.props.dispatch(appActions.logout());
								this._signup()
							}
						},
						{text: '취소'}
					],
					{cancelable: true}
				);
			} else if (response.data.message === 'invalidpw')  {
				this.props.dispatch(appActions.loaded());
				Alert.alert('패스워드를 다시 확인해주세요.');
			} else {
				this.props.dispatch(appActions.loaded());
			}
			
		}).catch(e => {
			Alert.alert('인터넷에 연결되어있지 않습니다.\n확인 후 다시 시도해주세요.');
			console.log('error', e);
		});
	}
	_logout() {
		AsyncStorage.multiRemove(['token', '_id', 'name', 'email', 'signhash'], (err) => {
			console.log('logout error', err);
		});
		this.props.dispatch(
			userActions.setUser({
				signhash: '',
				profile: require('../../img/profile.png'),
				email: '',
				name: ''
			})
		);
		Alert.alert(
			'',
			'로그아웃 되었습니다.',
			[
				{
					text: '확인',
					onPress: () => {
						this.props.dispatch(appActions.logout());
					}
				},
				{text: '취소'}
			],
			{cancelable: true}
		);
	}
	_signup() {
		let user = {signhash: '', profile: this.state.profile, email: '', name: ''};
		this.props.navigator.push({
			screen: 'calbum.SignupScreen',
			title: '회원가입',
			passProps: {
				dbsvc: this.props.dbsvc,
				crypt: this.props.crypt,
				profileCreate: true,
				user,
				setLoginState: (arg) => {
					this.setState(arg);
				}
			},
			navigatorStyle: {navBarHidden: false},
			navigatorButtons: {},
			backButtonHidden: true,
			overrideBackPress: true,
			animated: true,
			animationType: 'fade'
		});
	}
	_modify() {
		let user = {signhash: this.props.user.signhash, profile: this.props.user.profile, email: this.props.user.email, name: this.props.user.name};
		this.props.navigator.push({
			screen: 'calbum.SignupScreen',
			title: '정보수정',
			passProps: {
				dbsvc: this.props.dbsvc,
				crypt: this.props.crypt,
				profileCreate: false,
				user,
				setLoginState: (arg) => {
					this.setState(arg);
				}
			},
			navigatorStyle: {navBarHidden: false},
			navigatorButtons: {},
			backButtonHidden: true,
			overrideBackPress: true,
			animated: true,
			animationType: 'fade'
		});
	}

	render() {
		let notloggedin = !this.state.signhash || this.state.signhash === '';
		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
					<View style={styles.imgView}>
						<Image source={this.state.profile} style={styles.img} />
					</View>
					<View style={styles.formWrapper}>
						{!notloggedin ? (
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
						) : null}
						{!notloggedin ? <Hr lineColor={commonStyle.hrColor} /> : null}
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
						{notloggedin ? <Hr lineColor={commonStyle.hrColor} /> : null}
						{notloggedin ? (
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
						) : null}
					</View>
					{notloggedin ? (
						<View style={[styles.formWrapper, {marginBottom: 0}]}>
							<Button
								// imgsource={require('../../img/save.png')}
								style={{backgroundColor: '#3692d9'}}
								onPress={() => {
									this._login();
								}}
								btnname={'로그인'}
							/>
						</View>
					) : (
						<View style={[styles.formWrapper, {marginBottom: 0}]}>
							<Button
								// imgsource={require('../../img/save.png')}
								style={{backgroundColor: '#d9663c'}}
								onPress={() => {
									this._logout();
								}}
								btnname={'로그아웃'}
							/>
						</View>
					)}
					{notloggedin ? (
						<View style={[styles.formWrapper, {marginBottom: 0}]}>
							<Button
								// imgsource={require('../../img/save.png')}
								style={{backgroundColor: '#bd6592'}}
								onPress={() => {
									this._signup();
								}}
								btnname={'회원가입'}
							/>
						</View>
					) : <View style={[styles.formWrapper, {marginBottom: 0}]}>
						<Button
							style={{backgroundColor: '#bd6592'}}
							onPress={() => {
								this._modify();
							}}
							btnname={'정보수정'}
						/>
					</View>}
				</ScrollView>
				<AdBar/>
				<Loading show={this.props.app.loading} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex:1,
	},
	container: {
		width: width,
		height: height - 180
	},
	imgView: {
		flex: 1,
		flexDirection: 'row',
		height: 202,
		width: 202,
		marginHorizontal: (width - 202) / 2,
		marginTop: 30,
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
		user: state.user,
		app: state.app
	};
}

export default connect(mapStateToProps)(LoginScreen);

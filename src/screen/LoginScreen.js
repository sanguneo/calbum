/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Alert, AsyncStorage, Dimensions, Image, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {connect} from 'react-redux';

import * as appActions from "../reducer/app/actions";
import * as userActions from "../reducer/user/actions";

import LabeledInput from '../component/LabeledInput';
import Hr from '../component/Hr';
import Button from '../component/Button';
import axios from 'axios';

const RNFS = require('react-native-fs');

const {width, height} = Dimensions.get('window');


const commonStyle = {
	placeholderTextColor: '#bbb',
	hrColor: '#878787',
	backgroundColor: '#f5f5f5'
};
class LoginScreen extends Component {

	constructor(props) {
		super(props);
		props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.crypt = props.crypt;
		this.global = props.global;
		this.state = {
			profile: props.user.profile,
			name: props.user.name,
			email: props.user.email,
			pass: '',
			signhash: props.user.signhash
		}
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
		if (!this.state.email) {
			Alert.alert('확인', '이메일을 입력해주세요.');
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
		axios.post('http://calbum.sanguneo.com/user/login',
			{ email: this.state.email, password: this.state.pass },
			{ headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
		).then((response) => {
			if (response.data.message === 'success') {
				let key = Math.random()*10000;
				let userinfo = {
					token: response.data.token,
					_id: response.data._id,
					email: response.data.email,
					signhash: response.data.signhash,
					name: response.data.nickname
				};
				AsyncStorage.setItem('token', userinfo.token);
				AsyncStorage.setItem('_id', userinfo._id);
				AsyncStorage.setItem('email', userinfo.email);
				AsyncStorage.setItem('signhash', userinfo.signhash);
				AsyncStorage.setItem('name', userinfo.name);
				let pPath = RNFS.DocumentDirectoryPath + '/_profiles_/' + userinfo.signhash + '.calb';
				RNFS.downloadFile({fromUrl:'http://calbum.sanguneo.com/upload/profiles/' + userinfo.signhash, toFile: pPath}).promise.then((res) => {
					userinfo.profile = {uri: 'file://' + pPath + '?key=' + key};
					this.props.dispatch(userActions.setUser(userinfo));
					this.props.dispatch(appActions.login());
					this.props.navigator.pop();
				}).catch((e) => {console.error('error', e)});
			} else if(response.data.message === 'emailexist'){
				Alert.alert('사용중인 이메일 입니다.');
			} else {
				Alert.alert('회원가입에 오류가 발생했습니다.');
			}
		}).catch((error) => {
			console.error(error);
		});
	}
	_logout() {
		Alert.alert('로그아웃 되었습니다.');
		AsyncStorage.clear();
		if (!this.props.profileInitial) {
			this.props.dispatch(userActions.setUser({
				profile: require('../../img/profile.png'),
				name: '',
				signhash: '',
				email: ''
			}));
		}
	}
	_signup() {
		let user = {signhash : '', profile: this.state.profile, email: '', name: ''};
		this.props.navigator.push({
			screen: "calbum.SignupScreen",
			title: "회원가입",
			passProps: {dbsvc:this.props.dbsvc, crypt:this.props.crypt, global: this.props.global, profileCreate: true, user},
			navigatorStyle: {navBarHidden: false},
			navigatorButtons: {},
			backButtonHidden: true,
			overrideBackPress: true,
			animated: true,
			animationType: 'fade'
		});
	}


	render() {
		let notloggedin = !this.props.user.signhash || this.props.user.signhash === '';
		return (
			<ScrollView style={styles.container}>
				<View style={styles.imgView}>
					<Image source={this.state.profile} style={styles.img} />
				</View>
				<View style={styles.formWrapper}>
					{!notloggedin ? <LabeledInput label={"이름"} labelStyle={styles.labelStyle}>
						<TextInput
							style={styles.labeledtextbox}
							editable={true}
							autoCorrect={false}
							underlineColorAndroid={'transparent'}
							ref={'r_name'}
							onChangeText={(name) => this.setState({name})}
							value={this.state.name}
							placeholder={'이름을 입력해주세요'}
							placeholderTextColor={commonStyle.placeholderTextColor}
						/>
					</LabeledInput>: null}
					{!notloggedin ? <Hr lineColor={commonStyle.hrColor}/>: null}
					<LabeledInput label={"이메일"} labelStyle={styles.labelStyle}>
						<TextInput
							style={styles.labeledtextbox}
							editable={true}
							autoCorrect={false}
							underlineColorAndroid={'transparent'}
							ref={'r_eml'}
							onChangeText={(email) => this.setState({email})}
							value={this.state.email}
							placeholder={'이메일을 입력해주세요'}
							placeholderTextColor={commonStyle.placeholderTextColor}
							keyboardType={'email-address'}
						/>
					</LabeledInput>
					{ notloggedin ? <Hr lineColor={commonStyle.hrColor}/> : null}
					{ notloggedin ? <LabeledInput label={"비밀번호"} labelStyle={styles.labelStyle}>
						<TextInput
							style={styles.labeledtextbox}
							editable={true}
							autoCorrect={false}
							underlineColorAndroid={'transparent'}
							ref={'r_pass'}
							onChangeText={(pass) => this.setState({pass})}
							value={this.state.pass}
							placeholder={'비밀번호를 입력해주세요'}
							placeholderTextColor={commonStyle.placeholderTextColor}
							secureTextEntry={true}
						/>
					</LabeledInput> : null}
				</View>
				{ notloggedin ?
					<View style={[styles.formWrapper, {marginBottom: 0}]}>
						<Button imgsource={require('../../img/save.png')} style={{backgroundColor: '#3692d9'}} onPress={()=>{this._login();}} btnname={'로그인'}/>
					</View> :
					<View style={[styles.formWrapper, {marginBottom: 0}]}>
						<Button imgsource={require('../../img/save.png')} style={{backgroundColor: '#d9663c'}} onPress={()=>{this._logout();}} btnname={'로그아웃'}/>
					</View>
				}
				<View style={[styles.formWrapper, {marginBottom: 0}]}>
					<Button imgsource={require('../../img/save.png')} style={{backgroundColor: '#bd6592'}} onPress={()=>{this._signup();}} btnname={'회원가입'}/>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	imgView : {
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
	img :{
		width: 200,
		height: 200,
	},
	formWrapper: {
		flex: 1,
		marginTop: 10,
		marginHorizontal: 45,
		marginBottom: 30,
		borderRadius:5,
		backgroundColor: '#f5f5f5',
	},
	labeledtextbox: {
		height: 42,
		marginHorizontal: 10,
		fontSize: 15,
		color: '#000',
		textAlign: 'left',
		textAlignVertical: 'center',
	},
	textbox: {
		height: 58,
		marginHorizontal: 10,
		marginBottom: 10,
		fontSize: 15,
		color: '#000',

	},
	labelStyle: {
		fontSize:15,
	}
});

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps)(LoginScreen);



/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Alert, Dimensions, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';

import LabeledInput from '../component/LabeledInput';
import Hr from '../component/Hr';
import Button from '../component/Button';
import ImagePicker from 'react-native-image-crop-picker';
import md5 from '../service/md5';

const RNFS = require('react-native-fs');

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
export default class ProfileScreen extends Component {

	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.crypt = props.crypt;
		this.global = props.global;
		this.state = {
			success: 'no',
			profile: props.user[1],
			userid: props.user[2],
			name: props.user[3],
			email: props.user[4],
			pass: '',
			passchk: '',
			uniqkey: props.user[0]
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


	_changeImage() {
		ImagePicker.openPicker(imgOpt).then(profile => {
			this.setState({profile: {uri: profile.path}});
		}).catch((e)=>{console.error(e)});
	}
	_saveProfileImage() {
		let key = Math.random()*10000;
		let pPath = RNFS.DocumentDirectoryPath + '/_profiles_/' + this.state.uniqkey + '.jpghidden';
		RNFS.copyFile(this.state.profile.uri.replace('file://', ''), pPath).then(() => {
			RNFS.unlink(this.state.profile.uri.replace('file://', '')).catch((e) => {console.error('error_del', e)});
		}).catch((e) => {console.error('error', e)});
		this.global.getVar('side').setState({profile: {uri: 'file://'+pPath + '?key=' + key}});
	}
	_formCheck() {
		if (!this.state.profile.uri) {
			Alert.alert('확인', '이미지를 선택해주세요.');
			return false;
		} else if (!this.state.userid && this.state.userid.length >= 4) {
			Alert.alert('확인', '아이디를 입력해주세요.');
			this.refs['r_uid'].focus();
			return false;
		} else if (!this.state.name && this.state.name.length >= 4) {
			Alert.alert('확인', '닉네임을 입력해주세요.');
			this.refs['r_name'].focus();
			return false;
		} else if (!this.state.email) {
			Alert.alert('확인', '이메일을 입력해주세요.');
			this.refs['r_eml'].focus();
			return false;
		} else if (!(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(this.state.email))) {
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
		Alert.alert(
			'작성완료', '작성한 내용을 확인하셨나요?\n확인을 누르시면 저장됩니다.',
			[
				{text: '확인', onPress: () => {
					if (this.props.profileCreate) {
						this.props.dbsvc.regUSER(this.state.uniqkey, new Date().getTime(), this.state.userid, this.state.name, this.state.email, md5(this.state.pass));
					} else {
						this.props.dbsvc.editUSER(this.state.uniqkey, this.state.name, this.state.email, md5(this.state.pass));
					}
					this._saveProfileImage();
					this.global.getVar('side').setState({
						name: this.state.name,
						uniqkey: this.state.uniqkey,
						userid: this.state.userid,
						email: this.state.email
					});
					this.props.navigator.pop();
				}},
				{text: '취소'},
			],
			{ cancelable: true }
		);
	}


	render() {
		return (
			<ScrollView style={styles.container}>
				<View style={styles.imgView}>
					<TouchableOpacity onPress={() => {this._changeImage()}}>
						<Image source={this.state.profile} style={styles.img} />
					</TouchableOpacity>
				</View>
				<View style={styles.formWrapper}>
					<LabeledInput label={"아이디"} labelStyle={styles.labelStyle}>
						<TextInput
							style={styles.labeledtextbox}
							editable={true}
							autoCorrect={false}
							underlineColorAndroid={'transparent'}
							ref={'r_uid'}
							onChangeText={(userid) => {
                            	this.setState({
                            		userid,
                            		uniqkey : this.crypt.getCryptedCode(this.crypt.getCharCodeSerial(userid, 1))
                            	});

                            }}
							value={this.state.userid}
							placeholder={'아이디를 입력해주세요'}
							placeholderTextColor={commonStyle.placeholderTextColor}
						/>
					</LabeledInput>
					<Hr lineColor={commonStyle.hrColor}/>
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
					<Hr lineColor={commonStyle.hrColor}/>
					<LabeledInput label={"닉네임"} labelStyle={styles.labelStyle}>
						<TextInput
							style={styles.labeledtextbox}
							editable={true}
							autoCorrect={false}
							underlineColorAndroid={'transparent'}
							ref={'r_name'}
							onChangeText={(name) => this.setState({name})}
							value={this.state.name}
							placeholder={'닉네임을 입력해주세요'}
							placeholderTextColor={commonStyle.placeholderTextColor}
						/>
					</LabeledInput>
					<Hr lineColor={commonStyle.hrColor}/>
					<LabeledInput label={"비밀번호"} labelStyle={styles.labelStyle}>
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
					</LabeledInput>
					<Hr lineColor={commonStyle.hrColor}/>
					<LabeledInput label={"확인"} labelStyle={styles.labelStyle}>
						<TextInput
							style={styles.labeledtextbox}
							editable={true}
							autoCorrect={false}
							underlineColorAndroid={'transparent'}
							ref={'r_chk'}
							onChangeText={(passchk) => this.setState({passchk})}
							value={this.state.passchk}
							placeholder={'비밀번호를 다시 입력해주세요'}
							placeholderTextColor={commonStyle.placeholderTextColor}
							secureTextEntry={true}
						/>
					</LabeledInput>
				</View>
				<View style={[styles.formWrapper]}>
					<Button imgsource={require('../../img/checkmark.png')} style={{backgroundColor: '#3692d9'}} onPress={()=>{this._submit();}} btnname={'저장'}/>
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
		marginHorizontal: (Dimensions.get('window').width - 202) / 2,
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

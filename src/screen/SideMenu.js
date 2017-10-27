'use strict';

import React, {Component} from 'react';
import {AsyncStorage, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';

import Permissions from 'react-native-permissions';

class SideMenu extends Component {
	constructor(props) {
		super(props);
		props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
	}
	onNavigatorEvent(event) {}

	_toggleDrawer() {
		this.props.navigator.toggleDrawer({
			to: 'closed',
			side: 'left',
			animated: true
		});
	}
	_validateUserData() {
		AsyncStorage.getItem('token')
			.then(token => {
				if (typeof token === 'undefined' || token === null) {
					this._toggleDrawer();
					this.props.navigator.push({
						screen: 'calbum.LoginScreen',
						title: '로그인',
						passProps: {
							dbsvc: this.props.dbsvc,
							crypt: this.props.crypt,
							profileCreate: true,
							user: {
								signhash: '',
								profile: this.props.user.profile,
								email: '',
								name: ''
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
			})
			.done();
	}
	_openScreen(screen) {
		if (screen !== 'profile' && this.props.user.email == null) {
			this._validateUserData();
			return;
		}
		let user = {
			signhash: this.props.user.signhash,
			profile: this.props.user.profile,
			email: this.props.user.email,
			name: this.props.user.name
		};
		if (screen === 'subscribe') {
			this._toggleDrawer();
			this.props.navigator.push({
				screen: 'calbum.SubscribeScreen',
				title: '디자인 작성하기',
				passProps: {
					dbsvc: this.props.dbsvc,
					crypt: this.props.crypt
				},
				navigatorStyle: {},
				navigatorButtons: {},
				animated: true,
				animationType: 'slide-up'
			});
		} else if (screen === 'profile') {
			this._toggleDrawer();
			this.props.navigator.push({
				screen: 'calbum.LoginScreen',
				title: '로그인',
				passProps: {
					dbsvc: this.props.dbsvc,
					crypt: this.props.crypt,
					profileCreate: false
				},
				navigatorStyle: {},
				navigatorButtons: {},
				animated: true,
				animationType: 'slide-up'
			});
		} else if (screen === 'notice') {
			this._toggleDrawer();
			this.props.navigator.push({
				screen: "calbum.NoticeScreen",
				title: "공지사항",
				passProps: {dbsvc:this.props.dbsvc, crypt:this.props.crypt},
				navigatorStyle: {},
				navigatorButtons: {},
				animated: true,
				animationType: 'slide-up',
			});
		} else if (screen === 'tag') {
			this._toggleDrawer();
			this.props.navigator.push({
				screen: 'calbum.TagScreen',
				title: '태그목록',
				passProps: {
					dbsvc: this.props.dbsvc,
					crypt: this.props.crypt
				},
				navigatorStyle: {},
				navigatorButtons: {},
				animated: true,
				animationType: 'slide-up'
			});
		} else {
			this._toggleDrawer();
			this.props.navigator.resetTo({
				screen: 'calbum.TotalScreen',
				title: '전체보기',
				passProps: {
					dbsvc: this.props.dbsvc,
					crypt: this.props.crypt
				},
				navigatorStyle: {},
				navigatorButtons: {
					leftButtons: [{id: 'sideMenu'}]
				},
				animated: false,
				animationType: 'slide-up'
			});
		}
	}

	componentWillMount() {
		this._validateUserData();
	}
	componentDidMount() {
		Permissions.request('storage', 'always').then(() => {console.log('Storage Permission : ' + e)}).catch(e => console.warn(e));
		Permissions.request('camera', 'always').then(() => {console.log('Camera Permission : ' + e)}).catch(e => console.warn(e))
	}

	render() {
		let profile = this.props.user.profile;
		if (profile.uri) {
			var key = 1e5 * Math.random();
			profile.uri = profile.uri.split('?key=')[0] + '?key=' + key;
		}
		return (
			<View style={styles.container}>
				<TouchableOpacity
					style={styles.profile}
					onPress={() => {
						this._openScreen('profile');
					}}>
					<Image source={profile} style={styles.stretch} />
					<Text style={styles.name}>{this.props.user.name}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.sideBtn}
					onPress={() => {
						this._openScreen('subscribe');
					}}>
					<Image
						source={require('../../img/subscribe.png')}
						style={[styles.leftIcon]}
					/>
					<Text style={styles.sidetext}>작성하기</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.sideBtn}
					onPress={() => {
						this._openScreen('total');
					}}>
					<Image
						source={require('../../img/images.png')}
						style={[styles.leftIcon]}
					/>
					<Text style={styles.sidetext}>전체보기</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.sideBtn}
					onPress={() => {
						this._openScreen('tag');
					}}>
					<Image
						source={require('../../img/tags.png')}
						style={[styles.leftIcon]}
					/>
					<Text style={styles.sidetext}>태그보기</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[{position: 'absolute', bottom: 60, left: 0}, styles.sideBtn]}
					onPress={() => {
						this._openScreen('notice');
					}}>
					<Image
						source={require('../../img/notice.png')}
						style={[styles.leftIcon]}
					/>
					<Text style={styles.sidetext}>공지사항</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[{position: 'absolute', bottom: 10, left: 0}, styles.sideBtn]}
					onPress={() => {
						this._toggleDrawer();
					}}>
					<Image
						source={require('../../img/close.png')}
						style={[styles.leftIcon]}
					/>
					<Text style={styles.sidetext}>닫기</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		backgroundColor: '#fff',
		width: 200
	},
	name: {
		textAlign: 'right',
		fontSize: 15,
		marginTop: -30,
		marginLeft: 10,
		marginRight: 10,
		fontWeight: '500',
		height: 30,
		width: 170,
		color: 'white',
		textShadowColor: 'black',
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 2
	},
	title: {
		textAlign: 'center',
		fontSize: 15,
		marginBottom: 10,
		marginTop: 10,
		marginLeft: 10,
		fontWeight: '500'
	},
	button: {
		textAlign: 'center',
		fontSize: 14,
		marginBottom: 10,
		marginTop: 10
	},
	profile: {
		width: 200,
		height: 200,
		elevation: 1,
		marginBottom: 10,
		borderColor: '#000'
	},
	stretch: {
		width: 200,
		height: 200
	},
	sideBtn: {
		flexDirection: 'row',
		width: 200,
		height: 50
	},
	leftIcon: {
		width: 50,
		height: 50,
		margin: 8,
		tintColor: '#323339',
		resizeMode: 'contain',
		transform: [{scale: 0.6}]
	},
	sidetext: {
		width: 95,
		height: 50,
		marginTop: 21,
		textAlign: 'center',
		fontSize: 15
	},
	rotate45: {
		transform: [{rotate: '45deg'}]
	}
});

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps)(SideMenu);

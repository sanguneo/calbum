'use strict';

import React, {Component} from 'react';
import {Alert, AsyncStorage, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import AdBar from '../component/AdBar';
import Loading from '../component/Loading';

import axios from 'axios';
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

class NoticeScreen extends Component {
	static navigatorButtons = {
		leftButtons: [{id: 'sideMenu'}]
	};

	constructor(props) {
		super(props);
		props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.state = {
			rows: []
		};
	}
	onNavigatorEvent(event) {
	}

	_getNotice() {
		this.props.dispatch(appActions.loading());
		AsyncStorage.getItem('notice').then(notice => {
			if (typeof notice === 'undefined' || notice === null) {
				this._getNoticeSync()
			} else {
				AsyncStorage.getItem('noticeDate').then(noticeDate => {
					if (typeof noticeDate === 'undefined' || noticeDate === null) {
						this.setState({ rows : JSON.stringify(notice)}, ()=> {
							this.props.dispatch(appActions.loaded());
						});
					} else {
						this._getNoticeLatest(JSON.parse(notice), noticeDate)
					}
				}).done();
			}
		}).done();
	}
	_getNoticeLatest(parsedNotice, after) {
		axios.get(
			'http://calbum.sanguneo.com/notice/plain' + (after ? '?after=' + after : ''),
			{},
			{
				timeout: 1000,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}
		).then(response => {
			if (response.data.code === 320){
				let mergedNotice = [...response.data.notice, ...parsedNotice];
				if(response.data.notice.length > 0) {
					AsyncStorage.setItem('notice', JSON.stringify(mergedNotice)).done();
					AsyncStorage.setItem('noticeDate', response.data.notice[0].regDate).done();
				}
				this.setState({
					rows : mergedNotice
				}, ()=> {
					this.props.dispatch(appActions.loaded());
				});
			}else {
				this.setState({rows : parsedNotice}, ()=> {
					this.props.dispatch(appActions.loaded());
				});
			}
		}).catch(e => {
			console.log('error', e);
			this.setState({ rows : parsedNotice}, ()=> {
				this.props.dispatch(appActions.loaded());
			});
		});
	}
	_getNoticeSync() {
		axios.get(
			'http://calbum.sanguneo.com/notice/plain',
			{},
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}
		).then(response => {
			if (response.data.code === 320){
				if(response.data.notice.length > 0) {
					AsyncStorage.setItem('notice', JSON.stringify(response.data.notice)).done();
					AsyncStorage.setItem('noticeDate', response.data.notice[0].regDate).done();
				}
				this.setState({ rows : response.data.notice}, ()=> {
					this.props.dispatch(appActions.loaded());
				});
			}else {
				this.props.dispatch(appActions.loaded());
			}
		}).catch(e => {
			Alert.alert('인터넷에 연결되어있지 않습니다.\n확인후 다시 시도해주세요.');
			console.log('error', e);
			this.props.dispatch(appActions.loaded());
		});
	}
	_viewNotice(subjectIdx) {
		let subject = this.state.rows[subjectIdx];
		this.props.navigator.push({
			screen: 'calbum.NoticeViewScreen',
			title: '공지사항',
			passProps: {
				subject
			},
			navigatorStyle: {},
			navigatorButtons: {},
			animated: true,
			animationType: 'slide-up'
		});
	}

	componentWillMount() {
		this._getNotice();
	}

	render() {
		let noticelist = this.state.rows.map((item, idx) =>
			(<View style={styles.row} key={idx}>
				<TouchableOpacity onPress={()=>{this._viewNotice(idx)}}>
					<Text style={styles.rowRegdate}>{Util.isoFormatter(item.regDate)}</Text>
					<Text style={styles.rowTitle}>{item.title}</Text>
				</TouchableOpacity>
			</View>));
		if (this.state.rows.length > 0) {
			return (
				<View style={styles.wrapper}>
					<ScrollView style={styles.container}>
						{noticelist}
					</ScrollView>
					<AdBar/>
					<Loading show={this.props.app.loading} style={{width, height}}/>
				</View>
			);
		} else {
			return (
				<View style={[styles.container, styles.nodatastyle]}>
					<Text style={{fontSize: 20}}>{'공지사항이 없습니다.'}</Text>
					<AdBar style={{position: 'absolute', width, bottom: 0}} />
					<Loading show={this.props.app.loading} />
				</View>
			);
		}
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
	nodatastyle: {
		flex: 1,
		flexWrap: 'nowrap',
		justifyContent: 'center',
		alignItems: 'center'
	},
	row: {
		flexDirection: 'row',
		width: Dimensions.get('window').width,
		height: 60,
		paddingHorizontal: 10,

		borderBottomWidth: 1,
		borderColor: '#ccc',
	},
	rowRegdate: {
		width: Dimensions.get('window').width - 60,
		height: 20,

		paddingHorizontal: 0,

		textAlignVertical: 'center',

		fontSize: 14,
		color: '#000',
	},
	rowTitle: {
		width: Dimensions.get('window').width - 60,
		height: 40,

		paddingHorizontal: 0,

		textAlignVertical: 'center',

		fontSize: 18,
		color: '#000',
	},
});

function mapStateToProps(state) {
	return {
		app: state.app
	};
}

export default connect(mapStateToProps)(NoticeScreen);

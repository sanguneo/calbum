'use strict';

import React, {Component} from 'react';
import {Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';

import * as appActions from '../reducer/app/actions';
import axios from 'axios';

import Loading from '../component/Loading';

const {width, height} = Dimensions.get('window');

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
		let dateFormatter = (regdate) => {
			let date = new Date(regdate);

		};
		this.props.dispatch(appActions.loading());
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
			if (response.data.code === 331){
				this.setState({
					rows : response.data.notice.map((item, idx) => {return {regDate: new Date(item.regDate).toString()/*new Date(item.regDate).replace('T', ' ').split('.')[0]*/, idx, content: item.content}})
				}, ()=> {
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

	componentWillMount() {
		this._getNotice();
	}

	render() {
		let noticelist = this.state.rows.map((item) =>
			(<View style={styles.row} key={item.idx}>
				<TouchableOpacity onPress={()=>{}}>
					<Text style={styles.rowRegdate}>{item.regDate}</Text>
					<Text style={styles.rowContent}>{item.content}</Text>
				</TouchableOpacity>
			</View>));
		return (
			<ScrollView style={styles.container}>
				{noticelist}
				<Loading show={this.props.app.loading} style={{width, height}} />
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
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
	rowContent: {
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
		user: state.user,
		app: state.app
	};
}

export default connect(mapStateToProps)(NoticeScreen);

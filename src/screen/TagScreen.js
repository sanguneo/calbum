'use strict';

import React, {Component} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import AdBar from '../component/AdBar';
import Loading from '../component/Loading';

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

class TagScreen extends Component {
	constructor(props) {
		super(props);
		props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.state = {
			tagname: '',
			rows: []
		};
	}
	onNavigatorEvent(event) {}

	_goTag(tagname) {
		let aobj = {
			screen: 'calbum.InTagScreen',
			title: '#' + tagname,
			passProps: {
				dbsvc: this.props.dbsvc,
				crypt: this.props.crypt,
				user: this.props.user
			},
			navigatorStyle: {},
			navigatorButtons: {},
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
	_getTags() {
		this.props.dispatch(appActions.loading());
		this.props.dbsvc.getTagGroups(this.props.user.signhash, ret => {
			this.setState({
				rows: ret.map(item => {
					return item.name;
				})
			},()=> {
				this.props.dispatch(appActions.loaded());
			});
		});
	}

	componentWillMount() {
		if (this.props.user) {
			this._getTags();
		}
	}

	render() {
		let taglist = this.state.rows.map((item, idx) => (
			<View style={styles.row} key={idx}>
				<TouchableOpacity
					key={idx}
					onPress={() => {
						this._goTag(item);
					}}>
					<Text style={styles.rowContent}>{'#' + item}</Text>
				</TouchableOpacity>
			</View>
		));
		if (this.state.rows.length > 0) {
			return (
				<View style={styles.wrapper}>
					<ScrollView>
						<View style={styles.container}>{taglist}</View>
					</ScrollView>
					<AdBar/>
					<Loading show={this.props.app.loading} />
				</View>
			);
		} else {
			return (
				<View style={[styles.container2, styles.nodatastyle]}>
					<Text style={{fontSize: 20}}>{'태그가 없습니다.'}</Text>
					<AdBar style={{position: 'absolute', width, bottom: 0}} />
					<Loading show={this.props.app.loading} />
				</View>
			);
		}
	}
}
const styles = StyleSheet.create({
	wrapper: {
		width: width,
		height: height
	},
	container: {
		width: width,
		height: height - 260,
		flexWrap: 'wrap',
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: 10
	},
	container2: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		alignItems: 'flex-start'
	},
	nodatastyle: {
		flex: 1,
		flexWrap: 'nowrap',
		justifyContent: 'center',
		alignItems: 'center'
	},
	row: {
		flexDirection: 'row',
		height: 30,
		paddingHorizontal: 5,
		marginHorizontal: 2,
		marginVertical: 2,

		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,

		backgroundColor: '#aeaeae'
	},
	rowContent: {
		height: 30,
		paddingHorizontal: 0,
		textAlignVertical: 'center',
		fontSize: 16,
		color: '#fff'
	}
});

function mapStateToProps(state) {
	return {
		app: state.app,
		user: state.user
	};
}

export default connect(mapStateToProps)(TagScreen);


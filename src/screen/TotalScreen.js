'use strict';

import React, {Component} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';

import * as appActions from '../reducer/app/actions';

import Thumbnail from '../component/Thumbnail';
import AdBar from '../component/AdBar';
import Loading from '../component/Loading';
import Util from '../service/util_svc';

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
const owidth = (function() {
	let devW = 1440 > deviceWidth > 1080 ? 1440 : deviceWidth;
	let scaledThumbSize = 150 * scale;
	let quantityInline = Math.ceil(devW / scaledThumbSize);
	return (
		Math.round(devW / quantityInline / scale) -
		8 -
		(quantityInline - Math.round(devW / scaledThumbSize))
	);
})();

class TotalScreen extends Component {
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
		if(event.id === 'willAppear') {
			if (this.props.app.changing) {
				this.props.dispatch(appActions.changed());
				this._getPhoto();
			}
		}
	}

	_goPhoto(title, photohash) {
		this.props.navigator.push({
			screen: 'calbum.ViewScreen',
			passProps: {
				title,
				photohash,
				dbsvc: this.props.dbsvc,
				crypt: this.props.crypt,
				updateList: () => this._getPhoto()
			},
			navigatorStyle: {},
			navigatorButtons: {},
			animated: true,
			animationType: 'fade',
			overrideBackPress: true
		});
	}
	_getPhoto() {
		this.props.dispatch(appActions.loading());
		this.props.dbsvc.getPhoto(rows => {
			if (rows.length > 0)
				this.setState({rows}, () => {
					this.props.dispatch(appActions.loaded());
				});
			else this.props.dispatch(appActions.loaded());
		}, this.props.user.signhash);
	}
	componentWillMount() {
		this._getPhoto();
	}

	render() {
		if (this.state.rows.length > 0) {
			let key = Math.random() * 10000;
			let thumbs = this.state.rows.map((i, idx) => (
				<Thumbnail
					key={idx}
					style={styles.thumbnail}
					title={i.title}
					regdate={i.reg_date}
					uri={ 'file://' + RNFS.DocumentDirectoryPath + '/_thumb_/' + i.photohash + '_' + this.props.user.email + '.scalb?key=' + key}
					onPress={() => {
						this._goPhoto(
							i.title ? i.title : Util.dateFormatter(i.reg_date),
							i.photohash + ''
						);
					}}
				/>
			));
			return (
				<View style={styles.wrapper}>
					<ScrollView style={styles.scrollview}>
						<View style={styles.container}>{thumbs}</View>
					</ScrollView>
					<AdBar />
					<Loading show={this.props.app.loading} />
				</View>
			);
		} else {
			return (
				<View style={[styles.container, styles.nodatastyle]}>
					<Text style={{fontSize: 20}}>{'사진을 등록해주세요!'}</Text>
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
	scrollview: {
		width: width,
		height: height - 260
	},
	container: {
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
	text: {
		width: width,
		height: 40,
		textAlign: 'center',
		textAlignVertical: 'center'
	},
	thumbnail: {
		width: owidth,
		height: owidth,
		marginVertical: 5,
		marginHorizontal: 4,
		borderColor: 'rgba(0,0,0,0.2)',
		borderWidth: 1
	}
});

function mapStateToProps(state) {
	return {
		app: state.app,
		user: state.user
	};
}

export default connect(mapStateToProps)(TotalScreen);

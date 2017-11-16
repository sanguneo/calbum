'use strict';

import React, {Component} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';

import AdBar from '../component/AdBar';
import Loading from '../component/Loading';
import Thumbnail from '../component/Thumbnail';
import Util from '../service/util_svc';

import {connect} from 'react-redux';
import * as appActions from '../reducer/app/actions';

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

const owidth = (function() {
	let devW = 1440 > deviceWidth > 1080 ? 1440 : deviceWidth;
	let scaledThumbSize = 150 * scale;
	let quantityInline = Math.ceil(devW / scaledThumbSize);
	return [
		Math.round(devW / quantityInline / scale) -
		8 -
		(quantityInline - Math.round(devW / scaledThumbSize)),
		quantityInline]
})();

class InTagScreen extends Component {
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
			title: title,
			passProps: {
				title,
				photohash,
				dbsvc: this.props.dbsvc,
				user: this.props.user
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
		this.props.dbsvc.getPhotoByTag(
			rows => {
				if (rows.length > 0)
					this.setState({rows}, () => {
						this.props.dispatch(appActions.loaded());
					});
				else this.props.dispatch(appActions.loaded());
			},
			this.props.user.signhash,
			this.props.tagname
		);
	}

	componentWillMount() {
		this._getPhoto();
	}

	render() {
		if (this.state.rows.length > 0) {
			let randomkey = Math.random() * 10000;
			return (
				<View style={styles.wrapper}>
					<View style={styles.scrollview} >
						<FlatList initialNumToRender={20}  numColumns={owidth[1]} data={this.state.rows}
								  keyExtractor={item => item.photohash}
								  renderItem={({item}) => {
									  return <Thumbnail
										  key={item.idx}
										  style={styles.thumbnail}
										  title={item.title}
										  regdate={item.reg_date}
										  uri={'file://' + RNFS.PlatformDependPath + '/_thumb_/' + item.photohash + '_' + this.props.user.email + '.scalb?key=' + randomkey}
										  onPress={() => {
											  this._goPhoto(item.title ? item.title : Util.dateFormatter(item.reg_date), item.photohash + '');
										  }
										  }
									  />
								  }
								  }
						/>
					</View>
					<AdBar />
					<Loading show={this.props.app.loading} />
				</View>
			);
		} else {
			return (
				<View style={[styles.nodatastyle]}>
					<Text style={{fontSize: 20}}>{'사진을 등록해주세요!'}</Text>
					<AdBar style={{position: 'absolute', width: width, bottom: 0}} />
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
	scrollview: {
		width: width,
		height: height - 130,
		flexWrap: 'wrap',
		flexDirection: 'row',
	},
	nodatastyle: {
		flex: 1,
		flexWrap: 'nowrap',
		flexDirection: 'row',
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
		width: owidth[0],
		height: owidth[0],
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

export default connect(mapStateToProps)(InTagScreen);

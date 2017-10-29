'use strict';

import React, {Component} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';

import AdBar from '../component/AdBar';
import Loading from '../component/Loading';

import Util from '../service/util_svc';

import {connect} from 'react-redux';

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

class NoticeViewScreen extends Component {
	constructor(props) {
		super(props);
		props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
	}
	onNavigatorEvent(event) {
		if (event.id === 'backPress') {
			console.log('back');
		}
	}

	render() {
		let {subject} = this.props;
		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.container}>
					<Text style={styles.title}>{subject.title}</Text>
					<Text style={styles.regdate}>{Util.isoFormatter(subject.regDate)}</Text>
					<Text style={styles.content}>{subject.content.replace(/\\n/g, "\n")}</Text>
				</ScrollView>
				<AdBar />
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
		height: height - 260,
		padding: 10
	},
	title: {
		paddingHorizontal: 20,
		fontSize: 20,
		fontWeight: 'bold'
	},
	regdate: {
		paddingTop: 5,
		paddingHorizontal: 20,
		paddingBottom: 5,
		fontSize: 13,
		textAlign: 'right',
		borderBottomColor: '#878787',
		borderBottomWidth: 1
	},
	content: {
		paddingVertical: 10,
		paddingHorizontal: 10,
		fontSize: 15,
	}
});

function mapStateToProps(state) {
	return {
		app: state.app
	};
}

export default connect(mapStateToProps)(NoticeViewScreen);

'use strict';

import React, {Component} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';

import Util from '../service/util_svc';

const {width, height} = Dimensions.get('window');

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
			<ScrollView style={styles.container}>
				<Text style={styles.title}>{subject.title}</Text>
				<Text style={styles.regdate}>{Util.isoFormatter(subject.regDate)}</Text>
				<Text style={styles.content}>{subject.content.replace(/\\n/g, "\n")}</Text>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		margin: 10
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

export default connect()(NoticeViewScreen);

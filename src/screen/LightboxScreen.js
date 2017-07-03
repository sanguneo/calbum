/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	Modal,
	Dimensions
} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';

export default class LightboxScreen extends Component {
	constructor(props) {
		super(props);
	}
	state ={
		transparent: true
	}
	onRequestClose() {
		this.props.navigator.dismissLightBox();
	}
	render() {
		return (
			<Modal visible={true} transparent={this.state.transparent} onRequestClose={() => {this.onRequestClose();}}>
				<ImageViewer imageUrls={this.props.images}/>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	container: {
	}
});

'use strict';

import React from 'react';

import ImageViewer from 'react-native-image-zoom-viewer';

export default class ImgSourceViewScreen extends React.Component {
	constructor(props) {
		super(props);
		props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
	}
	onNavigatorEvent(event) {
	}

	render() {
		return <ImageViewer imageUrls={[{url: this.props.uri}]}/>;
	}
}
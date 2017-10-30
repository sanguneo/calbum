'use strict';

import React, {Component} from 'react';
import {TextInput} from 'react-native';

export default class AutoGrowingTextInput extends Component {
	constructor(props) {
		super(props);
		this.state = {height: 0};
	}
	render() {
		return (
			<TextInput
				{...this.props}
				multiline={true}
				onContentSizeChange={(event) => {
					this.setState({
						height: event.nativeEvent.contentSize.height,
					});
				}}
				style={[this.props.styleInput, {height: Math.max(36, this.state.height)}]}
				value={this.props.value}
			/>
		);
	}
}
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
					let height = event.nativeEvent.contentSize.height;
					this.props.contentLineFunc((Math.floor(event.nativeEvent.contentSize.height) - 42 + 19)/19);
					this.setState({
						height
					});
				}}
				style={[this.props.styleInput, {height: Math.max(36, this.state.height)}]}
				value={this.props.value}
			/>
		);
	}
}
'use strict';

import React, {Component} from 'react';
import {TextInput} from 'react-native';

export default class AutoGrowingTextInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			height: 0,
		};
	}
	render() {
		return (
			<TextInput
				{...this.props}
				multiline={true}
				onContentSizeChange={(event) => {
					let height = event.nativeEvent.contentSize.height;
					let lineCount = Math.floor((Math.floor(event.nativeEvent.contentSize.height) - 42 + 19)/19);
					let lineDiff = lineCount - this.state.lineBefore;
					this.setState({
						height,
						lineBefore : lineCount
					},()=>{
						this.props.measureBottom(lineDiff * 19);
					});
				}}
				style={[this.props.styleInput, {height: Math.max(36, this.state.height)}]}
				value={this.props.value}
			/>
		);
	}
}
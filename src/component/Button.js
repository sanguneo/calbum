/*

	The MIT License (MIT)

	Copyright (c) 2015 Karl Daniel

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

 */

import React, {Component} from 'react';
import {
	TouchableOpacity,
	Image,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export default class Button extends Component{
	render() {
		return (
			<TouchableOpacity style={[styles.button, this.props.style]}>
				<Image source={this.props.imgsource} style={styles.btnimg} /><Text style={styles.btntext} >저장</Text>
			</TouchableOpacity>
		);
	}
};

const styles = StyleSheet.create({

	button: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		backgroundColor: '#6cbf84',
		borderRadius: 5,
		borderColor: '#dfe2d2',
		borderWidth:1
	},
	btnimg: {
		width: 20,
		height: 20,
		marginTop: 13,
		marginBottom: 12,
		tintColor: '#fff',
	},
	btntext: {
		marginLeft: 20,
		height: 30,
		fontSize: 20,
		marginTop:7,
		textAlignVertical: 'center',
		color: '#fff'
	}

});

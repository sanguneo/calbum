// @flow

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Dimensions, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View,} from 'react-native';

const { width } = Dimensions.get('window');

type Props = {
	/**
	 * An array of tags
	 */
		value: Array<any>,
	/**
	 * A RegExp to test tags after enter, space, or a comma is pressed
	 */
		regex?: Object,
	/**
	 * Background color of tags
	 */
		tagColor?: string,
	/**
	 * Text color of tags
	 */
		tagTextColor?: string,
	/**
	 * Color of text input
	 */
		inputColor?: string,
	/**
	 * TextInput props Text.propTypes
	 */
		inputProps?: Object,
	/**
	 * path of the label in tags objects
	 */
		labelKey?: string,
	/**
	 *  maximum number of lines of this component
	 */
		numberOfLines: number,
};

type State = {
	text: string,
	inputWidth: ?number,
	lines: number,
};

type NativeEvent = {
	target: number,
	key: string,
	eventCount: number,
	text: string,
};

type Event = {
	nativeEvent: NativeEvent,
};

const DEFAULT_SEPARATORS = [',', ' ', ';', '\n'];
const DEFAULT_TAG_REGEX = /(.+)/gi;

class Tags extends Component {
	static propTypes = {
		value: PropTypes.array.isRequired,
		regex: PropTypes.object,
		tagColor: PropTypes.string,
		tagTextColor: PropTypes.string,
		inputColor: PropTypes.string,
		inputProps: PropTypes.object,
		labelKey: PropTypes.string,
		numberOfLines: PropTypes.number,
	};

	props: Props;
	state: State = {
		text: '',
		inputWidth: null,
		lines: 1,
	};

	wrapperWidth = width;

	// scroll to bottom
	contentHeight: 0;
	scrollViewHeight: 0;

	static defaultProps = {
		tagColor: '#dddddd',
		tagTextColor: '#aeaeae',
		inputColor: '#aeaeae',
		numberOfLines: 2,
	};

	measureWrapper = () => {
		if (!this.refs.wrapper)
			return;

		this.refs.wrapper.measure((ox, oy, w, /*h, px, py*/) => {
			this.wrapperWidth = w;
			this.setState({ inputWidth: this.wrapperWidth });
		});
	};

	calculateWidth = () => {
		// setTimeout(() => {
			if (!this.refs['tag' + (this.props.value.length - 1)])
				return;

			this.refs['tag' + (this.props.value.length - 1)].measure((ox, oy, w, /*h, px, py*/) => {
				const endPosOfTag = w + ox;
				const margin = 3;
				const spaceLeft = this.wrapperWidth - endPosOfTag - margin - 10;

				const inputWidth = (spaceLeft < 100) ? this.wrapperWidth : spaceLeft - 10;

				if (spaceLeft < 100) {
					if (this.state.lines < this.props.numberOfLines) {
						var lines = this.state.lines + 1;
						this.setState({ inputWidth, lines });
					} else {
						this.setState({ inputWidth }, () => this.scrollToBottom());
					}
				} else {
					this.setState({ inputWidth });
				}
			});
		// }, 0);
	};

	componentDidMount() {
		setTimeout(() => {
			this.calculateWidth();
		}, 10);
	}

	_getLabelValue = (tag) => {
		const { labelKey } = this.props;

		if (labelKey) {
			if (labelKey in tag) {
				return tag[labelKey];
			}
		}
		return tag;
	};

	_renderTag = (tag, index) => {
		const { tagColor, tagTextColor } = this.props;
		return (
			<TouchableOpacity
				key={index}
				ref={'tag' + index}
				style={[styles.tag, { backgroundColor: tagColor }, this.props.tagContainerStyle]}
				onPress={() => this.props.pressTag(this._getLabelValue(tag))}>
				<Text style={[styles.tagText, { color: tagTextColor }, this.props.tagTextStyle]}>
					{'#'+this._getLabelValue(tag)}
				</Text>
			</TouchableOpacity>
		);
	};



	scrollToBottom = (animated: boolean = true) => {
		if (this.contentHeight > this.scrollViewHeight) {
			this.refs.scrollView.scrollTo({
				y: this.contentHeight - this.scrollViewHeight,
				animated,
			});
		}
	};

	render() {
		var { inputWidth } = this.state;
		const { value } = this.props;

		return (
			<TouchableWithoutFeedback
				onLayout={this.measureWrapper}
				style={[styles.container]}>
				<View
					style={[styles.wrapper]}
					ref="wrapper"
					onLayout={this.measureWrapper}>
					<View
						ref='scrollView'
						style={styles.tagInputContainerScroll}
						onContentSizeChange={(w, h) => {this.contentHeight = h;}}
					>
						<View style={[styles.tagInputContainer, {width: inputWidth}, this.props.tagInputContainerStyle]}>
							{value.map((tag, index) => this._renderTag(tag, index))}
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	wrapper: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 3,
		marginBottom: 7,
		marginLeft: 14,
		marginRight: 14,
		alignItems: 'flex-start',
	},
	tagInputContainerScroll: {
		flex: 1,
		minHeight: 30,
	},
	textInput: {
		height: 35,
		fontSize: 16,
		padding: 0,
	},
	tag: {
		minWidth: 20,
		justifyContent: 'center',
		marginTop: 2,
		marginRight: 3,
		padding: 4,
		height: 28,
		borderRadius: 2,
	},
	tagText: {
		padding: 0,
		margin: 0,
	},
});

export default Tags;

export { DEFAULT_SEPARATORS, DEFAULT_TAG_REGEX }
